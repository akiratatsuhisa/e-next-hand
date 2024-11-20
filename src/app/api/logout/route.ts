import { revokeServerSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await revokeServerSession();

  return NextResponse.json({ verified: true });
}
