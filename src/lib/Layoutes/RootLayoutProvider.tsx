"use client";
import ChatIcon from "@/components/Home/ChatIcon";
import { SessionProvider } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";

const RootLayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      {children}

      <ChatIcon />
    </SessionProvider>
  );
};

export default RootLayoutProvider;
