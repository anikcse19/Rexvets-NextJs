import AppointmentDetailsPage from "@/components/Dashboard/Doctor/AppointmentDetailsPage";
import React from "react";

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: AppointmentPageProps) {
  const { id } = await props.params;

  return (
    <div>
      <AppointmentDetailsPage id={id} />
    </div>
  );
}
