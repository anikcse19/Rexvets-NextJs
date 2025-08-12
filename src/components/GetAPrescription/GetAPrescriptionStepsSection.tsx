"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { IPrescriptionStep } from "./types.prescription";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardHover: Variants = {
  hover: {
    scale: 1.05,
    y: -8,
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

interface IProps {
  steps: IPrescriptionStep[];
}

const GetAPrescriptionStepsSection: React.FC<IProps> = ({ steps }) => {
  return (
    <motion.section
      className="py-8 md:py-20 bg-gradient-to-r from-[#6E81E7] to-[#755EB9] text-white relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(255,255,255,0.1)_0%,_transparent_50%),radial-gradient(circle_at_75%_75%,_rgba(255,255,255,0.08)_0%,_transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Image */}
          <motion.div variants={fadeInUp}>
            <Image
              src="/images/HomePage/imgShop.webp"
              alt="Pet Products"
              width={720}
              height={720}
              className="rounded-3xl shadow-2xl"
            />
          </motion.div>

          {/* Steps */}
          <motion.div variants={staggerContainer}>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl  font-extrabold mb-6"
            >
              <span className="  md:text-[48px] leading-[58px] font-extrabold">
                {" "}
                Getting Everything for Your Pet is{" "}
              </span>
              <span className="md:text-[48px] md:leading-[58px] font-normal bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Easy
              </span>
            </motion.h2>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <motion.div
                    variants={cardHover}
                    whileHover="hover"
                    className="rounded-3xl"
                  >
                    <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden transition-shadow duration-300  h-[126px]">
                      <CardContent className=" flex items-start gap-4 h-full ">
                        <div className="w-16 h-16 bg-[#F7AA14] rounded-full flex items-center justify-center text-2xl font-extrabold text-white shadow-lg">
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-[20px] text-white font-bold">
                            {step.title}
                          </h3>
                          <p className="text-white/90">{step.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default React.memo(GetAPrescriptionStepsSection);
