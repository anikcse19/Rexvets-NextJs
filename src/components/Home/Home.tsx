"use client";

import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import dynamic from "next/dynamic";
import React from "react";

const loadingPlaceholder = () => <p>Loading...</p>;

const AboutUsSection = dynamic(() => import("./AboutUsSection"), {
  loading: loadingPlaceholder,
});
const AwardsMarquee = dynamic(() => import("./AwardsMarquee"), {
  loading: loadingPlaceholder,
});
const FeaturesSection = dynamic(() => import("./FeaturesSection"), {
  loading: loadingPlaceholder,
});
const HeroSection = dynamic(() => import("./HeroSection"), {
  loading: loadingPlaceholder,
});
const BlogPostSection = dynamic(
  () => import("./BlogPostSection").then((mod) => mod.BlogPostSection),
  { loading: loadingPlaceholder }
);
const RexVetPlan = dynamic(
  () => import("./HomeRexVetPlan").then((mod) => mod.RexVetPlan),
  { loading: loadingPlaceholder }
);
const SupportOurMission = dynamic(
  () => import("./SupportOurMission").then((mod) => mod.SupportOurMission),
  { loading: loadingPlaceholder }
);
const TestimonialsSection = dynamic(
  () => import("./TestimonialsSection").then((mod) => mod.TestimonialsSection),
  { loading: loadingPlaceholder }
);
const VirtualCareIntroSection = dynamic(
  () =>
    import("./VirtualCareIntroSection").then(
      (mod) => mod.VirtualCareIntroSection
    ),
  { loading: loadingPlaceholder }
);
const Home = () => {
  // Temporarily disabled automatic push notification registration to fix service worker conflicts
  // useEffect(() => {
  //   handleRequestPermission();
  // }, [handleRequestPermission]);
  // // Subscribe to push notifications once permission is granted
  // useEffect(() => {
  //   if (permission === "granted" && !subscription) {
  //     subscribeToPush(publicVapidKey, backendSaveUrl);
  //   }
  // }, [permission, subscription, subscribeToPush]);
  return (
    <div>
      <HeroSection />
      <AwardsMarquee brands={doubledBrands} />
      <AboutUsSection
        features={features}
        footer={{
          title: "Join thousands of pet parents who trust Rex vet",
          tabs: ["Trusted", "Verified", "Available 24/7"],
        }}
      />
      <FeaturesSection data={whyChooseFeaturesData} />
      <RexVetPlan />
      <SupportOurMission />
      <VirtualCareIntroSection />
      <BlogPostSection />
      <TestimonialsSection />

      {/* Chat Icon */}
    </div>
  );
};

export default Home;
