import { callback } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl;

  await callback(url.toString());
}
