import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await request.json();

  return NextResponse.json(undefined);
}
