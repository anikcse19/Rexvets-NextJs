import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import React, { useRef, useState } from "react";

const CameraPreview: React.FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isMediaReady, setIsMediaReady] = useState(false);


  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMediaStream(stream);
      setIsCameraOn(true);
      setIsMediaReady(true);

      // Disable video initially
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = true; // enable video on start

      // Set video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play();
      }
      setIsVideoEnabled(true);
    } catch (error) {
      console.error("Camera/mic access denied", error);
      alert("Please allow camera and microphone access.");
    }
  };

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const newState = !isVideoEnabled;
        videoTrack.enabled = newState;
        setIsVideoEnabled(newState);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        const newState = !isAudioEnabled;
        audioTrack.enabled = newState;
        setIsAudioEnabled(newState);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black rounded-2xl p-6 relative w-[480px] h-[270px]">
      {!isCameraOn ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <Video className="w-12 h-12 mb-3 text-white/50" />
          <p className="text-white text-lg font-medium mb-4">Camera is off</p>
          <button
            onClick={startCamera}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
          >
            Turn on camera
          </button>
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-2xl"
          />

          {/* Camera & Mic Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              onClick={toggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isAudioEnabled
                  ? "bg-gray-700/80 hover:bg-gray-600/80"
                  : "bg-red-500 hover:bg-red-600"
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
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isVideoEnabled
                  ? "bg-gray-700/80 hover:bg-gray-600/80"
                  : "bg-red-500 hover:bg-red-600"
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
  );
};

export default CameraPreview;
