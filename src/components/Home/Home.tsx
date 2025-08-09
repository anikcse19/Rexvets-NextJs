"use client";
import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import React from "react";
import { Footer } from "../Footer";
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
          title: "Join thousands of pet parents who trust Rexvets",
          tabs: ["Trusted", "Verified", "Available 24/7"],
        }}
      />
      <FeaturesSection data={whyChooseFeaturesData} />
      <RexVetPlan />
      <SupportOurMission />
      <VirtualCareIntroSection />
      <BlogPostSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Home;
