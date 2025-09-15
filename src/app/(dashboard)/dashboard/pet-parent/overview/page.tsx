import PetParentOverviewPage from "@/components/Dashboard/PetParent/OverviewPage";
import Loader from "@/components/shared/Loader";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<Loader size={60} />}>
      <PetParentOverviewPage />
    </Suspense>
  );
};

export default page;
