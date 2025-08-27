// app/donate/page.tsx
"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FC, useRef } from "react";

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
const DonateHeroSection = dynamic(
  () => import("../shared/Donate_OurMIssion_HeroSection"),
  {
    loading: () => <p>Loading...</p>,
  }
);
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
