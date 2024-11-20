"use server";

import { AUTH } from "@/constants";
import { db } from "@/db/drizzle";
import { sessions, users } from "@/db/schema";
import { cookies } from "next/headers";
import { cache } from "react";
import { generateRandomString } from "./crypto";
import dayjs from "dayjs";
import { and, eq, gte, isNull, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

interface LoggedSession {
  isLogged: true;
  user: {
    id: bigint;
    name: string;
    email: string;
  };
  expires: Date;
}

interface UnloggedSession {
  isLogged: false;
  user: null;
  expires: null;
}

type Session = LoggedSession | UnloggedSession;

const unloggedSessionState: UnloggedSession = {
  isLogged: false,
  user: null,
  expires: null,
};

export async function setServerSession(userId: bigint): Promise<void> {
  const value = {
    userId,
    key: generateRandomString(AUTH.SESSION_RANDOM_OPTIONS),
    expiresAt: dayjs()
      .add(AUTH.AUTH_COOKIE_OPTIONS_SECONDS, "seconds")
      .toDate(),
  };

  const [{ id: sessionId }] = await db
    .insert(sessions)
    .values(value)
    .$returningId();

  const cookieStore = await cookies();

  cookieStore.set(AUTH.AUTH_COOKIE_KEY, `${sessionId}:${value.key}`, {
    ...AUTH.AUTH_COOKIE_OPTIONS,
  });
}

async function getSessionCookie() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get(AUTH.AUTH_COOKIE_KEY);

  const [sessionId, key] = (cookie?.value ?? "").split(":");

  return {
    sessionId,
    key,
  };
}

export async function revokeServerSession() {
  const { sessionId, key } = await getSessionCookie();

  if (!sessionId || !key) {
    return unloggedSessionState;
  }

  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(sessions.id, BigInt(sessionId)),
        eq(sessions.key, key),
        isNull(sessions.revokedAt),
        gte(sessions.expiresAt, sql`NOW()`)
      )
    )
    .execute();

  const cookieStore = await cookies();

  cookieStore.delete(AUTH.AUTH_COOKIE_KEY);
}

export async function getServerSession(): Promise<Session> {
  return cache(async (): Promise<Session> => {
    const { sessionId, key } = await getSessionCookie();

    if (!sessionId || !key) {
      return unloggedSessionState;
    }

    const [session] = await db
      .select({
        expires: sessions.expiresAt,
        user: { id: users.id, email: users.email, name: users.name },
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.id, BigInt(sessionId)),
          eq(sessions.key, key),
          isNull(sessions.revokedAt),
          gte(sessions.expiresAt, sql`NOW()`)
        )
      )
      .innerJoin(
        users,
        and(eq(sessions.userId, users.id), eq(users.isActived, true))
      )
      .execute();

    if (!session) {
      return unloggedSessionState;
    }

    return { isLogged: true, ...session };
  })();
}

export async function verifyServerSession(): Promise<LoggedSession> {
  const result = await cache(async (): Promise<LoggedSession> => {
    const session = await getServerSession();

    if (!session.isLogged) {
      redirect("/login");
    }

    return session;
  })();

  return result;
}
