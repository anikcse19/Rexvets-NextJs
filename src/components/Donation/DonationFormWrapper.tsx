"use client";

import StripeContext from "@/hooks/StripeContext";
import React from "react";
import DonationForm from "./DonationForm";

interface DonationFormWrapperProps {
  onDonationComplete: (amount: number) => void;
}

const DonationFormWrapper: React.FC<DonationFormWrapperProps> = ({
  onDonationComplete,
}) => {
  return (
    <StripeContext>
      <DonationForm onDonationComplete={onDonationComplete} />
    </StripeContext>
  );
};

export default DonationFormWrapper;
