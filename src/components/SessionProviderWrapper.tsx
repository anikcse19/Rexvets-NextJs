"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface SessionProviderWrapperProps {
  children: React.ReactNode;
  session?: Session | null;
}

export default function SessionProviderWrapper({ 
  children, 
  session 
}: SessionProviderWrapperProps) {
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={false} 
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}
