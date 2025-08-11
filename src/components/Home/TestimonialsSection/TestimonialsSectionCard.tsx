"use client";
import { Badge } from "@/components/ui/badge";
import { ITestimonial } from "@/lib";
import { motion, Variants } from "framer-motion";
import React from "react";
import { IoCheckmarkCircleOutline, IoLogoGoogle } from "react-icons/io5";
import { MdFormatQuote } from "react-icons/md";
import { useMediaQuery } from "react-responsive";

interface IProps {
  testimonial: ITestimonial;
  isMiddle?: boolean;
}

const TestimonialsSectionCard: React.FC<IProps> = ({
  testimonial,
  isMiddle = false,
}) => {
  // Detect md and above
  const isMdUp = useMediaQuery({ minWidth: 768 });

  // Framer Motion variants for card animations
  const cardVariants: Variants = {
    initial: {
      y: 0,
      scale: isMdUp ? (isMiddle ? 1.05 : 0.95) : 1,
      opacity: isMiddle && isMdUp ? 1 : 0.95,
      boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
    },
    hover: isMdUp
      ? {
          y: -12,
          scale: isMiddle ? 1.07 : 1,
          opacity: 1,
          boxShadow: "0 25px 50px rgba(59,130,246,0.15)",
          transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        }
      : {},
  };

  const quoteVariants: Variants = {
    initial: { rotate: 0, scale: 1 },
    hover: isMdUp
      ? {
          rotate: 180,
          scale: 1.2,
          transition: { duration: 0.3, ease: "easeInOut" },
        }
      : {},
  };

  const avatarVariants: Variants = {
    initial: { y: 0 },
    hover: isMdUp
      ? {
          y: [-10, 0, -10],
          transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
        }
      : {},
  };

  const handleCardClick = () => {
    window.open("https://g.page/r/CV9taOtlIUL5EBM/review", "_blank");
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className={`relative min-h-[400px] bg-white/80 backdrop-blur-xl border border-blue-100 rounded-xl cursor-pointer overflow-hidden ${
        isMdUp ? (isMiddle ? "scale-105" : "scale-95") : "scale-100"
      }`}
      onClick={handleCardClick}
    >
      {/* Gradient Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />

      {/* Quote Icon */}
      <motion.div
        variants={quoteVariants}
        className="absolute top-5 right-5 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-[0_8px_24px_rgba(59,130,246,0.3)]"
      >
        <MdFormatQuote className="text-white text-2xl" />
      </motion.div>

      {/* Card Content */}
      <div className="p-6 flex flex-col h-full relative z-10">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="relative">
            <motion.div variants={avatarVariants}>
              <img
                src={testimonial.image}
                alt={testimonial.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-4 border-blue-100/50 object-cover"
              />
            </motion.div>
            <div className="absolute bottom-[-2px] right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div className="flex-1 ml-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {testimonial.name}
            </h3>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < testimonial.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial Text */}
        <p className="flex-1 text-base font-garet text-gray-600 italic text-justify leading-snug mb-4">
          {testimonial.text.length > 300
            ? `${testimonial.text.slice(0, 300)}...`
            : testimonial.text}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">
            {testimonial.date}
          </span>
          {testimonial.source === "google" ? (
            <Badge className="bg-green-100/50 border-green-200 text-green-600 font-semibold text-xs">
              <IoLogoGoogle className="mr-1 text-sm text-green-600" />
              Google Review
            </Badge>
          ) : (
            <Badge className="bg-blue-100/50 border-blue-200 text-blue-600 font-semibold text-xs">
              <IoCheckmarkCircleOutline className="mr-1 text-sm text-blue-600" />
              Verified Client
            </Badge>
          )}
        </div>
        <p className="text-center text-xs text-gray-400 italic mt-2">
          Click to leave a review
        </p>
      </div>
    </motion.div>
  );
};

export default React.memo(TestimonialsSectionCard);
