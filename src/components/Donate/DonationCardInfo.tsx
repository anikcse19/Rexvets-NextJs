"use client";

import { Card, CardContent } from "@/components/ui/card";
import StripeContext from "@/hooks/StripeContext";
import { motion, Variants } from "framer-motion";
import React from "react";
import DonationBGAnimation from "./DonationBGAnimation";
import DonationComponent from "./DonationBox";

const floatVariant: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const pulseVariant: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 0.4, 0.7],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const DonationCardInfo = () => {
  // Dummy amount and badge, replace with actual logic or props if needed
  const amount: number | null = null;
  const badge: string | null = null;

  return (
    <div className="donation-container">
      {/* Background radial gradients with float animation */}
      <DonationBGAnimation />

      {/* Main Container */}
      <div className="relative z-10  md:max-w-[850px] w-full mx-auto py-4 px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-8 text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 text-transparent bg-clip-text drop-shadow-md">
            Make a Difference
          </h2>
          <p className="text-lg opacity-90 font-light tracking-wide">
            Your contribution creates lasting impact
          </p>
        </div>

        {/* Shadcn UI Card */}
        <Card className="relative overflow-hidden bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-black/10 ring-1 ring-white/60">
          {/* Shimmer top border */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: "linear-gradient(90deg, #667eea, #764ba2, #667eea)",
              backgroundSize: "200% 100%",
            }}
            initial={{ backgroundPositionX: "-200%" }}
            animate={{ backgroundPositionX: "200%" }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          />

          <CardContent className="relative p-6 sm:p-8 md:p-2 ">
            {/* Decorative shapes inside card */}
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 opacity-60" />
            <div className="absolute bottom-5 left-5 w-[30px] h-[30px] rounded-[20%] bg-gradient-to-tr from-[#667eea]/15 to-[#764ba2]/15 opacity-40" />
            <StripeContext>
              <DonationComponent />
            </StripeContext>
          </CardContent>
        </Card>

        {/* Bottom text */}
        <div className="text-center mt-6 text-white/80">
          <p className="text-sm font-light tracking-wide">
            Secure • Trusted • Impactful
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationCardInfo;
