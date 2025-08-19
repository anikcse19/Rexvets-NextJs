"use client";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

// Slide-right animation for image
const slideRight: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: "easeOut" },
  },
};

// Slide-left animation for text
const slideLeft: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

interface IProps {
  chipText?: string;
  headingPrefix?: string;
  headingMain?: string;
  description?: string;
  tags?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageBadge?: React.ReactNode;
  className?: string;
}

const AchieveOurMissionSection: React.FC<IProps> = ({
  chipText = "Innovation",
  headingPrefix = "How We",
  headingMain = "Achieve Our Mission",
  description =
    "Through our innovative telehealth platform, Rex Vets connects pet owners with experienced veterinarians who provide virtual consultations, treatment recommendations, and follow-up care. By eliminating barriers of cost and travel, we bring essential veterinary services directly into homes nationwide.",
  tags = ["Telehealth", "Expert Care", "24/7 Support"],
  imageSrc = "/images/mission/image1.webp",
  imageAlt = "Support Pets",
  imageWidth = 600,
  imageHeight = 400,
  imageBadge = <span className="text-[#2b9159] text-2xl">⭐</span>,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "py-6 md:py-12 md:h-[60vh] flex items-center justify-center bg-gradient-to-b from-white to-[#f8fafc]",
        className
      )}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-11 items-center">
          {/* Left Section (Image) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideRight}
            className="rounded-lg overflow-hidden relative shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={imageWidth}
              height={imageHeight}
              className="w-full h-auto block transition-transform duration-500 hover:scale-105"
            />
            <div
              className="
                absolute 
                top-5 
                right-5 
                bg-[rgba(255,255,255,0.9)] 
                rounded-full 
                p-1 
                backdrop-blur-md"
            >
              {imageBadge}
            </div>
          </motion.div>

          {/* Right Section (Text) */}
          <motion.div initial="hidden" animate="visible" variants={slideLeft}>
            {/* Chip */}
            <span
              className="
                mb-3 
                inline-block 
                bg-[linear-gradient(135deg,_rgb(79,172,254)_0%,_rgb(0,242,254)_100%)]
                text-white 
                font-semibold 
                text-sm 
                px-3 
                py-1 
                rounded-full"
            >
              {chipText}
            </span>

            {/* Heading */}
            <h2
              className="
                text-2xl 
                md:text-[48px]
                leading-[58px] 
                mb-3 
                font-inter"
            >
              <span
                className="
                bg-[linear-gradient(135deg,_rgb(25,118,210)_0%,_rgb(156,39,176)_100%)]

                  text-transparent 
                  bg-clip-text"
              >
                {headingPrefix}{" "}
              </span>
              <span className="text-[#002261]">{headingMain}</span>
            </h2>

            {/* Description */}
            <p
              className="
                text-lg 
                md:text-xl 
                text-[rgba(0,0,0,0.7)] 
                mb-4 
                leading-relaxed 
                font-inter"
            >
              {description}
            </p>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="
                  bg-[rgba(102,126,234,0.1)] 
                  text-[#002261] 
                  font-semibold 
                  text-sm 
                  px-3 
                  py-1 
                  rounded-full 
                  hover:bg-[rgba(102,126,234,0.2)] 
                  transition-colors 
                  duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AchieveOurMissionSection);
