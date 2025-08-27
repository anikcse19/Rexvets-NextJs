"use client";
import {
  Calendar,
  Clock,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const VideoCallPreview: React.FC = () => {
  const router = useRouter();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [hasInitializedCamera, setHasInitializedCamera] = useState(false);

  const webcamRef = useRef<Webcam>(null);

  const toggleVideo = () => {
    if (!hasInitializedCamera) {
      setHasInitializedCamera(true);
    }
    setIsVideoEnabled((prev) => !prev);
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => !prev);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgb(15, 12, 41) 0%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(0, 35, 102) 100%)",
      }}
      className="min-h-screen w-full flex items-center justify-center p-4"
    >
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Appointment Details */}
          <div className="flex flex-col justify-center  rounded-2xl p-8  h-[450px]">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-1">
                Appointment with Dr.
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-1">
                Tiffany Delacruz &
              </h2>
              <h3 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
                Mohammed Mohiuddin
              </h3>
            </div>

            <div className="flex items-center space-x-8 mb-8">
              <div className="flex items-center text-white/70">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">August 6, 2025</span>
              </div>
              <div className="flex items-center text-white/70">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">04:00 PM</span>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 border border-white/20">
              <div className="text-white/90 text-sm mb-2">
                <span className="font-medium">Pet: Amphibian • Male</span>
              </div>
              <div className="text-white/70 text-sm">
                <span>Reason: Nutrition</span>
              </div>
            </div>

            <button
              style={{
                background:
                  "linear-gradient(135deg, rgb(13, 79, 60) 0%, rgb(74, 20, 140) 50%, rgb(21, 101, 192) 100%)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "12px",
                padding: "16px",
              }}
              onClick={() => router.push("/join-video-call")}
              className="w-full cursor-pointer bg-gradient-to-r text-white font-semibold py-4 px-6 rounded-xl mb-4"
            >
              JOIN VIDEO CALL
            </button>

            <div className="flex items-start justify-start text-white/60 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              <span>You can join the call using your phone or computer.</span>
            </div>
          </div>

          {/* Right Side - Camera Preview */}
          <div className="flex flex-col justify-center h-[450px]">
            <div className="bg-black rounded-2xl overflow-hidden h-full w-full flex flex-col">
              {!hasInitializedCamera ? (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <Video className="w-12 h-12 mb-3 text-white/50" />
                  <p className="text-white text-lg font-medium mb-4">
                    Camera is off
                  </p>
                  <button
                    onClick={toggleVideo}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                  >
                    Turn on camera
                  </button>
                </div>
              ) : (
                <div className="relative h-full w-full flex flex-col">
                  {isVideoEnabled && (
                    <Webcam
                      ref={webcamRef}
                      audio={isAudioEnabled}
                      mirrored
                      className="h-full w-full object-cover"
                    />
                  )}

                  {!isVideoEnabled && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                      <Video className="w-12 h-12 mb-3 text-white/40" />
                      <p className="text-white text-lg font-medium">
                        Camera is off
                      </p>
                    </div>
                  )}

                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <button
                      onClick={toggleAudio}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md bg-black/30 border border-white/20 ${
                        isAudioEnabled
                          ? "hover:bg-gray-700/80"
                          : "bg-red-500/80 hover:bg-red-600/80"
                      }`}
                    >
                      {isAudioEnabled ? (
                        <Mic className="w-5 h-5 text-white" />
                      ) : (
                        <MicOff className="w-5 h-5 text-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleVideo}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md bg-black/30 border border-white/20 ${
                        isVideoEnabled
                          ? "hover:bg-gray-700/80"
                          : "bg-red-500/80 hover:bg-red-600/80"
                      }`}
                    >
                      {isVideoEnabled ? (
                        <Video className="w-5 h-5 text-white" />
                      ) : (
                        <VideoOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPreview;
