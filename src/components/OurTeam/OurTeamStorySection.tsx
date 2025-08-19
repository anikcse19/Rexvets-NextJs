"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";

interface StoryProps {
  images: {
    about1: string;
    about2: string;
  };
  title: string;
  titleHighlight: string;
  subtitle1: string;
  subtitle2: string;
  gradients: {
    accent: string;
  };
}

const slideRight: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.5, ease: "easeOut" } },
};

// Floating Paw Animation
const bounceAnimation: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};

const OurTeamStorySection: React.FC<StoryProps> = ({
  images,
  title,
  titleHighlight,
  subtitle1,
  subtitle2,
  gradients,
}) => {
  return (
    <div className="py-12 md:py-20 bg-gradient-to-b from-[#0a0e27] to-[#1a1a2e]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative">
          {/* Images Section */}
          <div>
            <motion.div
              variants={slideRight}
              initial="hidden"
              animate="visible"
            >
              <div
                className="
                  rounded-2xl 
                  overflow-hidden 
                  bg-[rgba(255,255,255,0.05)] 
                  backdrop-blur-xl 
                  border 
                  border-[rgba(255,255,255,0.1)] 
                  p-2 
                  mb-11"
              >
                <Image
                  src={images.about1}
                  alt="About Rex Vets"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
            <motion.div variants={slideLeft} initial="hidden" animate="visible">
              <div
                className="
                  rounded-2xl 
                  overflow-hidden 
                  bg-[rgba(255,255,255,0.05)] 
                  backdrop-blur-xl 
                  border 
                  border-[rgba(255,255,255,0.1)] 
                  p-2 
                  md:ml-auto 
                  md:w-4/5 
                  md:translate-x-10"
              >
                <Image
                  src={images.about2}
                  alt="Pet Care"
                  width={480}
                  height={320}
                  className="w-full h-auto rounded-xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <h2
              className="
                text-3xl 
                md:text-[56px]
                 
                font-black 
                text-white 
                mb-3 
                leading-tight 
                font-inter"
            >
              {title}{" "}
              <span
                className={`
                  bg-gradient-to-r 
                  ${gradients.accent} 
                  text-transparent 
                  bg-clip-text`}
              >
                {titleHighlight}
              </span>{" "}
              one paw at a time
            </h2>
            <p
              className="
                text-lg 
                text-[rgba(255,255,255,0.8)] 
                leading-relaxed 
                mb-4 
                font-inter"
            >
              {subtitle1}
            </p>
            <p
              className="
                text-lg 
                text-[rgba(255,255,255,0.8)] 
                leading-relaxed 
                font-inter"
            >
              {subtitle2}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(OurTeamStorySection);
