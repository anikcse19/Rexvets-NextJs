"use client";
import { motion } from "framer-motion";
import { Award, Heart, Stethoscope, Users } from "lucide-react";
import React from "react";

const WhatWeTreatHeroSection = () => {
  const stats = [
    { icon: Users, value: "35", label: "Professionals", color: "bg-blue-500" },
    { icon: Heart, value: "1K+", label: "Happy Clients", color: "bg-red-500" },
    {
      icon: Stethoscope,
      value: "341",
      label: "Patients Treated",
      color: "bg-green-500",
    },
    { icon: Award, value: "8", label: "Awards Won", color: "bg-yellow-500" },
  ];

  return (
    <section className="what_we_treat_hero_section relative">
      <div className="w-full max-w-[1520px] mx-auto px-4  py-8 md:py-5 text-center text-white relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 bg-gradient-to-r from-white to-gray-200 text-transparent bg-clip-text"
        >
          Expert Care for Every Pet
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-16 max-w-2xl mx-auto opacity-90 mt-14 "
        >
          Comprehensive telehealth veterinary services providing accessible,
          professional care for your beloved companions
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  w-full">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer"
              >
                <div className="flex flex-col items-start space-y-6">
                  <div
                    className={`${stat.color} rounded-full p-3 w-16 h-16 flex items-center justify-center`}
                  >
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="space-y-1 items-center justify-center w-full">
                    <div className="text-5xl font-extrabold text-gray-900 leading-none">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-base font-normal">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default React.memo(WhatWeTreatHeroSection);
