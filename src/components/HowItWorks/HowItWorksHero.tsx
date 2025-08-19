"use client";
import { motion, Variants } from "framer-motion";
import { Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const heroVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.2 },
  },
};

const HowItWorksHero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(26, 35, 126, 0.8), rgba(0, 0, 81, 0.6), rgba(26, 35, 126, 0.4), rgba(83, 75, 174, 0.4)), url('/images/how-it-works/principal.webp')`,
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-[#2D3988]/50 backdrop-blur-[2px]" />
      </div>

      {/* Decorative radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.1)_0%,transparent_20%),radial-gradient(circle_at_90%_100%,rgba(255,255,255,0.08)_0%,transparent_20%)] pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl"
        >
          <motion.span
            variants={heroVariants}
            className="inline-block bg-blue-500/20 text-white border border-blue-500/30 rounded-full px-4 py-1 mb-6 font-semibold"
          >
            How Our Telehealth Services Work
          </motion.span>
          <motion.h1
            variants={heroVariants}
            className="text-4xl md:text-6xl  text-white mb-6 leading-tight"
          >
            <span className=" text-[72px] font-extrabold">
              {" "}
              Veterinary care at your{" "}
            </span>
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-md">
              fingertips
            </span>
          </motion.h1>
          <motion.p
            variants={heroVariants}
            className="text-[21px] leading-[33px] md:text-xl text-white/90 mb-8 max-w-md"
          >
            From check-ups to emergencies, our licensed vets are just a click
            away — anytime, anywhere.
          </motion.p>
          <motion.div variants={buttonVariants}>
            <button className=" cursor-pointer bg-gradient-to-r py-4 flex  items-center justify-center from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-full px-8 shadow-lg hover:-translate-y-0.5 transition-all">
              <Link href="/find-a-vet" className="flex items-center">
                Talk to a Vet
                <Phone className="ml-2 h-5 w-5" />
              </Link>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(HowItWorksHero);
