// app/donate/page.tsx
"use client";
import { FC } from "react";
import { ScrollToTop } from "../shared";
import DonateCauseSection from "./DonateCauseSection";
import DonateConnectSection from "./DonateConnectSection";
import DonateContributionsSection from "./DonateContributionsSection";
import DonateHeroSection from "./DonateHeroSection";
import DonatePawsCauseSection from "./DonatePawsCauseSection";
import DonateStatsSection from "./DonateStatsSection";

const DonatePage: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DonateHeroSection />
      <DonateStatsSection />
      <DonateCauseSection />
      <DonateContributionsSection />
      <DonatePawsCauseSection />
      <DonateConnectSection />
      <ScrollToTop />
      {/* <OLD_DONATE /> */}
    </div>
  );
};

export default DonatePage;
