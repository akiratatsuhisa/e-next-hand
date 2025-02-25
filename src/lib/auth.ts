"use server";

import * as client from "openid-client";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { ENV, KEYS } from "@/server-constants";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const discoveryServerMetadata = unstable_cache(
  async () => {
    const configuration = await client.discovery(
      new URL(`${ENV.OPENID_DOMAIN}/.well-known/openid-configuration`),
      ENV.OPENID_CLIENT_ID,
      ENV.OPENID_CLIENT_SECRET,
      undefined,
      { execute: [client.allowInsecureRequests] }
    );

    return configuration.serverMetadata();
  },
  ["OPENID_CONFIG"],
  { revalidate: 900 }
);

async function getConfiguration() {
  const serverMetadata = await discoveryServerMetadata();

  const configuration = new client.Configuration(
    serverMetadata,
    ENV.OPENID_CLIENT_ID,
    ENV.OPENID_CLIENT_SECRET
  );

  client.allowInsecureRequests(configuration);

  return configuration;
}

async function setAuthCookie(
  result: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  const cookieStore = await cookies();

  const decodedRefreshToken = decodeJwt(result.refresh_token!);

  cookieStore.set(KEYS.REFRESH_TOKEN, result.refresh_token!, {
    httpOnly: true,
    sameSite: true,
    secure: true,
    expires: (decodedRefreshToken.exp ?? 0) * 1000,
  });

  const decodedAccessToken = decodeJwt(result.access_token!);

  cookieStore.set(KEYS.ACCESS_TOKEN, result.access_token!, {
    httpOnly: true,
    sameSite: true,
    secure: true,
    expires: (decodedAccessToken.exp ?? 0) * 1000,
  });
}

export const getAccessTokenSilently = cache(async () => {
  const cookieStore = await cookies();

  if (cookieStore.has(KEYS.ACCESS_TOKEN)) {
    const accessToken = cookieStore.get(KEYS.ACCESS_TOKEN)!.value;
    return accessToken;
  }

  const configuration = await getConfiguration();

  if (!cookieStore.has(KEYS.REFRESH_TOKEN)) {
    throw new Error("Unauthorized");
  }

  const refreshToken = cookieStore.get(KEYS.REFRESH_TOKEN)!.value;
  const result = await client.refreshTokenGrant(configuration, refreshToken);

  await setAuthCookie(result);

  return result.access_token;
});

export async function callback(currentUrl: string) {
  const configuration = await getConfiguration();

  const result = await client.authorizationCodeGrant(
    configuration,
    new URL(currentUrl),
    {}
  );

  await setAuthCookie(result);

  redirect("/");
}

export async function signIn(options?: {
  scope?: string;
  prompt?: "none" | "login" | "consent" | "select_account";
  identityProvider?: "github";
}) {
  const {
    scope = "openid profile email",
    prompt = "consesnt",
    identityProvider,
  } = options ?? {};

  const configuration = await getConfiguration();

  const urlSearchParams = new URLSearchParams({
    redirect_uri: "http://localhost:3000/callback",
    scope,
    prompt,
  });

  if (identityProvider) {
    urlSearchParams.set("kc_idp_hint", identityProvider);
  }

  const url = client.buildAuthorizationUrl(configuration, urlSearchParams);

  redirect(url.toString());
}

export async function signOut() {
  const configuration = await getConfiguration();

  const cookieStore = await cookies();

  if (cookieStore.has(KEYS.REFRESH_TOKEN)) {
    const refreshToken = cookieStore.get(KEYS.REFRESH_TOKEN)!.value;
    await client.tokenRevocation(configuration, refreshToken);
    cookieStore.delete(KEYS.REFRESH_TOKEN);
  }

  if (cookieStore.has(KEYS.ACCESS_TOKEN)) {
    const accessToken = cookieStore.get(KEYS.ACCESS_TOKEN)!.value;
    await client.tokenRevocation(configuration, accessToken);
    cookieStore.delete(KEYS.ACCESS_TOKEN);
  }

  redirect("/");
}

export const getAuth = cache(async () => {
  const configuration = await getConfiguration();

  try {
    const accessToken = await getAccessTokenSilently();

    const userInfo = await client.fetchUserInfo(
      configuration,
      accessToken,
      client.skipSubjectCheck
    );

    return userInfo;
  } catch {
    return null;
  }
});
