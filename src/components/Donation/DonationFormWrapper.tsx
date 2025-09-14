"use client";

import StripeContext from "@/hooks/StripeContext";
import React from "react";
import DonationForm from "./DonationForm";

interface DonationFormWrapperProps {
  onDonationComplete: (amount: number) => void;
  donationType?: "donation" | "booking";
}

const DonationFormWrapper: React.FC<DonationFormWrapperProps> = ({
  onDonationComplete,
  donationType = "donation",
}) => {
  return (
    <StripeContext>
      <DonationForm onDonationComplete={onDonationComplete} donationType={donationType} />
    </StripeContext>
  );
};

export default DonationFormWrapper;
