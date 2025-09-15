"use client";
import { motion } from "framer-motion";
import React from "react";
interface IProps {
  title: string;
  description: string;
}
const BlogPostSectionHeader: React.FC<IProps> = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-6"
    >
      <h2 className="inline-block  text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 mb-3 leading-tight">
        {title}
      </h2>

      <p className="text-base md:text-lg text-gray-600 max-w-xl font-garet   mx-auto leading-relaxed">
        {/* Discover insights, tips, and stories from our veterinary experts */}
        {description}
      </p>
    </motion.div>
  );
};

export default React.memo(BlogPostSectionHeader);
