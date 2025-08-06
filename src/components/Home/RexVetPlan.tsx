/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  IoCheckmarkCircle,
  IoFlashOutline,
  IoHeartOutline,
  IoMedkitOutline,
  IoPawOutline,
  IoPeopleOutline,
  IoShieldOutline,
  IoSparkles,
  IoStar,
  IoTimeOutline,
} from "react-icons/io5";

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

const RexVetFamilyPlan: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<"per" | "family" | null>(null);
  const navigate = useRouter();

  // Framer Motion variants for floating icons
  const floatVariants: Variants = {
    animate: {
      y: [0, -20, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  };
  const floatDelayedVariants: Variants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 2,
      },
    },
  };
  const floatDelayed2Variants: Variants = {
    animate: {
      y: [0, -25, 0],
      transition: {
        duration: 7,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 4,
      },
    },
  };

  // Framer Motion variants for pulse effect
  const pulseVariants: Variants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Framer Motion variants for card animations
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
    },
    hover: {
      y: -8,
      scale: 1.05,
      rotate: -1,
      boxShadow: "0 25px 50px rgba(255,193,7,0.25)",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    tilt: {
      rotate: [-2, -1, -2],
      y: [0, -5, 0],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const familyCardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      rotate: 0,
      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    },
    hover: {
      y: -12,
      scale: 1.05,
      rotate: 1,
      boxShadow: "0 30px 60px rgba(99,102,241,0.3)",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    tilt: {
      rotate: [2, 1, 2],
      y: [0, -8, 0],
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Framer Motion variants for button hover
  const buttonVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative  bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/25 to-purple-300/25 rounded-full blur-3xl"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/2 -right-32 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-red-300/20 rounded-full blur-2xl"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-br from-green-200/20 to-cyan-200/20 rounded-full blur-3xl"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-20"
        variants={floatVariants}
        animate="animate"
      >
        <IoHeartOutline className="text-red-300 text-2xl opacity-40" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-32"
        variants={floatDelayedVariants}
        animate="animate"
      >
        <IoMedkitOutline className="text-indigo-300 text-3xl opacity-40" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/3"
        variants={floatDelayed2Variants}
        animate="animate"
      >
        <IoShieldOutline className="text-green-300 text-xl opacity-40" />
      </motion.div>

      <div className="relative z-10 3xl:max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Side */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <Badge className="mb-3 bg-gradient-to-br from-indigo-200/50 rounded-full py-2 px-5 to-purple-200/50 border border-indigo-300/50 text-indigo-800 font-semibold">
                <IoSparkles className="mr-1" /> Flexible Veterinary Care
              </Badge>

              {/* Main Headline */}
              <h2 className="text-2xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600 mb-3 leading-tight">
                Choose the{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-red-600 font-extrabold">
                  RexVets plan
                </span>{" "}
                that fits your lifestyle.
              </h2>

              <p className="text-base lg:text-xl text-gray-600 mb-4 leading-relaxed">
                Whether you prefer{" "}
                <strong className="text-gray-900 ">
                  pay-as-you-go flexibility
                </strong>{" "}
                or{" "}
                <strong className="text-gray-900 ">
                  unlimited access with savings
                </strong>
                , we have the perfect veterinary care solution for you and your
                pets.
              </p>

              {/* Features Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <IoCheckmarkCircle className="text-white text-sm" />
                  </div>
                  <h3 className="text-[19px] font-bold text-gray-900">
                    What&apos;s always included with both plans:
                  </h3>
                </div>

                <div className="space-y-2">
                  {sharedFeatures.map((text, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-2 hover:translate-x-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.2 }}
                    >
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center mt-0.5">
                        <IoCheckmarkCircle className="text-white text-xs" />
                      </div>
                      <p className="text-sm font-garet text-gray-600 leading-relaxed text-justify flex-1">
                        {text}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-col lg:flex-row gap-3 mt-6 pt-4">
                  <div className="flex items-center space-x-1">
                    <IoPeopleOutline className="text-indigo-600 text-base" />
                    <p className="text-base font-medium font-garet text-gray-600 text-justify">
                      1000+ happy pets
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IoTimeOutline className="text-green-600 text-base" />
                    <p className="text-base font-medium font-garet text-gray-600 text-justify">
                      24/7 availability
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IoShieldOutline className="text-cyan-600 text-base" />
                    <p className="text-base font-medium font-garet text-gray-600 text-justify">
                      Secure & private
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Creative Card Layout */}
          <div className="lg:col-span-7 relative h-auto lg:h-[600px] mt-20">
            {/* Per Appointment Card */}
            <motion.div
              onMouseEnter={() => setHoveredCard("per")}
              onMouseLeave={() => setHoveredCard(null)}
              variants={cardVariants}
              initial="initial"
              animate={
                hoveredCard === "per"
                  ? "hover"
                  : hoveredCard === null
                  ? "tilt"
                  : "initial"
              }
              className={`relative w-full lg:w-[75%] rounded-3xl  mb-4 lg:mb-0 ${
                hoveredCard === "per" ? "z-[100]" : "z-[2]"
              } lg:absolute lg:top-0 lg:left-0`}
            >
              <div className="relative  p-6 bg-gradient-to-br  from-white/95 to-yellow-50/95 backdrop-blur-xl rounded-3xl border-2 border-amber-300/30 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-700" />
                <div className="absolute -top-2.5 -right-2.5 w-16 h-16 bg-gradient-to-br from-amber-200/40 to-amber-400/40 rounded-full blur-md" />

                <div className="flex items-start space-x-2 mb-2">
                  <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center shadow-[0_8px_16px_rgba(255,193,7,0.25)]">
                    <IoFlashOutline className="text-white text-base" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">
                      Per Appointment
                    </h3>
                    <p className="text-sm text-gray-600">
                      Perfect for occasional visits
                    </p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-2xl font-bold text-amber-600">$35</h4>
                    <p className="text-xs text-gray-600">per visit</p>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  {perAppointmentFeatures.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <div className="w-3.5 h-3.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center">
                        <IoCheckmarkCircle className="text-white text-[8px]" />
                      </div>
                      <p className="text-sm text-gray-600 leading-5">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>

                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button
                    className="w-full z-50 cursor-pointer py-7 bg-gradient-to-br from-amber-500 to-amber-700 font-bold text-white rounded-lg shadow-[0_4px_12px_rgba(255,193,7,0.25)] hover:shadow-[0_8px_20px_rgba(255,193,7,0.3)]"
                    onClick={() => navigate.push("/FindAVet")}
                  >
                    Get Started
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Family Plan Card */}
            <motion.div
              onMouseEnter={() => setHoveredCard("family")}
              onMouseLeave={() => setHoveredCard(null)}
              variants={familyCardVariants}
              initial="initial"
              animate={
                hoveredCard === "family"
                  ? "hover"
                  : hoveredCard === null
                  ? "tilt"
                  : "initial"
              }
              className={`relative w-full rounded-3xl  lg:w-[85%] ${
                hoveredCard === "family" ? "z-[100]" : "z-[3]"
              } lg:absolute lg:bottom-20 lg:right-0`}
            >
              <div className="absolute -top-4 left-5 z-10">
                <Badge className="bg-gradient-to-br from-red-600 to-red-800 text-white font-bold px-3 shadow-lg">
                  <IoStar className="mr-1 text-white" /> Most Popular
                </Badge>
              </div>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-70"
                variants={pulseVariants}
                animate="animate"
              />
              <div className="relative p-8 bg-gradient-to-br from-white/95 via-gray-50/95 to-slate-100/95 backdrop-blur-xl rounded-[24px] border-[3px] border-indigo-500/40 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600" />
                <div className="absolute -top-5 -right-5 w-20 h-20 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-md" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-cyan-200/20 to-green-200/20 rounded-full blur-md" />

                <div className="relative pt-2">
                  <div className="flex items-start space-x-2 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_8px_20px_rgba(99,102,241,0.25)] relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg blur-sm opacity-30" />
                      <IoPawOutline className="text-white text-lg relative" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        RexVets Family Plan
                      </h3>
                      <p className="text-sm text-gray-600">
                        Complete peace of mind for all your pets
                      </p>
                    </div>
                  </div>

                  <div className="text-center mb-3 p-2 bg-gradient-to-br from-white/80 to-gray-50/80 rounded-lg border border-dashed border-indigo-500/40">
                    <p className="text-sm text-gray-400 line-through mb-0.5">
                      $11.49
                    </p>
                    <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-0.5">
                      $10 <span className="text-lg text-gray-600">/month</span>
                    </h3>
                    <p className="text-sm text-gray-600">
                      Billed annually at $120
                    </p>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    {familyPlanFeatures.slice(0, 4).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1.5"
                      >
                        <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <IoCheckmarkCircle className="text-white text-[10px]" />
                        </div>
                        <p className="text-sm text-gray-600">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <motion.div variants={buttonVariants} whileHover="hover">
                    <Button
                      className="w-full z-50  cursor-pointer py-7 font-garet bg-gradient-to-br from-indigo-600 to-purple-600 font-medium text-white text-base rounded-lg shadow-[0_8px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.3)] relative overflow-hidden"
                      onClick={() =>
                        navigate.push("/FindAVet", { state: 120 } as any)
                      }
                    >
                      Select Family Plan
                      <motion.div
                        className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ left: "-100%" }}
                        whileHover={{ left: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Connecting Line Element */}
            <div className="hidden lg:block absolute top-2/5 left-[30%] w-[40%] h-0.5 bg-gradient-to-r from-amber-500/60 via-transparent to-indigo-600/60 rounded-sm opacity-30 z-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RexVetFamilyPlan);
