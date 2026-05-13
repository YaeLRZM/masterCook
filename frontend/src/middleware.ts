import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/super-admin",
  "/admin",
  "/chef",
  "/auxiliar",
  "/sales",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const token = request.cookies.get("token")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL("/signin", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/super-admin/:path*",
    "/admin/:path*",
    "/chef/:path*",
    "/auxiliar/:path*",
    "/sales/:path*",
  ],
};