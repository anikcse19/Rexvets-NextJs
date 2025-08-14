"use client";

import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  hideOnRoutes?: string[]; // route names without leading slash, e.g. ["login", "register"]
};

export default function LayoutController({
  children,
  hideOnRoutes = [],
}: Props) {
  const pathname = usePathname(); // e.g. "/login" or "/dashboard/settings"

  // Remove leading slash
  const route = pathname.startsWith("/") ? pathname.slice(1) : pathname;

  // Get first segment of route (for nested routes)
  const routeSegment = route.split("/")[0];

  // Check if routeSegment is in hideOnRoutes
  const hideLayout = hideOnRoutes.indexOf(routeSegment) !== -1;

  return (
    <>
      {!hideLayout && <Header />}
      <main className="overflow-x-hidden ">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
