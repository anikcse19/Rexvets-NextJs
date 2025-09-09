"use client";

import { Footer } from "@/components/Footer";
import Header from "@/components/Navbar";
import TopToolbar from "@/components/Navbar/Toolbar";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { ReactNode, useMemo } from "react";

type Props = {
  children: ReactNode;
  hideOnRoutes?: string[]; // route names without leading slash, e.g. ["login", "register"]
  hideToolbarOnRoutes?: string[]; // hide TopToolbar on these routes
};

export default function LayoutController({
  children,
  hideOnRoutes = [],
  hideToolbarOnRoutes = [],
}: Props) {
  const pathname = usePathname() || "/"; // fallback to "/" if null

  const normalizeRoutes = (routes: string[]) =>
    routes.map((r) => r.toLowerCase().trim());

  // Normalize hideOnRoutes to lowercase for case-insensitive comparison
  const hideRoutesLower = useMemo(
    () => hideOnRoutes.map((r) => r.toLowerCase().trim()),
    [hideOnRoutes]
  );
  const hideToolbarRoutesLower = useMemo(
    () => normalizeRoutes(hideToolbarOnRoutes),
    [hideToolbarOnRoutes]
  );

  // Extract the first segment without query or trailing slash
  const routeSegment = useMemo(() => {
    const cleanPath = pathname.split("?")[0].replace(/^\/+|\/+$/g, ""); // remove leading/trailing slash
    return cleanPath.split("/")[0].toLowerCase();
  }, [pathname]);

  const hideLayout = hideRoutesLower.includes(routeSegment);
  const hideToolbar = hideToolbarRoutesLower.includes(routeSegment);

  return (
    <SessionProvider>
      <div className="flex flex-col gap-y-5">
        {/* {!hideLayout && <TopToolbar />} */}
        {!hideLayout && <Header />}
        <main className="overflow-x-hidden pt-12">{children}</main>
        {!hideLayout && <Footer />}
      </div>
    </SessionProvider>
  );
}
