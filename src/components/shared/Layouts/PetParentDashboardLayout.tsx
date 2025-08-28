"use client";

import Topbar from "@/components/shared/Layouts/Topbar";
import React, { useState } from "react";
import Sidebar from "./PetParentDashboardSidebar";
import { SessionProvider } from "next-auth/react";
import { DashboardProvider } from "@/hooks/DashboardContext";

interface DoctorDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function PetParentDashboardLayout({
  children,
  title = "Parent Dashboard",
}: DoctorDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex h-screen bg-muted overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 lg:ml-0">
          <Topbar
            title={title}
            onMenuClick={() => setSidebarOpen(true)}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gray-50">
            <DashboardProvider> {children}</DashboardProvider>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
