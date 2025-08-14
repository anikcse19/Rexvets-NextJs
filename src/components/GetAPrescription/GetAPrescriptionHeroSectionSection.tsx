"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FaPills, FaUserCheck } from "react-icons/fa6";
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
interface IProps {
  tabs: string[];
  description: string;
  title: string;
  sub_title: string;
}
const GetAPrescriptionHeroSectionSection: React.FC<IProps> = ({
  tabs = [],
  title,
  sub_title,
  description,
}) => {
  const router = useRouter();

  return (
    <motion.section
      className="get-a-prescription-hero"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className=" max-w-[1488px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-12 sm:py-16 md:py-[88px]">
        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg"
        >
          {title}{" "}
          <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            {sub_title} {/* Delivered */}
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl md:my-11 md:text-2xl text-white/90 max-w-[800px] mx-auto mb-8 leading-relaxed drop-shadow-md"
        >
          {description}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        >
          <Link href={"/find-a-vet"}>
            <button className="cursor-pointer h-[64px] w-full md:w-fit bg-gradient-to-r  from-white to-slate-100 text-slate-900 font-bold  md:px-6 sm:py-4 sm:px-8 rounded-full hover:shadow-2xl transition-all duration-300">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaUserCheck className="mr-2 inline-block" /> Speak to a
                Licensed Vet
              </motion.div>
            </button>
          </Link>
          <button
            className=" cursor-pointer  h-[64px] w-full md:w-fit bg-white/10 border-2 border-white/30 text-white font-bold  md:px-6 sm:py-4 sm:px-8 rounded-full hover:bg-white/20 hover:shadow-2xl transition-all duration-300"
            onClick={() => router.push("/FindAVet")}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <FaPills className="mr-2 inline-block" /> I Need a Prescription
            </motion.div>
          </button>
        </motion.div>
        <motion.div
          variants={staggerContainer}
          className="flex justify-center gap-4 flex-wrap mt-14"
        >
          {tabs.map((tag) => (
            <motion.span
              key={tag}
              variants={fadeInUp}
              className="bg-white/20 text-white border border-white/30 rounded-full px-5 py-1  text-[13px] font-semibold text-sm sm:text-base backdrop-blur-sm"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default React.memo(GetAPrescriptionHeroSectionSection);
