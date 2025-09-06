// app/donate/page.tsx
"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useRef } from "react";
import Loader from "../shared/Loader";

const DonateCauseSection = dynamic(() => import("./DonateCauseSection"), {
  loading: () => <Loader size={60} />,
});
const DonateConnectSection = dynamic(() => import("./DonateConnectSection"), {
  loading: () => <Loader size={60} />,
});
const DonateContributionsSection = dynamic(
  () => import("./DonateContributionsSection"),
  {
    loading: () => <Loader size={60} />,
  }
);
const DonateHeroSection = dynamic(
  () => import("../shared/Donate_OurMIssion_HeroSection"),
  {
    loading: () => <Loader size={60} />,
  }
);
const DonatePawsCauseSection = dynamic(
  () => import("./DonatePawsCauseSection"),
  {
    loading: () => <Loader size={60} />,
  }
);
const DonateStatsSection = dynamic(() => import("./DonateStatsSection"), {
  loading: () => <Loader size={60} />,
});

const DonatePage: FC = () => {
  const router = useRouter();
  const causeRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen flex flex-col">
      <DonateHeroSection
        primaryButton={{
          onClick: () => {
            router.push("/donate-now");
          },
          text: "Donate Now",
        }}
        secondaryButton={{
          onClick: () => {
            router.push("#howItCause");
            causeRef.current?.scrollIntoView({ behavior: "smooth" });
          },
          text: "Learn More",
        }}
      />
      <DonateStatsSection />
      <div ref={causeRef}>
        <DonateCauseSection />
      </div>
      <DonateContributionsSection />
      <DonatePawsCauseSection />
      <DonateConnectSection />
    </div>
  );
};

export default DonatePage;
