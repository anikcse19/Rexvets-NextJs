"use client";
import { motion } from "framer-motion";
import React from "react";

const BlogPostEmptySection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="p-6 text-center bg-white/80 backdrop-blur-md rounded-lg"
    >
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        No blogs available
      </h3>
      <p className="text-base text-gray-400">
        Check back soon for new content!
      </p>
    </motion.div>
  );
};

export default React.memo(BlogPostEmptySection);
