"use client";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import { PawPrint } from "lucide-react";
import React from "react";

interface HeroProps {
  coverImage: string;
  chipLabel: string;
  title1: string;
  title2: string;
  subtitle: string;
  gradients: {
    accent: string;
    secondary: string;
  };
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
};

// Floating animation variant
const floatAnimation: Variants = {
  animate: {
    y: [0, -30, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 8,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const floatAnimationReverse: Variants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, -180, -360],
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const OurTeamHeroSection: React.FC<HeroProps> = ({
  coverImage,
  chipLabel,
  title1,
  title2,
  subtitle,
  gradients,
}) => {
  return (
    <div
      className="min-h-screen flex items-center relative bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(0, 34, 97, 0.85) 0%, rgba(8, 73, 193, 0.85) 100%), url(${coverImage})`,
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      ></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <div
            className="
              mb-4 
              px-4 
              py-1.5 
              text-base 
              font-semibold 
              bg-[rgba(255,255,255,0.15)] 
              text-white 
              backdrop-blur-xl 
              border 
              border-[rgba(255,255,255,0.2)] 
              rounded-full 
              flex 
              items-center 
              gap-2 
              justify-center
              w-[200px]
              mx-auto
              text-[18px]
              "
          >
            <PawPrint
              className="w-5 h-5 text-white"
              size={30}
              // aria-hidden="true"
            />
            {chipLabel}
          </div>

          <h1
            className="
              text-4xl 
              md:text-[96px]
              font-black 
              bg-gradient-to-r 
              from-white 
              to-[#e3f2fd] 
              text-transparent 
              bg-clip-text 
              mb-2 
              leading-tight 
              font-inter 
              drop-shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          >
            {title1}
          </h1>

          <h1
            className={`
              text-4xl 
              md:text-6xl 
              lg:text-7xl 
              font-black 
              bg-gradient-to-r 
              ${gradients.accent} 
              text-transparent 
              bg-clip-text 
              mb-4 
              leading-tight 
              font-inter`}
          >
            {title2}
          </h1>

          <p
            className="
              text-lg 
              md:text-[24px] 
              text-[rgba(255,255,255,0.9)] 
              font-normal 
              max-w-2xl 
              mx-auto 
              leading-relaxed 
              font-inter"
          >
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        variants={floatAnimation}
        animate="animate"
        className={`
          absolute 
          top-[15%] 
          right-[10%] 
          w-20 
          h-20 
          rounded-full 
          bg-gradient-to-r 
          ${gradients.accent} 
          opacity-60`}
      ></motion.div>

      <motion.div
        variants={floatAnimationReverse}
        animate="animate"
        className={`
          absolute 
          bottom-[20%] 
          left-[8%] 
          w-16 
          h-16 
          rounded-full 
          bg-gradient-to-r 
          ${gradients.secondary} 
          opacity-50`}
      ></motion.div>
    </div>
  );
};

export default React.memo(OurTeamHeroSection);
