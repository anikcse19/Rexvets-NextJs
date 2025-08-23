import React from "react";
import { LocateIcon, Stethoscope } from "lucide-react";
import { MdEmojiEvents } from "react-icons/md";

const WelcomeSection = () => {
  return (
    <div
      style={{
        background: "linear-gradient(to right,#002366,#1a8693",
      }}
      className={`relative rounded-xl p-4 md:p-6 mb-4 text-white overflow-hidden bg-green-600`}
    >
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center relative">
          {/* Left Content */}
          <div className="flex-1 mb-4 lg:mb-0 lg:mr-6">
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl mb-1">
              Welcome back, Dr. Delacruz! 👋
            </h1>
            <h2 className="text-sm md:text-lg mb-2">
              You're making a difference in veterinary telemedicine
            </h2>
            <p className="text-xs md:text-sm">
              Ready to help pets and their families get the care they deserve
            </p>

            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1">
                <LocateIcon size={16} />
                <span className="text-sm">Hollywood, Florida</span>
              </div>
              <div className="flex items-center gap-1">
                <MdEmojiEvents size={16} />
                <span className="text-sm">Status: Approved</span>
              </div>
            </div>
          </div>

          {/* Decorative Icon Circle */}
          <div className="hidden lg:flex w-32 h-32 rounded-full bg-white/10 justify-center items-center">
            <Stethoscope size={64} className="text-white/80" />
          </div>
        </div>
      </div>

      {/* Decorative Bubble */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full transform translate-x-12 -translate-y-48"></div>
    </div>
  );
};

export default WelcomeSection;
