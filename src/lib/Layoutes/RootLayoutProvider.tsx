"use client";
import ChatIcon from "@/components/Home/ChatIcon";
import { StateProvider } from "@/hooks/StateContext";
import { SessionProvider } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";

const RootLayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <StateProvider>
        {children}

        <ChatIcon />
      </StateProvider>
    </SessionProvider>
  );
};

export default RootLayoutProvider;
