"use client";
import { motion, Variants } from "framer-motion";
import React from "react";
import RexHealthHubStatsCard from "./RexHealthHubStatsCard";

interface RexHealthHubHeroSectionProps {
  title: string;
  description: string;
  stats: { label: string; value: string | number; icon: React.ReactNode }[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const RexHealthHubHeroSection: React.FC<RexHealthHubHeroSectionProps> = ({
  title,
  description,
  stats,
}) => (
  <section
    className="relative min-h-[100vh] flex items-center justify-center bg-cover bg-center md:bg-fixed overflow-x-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(0, 35, 102, 0.9), rgba(67, 56, 202, 0.9), rgba(139, 92, 246, 0.9)), url('/images/Blogs/BlogsCover.webp')`,
    }}
  >
    {/* Decorative gradients */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.1)_0%,_transparent_50%),radial-gradient(circle_at_80%_80%,_rgba(255,255,255,0.08)_0%,_transparent_50%),radial-gradient(circle_at_40%_60%,_rgba(139,92,246,0.1)_0%,_transparent_50%)] pointer-events-none z-0 overflow-hidden"></div>

    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 md:py-12 relative z-10 box-border"
    >
      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="m-0 mb-6 
    font-roboto font-black 
    text-[6rem] leading-[1.167] tracking-[-0.01562em] 
    [text-shadow:0px_4px_20px_rgba(0,0,0,0.5)] 
    bg-[linear-gradient(135deg,rgba(255,255,255,1)_0%,rgba(226,232,240,1)_100%)] 
    bg-clip-text 
    text-transparent 
    [filter:drop-shadow(0px_2px_4px_rgba(0,0,0,0.3))]"
      >
        {title}
      </motion.h1>

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-[24px] leading-[38px] text-white/90 max-w-xl mx-auto "
      >
        {description}
      </motion.p>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <RexHealthHubStatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

export default React.memo(RexHealthHubHeroSection);
