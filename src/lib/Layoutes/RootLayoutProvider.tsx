"use client";
import { SessionProvider } from "next-auth/react";
import React, { FC, PropsWithChildren } from "react";

const RootLayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default RootLayoutProvider;
