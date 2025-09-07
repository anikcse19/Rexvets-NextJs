"use client";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useState } from "react";
import CEOSection from "../CEOSection";
import styles from "./hero.section.module.css";
import Loader from "../shared/Loader";
import HeroVideo from "../VideoPlayer";
const loadingPlaceholder = () => <Loader size={60} />;

const FloatingElements = dynamic(() => import("../FloatingParticle"), {
  loading: loadingPlaceholder,
});
const HeroContent = dynamic(() => import("./HeroContent"), {
  loading: loadingPlaceholder,
});
// const VideoPlayer = dynamic(() => import("../VideoPlayer"), {
//   loading: loadingPlaceholder,
// });
const videoSource =
  "https://res.cloudinary.com/di6zff0rd/video/upload/v1753102241/RexVetsWeb_tb3zcq.mp4";
const HeroSection = () => {
  const [shouldPauseVideo, setShouldPauseVideo] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  // Scroll detection for video pause
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      // Get scroll position from different possible sources
      const windowScrollY =
        window.scrollY ||
        window.pageYOffset ||
        document.documentElement.scrollTop;
      const bodyScrollY = document.body.scrollTop || 0;
      const mainContentEl = document.querySelector(".main-content");
      const mainContentScrollY = mainContentEl ? mainContentEl.scrollTop : 0;

      // Use the scroll value that's actually changing
      let currentScrollY = windowScrollY;
      if (mainContentScrollY > 0) {
        currentScrollY = mainContentScrollY;
      } else if (bodyScrollY > 0) {
        currentScrollY = bodyScrollY;
      }

      // If scrolling in any direction, trigger video pause
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        setShouldPauseVideo(true);
        setTimeout(() => setShouldPauseVideo(false), 100);
      }

      lastScrollY = currentScrollY;
    };

    // Add scroll listeners to multiple possible scroll containers
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("scroll", handleScroll, { passive: true });

    const mainContentEl = document.querySelector(".main-content");
    if (mainContentEl) {
      mainContentEl.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("scroll", handleScroll);
      if (mainContentEl) {
        mainContentEl.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.hero_container}>
      <div className="min-h-screen mt-16">
        <FloatingElements />
        <main className="">
          <div className="container mx-auto">
            <div className="flex flex-col xl:flex-row gap-12  md:gap-6 items-center">
              <div className="w-full">
                <HeroContent />
              </div>

              <div className="w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: 150 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <CEOSection
                    heading="Meet Our CEO"
                    name="Dr. Tiffany Delacruz, DVM"
                  />
                  <HeroVideo shouldPause={shouldPauseVideo} />
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        {/* Floating Chat Button */}
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 cursor-pointer z-50"
        >
          <div className=" bg-[#041E89] p-3 rounded-full shadow-lg cursor-pointer">
            <BsChatLeftTextFill className="text-white text-xl" />
          </div>
        </button> */}
      </div>
      {/* <HelpCenterModal isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    </div>
  );
};

export default React.memo(HeroSection);