"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionDebugger() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("🔍 Session Debugger:", {
      status,
      session: session ? {
        user: {
          id: (session.user as any)?.id,
          email: session.user?.email,
          name: session.user?.name,
          role: (session.user as any)?.role,
          emailVerified: (session.user as any)?.emailVerified,
          image: session.user?.image,
          refId: (session.user as any)?.refId,
        },
        expires: session.expires
      } : null
    });
  }, [session, status]);

  // This component doesn't render anything visible
  return null;
}
