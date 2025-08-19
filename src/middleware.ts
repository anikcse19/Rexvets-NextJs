import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

const protectedRoutes = [
  "/dashboard",
  "/api/appointment",
  "/api/pet",
  "/api/test",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only run middleware on protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Get JWT payload from NextAuth
    const token = await getToken({ req, secret });

    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    // Serialize user into headers (so API routes can access)
    const userData = {
      id: token.id,
      role: token.role,
      email: token.email,
    };

    const res = NextResponse.next();

    res.headers.set("user", JSON.stringify(userData));

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*", "/faq/:path*"],
};
