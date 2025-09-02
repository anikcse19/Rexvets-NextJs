"use client";

import StripeContext from "@/hooks/StripeContext";
import React from "react";
import DonationForm from "./DonationForm";

interface DonationFormWrapperProps {
  onDonationComplete: (amount: number) => void;
  selectedFamilyPlan?: string;
}

const DonationFormWrapper: React.FC<DonationFormWrapperProps> = ({
  onDonationComplete,
  selectedFamilyPlan,
}) => {
  return (
    <StripeContext>
      <DonationForm
        onDonationComplete={onDonationComplete}
        selectedFamilyPlan={selectedFamilyPlan}
      />
    </StripeContext>
  );
};

export default DonationFormWrapper;
