import { doubledBrands, features } from "@/lib";
import React from "react";
import AboutUsSection from "./AboutUsSection";
import AwardsMarquee from "./AwardsMarquee";
import HeroSection from "./HeroSection";

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
    </div>
  );
};

export default Home;
