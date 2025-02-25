import { UpdateDeleteAction } from "drizzle-orm/mysql-core";

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

export const KEYS = {
  OPENID_CONFIG: "openid_config",
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export const ENV = {
  OPENID_DOMAIN:
    process.env.OPENID_DOMAIN || "http://localhost:8080/realms/e-next-hand",
  OPENID_CLIENT_ID: process.env.OPENID_CLIENT_ID || "default_client_id",
  OPENID_CLIENT_SECRET:
    process.env.OPENID_CLIENT_SECRET || "default_client_secret",
};
