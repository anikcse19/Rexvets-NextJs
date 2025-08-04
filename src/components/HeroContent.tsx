import { Clock, Heart, Shield, Star, Users, Video } from "lucide-react";
import ServiceBadge from "./ServiceBadge";
import TrustIndicator from "./TrustIndicator";
import { Button } from "./ui/button";

const HeroContent: React.FC = () => {
  return (
    <div className="space-y-6">
      <ServiceBadge
        icon={<div className="w-4 h-4 bg-emerald-400 rounded"></div>}
        text="Non-Profit Veterinary Care"
      />

      <div>
        <h1 className="text-6xl md:text-[96px]  leading-[106px]  font-[900] text-white mb-4">
          Low-Cost
        </h1>
        <h1 className="text-6xl md:text-[96px] leading-[106px] font-[900] mb-6">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Veterinary Care
          </span>
        </h1>
      </div>

      <div className="flex items-center space-x-2 text-blue-400 mb-6">
        <Clock className="w-5 h-5" />
        <span className=" text-sm md:text-[24px] md:leading-[28px]  font-[600] ">
          24/7 Online Vet Appointments - Ask a Vet
        </span>
      </div>

      <p className="text-[rgba(255,255,255,0.9)] md:text-[21px] md:leading-[33px] max-w-lg ">
        As a non-profit organization, Rex Vets provides affordable telehealth
        consultations to ensure every pet gets the care they deserve from the
        comfort of home. Breaking barriers, building bonds.
      </p>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
        <button className="book-consultation-button inline-flex items-center justify-center box-border outline-none border-none m-0 cursor-pointer select-none align-middle appearance-none no-underline font-roboto text-base leading-[1.75] tracking-[0.02857em] min-w-[64px] rounded-full px-9 py-4 font-bold normal-case relative overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-white shadow-[0_8px_25px_rgba(59,130,246,0.4)] gap-x-2">
          <Video /> <span className="mb-[2px]"> Book Consultation</span>
        </button>

        <button className="inline-flex items-center justify-center box-border outline-none m-0 cursor-pointer select-none align-middle appearance-none no-underline font-roboto leading-[1.75] tracking-[0.02857em] min-w-[64px] rounded-full px-9 py-4 text-[16px] font-bold normal-case relative overflow-hidden transition-transform duration-300 ease-in-out bg-white/10 backdrop-blur-[20px] border-2 border-white/30 hover:border-white/60 text-white transform hover:scale-105 gap-x-2">
          <Heart /> <span className="mb-[2px]">Support Our Mission</span>
        </button>
      </div>

      {/* <div className="flex flex-wrap gap-6 pt-6">
        <TrustIndicator
          icon={
            <div className="flex">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
            </div>
          }
          highlight="4.9/5"
          text=" Rating"
        />
        <TrustIndicator
          icon={<Users className="w-4 h-4 text-emerald-400" />}
          highlight="10k+"
          text=" Happy Pet Owners"
        />
        <TrustIndicator
          icon={<Shield className="w-4 h-4 text-emerald-400" />}
          highlight="100%"
          text=" Secure"
        />
      </div> */}
    </div>
  );
};

export default HeroContent;
