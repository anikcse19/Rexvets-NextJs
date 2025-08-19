"use client";
import React from "react";
import { FaPaw } from "react-icons/fa6";
import Donate_OurMIssion_HeroSection from "../shared/Donate_OurMIssion_HeroSection";
import AchieveOurMissionSection from "./AchieveOurMissionSection";
import { weAimFeatures } from "./our-mission.data";

import dynamic from "next/dynamic";
const loader = () => <p>loading...........</p>;
const OurMissionWhyWeExist = dynamic(() => import("./OurMissionWhyWeExist"), {
  ssr: false,
  loading: loader,
});
const WeAimTo = dynamic(() => import("./WeAimTo"), {
  ssr: false,
  loading: loader,
});
const OurMissionImpactSection = dynamic(
  () => import("./OurMissionImpactSection"),
  {
    ssr: false,
    loading: loader,
  }
);
const OurMission: React.FC = () => {
  return (
    <div>
      <Donate_OurMIssion_HeroSection
        badgeText="Transforming Pet Care"
        subtitle="Affordable Veterinary Care for Every Pet"
        subTitleClassName="text-center"
        description="At Rex Vets, we're revolutionizing pet healthcare by breaking down barriers and making quality veterinary care accessible to every family, regardless of financial or geographic limitations."
        secondaryButton={{
          text: "Talk to vet",
          icon: (
            <FaPaw className="mr-3 text-xl group-hover:translate-x-1 transition-transform duration-300" />
          ),
          onClick: () => console.log("Learn More clicked"),
        }}
      />
      <OurMissionWhyWeExist
        title="Why We Exist"
        subtitle="Why We Exist"
        description="We understand that veterinary care can be costly and challenging to access. That's why we've revolutionized pet healthcare with innovative telehealth services that bring expert veterinary care directly to your home."
      />
      <WeAimTo features={weAimFeatures} />
      <AchieveOurMissionSection
        chipText="Innovation"
        headingPrefix="How We"
        headingMain="Achieve Our Mission"
        description="Custom description..."
        tags={["Telehealth", "Expert Care", "24/7 Support"]}
        imageSrc="/images/mission/image1.webp"
        imageAlt="Support Pets"
        className="md:h-[70vh]"
      />
      <OurMissionImpactSection
        title="The Impact of Your Support"
        subtitle="As a non-profit organization, we rely on the generosity of our community to continue providing affordable telehealth services. Every donation helps us:"
        impactItems={[
          "Keep our telehealth services affordable for all families",
          "Fund essential medical supplies and cutting-edge technology",
          "Support outreach programs that educate and promote animal welfare",
        ]}
        imageSrc="/images/mission/dog.webp"
        ctaHref="/donate"
        ctaLabel="Making a Difference"
      />
    </div>
  );
};

export default React.memo(OurMission);
