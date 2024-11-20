import { AUTH } from "@/constants";
import { db, setTrackingFields } from "@/db/drizzle";
import { passKeys, users } from "@/db/schema";
import { getServerSession } from "@/lib/auth";
import { uint8ArrayToBase64 } from "@/lib/crypto";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let email = searchParams.get("email");
  let name = searchParams.get("name");

  const [session, cookieStorage] = await Promise.all([
    getServerSession(),
    cookies(),
  ]);

  if (session.isLogged) {
    email = session.user.email;
    name = session.user.name;
  } else if (!email || !name) {
    return NextResponse.json(
      { message: "request query incorrect" },
      { status: 400 }
    );
  }

  const options = await generateRegistrationOptions({
    rpID: AUTH.WEB_AUTHN_RP_ID,
    rpName: AUTH.WEB_AUTHN_RP_NAME,
    userName: email,
    userDisplayName: name,
  });

  cookieStorage.set(
    AUTH.WEB_AUTHN_REG_COOKIE_KEY,
    JSON.stringify({
      email,
      name,
      challenge: options.challenge,
    }),
    AUTH.WEB_AUTHN_COOKIE_OPTIONS
  );

  return NextResponse.json(options);
}

export async function POST(request: NextRequest) {
  const [body, session, cookieStorage] = await Promise.all([
    request.json(),
    getServerSession(),
    cookies(),
  ]);

  const regInfo =
    (JSON.parse(
      cookieStorage.get(AUTH.WEB_AUTHN_REG_COOKIE_KEY)?.value ?? "null"
    ) as { email: string; name: string; challenge: string }) || null;

  if (
    !regInfo ||
    typeof regInfo?.email !== "string" ||
    typeof regInfo?.name !== "string" ||
    typeof regInfo?.challenge !== "string"
  ) {
    return NextResponse.json({ verified: false });
  }

  const response = await verifyRegistrationResponse({
    response: body,
    expectedRPID: AUTH.WEB_AUTHN_RP_ID,
    expectedChallenge: regInfo.challenge,
    expectedOrigin: AUTH.WEB_AUTHN_ORIGIN,
  });

  if (!response.verified) {
    return NextResponse.json({ verified: false });
  }

  if (session.isLogged && regInfo.email !== session.user.email) {
    return NextResponse.json({ verified: false });
  }

  let userId: bigint;
  if (!session.isLogged) {
    const [{ id }] = await db
      .insert(users)
      .values({
        email: regInfo.email,
        name: regInfo.name,
        isActived: true,
        ...setTrackingFields({ id: BigInt(0) }, "insert"),
      })
      .$returningId();

    userId = id;
  } else {
    userId = session.user.id;
  }
  const registrationInfo = response.registrationInfo!;

  await db
    .insert(passKeys)
    .values({
      userId,
      credentialID: registrationInfo.credential.id,
      credentialPublicKey: uint8ArrayToBase64(
        registrationInfo.credential.publicKey
      ),
      credentialTransports: registrationInfo.credential.transports ?? [],
      credentialCounter: registrationInfo.credential.counter,
      credentialDeviceType: registrationInfo.credentialDeviceType,
      credentialBackedUp: registrationInfo.credentialBackedUp,
      ...setTrackingFields({ id: userId }, "insert"),
    })
    .execute();

  cookieStorage.delete(AUTH.WEB_AUTHN_REG_COOKIE_KEY);

  return NextResponse.json({ verified: true });
}
