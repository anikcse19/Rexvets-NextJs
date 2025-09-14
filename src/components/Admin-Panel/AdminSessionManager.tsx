"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface AdminSessionManagerProps {
  children: ReactNode;
}

const AdminSessionManager: React.FC<AdminSessionManagerProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      // Still loading, show loading spinner
      return;
    }

    if (status === "unauthenticated") {
      // User is not authenticated, redirect to sign in
      router.push("/auth/signin?redirect=/admin/overview");
      return;
    }

    if (status === "authenticated" && session?.user) {
      const { role } = session.user;

      // If role is still undefined, wait until it's populated
      if (!role) {
        return;
      }

      // Allow both admin and moderator roles
      if (!["admin", "moderator"].includes(role)) {
        // User does not have sufficient privileges, redirect to home
        router.push("/");
        return;
      }
    }
  }, [session, status, router]);

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show loading spinner while redirecting
  if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has admin role, render children
  return <>{children}</>;
};

export default AdminSessionManager;
