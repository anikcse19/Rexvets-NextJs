"use client";
import { Badge } from "@/components/ui/badge";
import { motion, Variants } from "framer-motion";
import React from "react";
import OurTeamLeaderCard from "./OurTeamLeaderCard";

interface Leader {
  name: string;
  title: string;
  description: string;
  image: string;
  icon: "School" | "Psychology";
  gradient: string;
}

interface LeadershipProps {
  chipLabel: string;
  title: string;
  subtitle: string;
  leaders: Leader[];
  gradients: {
    accent: string;
    secondary: string;
  };
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } },
};

const floatAnimation: Variants = {
  animate: {
    y: [0, -30, 0], // float up and down
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
    transition: {
      duration: 10,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const OurTeamLeadershipSection: React.FC<LeadershipProps> = ({
  chipLabel,
  title,
  subtitle,
  leaders,
  gradients,
}) => {
  return (
    <div
      className="
        py-12 
        bg-gradient-to-b 
        from-[#0a0e27] 
        via-[#16213e] 
        to-[#1a1a2e] 
        relative 
        overflow-hidden"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245, 87, 108, 0.1) 0%, transparent 50%)",
        }}
      ></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="text-center mb-8"
        >
          <Badge
            className="
              mb-3 
              px-3 
              py-1 
              text-base 
              font-semibold 
              bg-[rgba(255,255,255,0.15)] 
              text-white 
              backdrop-blur-xl 
              border 
              border-[rgba(255,255,255,0.2)] 
              rounded-full"
          >
            {chipLabel}
          </Badge>
          <h2
            className="
              text-3xl 
              md:text-5xl 
              font-black 
              bg-gradient-to-r 
              from-white 
              to-[#e3f2fd] 
              text-transparent 
              bg-clip-text 
              mb-2 
              font-inter 
              drop-shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          >
            {title}
          </h2>
          <p
            className="
              text-lg 
              text-[rgba(255,255,255,0.8)] 
              font-normal 
              max-w-xl 
              mx-auto 
              font-inter"
          >
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaders.map((leader, index) => (
            <OurTeamLeaderCard
              key={index}
              {...leader}
              delay={1.2 + index * 0.2}
              gradients={gradients}
            />
          ))}
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <motion.div
        variants={floatAnimation}
        animate="animate"
        className="
          absolute 
          top-[10%] 
          right-[5%] 
          w-24 
          h-24 
          rounded-full 
          bg-[rgba(79,172,254,0.1)]"
      ></motion.div>

      <motion.div
        variants={floatAnimationReverse}
        animate="animate"
        className="
          absolute 
          bottom-[15%] 
          left-[8%] 
          w-20 
          h-20 
          rounded-full 
          bg-[rgba(245,87,108,0.1)]"
      ></motion.div>
    </div>
  );
};

export default React.memo(OurTeamLeadershipSection);
