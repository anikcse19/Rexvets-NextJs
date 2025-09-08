"use client";

import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import dynamic from "next/dynamic";
import React from "react";
import ChatIcon from "./ChatIcon";
import type { ComponentType } from "react";
import LazyLoad from "../LazyLoad";

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

const AboutUsSection = () => (
  <LazyLoad
    importer={() => import("./AboutUsSection")}
    props={{
      features,
      footer: {
        title: "Join thousands of pet parents who trust Rex vet",
        tabs: ["Trusted", "Verified", "Available 24/7"],
      },
    }}
  />
);
const AwardsMarquee = () => (
  <LazyLoad
    importer={() => import("./AwardsMarquee")}
    props={{ brands: doubledBrands }}
  />
);
const FeaturesSection = () => (
  <LazyLoad
    importer={() => import("./FeaturesSection")}
    props={{ data: whyChooseFeaturesData }}
  />
);
const BlogPostSection = () => (
  <LazyLoad
    importer={() =>
      import("./BlogPostSection").then((m) => ({ default: m.BlogPostSection }))
    }
  />
);
const RexVetPlan = () => (
  <LazyLoad
    importer={() =>
      import("./HomeRexVetPlan").then((m) => ({ default: m.RexVetPlan }))
    }
  />
);
const SupportOurMission = () => (
  <LazyLoad
    importer={() =>
      import("./SupportOurMission").then((m) => ({
        default: m.SupportOurMission,
      }))
    }
  />
);
const TestimonialsSection = () => (
  <LazyLoad
    importer={() =>
      import("./TestimonialsSection").then((m) => ({
        default: m.TestimonialsSection,
      }))
    }
  />
);
const VirtualCareIntroSection = () => (
  <LazyLoad
    importer={() =>
      import("./VirtualCareIntroSection").then((m) => ({
        default: m.VirtualCareIntroSection,
      }))
    }
  />
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
      <AwardsMarquee />
      <AboutUsSection />
      <RexVetPlan />
      <FeaturesSection />
      <SupportOurMission />
      <VirtualCareIntroSection />
      <BlogPostSection />
      <TestimonialsSection />

      {/* Chat Icon */}
    </div>
  );
};

export default Home;
