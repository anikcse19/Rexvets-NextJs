"use client";
import { Avatar } from "@radix-ui/react-avatar";
import { motion, Variants } from "framer-motion";
import { PawPrint, Play } from "lucide-react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { Card, CardContent } from "../ui/card";

type HeroSectionProps = {
  isVisible: boolean;
};
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const zoomIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const float: Variants = {
  animate: {
    y: [0, -8, -12, -8, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: { duration: 2, ease: "easeInOut", repeat: Infinity },
  },
};

const shimmer: Variants = {
  animate: {
    x: [-8, 8, -8], // smooth back & forth
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    },
  },
};
const BComeRexVetHeroSection: React.FC<HeroSectionProps> = ({ isVisible }) => {
  return (
    <section
      style={{
        background: `radial-gradient(circle at 20% 50%, rgba(25, 118, 210, 0.125) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(156, 39, 176, 0.082) 0%, transparent 50%),
                 radial-gradient(circle at 40% 80%, rgba(66, 165, 245, 0.063) 0%, transparent 50%)`,
      }}
      className="relative min-h-screen    flex items-center overflow-hidden"
    >
      <div className="w-full h-full max-w-[1536px] mx-auto px-4 relative z-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="space-y-6"
          >
            <div className=" px-2.5 py-3.5 font-['Roboto','Helvetica','Arial','sans-serif'] text-[0.8125rem] inline-flex items-center justify-center h-8 text-black/87 cursor-auto align-middle box-border bg-transparent self-start backdrop-blur-[20px] rounded-[16px] whitespace-nowrap  transition-shadow duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] outline-0 no-underline p-0 border border-solid border-[rgba(25,118,210,0.19)]">
              <MdVerified className="w-4 h-4 mr-2 text-blue-600" />
              Trusted by Licensed DVMs
            </div>
            <h1 className="text-4xl  bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              <span className="md:text-[72px] font-extrabold">
                Practice on your terms.
              </span>
              <br />
              <span className=" text-3xl  md:text-[72px] font-normal  leading-[79px] mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Make a difference.
              </span>
            </h1>
            <p className="text-[24px] leading-[38px] text-gray-600 max-w-xl">
              Rex Vet empowers licensed veterinarians to provide virtual care,
              reduce burnout, and earn competitive pay without corporate
              pressure.
            </p>
            <div className="flex flex-col w-full md:flex-row items-center justify-start   gap-4 my-3">
              <Link
                href="/register"
                className=" w-full md:max-w-[307px]  md:min-w-[64px] h-[64px]  px-6 p-2 inline-flex items-center justify-center box-border tap-highlight-transparent outline-0 border-0 m-0 cursor-pointer select-none align-middle  leading-[1.75] tracking-[0.02857em] rounded-[16px]  text-[1.1rem] font-semibold normal-case relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-gradient-to-br from-[#1976d2] to-[#9c27b0] text-white shadow-[0_8px_32px_-8px_rgba(25,118,210,0.376)]"
              >
                <span className="flex items-center">
                  Start Helping Pets Today
                  <FaArrowRightLong className="ml-2" />
                </span>
              </Link>

              <Link
                href="/how-it-works"
                className=" w-full md:max-w-[307px]  md:min-w-[64px] h-[64px] bg-transparent px-6 inline-flex items-center justify-center box-border tap-highlight-transparent backdrop-blur-[20px] outline-0 m-0 cursor-pointer select-none align-middle leading-[1.75] tracking-[0.02857em] rounded-[16px] py-4 text-[1.1rem] font-medium normal-case relative overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border border-[rgba(25,118,210,0.19)] text-black/87 transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center">
                  <Play className="mr-2" />
                  Learn How It Works
                </span>
              </Link>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center gap-2">
                {/* Green shimmering dot */}
                <motion.div
                  className="w-2 h-2 rounded-full bg-green-500"
                  variants={shimmer}
                  animate="animate"
                />

                {/* Text */}
                <span className="text-base text-gray-500">
                  No minimum hours required
                </span>

                {/* Blue shimmering dot (delayed for smooth offset) */}
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#1976d2]"
                  variants={shimmer}
                  animate="animate"
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                />
              </div>
            </div>
          </motion.div>
          <motion.div
            variants={zoomIn}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="relative"
          >
            <motion.div
              variants={float}
              animate="animate"
              className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-gradient-to-br from-blue-300/40 to-purple-300/40"
            />
            <motion.div
              variants={float}
              animate="animate"
              className="absolute -bottom-7 -left-7 w-16 h-16 rounded-full bg-gradient-to-br from-purple-300/40 to-blue-300/40"
            />
            <Card className="bg-white/90 h-[428px] backdrop-blur-lg border-blue-100/20 rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="relative flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden select-none bg-gradient-to-br from-blue-600 to-purple-600">
                  <PawPrint className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-[24px] leading-[32px] font-semibold">
                  Virtual Veterinary Care
                </h3>
                <p className="mt-2 text-gray-600">
                  Connecting vets with pet owners nationwide
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    {
                      label: "Video Consultations",
                      value: "24/7",
                      color: "text-blue-600",
                    },
                    {
                      label: "Client Satisfaction",
                      value: "98%",
                      color: "text-green-600",
                    },
                    {
                      label: "Response Time",
                      value: "<2min",
                      color: "text-purple-600",
                    },
                    {
                      label: "Species Supported",
                      value: "25+",
                      color: "text-orange-600",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="text-center mb-5">
                      <p className={`text-lg font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-600 ">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
    </section>
  );
};

export default BComeRexVetHeroSection;
