// app/donate/page.tsx
"use client";
import dynamic from "next/dynamic";
import { FC } from "react";

const DonateCauseSection = dynamic(() => import("./DonateCauseSection"), {
  loading: () => <p>Loading...</p>,
});
const DonateConnectSection = dynamic(() => import("./DonateConnectSection"), {
  loading: () => <p>Loading...</p>,
});
const DonateContributionsSection = dynamic(
  () => import("./DonateContributionsSection"),
  {
    loading: () => <p>Loading...</p>,
  }
);
const DonateHeroSection = dynamic(() => import("./DonateHeroSection"), {
  loading: () => <p>Loading...</p>,
});
const DonatePawsCauseSection = dynamic(
  () => import("./DonatePawsCauseSection"),
  {
    loading: () => <p>Loading...</p>,
  }
);
const DonateStatsSection = dynamic(() => import("./DonateStatsSection"), {
  loading: () => <p>Loading...</p>,
});

const DonatePage: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <DonateHeroSection />
      <DonateStatsSection />
      <DonateCauseSection />
      <DonateContributionsSection />
      <DonatePawsCauseSection />
      <DonateConnectSection />
    </div>
  );
};

export default DonatePage;
