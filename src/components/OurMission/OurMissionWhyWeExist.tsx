"use client";
import { motion, Variants } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

interface IProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

const OurMissionWhyWeExist: React.FC<IProps> = ({
  title,
  subtitle,
  description,
}) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);
    const handleEnded = () => setPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const slideUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <div className="py-6 md:py-12 bg-gradient-to-b from-[#f8fafc] to-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={slideUp}
          className="rounded-3xl overflow-hidden bg-[rgba(255,255,255,0.9)] backdrop-blur-xl border border-[rgba(255,255,255,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Section */}
            <div className="p-4 md:p-6 flex flex-col justify-center">
              <span className="mb-3 inline-block bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)] text-white font-semibold text-sm px-3 py-1 rounded-full self-start">
                {title}
              </span>

              <h2 className="m-0 mb-6 font-roboto text-[3.75rem] font-bold leading-[1.2] tracking-[-0.00833em] bg-gradient-to-tr from-[rgb(0,34,97)] from-[30%] to-[rgb(43,145,89)] to-[90%] bg-clip-text text-transparent">
                {subtitle}
              </h2>

              <p className="text-lg md:text-xl text-[rgba(0,0,0,0.7)] mb-4 leading-relaxed font-inter">
                {description}
              </p>

              <Link
                href="/PetParents"
                className="inline-flex items-center gap-2 bg-gradient-to-br from-[rgb(102,126,234)] to-[rgb(118,75,162)] text-white font-semibold text-base px-6 py-3 rounded-full shadow-[0_8px_25px_rgba(102,126,234,0.4)] hover:shadow-[0_12px_35px_rgba(102,126,234,0.6)] hover:-translate-y-0.5 transition-all duration-300 self-start font-inter"
              >
                <span>🚀</span> Learn More
              </Link>
            </div>

            {/* Right Section (Video) */}
            <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                muted={muted}
                loop
                controls={false}
                playsInline
              >
                <source
                  src="https://res.cloudinary.com/di6zff0rd/video/upload/v1754726064/RexVets2_our_mission24_cg4lve.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(102,126,234,0.1)] to-[rgba(43,145,89,0.1)]"></div>

              {/* Controls - Bottom aligned & horizontal */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="cursor-pointer p-5 rounded-full bg-white/80 hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  aria-label={playing ? "Pause video" : "Play video"}
                >
                  {playing ? <FaPause size={16} /> : <FaPlay size={16} />}
                </button>

                <button
                  onClick={toggleMute}
                  className="cursor-pointer p-5 rounded-full bg-white/80 hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
                  aria-label={muted ? "Unmute video" : "Mute video"}
                >
                  {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OurMissionWhyWeExist;
