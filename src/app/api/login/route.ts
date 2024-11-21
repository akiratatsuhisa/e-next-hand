import { AUTH } from "@/constants";
import { db } from "@/db/drizzle";
import { passKeys, users } from "@/db/schema";
import { setServerSession } from "@/lib/auth";
import { base64ToUint8Array } from "@/lib/crypto";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getUserByEmail(email: string) {
  const queryResult = await db
    .select({
      id: users.id,
      email: users.email,
      passKey: {
        id: passKeys.id,
        credentialID: passKeys.credentialID,
        credentialPublicKey: passKeys.credentialPublicKey,
        transports: passKeys.credentialTransports,
        credentialCounter: passKeys.credentialCounter,
      },
    })
    .from(users)
    .leftJoin(passKeys, eq(passKeys.userId, users.id))
    .where(and(eq(users.email, email), eq(users.isActived, true)))
    .execute();

  if (!queryResult.length) {
    return null;
  }

  const user = queryResult[0];

  return {
    id: user.id,
    email: user.email,
    passKeys: queryResult
      .filter((u) => u.passKey !== null)
      .map((u) => u.passKey!),
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "request query incorrect" },
      { status: 400 }
    );
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json(
      { message: "user info not found" },
      { status: 400 }
    );
  }

  const options = await generateAuthenticationOptions({
    rpID: AUTH.WEB_AUTHN_RP_ID,
    allowCredentials: user.passKeys.map((pk) => ({
      id: pk.credentialID,
      transports: pk.transports,
    })),
  });

  const cookieStorage = await cookies();

  cookieStorage.set(
    AUTH.WEB_AUTHN_AUTH_COOKIE_KEY,
    JSON.stringify({
      email,
      challenge: options.challenge,
    }),
    AUTH.WEB_AUTHN_COOKIE_OPTIONS
  );

  return NextResponse.json(options);
}

export async function POST(request: NextRequest) {
  const [body, cookieStorage] = await Promise.all([request.json(), cookies()]);

  const authInfo =
    (JSON.parse(
      cookieStorage.get(AUTH.WEB_AUTHN_AUTH_COOKIE_KEY)?.value ?? "null"
    ) as { email: string; challenge: string }) || null;

  if (
    !authInfo ||
    typeof authInfo?.email !== "string" ||
    typeof authInfo?.challenge !== "string"
  ) {
    return NextResponse.json({ verified: false });
  }

  const user = await getUserByEmail(authInfo.email);

  if (!user) {
    return NextResponse.json({ verified: false });
  }

  const passKey = user.passKeys.find((pk) => pk.credentialID === body.id);

  if (!passKey) {
    return NextResponse.json({ verified: false });
  }

  const response = await verifyAuthenticationResponse({
    response: body,
    expectedRPID: AUTH.WEB_AUTHN_RP_ID,
    expectedChallenge: authInfo.challenge,
    expectedOrigin: AUTH.WEB_AUTHN_ORIGIN,
    credential: {
      id: passKey.credentialID,
      publicKey: base64ToUint8Array(passKey.credentialPublicKey),
      counter: passKey.credentialCounter,
      transports: passKey.transports,
    },
  });

  await db
    .update(passKeys)
    .set({
      credentialCounter: response.authenticationInfo.newCounter,
    })
    .where(eq(passKeys.id, passKey.id))
    .execute();

  if (!response.verified) {
    return NextResponse.json({ verified: false });
  }

  await setServerSession(user.id);

  cookieStorage.delete(AUTH.WEB_AUTHN_AUTH_COOKIE_KEY);

  return NextResponse.json({ verified: true });
}
