import AppointmentDetailsPage from "@/components/Dashboard/Doctor/AppointmentDetailsPage";
import React from "react";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return (
    <div>
      <AppointmentDetailsPage id={params.id} />
    </div>
  );
}
