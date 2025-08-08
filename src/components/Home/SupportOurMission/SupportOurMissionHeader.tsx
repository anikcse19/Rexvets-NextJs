"use client";
import { motion } from "framer-motion";
import React from "react";
import { IoPawOutline } from "react-icons/io5";
interface IProps {
  title: string;
  description: string;
}
const SupportOurMissionHeader: React.FC<IProps> = ({ title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <div className="flex justify-center items-center mb-6">
        <IoPawOutline className="hidden md:block text-green-500 text-5xl mr-4" />
        <h2 className="text-4xl md:text-5xl font-garet lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 leading-tight">
          {title}
        </h2>
      </div>
      <p className="text-base md:text-[20px] text-gray-600 max-w-xl mx-auto leading-relaxed font-garet font-medium">
        {description}
      </p>
    </motion.div>
  );
};

export default React.memo(SupportOurMissionHeader);
