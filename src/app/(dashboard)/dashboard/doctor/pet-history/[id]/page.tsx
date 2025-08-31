import PetHistoryPage from "@/components/Dashboard/Doctor/PetHistory/PetHistoryPage";
import React from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const page = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const petId = resolvedParams.id;
  return (
    <div>
      <PetHistoryPage id={petId} />
    </div>
  );
};

export default page;
