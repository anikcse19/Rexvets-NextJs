"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

/**
 * A stable session hook that prevents unnecessary re-renders and provides
 * consistent session data across components
 */
export function useSessionStable() {
  const { data: session, status, update } = useSession();
  const [stableSession, setStableSession] = useState(session);
  const previousSession = useRef(session);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only update if session actually changed (deep comparison for user object)
    if (status === "authenticated" && session) {
      const hasChanged = 
        !previousSession.current ||
        JSON.stringify(previousSession.current.user) !== JSON.stringify(session.user);
      
      if (hasChanged) {
        setStableSession(session);
        previousSession.current = session;
      }
      
      if (!isInitialized.current) {
        isInitialized.current = true;
      }
    } else if (status === "unauthenticated") {
      setStableSession(null);
      previousSession.current = null;
      isInitialized.current = true;
    }
  }, [session, status]);

  // Return stable values
  return {
    data: stableSession,
    status,
    update,
    isInitialized: isInitialized.current
  };
}
