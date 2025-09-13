import AdminDashboardLayout from "@/components/Admin-Panel/Layout/AdminDashboardLayout";
import AdminSessionManager from "@/components/Admin-Panel/AdminSessionManager";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminSessionManager>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </AdminSessionManager>
  );
};

export default layout;
