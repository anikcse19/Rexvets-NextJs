"use client";
import dynamic from "next/dynamic";
import React from "react";
import {
  prescriptionFeatures,
  prescriptionHeroSectionTabs,
  prescriptionSteps,
} from "./prescription.data";
import Loader from "../shared/Loader";
// import GetAPrescriptionPharmacySection from "./GetAPrescriptionPharmacySection";
const loader = () => <Loader size={60} />;
const GetAPrescriptionHeroSectionSection = dynamic(
  () => import("./GetAPrescriptionHeroSectionSection"),
  {
    loading: loader,
  }
);
const GetAPrescriptionFeaturesSection = dynamic(
  () => import("./GetAPrescriptionFeaturesSection"),
  {
    loading: loader,
  }
);
const GetAPrescriptionPharmacySection = dynamic(
  () => import("./GetAPrescriptionPharmacySection"),
  {
    loading: loader,
  }
);
const GetAPrescriptionStepsSection = dynamic(
  () => import("./GetAPrescriptionStepsSection"),
  {
    loading: loader,
  }
);
const ReadyToGetStarted = dynamic(
  () => import("@/components/shared/ReadyToGetStarted"),
  {
    loading: loader,
  }
);

const GetAPrescription = () => {
  return (
    <div>
      <GetAPrescriptionHeroSectionSection
        tabs={prescriptionHeroSectionTabs}
        description="Rex Vet can prescribe online. Order medication with RexRx or pick up
          from your local pharmacy."
        title="Pet Medication"
        sub_title="Delivered"
      />
      <GetAPrescriptionFeaturesSection features={prescriptionFeatures} />
      <GetAPrescriptionPharmacySection
        title="Rex Vet"
        sub_title="Pharmacy"
        description=" Get trusted, veterinarian-approved products delivered right to your
            door. From prescription medications to wellness supplements, our
            online pharmacy ensures your pets get exactly what they need—safely,
            affordably, and conveniently."
      />
      <GetAPrescriptionStepsSection steps={prescriptionSteps} />
      <ReadyToGetStarted
        isShowVisitPerfumery
        description="Connect with our licensed veterinarians today and get the medications your pet needs."
      />
    </div>
  );
};

export default React.memo(GetAPrescription);
