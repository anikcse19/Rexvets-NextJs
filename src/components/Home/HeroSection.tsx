"use client";
import React, { useState } from "react";
import { BsChatLeftTextFill } from "react-icons/bs";
import CEOSection from "../CEOSection";
import FloatingElements from "../FloatingParticle";
import VideoPlayer from "../VideoPlayer";
import styles from "./hero.section.module.css";
import HeroContent from "./HeroContent";
const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.hero_container}>
      <div className="min-h-screen   mt-24  lg:mt-16">
        <FloatingElements />
        <main className="">
          <div className="max-w-[1536px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2">
                <HeroContent />
              </div>

              <div className="w-full lg:w-1/2 lg:mt-20">
                <CEOSection
                  heading="Meet Our CEO"
                  name="Dr. Tiffany Delacruz, DVM"
                />
                <VideoPlayer />
              </div>
            </div>
          </div>
        </main>

        {/* Floating Chat Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 cursor-pointer z-50"
        >
          <div className=" bg-[#041E89] p-3 rounded-full shadow-lg cursor-pointer">
            <BsChatLeftTextFill className="text-white text-xl" />
          </div>
        </button>
      </div>
      {/* <HelpCenterModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </div>
  );
};

export default React.memo(HeroSection);
