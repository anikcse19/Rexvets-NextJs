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

// Map admin routes to their corresponding access permissions
const adminRoutePermissions: Record<string, string> = {
  "/admin/overview": "Dashboard",
  "/admin/appointments": "Appointments",
  "/admin/appointments/list": "Appointments",
  "/admin/appointments/reschedule-appointments": "Appointments",
  "/admin/appointments/reschedule-appointments/list": "Appointments",
  "/admin/doctors": "Doctors",
  "/admin/doctors/vets": "Doctors",
  "/admin/pet-parents": "Parents",
  "/admin/pet-parents/list": "Parents",
  "/admin/donations": "Donations",
  "/admin/pharmacy-requests": "Pharmacy Request",
  "/admin/reviews": "Reviews",
  "/admin/support": "Support",
  "/admin/video-call-monitoring": "Video Monitoring",
  "/admin/system-update": "System Update",
  "/admin/settings": "Settings",
  "/admin/settings/moderator": "Settings",
};

// Helper function to check if user has access to a specific route
function hasRouteAccess(pathname: string, userRole: string, accessList: string[] = []): boolean {
  // Full admin access
  if (userRole === "admin") {
    return true;
  }

  // Check moderator access
  if (userRole === "moderator") {
    // Find the most specific route match
    const matchingRoute = Object.keys(adminRoutePermissions)
      .filter(route => pathname.startsWith(route))
      .sort((a, b) => b.length - a.length)[0]; // Get the longest match

    if (matchingRoute) {
      const requiredPermission = adminRoutePermissions[matchingRoute];
      return accessList.includes(requiredPermission);
    }
  }

  return false;
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = (req as any).nextauth?.token;

    // Allow NextAuth internal routes to proceed without auth middleware handling
    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    // Check admin routes first
    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (!token) {
        // Redirect to login if no token with redirect parameter
        const signInUrl = new URL("/auth/signin", req.url);
        signInUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check if user has admin or moderator role
      if (!["admin", "moderator"].includes(token.role)) {
        // Redirect non-admin/moderator users to home page
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Check specific route access for moderators
      if (token.role === "moderator") {
        const accessList = token.accesslist || [];
        if (!hasRouteAccess(pathname, token.role, accessList)) {
          // Redirect to access denied page or admin overview
          return NextResponse.redirect(new URL("/admin/access-denied", req.url));
        }
      }

      // Serialize user into headers (so API routes can access)
      const userData = {
        id: token.id,
        role: token.role,
        email: token.email,
        accesslist: token.accesslist || [],
      };

      const res = NextResponse.next();
      res.headers.set("user", JSON.stringify(userData));
      // Add security headers for better session handling
      res.headers.set('X-Frame-Options', 'DENY');
      res.headers.set('X-Content-Type-Options', 'nosniff');
      res.headers.set('Referrer-Policy', 'origin-when-cross-origin');
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
      // Add security headers for better session handling
      res.headers.set('X-Frame-Options', 'DENY');
      res.headers.set('X-Content-Type-Options', 'nosniff');
      res.headers.set('Referrer-Policy', 'origin-when-cross-origin');
      return res;
    }

    // Add security headers to all responses
    const res = NextResponse.next();
    res.headers.set('X-Frame-Options', 'DENY');
    res.headers.set('X-Content-Type-Options', 'nosniff');
    res.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    return res;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow access to NextAuth internal routes
        if (pathname.startsWith("/api/auth")) {
          return true;
        }

        // Allow access to admin routes only if user has admin or moderator role
        if (adminRoutes.some((route) => pathname.startsWith(route))) {
          if (!token) return false;
          
          // Admin has full access
          if (token.role === "admin") return true;
          
          // Moderator needs specific permission
          if (token.role === "moderator") {
            const accessList = token.accesslist || [];
            return hasRouteAccess(pathname, token.role, accessList);
          }
          
          return false;
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
