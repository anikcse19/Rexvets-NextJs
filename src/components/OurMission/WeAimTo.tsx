"use client";
import { motion, Variants } from "framer-motion";
import React from "react";

interface IFeature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

interface IProps {
  features: IFeature[];
}

const WeAimTo: React.FC<IProps> = ({ features }) => {
  // Fade animation for heading
  const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  // Zoom animation for cards
  const zoomIn = (delay: number): Variants => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut", delay },
    },
  });

  return (
    <div className="py-10 md:py-16 bg-gradient-to-br from-[#667eea] to-[#764ba2]">
      <div className="max-w-[1220px] mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Heading Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-8"
        >
          <h2
            className="
              text-3xl 
              md:text-4xl 
              font-bold 
              text-white 
              mb-2 
              font-inter"
          >
            We Aim To
          </h2>
          <div
            className="
              w-24 
              mx-auto 
              border-2 
              border-[rgba(255,255,255,0.3)]"
          ></div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate="visible"
              variants={zoomIn(feature.delay)}
              className="
                h-full 
                bg-[rgba(255,255,255,0.95)] 
                backdrop-blur-xl 
                rounded-lg 
                border 
                border-[rgba(255,255,255,0.2)] 
                transition-all 
                duration-400 
                ease-in-out 
                hover:-translate-y-2 
                hover:scale-102 
                hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)]"
            >
              <div className="p-4 text-center">
                {/* Icon */}
                <div
                  className={`
                    w-20 
                    h-20 
                    mx-auto 
                    mb-3 
                    bg-gradient-to-r ${feature.gradient} 
                    rounded-full 
                    flex 
                    items-center 
                    justify-center 
                    text-white 
                    text-2xl 
                    transition-transform 
                    duration-300 
                    ease-in-out 
                    group-hover:scale-110 
                    group-hover:rotate-6`}
                >
                  {<feature.icon className="text-white " />}
                </div>

                {/* Title */}
                <h3
                  className="
                    text-[24px]
                    leading-[32px] 
                    font-bold 
                    text-[#002261] 
                    mb-2 
                    font-inter"
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="
                    text-[rgba(0,0,0,0.7)] 
                    leading-[27px]
                    font-inter 
                    text-base
                    md:text-center 
                    text-justify"
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeAimTo;
