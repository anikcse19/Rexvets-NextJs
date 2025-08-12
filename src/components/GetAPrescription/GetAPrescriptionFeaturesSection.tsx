"use client";
import { motion, Variants } from "framer-motion";
import React, { useMemo } from "react";
import { FaMobileAlt } from "react-icons/fa";
import { FaPills, FaTruck, FaUserCheck } from "react-icons/fa6";
import { Card, CardContent } from "../ui/card";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const GetAPrescriptionFeaturesSection = () => {
  const features = useMemo(
    () => [
      {
        icon: FaTruck,
        title: "Free Shipping",
        description: "Free standard shipping on orders over $49",
        color: "bg-emerald-500",
      },
      {
        icon: FaPills,
        title: "Prescription Available",
        description: "Prescriptions available in select states",
        color: "bg-blue-500",
      },
      {
        icon: FaMobileAlt,
        title: "24/7 Availability",
        description: "24/7 on-demand, online vet appointments",
        color: "bg-purple-500",
      },
      {
        icon: FaUserCheck,
        title: "Licensed Veterinarians",
        description: "Choose from thousands of licensed vets",
        color: "bg-amber-500",
      },
    ],
    []
  );

  return (
    <motion.section
      className="container mx-auto px-4 py-8 md:py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={fadeInUp}
            className="transform transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-3  min-w-[346px] mx-auto"
          >
            <Card className="bg-white/95 backdrop-blur-3xl border border-gray-200 rounded-3xl shadow-sm">
              <CardContent className="p-6 flex flex-col items-center">
                <div
                  className={`${feature.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg self-start`}
                >
                  <feature.icon className="text-white text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default React.memo(GetAPrescriptionFeaturesSection);
