import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/appointment-confirmation",
  // "/api/appointments",
  // "/api/pet",
  "/api/test",
];

const adminRoutes = [
  "/admin",
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = (req as any).nextauth?.token;

    // Check admin routes first
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (!token) {
        // Redirect to login if no token with redirect parameter
        const signInUrl = new URL("/auth/signin", req.url);
        signInUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check if user has admin role
      if (token.role !== "admin") {
        // Redirect non-admin users to home page
        return NextResponse.redirect(new URL("/", req.url));
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

    // Handle other protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
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
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to admin routes only if user has admin role
        if (adminRoutes.some((route) => pathname.startsWith(route))) {
          return !!(token && token.role === "admin");
        }

        // Allow access to protected routes only if user has a token
        if (protectedRoutes.some((route) => pathname.startsWith(route))) {
          return !!token;
        }

        // Allow access to non-protected routes
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*", "/faq/:path*"],
};
