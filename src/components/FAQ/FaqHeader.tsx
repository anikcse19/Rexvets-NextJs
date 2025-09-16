"use client";
import { motion, Variants } from "framer-motion";
import React from "react";

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const FaqHeader = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className=" max-w-7xl mx-auto px-4 text-start">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-0">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mt-1">
            Find answers to common questions about Rex Vets&apos; telehealth
            services and how we can help you and your pet.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
export default React.memo(FaqHeader);
