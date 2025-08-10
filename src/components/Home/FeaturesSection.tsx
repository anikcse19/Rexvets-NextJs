"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IHomeFeaturesSection } from "@/lib";
import { motion, Variants } from "framer-motion";
import { MdPets } from "react-icons/md"; // 🐾 Paw icon

import Image from "next/image";
import React from "react";
import { IoCashOutline } from "react-icons/io5";
import {
  MdFavorite,
  MdHome,
  MdMonetizationOn,
  MdSchedule,
  MdSchool,
  MdSupport,
} from "react-icons/md";

interface FeaturesSectionProps {
  data: IHomeFeaturesSection[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ data = [] }) => {
  // Map feature IDs to icons
  const iconMap: { [key: number]: React.ReactElement } = {
    1: <MdMonetizationOn size={28} className="text-white" />,
    2: <MdHome size={28} className="text-white" />,
    3: <MdFavorite size={28} className="text-white" />,
    4: <MdSupport size={28} className="text-white" />,
    5: <MdSchedule size={28} className="text-white" />,
    6: <MdSchool size={28} className="text-white" />,
  };

  // Framer Motion variants for card hover
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      border: "1px solid rgba(255,255,255,0.2)",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Framer Motion variants for gradient bar
  const gradientBarVariants: Variants = {
    initial: { scaleX: 0, transformOrigin: "left" },
    hover: { scaleX: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  // Framer Motion variants for center image
  const imageVariants: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  return (
    <div className="relative py-8 md:py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative z-10 3xl:max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-3">
            <MdPets className="hidden md:block text-[#4CAF50] text-3xl md:text-5xl mr-2" />
            <h2 className="text-3xl md:text-4xl lg:text-[64px] font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 mb-3 leading-tight">
              Why Choose Rex Vet?
            </h2>
          </div>
          <p className="text-base md:text-[21px] md:leading-[33px] font-garet text-[#546e7a] font-[500] max-w-2xl mx-auto leading-relaxed ">
            Rex Vet is a 501(c)(3) non-profit organization committed to
            providing convenient, affordable, and compassionate veterinary care
            through telehealth. Our experienced veterinarians are here to help
            you and your pet—no travel required.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 justify-items-center">
          {/* Left Column */}
          <div className="flex flex-col gap-4 w-full">
            {data.slice(0, 3).map((feature) => (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                className="w-full   mb-2 rounded-2xl home-features-card max-w-md overflow-hidden mx-auto"
              >
                <Card className="relative  w-full bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1 overflow-hidden"
                    style={{ background: feature.gradient }}
                    variants={gradientBarVariants}
                    initial="initial"
                    animate="initial"
                  />
                  <CardContent className="p-6 text-right md:text-right">
                    <div className="flex justify-end items-center mb-2">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{
                          background: feature.gradient,
                          boxShadow: `0 8px 25px ${feature.color}40`,
                        }}
                      >
                        {iconMap[feature.id]}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#2c3e50] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-base text-[#546e7a] leading-relaxed text-end  font-garet font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Center Image */}
          <div className="flex justify-center items-center w-full h-full relative">
            <motion.div
              variants={imageVariants}
              initial="initial"
              whileHover="hover"
              className="relative rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.15)] w-full max-w-md"
            >
              <Image
                src="/images/Homepage/twoPuppy.webp"
                alt="Rex Vet Benefits"
                width={500}
                height={500}
                className="w-full h-[300px] md:h-[500px] object-cover rounded-2xl brightness-110 contrast-110"
              />
              <div className="absolute top-5 right-5 flex gap-2">
                <Badge className="bg-white/90 text-[#2c3e50] font-semibold backdrop-blur-md">
                  <IoCashOutline className="mr-1" /> Trusted Care
                </Badge>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 w-full">
            {data.slice(3, 6).map((feature) => (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                className="w-full rounded-2xl home-features-card max-w-md overflow-hidden mx-auto"
              >
                <Card className="relative bg-white/95 backdrop-blur-xl rounded-2xl border border-white/20">
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: feature.gradient }}
                    variants={gradientBarVariants}
                    initial="initial"
                    animate="initial"
                  />
                  <CardContent className="p-6 text-left md:text-left">
                    <div className="flex justify-start items-center mb-2">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mr-2"
                        style={{
                          background: feature.gradient,
                          boxShadow: `0 8px 25px ${feature.color}40`,
                        }}
                      >
                        {iconMap[feature.id]}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-[#2c3e50] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-base text-[#546e7a] leading-relaxed text-justify font-garet font-medium">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FeaturesSection);
