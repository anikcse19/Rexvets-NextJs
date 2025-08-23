"use client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { FC, ReactNode } from "react";
import { FaHeart, FaPaw, FaRocket } from "react-icons/fa6";

interface HeroSectionProps {
  // Badge props
  badgeText?: string;
  badgeIcon?: ReactNode;

  // Title and content
  title?: string;
  subtitle?: string;
  description?: string;

  // Buttons
  primaryButton?: {
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    icon?: ReactNode;
    onClick?: () => void;
  };

  // Styling
  backgroundGradient?: string;
  titleGradient?: string;
  showAnimatedBackground?: boolean;
  className?: string;
  subTitleClassName?: string;
}

const Donate_OurMIssion_HeroSection: FC<HeroSectionProps> = ({
  badgeText = "Making a Difference",
  badgeIcon = <FaPaw className="mr-2" />,
  title = "Our Mission",
  subtitle = "At Rex Vets, our mission is to increase access to veterinary care for all pets—regardless of their family's financial or geographic limitations.",
  description = "We believe that early and consistent veterinary care is essential for animal health and critical to strengthening the human-animal bond. Together, we can make a significant difference in the lives of pets and their families.",
  primaryButton = {
    text: "Donate Now",
    icon: <FaHeart className="mr-3 text-xl group-hover:animate-pulse" />,
    onClick: () => console.log("Donate Now clicked"),
  },
  secondaryButton = {
    text: "Learn More",
    icon: (
      <FaRocket className="mr-3 text-xl group-hover:translate-x-1 transition-transform duration-300" />
    ),
    onClick: () => console.log("Learn More clicked"),
  },
  backgroundGradient = "from-blue-900 via-blue-950 to-blue-900",
  // titleGradient = "from-white to-gray-200",
  showAnimatedBackground = true,
  className = "",
  subTitleClassName = "",
}) => {
  const splitString = (input: string) => {
    const target = "Affordable Veterinary Care for Every Pet";
    if (input === target) {
      return {
        first: "Affordable Veterinary Care for", // remaining text
        second: "Every Pet", // last part
      };
    }
    return null; // or undefined if it doesn't match exactly
  };

  return (
    <section
      className={`relative min-h-screen flex items-center py-12 md:py-0 bg-gradient-to-br ${backgroundGradient} overflow-hidden ${className}`}
    >
      {/* Animated background elements */}
      {showAnimatedBackground && (
        <>
          <motion.div
            className="absolute top-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-orange-500/20 to-orange-300/10 "
            animate={{
              y: [0, -30, 0],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-[15%] left-[5%] w-[200px] h-[200px] rounded-full bg-gradient-to-br from-teal-700/20 to-teal-500/10 "
            animate={{
              y: [0, -20, 0],
              rotate: [0, -2, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute top-[50%] left-[15%] w-[100px] h-[100px] rounded-full bg-gradient-to-br from-white/10 to-white/5"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center text-white"
        >
          <Badge className="mb-6 px-10 py-1 rounded-full text-[18px] font-semibold bg-white/15 backdrop-blur-lg border  border-white/20 text-white">
            {badgeIcon}
            {badgeText}
          </Badge>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-4xl md:text-6xl lg:text-[96px] font-black mb-6 text-shadow-lg  text-white bg-clip-text text-transparent`}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className={cn(
              "text-xl md:text-[40px] font-medium mb-8 max-w-4xl mx-auto leading-relaxed text-justify text-shadow",
              subTitleClassName
            )}
          >
            {splitString(subtitle) ? (
              <>
                <span>{splitString(subtitle)?.first}</span>
                <span className=" ml-1 text-[#41ABF3]">
                  {splitString(subtitle)?.second}
                </span>
              </>
            ) : (
              subtitle
            )}
          </motion.p>

          {description && (
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-lg md:text-xl mb-10 max-w-2xl text-center  mx-auto leading-relaxed opacity-90"
            >
              {description}
            </motion.p>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Primary Button */}
              <button
                onClick={primaryButton.onClick}
                className="group cursor-pointer z-50 relative inline-flex items-center justify-center px-8 py-5 text-white font-semibold text-lg rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {primaryButton.icon}
                {primaryButton.text}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              {/* Secondary Button */}
              {secondaryButton && (
                <button
                  onClick={secondaryButton.onClick}
                  className="group cursor-pointer z-50 relative inline-flex items-center justify-center px-8 py-5 text-white font-semibold text-lg rounded-2xl border-2 border-blue-400 hover:border-blue-300 hover:bg-blue-500/10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                >
                  {secondaryButton.icon}
                  {secondaryButton.text}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(Donate_OurMIssion_HeroSection);
