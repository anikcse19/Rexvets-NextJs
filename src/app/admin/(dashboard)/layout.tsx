import AdminDashboardLayout from "@/components/Admin-Panel/Layout/AdminDashboardLayout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </div>
  );
};

export default layout;
