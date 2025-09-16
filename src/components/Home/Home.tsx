"use client";

import { doubledBrands, features, whyChooseFeaturesData } from "@/lib";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import LazyLoad from "../LazyLoad";
import VetScheduleSetupAlertModal from "../shared/VetScheduleSetupAlertModal";
import { FAQ } from "../FAQ";

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

  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  // console.log("userrole from home page", userRole);

  const isAppointmentSLotAvailable = async (vetId: string) => {
    if (session?.user?.role !== "veterinarian") {
      return;
    }
    try {
      const response = await fetch(
        `/api/appointments/booking/slot/has-availability?vetId=${vetId}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch appointment slot availability: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("isAppointmentSLotAvailable", data?.data?.hasAvailability);
      setOpen(!data?.data?.hasAvailability);
    } catch (error: any) {
      toast.error(
        error.message || "Failed to fetch appointment slot availability"
      );
      console.error("Error fetching appointment slot availability:", error);
    }
  };
  useEffect(() => {
    if (session?.user?.role === "veterinarian" && session?.user?.refId) {
      isAppointmentSLotAvailable(session?.user?.refId);
    }
  }, [session]);

  // console.log("open from home page", open);

  // Don't render session-dependent content until session is loaded
  if (status === "loading") {
    return (
      <div>
        <HeroSection />
        <AwardsMarquee />
        <AboutUsSection />
        <FeaturesSection />
        <TestimonialsSection />
        <VirtualCareIntroSection />
      </div>
    );
  }

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
      <FAQ />
      <VetScheduleSetupAlertModal open={open} />

      {/* Chat Icon */}
    </div>
  );
};

export default Home;
