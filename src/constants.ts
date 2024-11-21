import { UpdateDeleteAction } from "drizzle-orm/mysql-core";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const DATABASE = {
  STRING_LENGTH: {
    MICRO: 16,
    MINI: 32,
    TINY: 64,
    SMALL: 128,
    MEDIUM: 255,
    LARGE: 450,
  },
  DECIMAL: {
    MONEY: {
      precision: 15,
      scale: 2,
    },
  },
  REFERENCES_ACTIONS: { onUpdate: "cascade", onDelete: "cascade" } satisfies {
    onUpdate?: UpdateDeleteAction;
    onDelete?: UpdateDeleteAction;
  },
};

export const AUTH = {
  WEB_AUTHN_RP_ID: "localhost",
  WEB_AUTHN_RP_NAME: "E Next Hand",
  WEB_AUTHN_ORIGIN: "http://localhost:3000",
  WEB_AUTHN_REG_COOKIE_KEY: "registration-info",
  WEB_AUTHN_AUTH_COOKIE_KEY: "authentication-info",
  WEB_AUTHN_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 600, // 10 minutes
  } satisfies Partial<ResponseCookie>,
  AUTH_COOKIE_KEY: "auth",
  AUTH_COOKIE_OPTIONS_SECONDS: 2592000, // 30 days
  AUTH_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  } satisfies Partial<ResponseCookie>,
  SESSION_RANDOM_OPTIONS: {
    length: 36,
    characters: "ABCDEF0123456789",
  },
};
