import PetParentAppointmentDetailsPage from "@/components/Dashboard/PetParent/PetParentAppointmentDetailsPage";
import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <PetParentAppointmentDetailsPage params={params} />
    </div>
  );
};

export default page;
