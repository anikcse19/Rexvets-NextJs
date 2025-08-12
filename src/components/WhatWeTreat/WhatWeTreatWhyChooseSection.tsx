"use client";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";

const WhatWeTreatWhyChooseSection = () => {
  const treatmentBenefits = useMemo(
    () => [
      "Faster Recovery Times",
      "Reduced Health Risks",
      "Cost-Effective Solutions",
      "Expert Veterinary Care",
      "24/7 Availability",
      "Personalized Treatment Plans",
      "Follow-up Support",
    ],
    []
  );

  return (
    <section className="container mx-auto px-4 py-8 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-11 ">
        <motion.img
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          src="/images/what-we-treat/whyChoose.webp"
          alt="Pet Treatment"
          className="w-full h-auto rounded-3xl shadow-xl mt-20"
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-gray-900">
            Why Choose Rex Vet?
          </h2>
          <ul className="mb-4 space-y-2">
            {treatmentBenefits.map((benefit, index) => (
              <li key={index} className="flex items-center mb-8 ">
                <CheckCircle2 size={24} className="text-green-500 mr-2" />
                <span className="text-gray-700 font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 mb-5 mt-14">
            <Shield size={22} className="text-blue-500" />
            <p className="text-gray-600 text-lg">
              Licensed veterinarians available 24/7
            </p>
          </div>
          <Link href="/find-a-vet" passHref>
            <button
              role="button"
              aria-label="find-a-vet"
              className="cursor-pointer bg-gradient-to-r ml-1  from-indigo-400 to-purple-400 text-white rounded-full flex items-center justify-center px-8 h-[50px] font-semibold shadow-lg hover:from-indigo-400 hover:to-purple-500 hover:-translate-y-0.5"
            >
              Start Consultation <ArrowRight size={20} className="ml-2" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
export default React.memo(WhatWeTreatWhyChooseSection);
