"use client";
import { Clock, Heart, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { MdAutoAwesome } from "react-icons/md";
import AnimatedChip from "../AnimatedChip";

const HeroContent: React.FC = () => {
  const router = useRouter();

  return (
    <div className="p-4 md:p-0 flex flex-col items-center justify-center text-center xl:items-start xl:justify-start xl:text-start">
      <AnimatedChip
        icon={<MdAutoAwesome size={25} className="text-[#5F9CEB]" />}
        label="🏥 Non-Profit Veterinary Care"
      />

      <div>
        <h1 className="text-6xl md:text-[96px] md:leading-[106px] font-garet font-bold text-[#FFFFFF] mb-1 md:mb-4">
          Low-Cost
        </h1>
        <h1 className="text-6xl md:text-[96px] md:leading-[106px] font-garet font-bold mb-2 md:mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Veterinary Care
          </span>
        </h1>
      </div>

      <div className="flex items-center justify-center xl:justify-start space-x-2 text-blue-400 mb-6">
        <Clock className="w-5 h-5" />
        <span className="text-[17px] md:text-[24px] md:leading-[28px] font-[600]">
          24/7 Online Vet Appointments - Ask a Vet
        </span>
      </div>

      <p className="text-[17px] text-white md:text-[21px] md:leading-[33px] max-w-lg mb-6">
        As a non-profit organization, Rex Vets provides affordable telehealth
        consultations to ensure every pet gets the care they deserve from the
        comfort of home. Breaking barriers, building bonds.
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-center items-center xl:justify-start xl:items-start">
        <button
          onClick={() => router.push("/video-call")}
          className=" z-50  inline-flex items-center justify-center box-border outline-none border-none m-0 cursor-pointer select-none align-middle appearance-none no-underline font-roboto text-base leading-[1.75] tracking-[0.02857em] min-w-[64px] rounded-full px-9 py-4 font-bold normal-case relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)] gap-x-2"
        >
          <Video /> <span className="mb-[2px]">Book Consultation</span>
        </button>

        <button className=" z-50 inline-flex items-center justify-center box-border outline-none m-0 cursor-pointer select-none align-middle appearance-none no-underline font-roboto leading-[1.75] tracking-[0.02857em] min-w-[64px] rounded-full px-9 py-[14px] text-[16px] font-bold normal-case relative overflow-hidden transition-transform duration-300 ease-in-out bg-white/10 backdrop-blur-[20px] border-2 border-white/30 hover:border-white/60 text-white transform hover:scale-105 gap-x-2">
          <Heart /> <span className="mb-[2px]">Support Our Mission</span>
        </button>
      </div>
    </div>
  );
};

export default HeroContent;
