"use client";
import React from "react";

import { motion } from "framer-motion";
import Image from "next/image";
const AboutStorySection = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-[#0a0e27] to-[#1a1a2e] overflow-hidden">
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Floating Paw Heart */}
          <motion.div
            className="fixed top-8 right-8 md:top-12 md:right-24 drop-shadow-[0_10px_30px_rgba(79,172,254,0.4)] z-50"
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/images/about/PawHeart.webp"
              alt="Paw Heart"
              width={120}
              height={120}
              className="w-20 h-20 md:w-32 md:h-32"
              priority
            />
          </motion.div>

          {/* Images Section */}
          <div className="relative space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-xl"
            >
              <Image
                src="/images/about/About1.webp"
                alt="About Rex Vet"
                width={500}
                height={600}
                className="w-full h-auto rounded-xl transition-transform duration-500 hover:scale-105"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2 }}
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-white/10 p-2 bg-white/5 backdrop-blur-xl md:w-4/5 md:ml-16 md:translate-x-10"
            >
              <Image
                src="/images/about/About2.webp"
                alt="Pet Care"
                width={500}
                height={600}
                className="w-full h-auto rounded-xl transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-6xl font-extrabold text-white leading-[1.2] mb-6">
              Building bonds that last a{" "}
              <span className="bg-gradient-to-r from-[#4facfe] to-[#00f2fe] bg-clip-text font-semibold text-transparent">
                lifetime,
              </span>{" "}
              one paw at a time
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-6">
              At Rex Vet, our mission is to increase access to veterinary care
              for all pets regardless of their family's financial or geographic
              limitations. Too often, animals end up in shelters or suffer from
              preventable, late-stage medical conditions simply because timely
              care wasn't available.
            </p>

            <p className="text-lg text-white/80 leading-relaxed">
              We believe that early and consistent veterinary care is not only
              essential for animal health but also critical to strengthening the
              human-animal bond. By making care more accessible, we're improving
              the lives of pets—and the people who love them.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutStorySection;
