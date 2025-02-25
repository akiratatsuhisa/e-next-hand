import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
  return this.toString();
};

const poolConnection = mysql.createPool({
  uri: process.env.MYSQL_URI,
});

export const db = drizzle(poolConnection);

export function setTrackingFields(
  identity: { id: bigint },
  mode: "insert"
): {
  updatedBy: bigint;
  createdBy: bigint;
};
export function setTrackingFields(
  identity: { id: bigint },
  mode: "update"
): {
  updatedBy: bigint;
};
export function setTrackingFields(
  identity: { id: bigint },
  mode: "insert" | "update"
) {
  return mode === "insert"
    ? { createdBy: identity.id, updatedBy: identity.id }
    : {
        updatedBy: identity.id,
      };
}
