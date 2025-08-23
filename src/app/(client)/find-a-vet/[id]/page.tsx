// app/doctor/[id]/page.tsx
import DoctorProfilePage from "@/components/DoctorProfile/DoctorProfilePage";
import { getVetById } from "@/components/DoctorProfile/service/get-doctor-by-id";
import React from "react";

interface PageProps {
  params: {
    id: string;
  };
}

// If using App Router and server component
const Page = async ({ params }: PageProps) => {
  const doctorId = params.id;

  // fetch data using the dynamic id
  const doctorData = await getVetById(doctorId);

  console.log("doctor get by id", doctorData);

  return (
    <div>
      <DoctorProfilePage doctorData={doctorData?.data?.veterinarian} />
    </div>
  );
};

export default Page;
