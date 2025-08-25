"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export interface VeterinarianSession {
  id: string;
  refId?: string;
  name?: string;
  email?: string;
  role: string;
}

export function useVeterinarian() {
  const { data: session, status } = useSession();
  const [veterinarianData, setVeterinarianData] = useState<VeterinarianSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "unauthenticated") {
      setError("Not authenticated");
      setIsLoading(false);
      return;
    }

    if (session?.user) {
      const user = session.user as any;
      
      // Check if user is a veterinarian
      if (user.role !== "veterinarian") {
        setError("User is not a veterinarian");
        setIsLoading(false);
        return;
      }

      // Check if we have the veterinarian reference ID
      if (!user.refId) {
        setError("Veterinarian profile not found");
        setIsLoading(false);
        return;
      }

      const vetData = {
        id: user.id,
        refId: user.refId,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      
      setVeterinarianData(vetData);
      setError(null);
    } else {
      setError("No user session found");
    }

    setIsLoading(false);
  }, [session, status]);

  return {
    veterinarian: veterinarianData,
    isLoading,
    error,
    isAuthenticated: status === "authenticated",
    isVeterinarian: veterinarianData?.role === "veterinarian",
  };
}
