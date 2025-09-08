import DoctorProfilePage from "@/components/DoctorProfile/DoctorProfilePage";
import { getVetById } from "@/components/DoctorProfile/service/get-doctor-by-id";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// If using App Router and server component
const Page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const doctorId = resolvedParams.id;

  // fetch data using the dynamic id
  const doctorData = await getVetById(doctorId);
  console.log("doctorData", doctorData?.data?.timezone);
  // console.log("doctor get by id", doctorData);

  return (
    <div>
      <DoctorProfilePage
        vetTimezone={doctorData?.data?.timezone}
        doctorData={doctorData?.data?.veterinarian}
      />
    </div>
  );
};

export default Page;
