import { NextRequest, NextResponse } from "next/server";

// Auth disabled — all routes are public for now
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
