"use client";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineCameraswitch } from "react-icons/md";

interface VideoCallInterfaceProps {
  appId: string;
  channel: string;
  uid: number;
  isPublisher?: boolean;
}

type CallState = "connecting" | "waiting" | "active" | "ended" | "failed";

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  appId,
  channel,
  uid,
  isPublisher = true,
}) => {
  const router = useRouter();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callState, setCallState] = useState<CallState>("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [localUserJoined, setLocalUserJoined] = useState(false);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Agora refs
  const client = useRef<any>(null);
  const localVideoTrack = useRef<any>(null);
  const localAudioTrack = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const remoteUsers = useRef<{ [uid: string]: any }>({});
  const isJoiningRef = useRef(false);

  // Recording refs

  // Format duration to MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Initialize Agora client on mount
  useEffect(() => {
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  }, []);

  // Start recording via server API

  // Stop recording via server API

  // Join call function
  const joinCall = useCallback(async () => {
    if (isJoiningRef.current) return;
    isJoiningRef.current = true;

    try {
      setCallState("connecting");

      const res = await fetch(
        `/api/agora-token?channelName=${channel}&uid=${uid}&isPublisher=${isPublisher}`
      );
      const data = await res.json();
      if (!data.token) {
        console.error("Failed to get token");
        setCallState("failed");
        return;
      }
      const token = data.token;

      const clientInstance = client.current;
      if (!clientInstance) {
        console.error("Agora client not initialized");
        setCallState("failed");
        return;
      }

      await clientInstance.join(appId, channel, token, uid);

      // Create and publish local tracks if publisher
      if (isPublisher) {
        localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
        localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();

        if (localVideoRef.current)
          localVideoTrack.current.play(localVideoRef.current);

        await clientInstance.publish([
          localAudioTrack.current,
          localVideoTrack.current,
        ]);
      }

      setLocalUserJoined(true);
      setCallState("waiting");

      // Remote user joined
      clientInstance.on("user-joined", (user: any) => {
        remoteUsers.current[user.uid] = user;
        setRemoteUserJoined(true);

        // Start recording once both local and remote joined
        // if (localUserJoined && remoteUserJoined) startRecording();

        setCallState("active");
      });

      // Remote user published
      clientInstance.on(
        "user-published",
        async (user: any, mediaType: string) => {
          await clientInstance.subscribe(user, mediaType);
          remoteUsers.current[user.uid] = user;

          if (mediaType === "video" && remoteVideoRef.current) {
            user.videoTrack?.play(remoteVideoRef.current);
            setRemoteUserJoined(true);
          }
          if (mediaType === "audio") user.audioTrack?.play();
        }
      );

      // Remote user unpublished
      clientInstance.on("user-unpublished", (user: any, mediaType: string) => {
        if (mediaType === "video" && remoteVideoRef.current)
          remoteVideoRef.current.innerHTML = "";
        if (Object.keys(remoteUsers.current).length <= 1)
          setRemoteUserJoined(false);
        setCallState("waiting");
        // setTimeout(() => {
        //   stopRecording();
        // }, 3000);
      });

      // Remote user left
      clientInstance.on("user-left", (user: any) => {
        delete remoteUsers.current[user.uid];
        if (Object.keys(remoteUsers.current).length === 0)
          setCallState("waiting");
        if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";
      });

      // Connection state
      clientInstance.on("connection-state-change", (state: string) => {
        if (state === "DISCONNECTED" || state === "DISCONNECTING") {
          setCallState("failed");
          setRemoteUserJoined(false);
        }
      });

      // Track updated (mute/unmute)
      clientInstance.on("track-updated", (track: any) => {
        if (
          track.trackMediaType === "audio" &&
          track === localAudioTrack.current
        )
          setIsAudioEnabled(!track.muted);
        if (
          track.trackMediaType === "video" &&
          track === localVideoTrack.current
        )
          setIsVideoEnabled(!track.muted);
      });
    } catch (error) {
      console.error("Failed to join call:", error);
      setCallState("failed");
    } finally {
      isJoiningRef.current = false;
    }
  }, [isPublisher, appId, channel, uid, client]);

  // Join call once on mount
  useEffect(() => {
    if (client.current) joinCall();
  }, [joinCall]);
  // useEffect(() => {
  //   if (localUserJoined && remoteUserJoined && !isRecording) {
  //     startRecording();
  //   }
  // }, [localUserJoined, remoteUserJoined]);
  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callState === "active") {
      interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [callState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const cleanupAgora = async () => {
        try {
          if (localVideoTrack.current) {
            localVideoTrack.current.close();
            localVideoTrack.current = null;
          }
          if (localAudioTrack.current) {
            localAudioTrack.current.close();
            localAudioTrack.current = null;
          }
          if (client.current) {
            await client.current.leave();
            client.current.removeAllListeners();
          }
        } catch (error) {
          console.error("Error during Agora cleanup:", error);
        }
      };
      cleanupAgora();
    };
  }, []);

  // Toggle audio/video
  const toggleAudio = async () => {
    if (!localAudioTrack.current) return;
    const shouldMute = isAudioEnabled;
    await localAudioTrack.current.setEnabled(!shouldMute);
    setIsAudioEnabled(!shouldMute);
  };

  const toggleVideo = async () => {
    if (!localVideoTrack.current) return;
    const shouldMute = isVideoEnabled;
    await localVideoTrack.current.setEnabled(!shouldMute);
    setIsVideoEnabled(!shouldMute);
  };
  const switchCamera = async () => {
    if (!localVideoTrack.current) return;

    try {
      // Get all available cameras
      const devices = await AgoraRTC.getCameras();
      // Pick the opposite camera
      const newCamera = devices.find((device) =>
        isFrontCamera
          ? device.label.toLowerCase().includes("back")
          : device.label.toLowerCase().includes("front")
      );

      if (newCamera) {
        await localVideoTrack.current.setDevice(newCamera.deviceId);
        setIsFrontCamera((prev) => !prev);
      } else {
        console.warn("No alternative camera found");
      }
    } catch (error) {
      console.error("Failed to switch camera:", error);
    }
  };
  // End call
  const endCall = async () => {
    try {
      if (localVideoTrack.current) {
        localVideoTrack.current.close();
        localVideoTrack.current = null;
      }
      if (localAudioTrack.current) {
        localAudioTrack.current.close();
        localAudioTrack.current = null;
      }
      if (client.current) {
        await client.current.leave();
        client.current.removeAllListeners();
      }
      if (localVideoRef.current) localVideoRef.current.innerHTML = "";
      if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";

      // Stop recording
      // await stopRecording();

      setCallState("ended");
    } catch (error) {
      console.error("Error ending call:", error);
      setCallState("ended");
    } finally {
      router.back();
    }
  };

  // Connection status helper
  const getConnectionStatus = () => {
    switch (callState) {
      case "connecting":
        return {
          text: "Connecting...",
          color: "text-yellow-400",
          dot: "bg-yellow-400",
        };
      case "waiting":
        return {
          text: "Waiting for others...",
          color: "text-yellow-400",
          dot: "bg-yellow-400",
        };
      case "active":
        return {
          text: "Connected",
          color: "text-green-400",
          dot: "bg-green-400",
        };
      case "ended":
        return { text: "Call Ended", color: "text-red-400", dot: "bg-red-400" };
      case "failed":
        return {
          text: "Connection Failed",
          color: "text-red-400",
          dot: "bg-red-400",
        };
      default:
        return { text: "Unknown", color: "text-gray-400", dot: "bg-gray-400" };
    }
  };

  const status = getConnectionStatus();
  console.log("localUserJoined:", localUserJoined);
  console.log("remoteUserJoined:", remoteUserJoined);
  console.log("isVideoEnabled:", isVideoEnabled);
  console.log("isAudioEnabled:", isAudioEnabled);
  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Main video area - Remote participant */}
      <div className="absolute inset-0">
        <div
          ref={remoteVideoRef}
          className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center"
        >
          {/* <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            alt="Sarah Parker"
            className="w-full h-full object-cover"
          /> */}
        </div>

        {remoteUserJoined && (
          <div className="absolute bottom-6 left-6">
            <div className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
              <span className="font-medium">Sarah Parker</span>
            </div>
          </div>
        )}
      </div>

      {/* Local video - Picture in Picture */}
      <div className="absolute top-6 right-6 w-64 h-48 rounded-xl overflow-hidden shadow-2xl border-2 border-white">
        <div
          ref={localVideoRef}
          className="w-full h-full bg-gray-800 flex items-center justify-center relative"
        >
          {!localUserJoined && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <Video className="w-8 h-8 text-gray-400" />
            </div>
          )}

          <div className="absolute bottom-3 left-3">
            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
              You
            </div>
          </div>

          {!isVideoEnabled && localUserJoined && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-white text-xl font-medium">
          Meeting with Sarah Parker
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-white text-sm">
            {callState === "active" ? formatDuration(callDuration) : "00:00"}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${status.dot} ${
                callState === "connecting" || callState === "waiting"
                  ? "animate-pulse"
                  : ""
              }`}
            ></div>
            <span className={`text-sm ${status.color}`}>{status.text}</span>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-20 left-0 right-0 p-8">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={toggleAudio}
            disabled={callState !== "active"}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              callState !== "active"
                ? "bg-gray-700 opacity-50 cursor-not-allowed"
                : isAudioEnabled
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isAudioEnabled ? (
              <Mic className="w-6 h-6 text-white" />
            ) : (
              <MicOff className="w-6 h-6 text-white" />
            )}
          </button>
          <button onClick={switchCamera}>
            <MdOutlineCameraswitch className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={toggleVideo}
            disabled={callState !== "active"}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              callState !== "active"
                ? "bg-gray-700 opacity-50 cursor-not-allowed"
                : isVideoEnabled
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isVideoEnabled ? (
              <Video className="w-6 h-6 text-white" />
            ) : (
              <VideoOff className="w-6 h-6 text-white" />
            )}
          </button>

          <button
            disabled={callState !== "active"}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
              callState !== "active"
                ? "bg-gray-700 opacity-50 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={endCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200 shadow-lg"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallInterface;
