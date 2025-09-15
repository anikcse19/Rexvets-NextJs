"use client";
import { StateProvider } from "@/hooks/StateContext";
import { SessionProvider } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";
import type { Session } from "next-auth";
import TawkToScript from "@/components/TawkTo/TawkToScript";

type Props = PropsWithChildren & { session?: Session | null };

const RootLayoutProvider: FC<Props> = ({ children, session }) => {
  return (
    <SessionProvider 
      session={session}
      refetchOnWindowFocus={false} 
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <StateProvider>
        {children}
        <TawkToScript />
      </StateProvider>
    </SessionProvider>
  );
};

export default RootLayoutProvider;
