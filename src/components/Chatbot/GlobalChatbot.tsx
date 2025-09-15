"use client";

import { useSession } from "next-auth/react";
import { ChatbotInterface } from "./ChatbotInterface";

export const GlobalChatbot = () => {
  const { data: session } = useSession();

  // Extract user info from session
  const userInfo = session?.user
    ? {
        email: (session?.user as any)?.email || undefined,
        user_type: ((session?.user as any)?.role === "veterinarian"
          ? "veterinarian"
          : "pet_parent") as "veterinarian" | "pet_parent",
      }
    : {
        user_type: "guest" as const,
      };

  return (
    <ChatbotInterface
      userInfo={userInfo}
      initialMessage="Hi! I'm Rex Vet AI Assistant. I can help you with pet care questions, find veterinarians, check appointments, and more. How can I assist you today?"
    />
  );
};
