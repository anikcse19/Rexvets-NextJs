"use client";
import dynamic from "next/dynamic";
import React from "react";
const loader = () => <p>loading..........</p>;
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

const GetAPrescription = () => {
  return (
    <div>
      <GetAPrescriptionHeroSectionSection />
      <GetAPrescriptionFeaturesSection />
    </div>
  );
};

export default React.memo(GetAPrescription);
