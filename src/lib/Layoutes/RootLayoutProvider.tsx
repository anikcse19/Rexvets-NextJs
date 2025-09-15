"use client";
import { StateProvider } from "@/hooks/StateContext";
import { SessionProvider } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";
import TawkToScript from "@/components/TawkTo/TawkToScript";

const RootLayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider 
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
