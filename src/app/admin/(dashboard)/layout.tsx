import AdminDashboardLayout from "@/components/Admin-Panel/Layout/AdminDashboardLayout";
import AdminSessionManager from "@/components/Admin-Panel/AdminSessionManager";
import React from "react";
import { ThemeProvider } from "next-themes";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminSessionManager>
      <ThemeProvider defaultTheme="light" attribute="class">
        <AdminDashboardLayout>{children}</AdminDashboardLayout>
      </ThemeProvider>
    </AdminSessionManager>
  );
};

export default layout;
