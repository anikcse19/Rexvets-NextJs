"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import React from "react";
import { IoCheckmarkCircle, IoPawOutline, IoStar } from "react-icons/io5";

interface IProps {
  familyPlanFeatures: string[];
  onClick?: (state: number) => void;
  isSmallDevice?: boolean;
  hoveredCard: "per" | "family" | null;
  setHoveredCard: React.Dispatch<React.SetStateAction<"per" | "family" | null>>;
}

const RexVetFamilyPlanInfo: React.FC<IProps> = ({
  familyPlanFeatures,
  onClick,
  isSmallDevice = false,
  hoveredCard,
  setHoveredCard,
}) => {
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

  const pulseVariants: Variants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const buttonVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      onMouseEnter={() => setHoveredCard("family")}
      onMouseLeave={() => setHoveredCard(null)}
      variants={familyCardVariants}
      initial="initial"
      animate={
        hoveredCard === "family" ? "hover" : isSmallDevice ? "initial" : "tilt"
      }
      className={`relative w-full lg:w-[85%] ${
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
            <p className="text-sm text-gray-400 line-through mb-0.5">$11.49</p>
            <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-0.5">
              $10 <span className="text-lg text-gray-600">/month</span>
            </h3>
            <p className="text-sm text-gray-600">Billed annually at $120</p>
          </div>

          <div className="space-y-1.5 mb-3">
            {familyPlanFeatures.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center space-x-1.5">
                <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <IoCheckmarkCircle className="text-white text-[10px]" />
                </div>
                <p className="text-sm text-gray-600">{feature}</p>
              </div>
            ))}
          </div>

          <motion.div variants={buttonVariants} whileHover="hover">
            <Button
              className="w-full py-7 bg-gradient-to-br from-indigo-600 to-purple-600 font-medium text-white text-base rounded-lg shadow-[0_8px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.3)] relative overflow-hidden"
              onClick={() => onClick?.(120)}
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
  );
};

export default React.memo(RexVetFamilyPlanInfo);
