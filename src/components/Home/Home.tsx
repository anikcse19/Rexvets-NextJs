"use client";
import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import React from "react";
import AboutUsSection from "./AboutUsSection";
import AwardsMarquee from "./AwardsMarquee";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import RexVetPlan from "./RexVetPlan";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AwardsMarquee brands={doubledBrands} />
      <AboutUsSection
        features={features}
        footer={{
          title: "Join thousands of pet parents who trust Rexvets",
          tabs: ["Trusted", "Verified", "Available 24/7"],
        }}
      />
      <FeaturesSection data={whyChooseFeaturesData} />
      <RexVetPlan />
    </div>
  );
};

export default Home;
