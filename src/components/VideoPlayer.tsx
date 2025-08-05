"use client";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const handlePlayPause = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);
  const handleMuteToggle = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  return (
    <div className=" rounded-[20px] h-[500px] w-[100%] md:h-[620px] md:w-[550px] md:ml-auto flex items-center justify-center relative  overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] mb-6">
      <div className=" relative h-[450px] w-[90%] md:w-[500px] md:h-[580px]  flex items-center justify-center">
        <ReactPlayer
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 20,
            objectFit: "cover",
          }}
          playing={playing}
          muted={muted}
          // controls={true}
          playIcon={<Play className="w-10 h-10 text-red-300" />}
          // pauseIcon={<Pause className="w-10 h-10 text-white" />}
          // volumeIcon={<Volume2 className="w-10 h-10 text-white" />}
          // mutedIcon={<VolumeX className="w-10 h-10 text-white" />}
          // muted={true}
          src="https://res.cloudinary.com/di6zff0rd/video/upload/v1753102241/RexVetsWeb_tb3zcq.mp4"
        />
        <div className="absolute bottom-11 left-1/2 transform -translate-x-1/2 flex space-x-4 items-center justify-center">
          <div className="flex justify-center items-center cursor-pointer">
            <button
              onClick={handlePlayPause}
              className="p-2 h-[56px] w-[56px] cursor-pointer flex items-center justify-center bg-white backdrop-blur-sm rounded-full transition-transform duration-200 hover:scale-110"
              aria-label={playing ? "Pause video" : "Play video"}
            >
              {playing ? (
                <Pause className="w-6 h-6 text-[#002366]" />
              ) : (
                <Play className="w-6 h-6 text-[#002366]" />
              )}
            </button>
          </div>

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
