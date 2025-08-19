"use client";
import React, { FC } from "react";
import HowItWorksHero from "./HowItWorksHero";
import HowItWorksMission from "./HowItWorksMission";
import HowItWorksProcess from "./HowItWorksProcess";
import HowItWorksReimagined from "./HowItWorksReimagined";
import HowItWorksSteps from "./HowItWorksSteps";

const HowItWorks: FC = () => {
  return (
    <div>
      <HowItWorksHero />
      <HowItWorksSteps />
      <HowItWorksProcess />
      <HowItWorksMission />
      <HowItWorksReimagined />
    </div>
  );
};

export default React.memo(HowItWorks);
