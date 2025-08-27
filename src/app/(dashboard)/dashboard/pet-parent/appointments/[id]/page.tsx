import PetParentAppointmentDetailsPage from "@/components/Dashboard/PetParent/PetParentAppointmentDetailsPage";
import { getAppointmentById } from "@/components/Dashboard/PetParent/Service/appointment";
import { getApp } from "firebase/app";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PetParentAppointmentDetailsPage id={id} />
    </div>
  );
}
