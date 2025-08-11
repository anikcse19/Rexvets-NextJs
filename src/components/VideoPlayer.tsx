"use client";
import { Play, Volume2, VolumeX } from "lucide-react";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa";
// import ReactPlayer from "react-player";

interface IProps {
  playing?: boolean;
  muted?: boolean;
  handlePlayPause: () => void;
  handleMuteToggle: () => void;
  containerStyle?: React.CSSProperties;
  source: string;
}
const VideoPlayer: React.FC<IProps> = ({
  playing,
  muted,
  handlePlayPause,
  handleMuteToggle,
  source = "https://res.cloudinary.com/di6zff0rd/video/upload/v1753102241/RexVetWeb_tb3zcq.mp4",
}) => {
  return (
    <div className=" rounded-[20px] h-[500px] w-[100%] md:h-[620px]  flex items-center justify-center  relative  overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] mb-6">
      <div className=" relative h-[450px] w-[96%] md:w-[500px] md:h-[580px]  p-4 flex items-center justify-center">
        <video
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            objectFit: "cover",
          }}
          autoPlay={playing}
          muted={muted}
          src={source}
          loop
        />
        <div className="absolute bottom-11 left-1/2 transform -translate-x-1/2 flex space-x-4 items-center justify-center z-50 pointer-events-auto">
          {/* Play/Pause Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={handlePlayPause}
              className="p-2 h-[56px] w-[56px] cursor-pointer flex items-center justify-center bg-white backdrop-blur-sm rounded-full transition-transform duration-200 hover:scale-110"
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? (
                <FaPause className="w-6 h-6 text-[#002366]" />
              ) : (
                <FaPlay className="w-6 h-6 text-[#002366]" />
              )}
            </button>
          </div>

          {/* Mute/Unmute Button */}
          <div className="flex justify-center items-center">
            <button
              onClick={handleMuteToggle}
              className="p-2 h-[56px] w-[56px] cursor-pointer flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full transition-transform duration-200 hover:scale-110"
              aria-label={muted ? "Unmute video" : "Mute video"}
            >
              {muted ? (
                <VolumeX className="w-6 h-6 text-[#002366]" />
              ) : (
                <Volume2 className="w-6 h-6 text-[#002366]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;