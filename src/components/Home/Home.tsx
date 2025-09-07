"use client";

import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import dynamic from "next/dynamic";
import React from "react";
import ChatIcon from "./ChatIcon";
import type { ComponentType } from "react";

const Skeleton = () => (
  <div className="w-full h-56 bg-gray-100 animate-pulse rounded-lg" />
);

// Helper to lazy-import client-only components
const lazy = (importer: () => Promise<any>): ComponentType<any> =>
  dynamic(importer, {
    ssr: false,
    loading: () => <Skeleton />,
  }) as ComponentType<any>;

// HeroSection stays SSR for LCP
const HeroSection = dynamic(() => import("./HeroSection"));

const AboutUsSection = lazy(() => import("./AboutUsSection"));
const AwardsMarquee = lazy(() => import("./AwardsMarquee"));
const FeaturesSection = lazy(() => import("./FeaturesSection"));
const BlogPostSection = lazy(() =>
  import("./BlogPostSection").then((m) => m.BlogPostSection)
);
const RexVetPlan = lazy(() =>
  import("./HomeRexVetPlan").then((m) => m.RexVetPlan)
);
const SupportOurMission = lazy(() =>
  import("./SupportOurMission").then((m) => m.SupportOurMission)
);
const TestimonialsSection = lazy(() =>
  import("./TestimonialsSection").then((m) => m.TestimonialsSection)
);
const VirtualCareIntroSection = lazy(() =>
  import("./VirtualCareIntroSection").then((m) => m.VirtualCareIntroSection)
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
