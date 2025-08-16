"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import config from "@/config/env.config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import {
  FaComments,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaTimes,
  FaVideoSlash,
} from "react-icons/fa";

type CallState = "connecting" | "waiting" | "active" | "ended" | "failed";
interface VideoCallProps {
  onEndCall?: () => void;
}

const APP_ID = config.AGORA_PUBLIC_ID;
const CHANNEL = "testChannel";
const IS_PUBLISHER = true;

const VideoCall: React.FC<VideoCallProps> = ({ onEndCall }) => {
  const router = useRouter();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callState, setCallState] = useState<CallState>("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [localUserJoined, setLocalUserJoined] = useState(false);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agoraLoaded, setAgoraLoaded] = useState(false);
  const [clientInitialized, setClientInitialized] = useState(false);
  const [remoteUsersState, setRemoteUsersState] = useState<{
    [uid: string]: any;
  }>({});

  // Agora refs
  const client = useRef<any>(null);
  const localVideoTrack = useRef<any>(null);
  const localAudioTrack = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const remoteUsers = useRef<{ [uid: string]: any }>({});
  const isJoiningRef = useRef(false);

  // Generate unique UID
  const [uid] = useState(Math.floor(Math.random() * 100000));

  // Load AgoraRTC dynamically
  useEffect(() => {
    (async () => {
      try {
        const module = await import("agora-rtc-sdk-ng");
        if (module.default) {
          console.log("AgoraRTC loaded successfully");
          module.default.setLogLevel(1); // Enable INFO level logging
          setAgoraLoaded(true);
        } else {
          throw new Error("AgoraRTC module is undefined");
        }
      } catch (error) {
        console.error("Failed to load AgoraRTC:", error);
        setErrorMessage("Failed to load video call library.");
        setCallState("failed");
      }
    })();
  }, []);

  // Initialize Agora client
  useEffect(() => {
    if (agoraLoaded && !client.current) {
      console.log("Initializing Agora client...");
      try {
        const AgoraRTC = require("agora-rtc-sdk-ng");
        if (!AgoraRTC.createClient) {
          throw new Error("AgoraRTC.createClient is not available");
        }
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        console.log("Agora client initialized:", client.current);
        setClientInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Agora client:", error);
        setErrorMessage("Failed to initialize video call client.");
        setCallState("failed");
      }
    }
  }, [agoraLoaded]);

  // Format duration to MM:SS
  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Fetch token
  const fetchToken = useCallback(
    async (channelName: string, id: number, isPublisher: boolean) => {
      try {
        const res = await fetch(
          `/api/agora-token?channelName=${channelName}&uid=${id}&isPublisher=${isPublisher}`
        );
        if (!res.ok) {
          throw new Error(`Token fetch failed with status: ${res.status}`);
        }
        const data = await res.json();
        if (!data.token) {
          throw new Error("No token received from server");
        }
        console.log("Token fetched successfully:", data.token);
        return data.token;
      } catch (error) {
        console.error("Error fetching token:", error);
        setErrorMessage("Failed to authenticate. Please try again.");
        setCallState("failed");
        return null;
      }
    },
    []
  );

  // Join call function
  const joinCall = useCallback(async () => {
    if (isJoiningRef.current || !client.current || !clientInitialized) {
      console.log("Join call skipped: isJoining or client not ready");
      return;
    }
    isJoiningRef.current = true;

    try {
      if (!APP_ID) {
        throw new Error("Missing Agora App ID");
      }

      setCallState("connecting");
      setErrorMessage(null);

      // Set up event listeners
      client.current.on("user-joined", (user: any) => {
        console.log("User joined:", user.uid);
        remoteUsers.current[user.uid] = user;
        setRemoteUsersState((prev) => ({ ...prev, [user.uid]: user }));
        setRemoteUserJoined(true);
        setCallState("active");
      });

      client.current.on(
        "user-published",
        async (user: any, mediaType: string) => {
          if (!client.current) {
            console.warn("Client is null in user-published");
            return;
          }
          try {
            await client.current.subscribe(user, mediaType);
            console.log(`Subscribed to ${mediaType} for user:`, user.uid);
            remoteUsers.current[user.uid] = user;
            setRemoteUsersState((prev) => ({ ...prev, [user.uid]: user }));

            if (mediaType === "video" && remoteVideoRef.current) {
              user.videoTrack?.play(remoteVideoRef.current);
              console.log("Remote video playing for user:", user.uid);
              setRemoteUserJoined(true);
            }
            if (mediaType === "audio") {
              user.audioTrack?.play();
              console.log("Remote audio playing for user:", user.uid);
            }
          } catch (error) {
            console.error("Error in user-published:", error);
            setErrorMessage("Failed to subscribe to user stream.");
          }
        }
      );

      client.current.on("user-unpublished", (user: any, mediaType: string) => {
        console.log("User unpublished:", user.uid, mediaType);
        if (mediaType === "video") {
          remoteUsers.current[user.uid] = {
            ...remoteUsers.current[user.uid],
            videoTrack: null,
          };
          setRemoteUsersState((prev) => ({
            ...prev,
            [user.uid]: { ...prev[user.uid], videoTrack: null },
          }));
        }
        if (Object.keys(remoteUsers.current).length <= 1) {
          setRemoteUserJoined(false);
          setCallState("waiting");
        }
      });

      client.current.on("user-left", (user: any) => {
        console.log("User left:", user.uid);
        delete remoteUsers.current[user.uid];
        setRemoteUsersState((prev) => {
          const newState = { ...prev };
          delete newState[user.uid];
          return newState;
        });
        if (Object.keys(remoteUsers.current).length === 0) {
          setRemoteUserJoined(false);
          setCallState("waiting");
        }
      });

      client.current.on("connection-state-change", (state: string) => {
        console.log("Connection state changed:", state);
        if (state === "DISCONNECTED" || state === "DISCONNECTING") {
          setCallState("failed");
          setRemoteUserJoined(false);
          setErrorMessage("Connection lost.");
        }
      });

      client.current.on("track-updated", (track: any) => {
        console.log("Track updated:", track.trackMediaType);
        if (
          track.trackMediaType === "audio" &&
          track === localAudioTrack.current
        ) {
          setIsAudioEnabled(!track.muted);
        }
        if (
          track.trackMediaType === "video" &&
          track === localVideoTrack.current
        ) {
          setIsVideoEnabled(!track.muted);
        }
      });

      // Create and publish local tracks
      if (IS_PUBLISHER) {
        try {
          const AgoraRTC = require("agora-rtc-sdk-ng");
          localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
          localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
          console.log(
            "Local tracks created:",
            localVideoTrack.current,
            localAudioTrack.current
          );
        } catch (error) {
          console.error("Error accessing media devices:", error);
          setErrorMessage("Please allow camera and microphone access.");
          setCallState("failed");
          isJoiningRef.current = false;
          return;
        }

        if (localVideoRef.current && localVideoTrack.current) {
          try {
            localVideoTrack.current.play(localVideoRef.current);
            console.log("Local video playing on:", localVideoRef.current);
          } catch (error) {
            console.error("Error playing local video:", error);
            setErrorMessage("Failed to display local video.");
          }
        }
      }

      // Join channel with retry logic
      const attemptJoin = async (retryCount = 3) => {
        let currentUid = uid;
        for (let i = 0; i < retryCount; i++) {
          try {
            const token = await fetchToken(CHANNEL, currentUid, IS_PUBLISHER);
            if (!token) {
              throw new Error("Failed to fetch token");
            }
            await client.current.join(APP_ID, CHANNEL, token, currentUid);
            console.log("Joined channel with UID:", currentUid);
            if (
              IS_PUBLISHER &&
              localVideoTrack.current &&
              localAudioTrack.current
            ) {
              await client.current.publish([
                localVideoTrack.current,
                localAudioTrack.current,
              ]);
              console.log("Local tracks published");
            }
            setLocalUserJoined(true);
            setCallState("waiting");
            return;
          } catch (error: any) {
            if (error.code === "UID_CONFLICT") {
              console.warn(
                `UID conflict detected for ${currentUid}. Retrying...`
              );
              currentUid = Number(
                `${Date.now()}${Math.floor(Math.random() * 1000)}`
              );
              continue;
            }
            throw error;
          }
        }
        throw new Error("Failed to join channel after multiple retries");
      };

      await attemptJoin();
    } catch (error: any) {
      console.error("Failed to join call:", error);
      setCallState("failed");
      setErrorMessage(
        `Failed to join call: ${error.message || "Unknown error"}`
      );
    } finally {
      isJoiningRef.current = false;
    }
  }, [fetchToken, uid, clientInitialized]);

  // Join call once client is initialized
  useEffect(() => {
    if (clientInitialized) {
      console.log("Client initialized, joining call...");
      joinCall();
    }
  }, [clientInitialized, joinCall]);

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
            localVideoTrack.current.stop();
            localVideoTrack.current.close();
            localVideoTrack.current = null;
            console.log("Local video track cleaned up");
          }
          if (localAudioTrack.current) {
            localAudioTrack.current.stop();
            localAudioTrack.current.close();
            localAudioTrack.current = null;
            console.log("Local audio track cleaned up");
          }
          if (client.current) {
            await client.current.leave();
            client.current.removeAllListeners();
            client.current = null;
            console.log("Agora client cleaned up");
          }
          remoteUsers.current = {};
          setRemoteUsersState({});
        } catch (error) {
          console.error("Error during Agora cleanup:", error);
        }
      };
      cleanupAgora();
    };
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!localAudioTrack.current) return;
    try {
      const shouldMute = isAudioEnabled;
      await localAudioTrack.current.setEnabled(!shouldMute);
      setIsAudioEnabled(!shouldMute);
      console.log("Audio toggled:", !shouldMute);
    } catch (error) {
      console.error("Error toggling audio:", error);
      setErrorMessage("Failed to toggle audio.");
    }
  }, [isAudioEnabled]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localVideoTrack.current) return;
    try {
      const shouldMute = isVideoEnabled;
      await localVideoTrack.current.setEnabled(!shouldMute);
      setIsVideoEnabled(!shouldMute);
      console.log("Video toggled:", !shouldMute);
    } catch (error) {
      console.error("Error toggling video:", error);
      setErrorMessage("Failed to toggle video.");
    }
  }, [isVideoEnabled]);

  // Switch camera
  const switchCamera = useCallback(async () => {
    if (!localVideoTrack.current || !agoraLoaded) {
      console.warn("No video track or AgoraRTC available for camera switch");
      setErrorMessage("Camera switch unavailable: No active video track.");
      return;
    }

    try {
      const AgoraRTC = require("agora-rtc-sdk-ng");
      const devices = await AgoraRTC.getCameras();
      if (devices.length === 0) {
        console.warn("No cameras found");
        setErrorMessage("No cameras available.");
        return;
      }

      const currentSettings = localVideoTrack.current
        .getMediaStreamTrack()
        .getSettings();
      const currentDeviceId = currentSettings.deviceId;
      let targetDeviceId = null;
      let newIsFrontCameraValue = isFrontCamera;

      const frontCameras = devices.filter(
        (device: any) =>
          device.label.toLowerCase().includes("front") ||
          device.label.toLowerCase().includes("user")
      );
      const backCameras = devices.filter(
        (device: any) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment")
      );

      const isCurrentCameraFront = frontCameras.some(
        (d: { deviceId: any }) => d.deviceId === currentDeviceId
      );
      const isCurrentCameraBack = backCameras.some(
        (d: { deviceId: any }) => d.deviceId === currentDeviceId
      );

      if (isCurrentCameraFront && backCameras.length > 0) {
        targetDeviceId = backCameras[0].deviceId;
        newIsFrontCameraValue = false;
      } else if (isCurrentCameraBack && frontCameras.length > 0) {
        targetDeviceId = frontCameras[0].deviceId;
        newIsFrontCameraValue = true;
      } else if (devices.length > 1) {
        const currentIndex = devices.findIndex(
          (device: any) => device.deviceId === currentDeviceId
        );
        const nextIndex = (currentIndex + 1) % devices.length;
        const newCamera = devices[nextIndex];
        targetDeviceId = newCamera.deviceId;
        newIsFrontCameraValue =
          newCamera.label.toLowerCase().includes("front") ||
          newCamera.label.toLowerCase().includes("user");
      } else {
        console.warn(
          "Only one camera found or no clear front/back distinction"
        );
        setErrorMessage(
          "Only one camera available or no clear front/back distinction."
        );
        return;
      }

      if (targetDeviceId && targetDeviceId !== currentDeviceId) {
        await localVideoTrack.current.setDevice(targetDeviceId);
        console.log(`Switched to camera with deviceId: ${targetDeviceId}`);
        setIsFrontCamera(newIsFrontCameraValue);
        setErrorMessage(null);
      } else {
        console.log(
          "No suitable camera to switch to or already on desired camera."
        );
        setErrorMessage("No alternative camera to switch to.");
      }
    } catch (error) {
      console.error("Failed to switch camera:", error);
      setErrorMessage("Failed to switch camera. Please try again.");
    }
  }, [isFrontCamera, agoraLoaded]);

  // End call
  const endCall = useCallback(async () => {
    try {
      if (localVideoTrack.current) {
        localVideoTrack.current.stop();
        localVideoTrack.current.close();
        localVideoTrack.current = null;
        console.log("Local video track stopped and closed");
      }
      if (localAudioTrack.current) {
        localAudioTrack.current.stop();
        localAudioTrack.current.close();
        localAudioTrack.current = null;
        console.log("Local audio track stopped and closed");
      }
      if (client.current) {
        await client.current.leave();
        client.current.removeAllListeners();
        client.current = null;
        console.log("Client left and cleaned up");
      }
      remoteUsers.current = {};
      setRemoteUsersState({});
      setCallState("ended");
      setLocalUserJoined(false);
      setRemoteUserJoined(false);
      setErrorMessage(null);
    } catch (error) {
      console.error("Error ending call:", error);
      setErrorMessage("Failed to end call.");
      setCallState("ended");
    } finally {
      if (onEndCall) {
        onEndCall();
      } else {
        router.back();
      }
    }
  }, [onEndCall, router]);

  // Connection status helper
  const getConnectionStatus = useCallback(() => {
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
  }, [callState]);

  const status = getConnectionStatus();

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
      }}
      className="h-screen flex justify-center"
    >
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row gap-7 py-5 md:py-24 px-4">
        {/* Left Main Section */}
        <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-2xl flex flex-col relative">
          {/* Logo */}
          <div className="absolute -top-11 left-6">
            <Link href="/" aria-label="Homepage">
              <Image
                src="/images/Logo.svg"
                alt="Logo RexVet"
                width={120}
                height={100}
                quality={100}
              />
            </Link>
          </div>

          {/* Top Header */}
          <div className="flex items-center justify-between p-6 absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                <AvatarFallback>MM</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <div className="font-semibold text-lg">Mohammed Mohiuddin</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-300">Online</span>
                </div>
              </div>
            </div>

            <Button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaPhoneSlash className="w-4 h-4" />
              End Call
            </Button>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 flex items-center justify-center p-6 pt-24">
            <div className="relative flex gap-4 w-full h-full">
              {callState === "connecting" && !errorMessage && (
                <div className="text-white text-lg">Connecting...</div>
              )}
              {callState === "failed" && errorMessage && (
                <div className="text-red-500 text-lg">{errorMessage}</div>
              )}
              {callState !== "connecting" &&
                !errorMessage &&
                Object.keys(remoteUsersState).length !== 0 && (
                  <div className="w-full h-full rounded-[2.5rem] p-2 shadow-2xl">
                    <div className="w-full h-full bg-gray-900 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden">
                      <div
                        ref={remoteVideoRef}
                        className="w-full h-full flex items-center justify-center"
                        style={{ minHeight: "100%", minWidth: "100%" }}
                      ></div>
                    </div>
                  </div>
                )}
              {callState !== "connecting" &&
                !errorMessage &&
                Object.keys(remoteUsersState).length === 0 && (
                  <div className="h-full w-full flex items-center justify-center">
                    <div>
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="w-[120px] h-[120px] mb-4 border-4 border-white shadow-lg">
                          <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face" />
                          <AvatarFallback>MM</AvatarFallback>
                        </Avatar>
                        <div className="text-white">
                          <h2 className="text-xl font-semibold mb-1">
                            Waiting for Mohammed Mohiuddin...
                          </h2>
                          <p className="text-gray-300 text-sm">
                            Please wait while we establish the connection
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Local Video Preview */}
          <div className="w-[174px] h-[234px] border border-gray-100 absolute top-20 right-4 z-50 bg-black rounded-lg overflow-hidden">
            <div
              ref={localVideoRef}
              className="w-full h-full flex items-center justify-center"
            >
              {!localVideoTrack.current && (
                <div className="text-white text-sm">Local Video</div>
              )}
              {!isVideoEnabled && localVideoTrack.current && (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <FaVideoSlash className="text-white text-4xl opacity-50" />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isAudioEnabled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {isAudioEnabled ? (
                  <FaMicrophone className="text-white text-lg" />
                ) : (
                  <FaMicrophoneSlash className="text-white text-lg" />
                )}
              </Button>

              <Button
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
              >
                <FaPhoneSlash className="text-white text-lg" />
              </Button>

              <Button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isVideoEnabled
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                <FaVideoSlash className="text-white text-lg" />
              </Button>

              <Button className="w-14 h-14 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center">
                <FaComments className="text-white text-lg" />
              </Button>
              <Button
                onClick={switchCamera}
                className="w-14 h-14 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center"
              >
                <AiOutlineCamera className="text-white text-lg" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Hidden below md */}
        <div className="hidden md:block w-full md:w-[30%] bg-gradient-to-b from-purple-700 via-purple-800 to-blue-800 p-6 relative rounded-2xl">
          <Button
            onClick={onEndCall}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/10 w-8 h-8 p-0"
          >
            <FaTimes className="w-4 h-4" />
          </Button>

          {/* Patient Avatar and Info */}
          <div className="text-center mb-8 pt-8">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <div className="text-white text-2xl">🐾</div>
              </div>
              <div className="absolute -top-2 -right-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <h3 className="text-white text-xl font-semibold mb-1">
              new image 2
            </h3>
            <p className="text-gray-200 text-sm mb-1">
              Amphibian • Male Neutered • fsdaf
            </p>
            <p className="text-gray-200 text-sm mb-3">Weight: 20</p>

            <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Active
            </Badge>
          </div>

          {/* Reason for appointment */}
          <div className="mb-8">
            <h4 className="text-white font-semibold mb-3 text-lg">
              Reason for appointment
            </h4>
            <Input
              value="Nutrition"
              readOnly
              className="bg-white/20 border-white/30 text-white placeholder-gray-300 h-12 text-base"
            />
          </div>

          {/* Veterinarian Details */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">
              Veterinarian Details
            </h4>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MM</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-base">
                    Mohammed Mohiuddin
                  </h5>
                  <p className="text-gray-200 text-sm">America/New_York</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
