"use client";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const WhatWeTreatMissionSection = () => {
  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Our Mission
          </h2>
          <p className="text-[20px] text-gray-600 mb-4 leading-relaxed">
            As a nonprofit, Rex Vets is committed to making veterinary care
            accessible through free and low-cost telehealth services. Our goal
            is to reach more underserved pets and families—ensuring every animal
            gets the care they deserve, no matter the circumstances.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href={"/contact"}>
              <button
                className="cursor-pointer bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full px-9 h-[50px] flex items-center font-semibold shadow-lg
             hover:from-indigo-400 hover:to-purple-500 hover:-translate-y-0.5
             transition-all duration-300 ease-in-out"
              >
                Contact Us <Phone size={20} className="ml-2" />
              </button>
            </Link>
            <Link href={"/talk-to-vet"}>
              <button
                // variant="outline"
                className="cursor-pointer rounded-full h-[50px]  px-9 font-semibold flex items-center justify-center border  text-indigo-500 border-indigo-500 hover:bg-indigo-50"
              >
                Talk to a Vet <ArrowRight size={20} className="ml-2" />
              </button>
            </Link>
          </div>
        </motion.div>
        <motion.img
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          src="/images/what-we-treat/mission.webp"
          alt="Veterinary Care"
          className="w-full h-auto rounded-3xl shadow-xl"
        />
      </div>
    </section>
  );
};
export default React.memo(WhatWeTreatMissionSection);
