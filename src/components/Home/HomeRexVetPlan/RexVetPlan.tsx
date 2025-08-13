"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import RexVetAPointmentFeeInfo from "./RexVetAPointmentFeeInfo";
import RexVetFamilyPlanInfo from "./RexVetFamilyPlanInfo";
import RexVetPlanAnimatedBackground from "./RexVetPlanAnimatedBackground";
import RexVetPlanInfoCard from "./RexVetPlanInfoCard";

const sharedFeatures = [
  "Access to licensed veterinarians",
  "High-quality, secure video calls & 48-hour follow-up messaging",
  "Prescriptions via RexVetRx",
  "Medical records always secure and accessible",
];

const perAppointmentFeatures = [
  "Pay only when you need it",
  "No monthly commitments",
  "Same professional veterinarians",
  "Complete medical consultation",
  "Prescription services included",
];

const familyPlanFeatures = [
  "4 virtual vet appointments ($140 value minimum)",
  "Unlimited messaging with professionals",
  "Exclusive discounts on medications",
  "Free shipping on all orders over $49",
  "Covers all of your pets",
];

const RexVetPlan: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<"per" | "family" | null>(null);
  const [isSmallDevice, setIsSmallDevice] = useState(false);

  const navigate = useRouter();

  // Framer Motion variants for pulse effect

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    setIsSmallDevice(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsSmallDevice(e.matches);
    };
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);
  return (
    <div className="relative  bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 overflow-hidden">
      {/* Animated Background Elements */}
      <RexVetPlanAnimatedBackground />

      <div className="relative z-10 3xl:max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Side */}
          <div className="lg:col-span-5">
            <RexVetPlanInfoCard sharedFeatures={sharedFeatures} />
          </div>

          {/* Right Side - Creative Card Layout */}
          <div className="lg:col-span-7 relative h-auto lg:h-[600px] mt-20">
            {/* Per Appointment Card */}

            <RexVetAPointmentFeeInfo
              isSmallDevice={isSmallDevice}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              onClick={() => navigate.push("/findAVet")}
              perAppointmentFeatures={perAppointmentFeatures}
            />
            {/* Family Plan Card */}
            <RexVetFamilyPlanInfo
              familyPlanFeatures={familyPlanFeatures}
              onClick={(state: number) =>
                navigate.push("/indAVet", { state } as any)
              }
              isSmallDevice={isSmallDevice}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
            />

            {/* Connecting Line Element */}
            <div className="hidden lg:block absolute top-2/5 left-[30%] w-[40%] h-0.5 bg-gradient-to-r from-amber-500/60 via-transparent to-indigo-600/60 rounded-sm opacity-30 z-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RexVetPlan);
