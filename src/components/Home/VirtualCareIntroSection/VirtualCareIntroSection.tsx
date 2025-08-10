"use client";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import {
  IoArrowForward,
  IoBagHandleOutline,
  IoCalendarOutline,
  IoVideocamOutline,
} from "react-icons/io5";
import mobile from "../../../../public/images/Homepage/mblImg.webp";
import VirtualCareIntroSectionCard from "./VirtualCareIntroSectionCard";
import VirtualCareIntroSectionHeader from "./VirtualCareIntroSectionHeader";

const steps = [
  {
    number: "1",
    title: "Schedule an Affordable Consultation",
    description:
      "Find top-rated Vet near you and pick the best one for your needs.",
    icon: IoCalendarOutline,
    color: "#3b82f6",
  },
  {
    number: "2",
    title: "Connect Online",
    description:
      "Choose a time that works for you and your pet for a consultation.",
    icon: IoVideocamOutline,
    color: "#8b5cf6",
  },
  {
    number: "3",
    title: "Order Medications Online",
    description:
      "Get specific guidance for your pet's health, including advice, triage, and second opinions.",
    icon: IoBagHandleOutline,
    color: "#06b6d4",
  },
];
const title: string = "Making a Difference";
const sub_title: string = "One Virtual Visit";
const post_title: string = "at a Time";
const description: string =
  "  As a nonprofit, Rex Vet is dedicated to expanding access to veterinary care by providing telehealth services to pets and families who need them most. With your support, we can help even more animals live healthier, happier lives.";
const VirtualCareIntroSection: React.FC = () => {
  const navigate = useRouter();

  // Framer Motion variants for button hover
  const buttonVariants: Variants = {
    initial: { y: 0 },
    hover: {
      y: -2,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div className="bg-white py-8 md:py-12 lg:py-16">
      <div className=" 3xl:max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
          {/* Content Section */}
          <div className="lg:col-span-7">
            <VirtualCareIntroSectionHeader
              title={title}
              description={description}
              sub_title={sub_title}
              post_title={post_title}
            />
            <div className="mb-6">
              {steps.map((step, index) => (
                <VirtualCareIntroSectionCard
                  key={index}
                  step={step}
                  index={index}
                  isLast={index === steps.length - 1}
                />
              ))}
            </div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              className="text-center md:text-left "
            >
              <Button
                className="py-8 my-4  w-[180px] z-50 cursor-pointer rounded-2xl bg-gradient-to-br  from-[#00276A] to-[#003d8a] text-white text-lg font-semibold shadow-[0_8px_24px_rgba(0,39,106,0.3)]"
                onClick={() => navigate.push("/findAVet")}
              >
                Find a Vet
                <IoArrowForward className="ml-2 text-xl" />
              </Button>
            </motion.div>
          </div>

          {/* Image Section */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center items-center"
            >
              <div className="relative max-w-[500px] w-full before:content-[''] before:absolute before:-top-5 before:-left-5 before:right-5 before:bottom-5 before:bg-gradient-to-br before:from-blue-500 before:to-purple-500 before:rounded-3xl before:opacity-10 before:z-0">
                <Image
                  src={mobile}
                  alt="Vet consultation"
                  width={500}
                  height={500}
                  priority
                  className="w-full h-auto rounded-xl shadow-2xl relative z-10"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(VirtualCareIntroSection);
