"use client";
import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import React from "react";
import AboutUsSection from "./AboutUsSection";
import AwardsMarquee from "./AwardsMarquee";
import { BlogPostSection } from "./BlogPostSection";
import FeaturesSection from "./FeaturesSection";
import HeroSection from "./HeroSection";
import { RexVetPlan } from "./HomeRexVetPlan";
import { SupportOurMission } from "./SupportOurMission";
import { TestimonialsSection } from "./TestimonialsSection";
import { VirtualCareIntroSection } from "./VirtualCareIntroSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <AwardsMarquee brands={doubledBrands} />
      <AboutUsSection
        features={features}
        footer={{
          title: "Join thousands of pet parents who trust Rexvet",
          tabs: ["Trusted", "Verified", "Available 24/7"],
        }}
      />
      <FeaturesSection data={whyChooseFeaturesData} />
      <RexVetPlan />
      <SupportOurMission />
      <VirtualCareIntroSection />
      <BlogPostSection />
      <TestimonialsSection />
    </div>
  );
};

export default Home;
