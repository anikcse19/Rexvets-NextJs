import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/api/appointments", 
  // "/api/pet",
  "/api/test",
];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Only run middleware on protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      // The token is available in req.nextauth.token
      const token = (req as any).nextauth?.token;

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
