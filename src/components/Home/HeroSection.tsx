import React from "react";
import CEOSection from "../CEOSection";
import FloatingElements from "../FloatingParticle";
import { Button } from "../ui/button";
import VideoPlayer from "../VideoPlayer";
import styles from "./hero.section.module.css";
import HeroContent from "./HeroContent";
const HeroSection = () => {
  return (
    <div className={styles.hero_container}>
      <div className="min-h-screen  pt-12">
        <FloatingElements />
        <main className="">
          <div className="max-w-[1536px] mx-auto">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="w-full lg:w-1/2">
                <HeroContent />
              </div>

              <div className="w-full lg:w-1/2">
                <CEOSection />
                <VideoPlayer />
              </div>
            </div>
          </div>
        </main>

        {/* Floating Chat Button */}
        <div className="fixed bottom-6 right-6">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg px-6 py-3">
            Chat live with an agent now!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HeroSection);
