"use client";

import { Footer } from "@/components/Footer";
import Header from "@/components/Navbar";
import { VideoCallProvider } from "@/hooks/VideoCallContext";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { ReactNode, useMemo } from "react";

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
      <VideoCallProvider>
        {!hideLayout && <Header />}
        <main className="overflow-x-hidden">{children}</main>
        {!hideLayout && <Footer />}
      </VideoCallProvider>
    </SessionProvider>
  );
}
