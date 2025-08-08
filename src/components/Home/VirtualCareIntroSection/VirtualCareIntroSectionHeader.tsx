"use client";
import { motion } from "framer-motion";
import React from "react";
interface IProps {
  title: string;
  description: string;
  sub_title: string;
  post_title?: string;
}
const VirtualCareIntroSectionHeader: React.FC<IProps> = ({
  title,
  sub_title,
  description,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-6 md:mb-8"
    >
      <h2 className="text-3xl md:max-w-2xl md:leading-[58px] md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 leading-tight tracking-tight">
        {title},{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600">
          {sub_title}
        </span>{" "}
        at a Time
      </h2>
      <p className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default React.memo(VirtualCareIntroSectionHeader);
