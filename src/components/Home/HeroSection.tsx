"use client";
import React, { useCallback, useState } from "react";
import { BsChatLeftTextFill } from "react-icons/bs";
import CEOSection from "../CEOSection";
import FloatingElements from "../FloatingParticle";
import VideoPlayer from "../VideoPlayer";
import styles from "./hero.section.module.css";
import HeroContent from "./HeroContent";
const videoSource =
  "https://res.cloudinary.com/di6zff0rd/video/upload/v1753102241/RexVetsWeb_tb3zcq.mp4";
const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);
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
                <VideoPlayer
                  source={videoSource}
                  playing={playing}
                  muted={muted}
                  handlePlayPause={handlePlayPause}
                  handleMuteToggle={handleMuteToggle}
                />
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
