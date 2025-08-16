"use client";

import { Footer } from "@/components/Footer";
import Header from "@/components/Navbar";
import { usePathname } from "next/navigation";
import React, { ReactNode, useMemo } from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: ReactNode;
  hideOnRoutes?: string[]; // route names without leading slash, e.g. ["login", "register"]
};

export default function LayoutController({
  children,
  hideOnRoutes = [],
}: Props) {
  const pathname = usePathname() || "/"; // fallback to "/" if null

  // Normalize hideOnRoutes to lowercase for case-insensitive comparison
  const hideRoutesLower = useMemo(
    () => hideOnRoutes.map((r) => r.toLowerCase().trim()),
    [hideOnRoutes]
  );

  // Extract the first segment without query or trailing slash
  const routeSegment = useMemo(() => {
    const cleanPath = pathname.split("?")[0].replace(/^\/+|\/+$/g, ""); // remove leading/trailing slash
    return cleanPath.split("/")[0].toLowerCase();
  }, [pathname]);

  const hideLayout = hideRoutesLower.includes(routeSegment);

  return (
    <SessionProvider>
      {!hideLayout && <Header />}
      <main className="overflow-x-hidden">{children}</main>
      {!hideLayout && <Footer />}
    </SessionProvider>
  );
}
