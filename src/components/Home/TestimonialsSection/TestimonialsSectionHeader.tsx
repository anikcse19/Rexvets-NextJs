"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import React from "react";
import { IoCutOutline } from "react-icons/io5";
interface IProps {
  title: string;
  description: string;
  sub_title: string;
}
const TestimonialsSectionHeader: React.FC<IProps> = ({
  title,
  description,
  sub_title,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center my-11"
    >
      <Badge className="mb-3 bg-white/80 backdrop-blur-md border-blue-200 text-blue-600 font-semibold">
        <IoCutOutline className="mr-1 text-blue-600" />
        {title}
      </Badge>
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 mb-3 leading-tight">
        {sub_title}
      </h2>
      <p className="text-lg md:text-xl  font-garet text-gray-600 max-w-2xl mx-auto leading-relaxed mb-11">
        {description}
      </p>
    </motion.div>
  );
};

export default React.memo(TestimonialsSectionHeader);
