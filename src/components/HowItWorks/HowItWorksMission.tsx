"use client";

import { motion, Variants } from "framer-motion";
import { Heart, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const textVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1.2, ease: "easeOut" } },
};

const HowItWorksMission = () => {
  return (
    <section
      className="py-12 md:py-20 bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(135deg, #ffffff 0%, #f8fafc 100%), url('/images/texture.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-sm pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-11 items-center">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <Image
              src="/images/how-it-works/PrincipalImgWorks.webp"
              alt="Our Mission"
              width={600}
              height={400}
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </motion.div>
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Our Mission
            </h2>
            <h3 className="text-[20px] leading-[32px]  md:text-xl text-blue-500 font-bold mb-4">
              Making Veterinary Care Accessible to All
            </h3>
            <p className="text-gray-600 mb-4 text-base md:text-lg">
              At Rex Vets, our mission is to increase access to veterinary care
              for all pets—regardless of their family's financial or geographic
              limitations. Too often, animals end up in shelters or suffer from
              preventable, late-stage medical conditions simply because timely
              care wasn't available.
            </p>
            <p className="text-gray-600 mb-6 text-base md:text-lg">
              We believe that early and consistent veterinary care is not only
              essential for animal health but also critical to strengthening the
              human-animal bond. By making care more accessible, we're improving
              the lives of pets—and the people who love them.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              <p className="text-blue-500 text-[20px] leading-[32px]  font-bold italic">
                Because every pet deserves a joyful, healthy life.
              </p>
            </div>
            <button className=" flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full px-12 py-4 shadow-lg hover:-translate-y-0.5 transition-all">
              <Link href="/donate" className="flex items-center">
                Support Us
                <Shield className="ml-2 h-5 w-5" />
              </Link>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default React.memo(HowItWorksMission);
