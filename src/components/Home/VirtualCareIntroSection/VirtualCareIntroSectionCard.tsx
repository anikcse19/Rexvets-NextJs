"use client";
import { motion, Variants } from "framer-motion";
import React from "react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface StepCardProps {
  step: Step;
  index: number;
  isLast: boolean;
}

const VirtualCareIntroSectionCard: React.FC<StepCardProps> = ({
  step,
  index,
}) => {
  // Framer Motion variants for card animations
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 24px rgba(148,163,184,0.08)",
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 24px 48px rgba(148,163,184,0.15)",
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="relative mb-6">
      <motion.div
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        className="p-8 bg-white border border-gray-100 rounded-3xl shadow-md hover:border-gray-200"
      >
        {/* {!isLast && (
          <div className="hidden md:block absolute top-8 right-[-50%] w-[50%] h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-30" />
        )} */}
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
            style={{
              background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)`,
              boxShadow: `0 8px 24px ${step.color}40`,
              border: `3px solid ${step.color}20`,
            }}
          >
            {step.number}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <step.icon
                className="text-[24px] mr-3"
                // style={{ color: step.color }}
              />
              <h3 className="text-lg md:text-xl font-bold text-gray-800">
                {step.title}
              </h3>
            </div>
            <p className="text-base text-gray-600 leading-relaxed text-justify">
              {step.description}
            </p>
            {index === 2 && (
              <p className="text-sm text-gray-400 font-semibold italic mt-2">
                Note: Medications must be purchased separately.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default React.memo(VirtualCareIntroSectionCard);
