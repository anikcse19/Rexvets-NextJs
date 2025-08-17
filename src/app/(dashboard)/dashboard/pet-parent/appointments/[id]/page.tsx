import PetParentAppointmentDetailsPage from "@/components/Dashboard/PetParent/PetParentAppointmentDetailsPage";
import React from "react";

interface AppointmentPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: AppointmentPageProps) {
  const { id } = await props.params;
  return (
    <div>
      <PetParentAppointmentDetailsPage id={id} />
    </div>
  );
}
