"use client";
import config from "@/config/env.config";
import usePushNotification from "@/hooks/usePushNotification";
import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect } from "react";

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
const publicVapidKey = config.VAPID_PUBLIC_KEY!;
const backendSaveUrl = "";
const Home = () => {
  const { permission, subscription, requestPermission, subscribeToPush } =
    usePushNotification();
  const handleRequestPermission = useCallback(() => {
    requestPermission();
  }, [requestPermission]);
  useEffect(() => {
    handleRequestPermission();
  }, [handleRequestPermission]);
  // Subscribe to push notifications once permission is granted
  useEffect(() => {
    if (permission === "granted" && !subscription) {
      subscribeToPush(publicVapidKey, backendSaveUrl);
    }
  }, [permission, subscription, subscribeToPush]);
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
    </div>
  );
};

export default Home;
