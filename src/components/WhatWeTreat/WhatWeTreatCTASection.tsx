"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import React from "react";

const WhatWeTreatCTASection = () => {
  return (
    <section className="bg-[#1E293B] text-white py-8 md:py-36">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold mb-3"
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg mb-6 opacity-90 my-9"
        >
          Connect with our licensed veterinarians today and give your pets the
          care they deserve.
        </motion.p>
        <div className="items-center justify-center flex mt-11">
          <Link href={"/find-a-vet"} passHref>
            <button className="bg-white text-gray-900 rounded-full cursor-pointer flex items-center justify-center px-11 py-4 text-lg font-bold shadow-lg hover:bg-gray-100 hover:-translate-y-0.5">
              Find a Vet <Star size={20} className="ml-2 star-icon" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
export default React.memo(WhatWeTreatCTASection);
