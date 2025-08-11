"use client";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import React, { FC } from "react";
import { FaHeart, FaPaw, FaRocket } from "react-icons/fa6";

const DonateHeroSection: FC = () => {
  return (
    <section className="relative min-h-screen flex items-center py-12 md:py-0 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
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

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-center text-white"
        >
          <Badge className="mb-6 px-10 py-1 rounded-full text-[18px] font-semibold bg-white/15 backdrop-blur-lg border  border-white/20 text-white">
            <FaPaw className="mr-2" />
            Making a Difference
          </Badge>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-[96px] font-black mb-6 text-shadow-lg bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
          >
            Our Mission
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl font-normal mb-8 max-w-4xl mx-auto leading-relaxed text-justify text-shadow"
          >
            At Rex Vets, our mission is to increase access to veterinary care
            for all pets—regardless of their family&apos;s financial or
            geographic limitations.
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg md:text-xl mb-10 max-w-2xl text-center  mx-auto leading-relaxed opacity-90"
          >
            We believe that early and consistent veterinary care is essential
            for animal health and critical to strengthening the human-animal
            bond. Together, we can make a significant difference in the lives of
            pets and their families.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Donate Now Button */}
              <button className="group cursor-pointer z-50 relative inline-flex items-center justify-center px-8 py-5 text-white font-semibold text-lg rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <FaHeart className="mr-3 text-xl group-hover:animate-pulse" />
                Donate Now
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>

              {/* Learn More Button */}
              <button className="group cursor-pointer z-50 relative inline-flex items-center justify-center px-8 py-5 text-white font-semibold text-lg rounded-2xl border-2 border-blue-400 hover:border-blue-300 hover:bg-blue-500/10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm">
                <FaRocket className="mr-3 text-xl group-hover:translate-x-1 transition-transform duration-300" />
                Learn More
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(DonateHeroSection);
