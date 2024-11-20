import { AUTH, DATABASE } from "@/constants";
import { AuthenticatorTransportFuture } from "@simplewebauthn/types";
import { sql } from "drizzle-orm";
import {
  bigint,
  mysqlTable,
  datetime,
  varchar,
  boolean,
  text,
  int,
  json,
  char,
} from "drizzle-orm/mysql-core";

const idField = bigint("id", { mode: "bigint" }).primaryKey().autoincrement();

const commonFields = {
  createdAt: datetime("created_at", { mode: "date" })
    .default(sql`NOW()`)
    .notNull(),
  createdBy: bigint("created_by", { mode: "bigint" }).notNull(),
  updatedAt: datetime("updated_at", { mode: "date" })
    .default(sql`NOW()`)
    .notNull(),
  updatedBy: bigint("updated_by", { mode: "bigint" }).notNull(),
};

export const users = mysqlTable("users", {
  id: idField,
  email: varchar("email", { length: DATABASE.STRING_LENGTH.DEFAULT }).unique().notNull(),
  name: varchar("name", { length: DATABASE.STRING_LENGTH.DEFAULT }).notNull(),
  isActived: boolean("is_actived").default(false).notNull(),
  ...commonFields,
});

export const passKeys = mysqlTable("pass_keys", {
  id: idField,
  userId: bigint("user_id", { mode: "bigint" })
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  credentialID: text("credential_id").notNull(),
  credentialPublicKey: text("credential_public_key").notNull(),
  credentialTransports: json()
    .$type<AuthenticatorTransportFuture[]>()
    .notNull(),
  credentialCounter: int("credential_counter").default(0).notNull(),
  credentialDeviceType: varchar("credential_device_type", {
    length: 16,
    enum: ["singleDevice", "multiDevice"],
  }).notNull(),
  credentialBackedUp: boolean("credential_backed_up").notNull(),
  ...commonFields,
});

export const sessions = mysqlTable("sessions", {
  id: idField,
  userId: bigint("user_id", { mode: "bigint" })
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  key: char("key", { length: AUTH.SESSION_RANDOM_OPTIONS.length }).notNull(),
  expiresAt: datetime("expires_at", { mode: "date" }).notNull(),
  revokedAt: datetime("revoked_at", { mode: "date" }),
});
