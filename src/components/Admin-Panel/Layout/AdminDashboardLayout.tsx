"use client";

import { useState } from "react";
import clsx from "clsx"; // optional, for conditional classnames
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarWidth = "w-64";

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-30 transition-transform duration-300 lg:translate-x-0",
          sidebarWidth,
          {
            "-translate-x-full": !sidebarOpen,
            "translate-x-0": sidebarOpen,
          }
        )}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content with left margin on large screens */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden lg:ml-64`}>
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-700/80 via-blue-600/80 to-blue-500/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-600/80 backdrop-blur-md border-b border-blue-900/20 dark:border-gray-700 shadow">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
