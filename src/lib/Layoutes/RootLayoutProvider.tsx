"use client";
import { StateProvider } from "@/hooks/StateContext";
import React, { FC, PropsWithChildren } from "react";
import type { Session } from "next-auth";
import TawkToScript from "@/components/TawkTo/TawkToScript";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";

type Props = PropsWithChildren & { session?: Session | null };

const RootLayoutProvider: FC<Props> = ({ children, session }) => {
  return (
    <SessionProviderWrapper session={session}>
      <StateProvider>
        {children}
        <TawkToScript />
      </StateProvider>
    </SessionProviderWrapper>
  );
};

export default RootLayoutProvider;
