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
import React, { useCallback, useEffect, useRef, useState } from "react";

const VideoCallPreview: React.FC = () => {
  const router = useRouter();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const cleanup = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  }, [mediaStream]);
  const initializeMedia = useCallback(async () => {
    const hasPermission = await checkPermissions();
    if (!hasPermission) {
      alert("Camera and microphone permissions are required to join the call.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setMediaStream(stream);
      setIsMediaReady(true);

      // Initially disable video track (camera off by default)
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) videoTrack.enabled = false;

      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Unable to access camera or microphone.");
    }
  }, []);
  useEffect(() => {
    initializeMedia();
    return () => {
      cleanup();
    };
  }, [initializeMedia, cleanup]);

  // Check camera and microphone permissions
  const checkPermissions = async () => {
    try {
      const cameraStatus = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });
      const micStatus = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      return cameraStatus.state !== "denied" && micStatus.state !== "denied";
    } catch (err) {
      console.warn(
        "Permissions API not supported, fallback to getUserMedia:",
        err
      );
      return true;
    }
  };

  const toggleVideo = async () => {
    if (!(await checkPermissions())) {
      alert("Camera permission denied.");
      return;
    }

    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const newVideoState = !isVideoEnabled;
        videoTrack.enabled = newVideoState;
        setIsVideoEnabled(newVideoState);
      }
    }
  };

  const toggleAudio = async () => {
    if (!(await checkPermissions())) {
      alert("Microphone permission denied.");
      return;
    }

    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        const newAudioState = !isAudioEnabled;
        audioTrack.enabled = newAudioState;
        setIsAudioEnabled(newAudioState);
      }
    }
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
              // disabled={true}
              className="w-full cursor-pointer bg-gradient-to-r   text-white font-semibold py-4 px-6 rounded-xl mb-4"
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
              {!isCameraOn ? (
                <div className="h-full w-full flex flex-col items-center justify-center">
                  <Video className="w-12 h-12 mb-3 text-white/50" />
                  <p className="text-white text-lg font-medium mb-4">
                    Camera is off
                  </p>
                  <button
                    onClick={() => setIsCameraOn(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                  >
                    Turn on camera
                  </button>
                </div>
              ) : (
                <div className="relative h-full w-full flex flex-col">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-full w-full object-cover ${
                      !isVideoEnabled ? "hidden" : ""
                    }`}
                  />

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
                      disabled={!isMediaReady}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isAudioEnabled
                          ? "bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm"
                          : "bg-red-500 hover:bg-red-600"
                      } ${
                        !isMediaReady ? "opacity-50 cursor-not-allowed" : ""
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
                      disabled={!isMediaReady}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isVideoEnabled
                          ? "bg-gray-700/80 hover:bg-gray-600/80 backdrop-blur-sm"
                          : "bg-red-500 hover:bg-red-600"
                      } ${
                        !isMediaReady ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isVideoEnabled ? (
                        <Video className="w-5 h-5 text-white" />
                      ) : (
                        <VideoOff className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>

                  {!isMediaReady && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">
                          Loading camera and microphone...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-6 text-white/50 text-xs">
        <div className="text-right">
          <p className="font-medium">Activate Windows</p>
          <p>Go to Settings to activate Windows</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCallPreview;
