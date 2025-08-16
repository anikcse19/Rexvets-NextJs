import DashboardLayout from "@/components/shared/Layouts/DoctorDashboardLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
