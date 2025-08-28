"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import config from "@/config/env.config";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
// Add strongly-typed Agora imports
import { IAppointment, IPetParent, IUser } from "@/models";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import PostCallModal from "../PostCallReviewModal";

type CallState = "connecting" | "waiting" | "active" | "ended" | "failed";
interface VideoCallProps {
  onEndCall?: () => void;
}

const APP_ID = config.AGORA_PUBLIC_ID;
const CHANNEL = "testChannel";
const IS_PUBLISHER = true;

// Virtual background images (using project images)
const VIRTUAL_BACKGROUNDS = [
  {
    id: 1,
    name: "Blur",
    url: "blur",
    image: "/images/how-it-works/SecondImg.webp",
  },
  {
    id: 2,
    name: "Office",
    url: "/images/donate-page/Texture.webp",
    image: "/images/donate-page/Texture.webp",
  },
  {
    id: 3,
    name: "Beach",
    url: "/images/mission/dog.webp",
    image: "/images/mission/dog.webp",
  },
  {
    id: 4,
    name: "Nature",
    url: "/images/about/About1.webp",
    image: "/images/about/About1.webp",
  },
  {
    id: 5,
    name: "Space",
    url: "/images/how-it-works/PrincipalImgWorks.webp",
    image: "/images/how-it-works/PrincipalImgWorks.webp",
  },
  { id: 6, name: "None", url: "none", image: "/images/Logo.svg" },
];

const VideoCall: React.FC<VideoCallProps> = ({ onEndCall }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [petParent, setPetParent] = useState<IUser | null>(null);
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  console.log("appointmentId", appointmentId);
  const vetId = searchParams.get("vetId");
  const petParentId = searchParams.get("petParentId");
  const [appointmentDetails, setAppointmentDetails] =
    useState<IAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState<boolean | null>(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callState, setCallState] = useState<CallState>("connecting");
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [agoraLoaded, setAgoraLoaded] = useState(false);
  const [clientInitialized, setClientInitialized] = useState(false);
  const [remoteUsersState, setRemoteUsersState] = useState<{
    [uid: string]: any;
  }>({});
  const [isVirtualBackgroundSupported, setIsVirtualBackgroundSupported] =
    useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(
    null
  );
  const [isProcessingVirtualBg, setIsProcessingVirtualBg] = useState(false);
  const [showVirtualBackground, setShowVirtualBackground] = useState(false);

  // Agora refs with types
  const client = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrack = useRef<ILocalVideoTrack | null>(null);
  const localAudioTrack = useRef<ILocalAudioTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const remoteUsers = useRef<{ [uid: string]: any }>({});
  const isJoiningRef = useRef(false);
  const isJoinedRef = useRef(false);

  // Virtual background extension/processor
  const vbExtensionRef = useRef<any>(null);
  const virtualBackgroundProcessor = useRef<any>(null);

  // Generate unique UID
  const [uid] = useState(Math.floor(Math.random() * 100000));

  // Check for existing review
  const checkExistingReview = useCallback(async (vetId: string, parentId: string) => {
    try {
      const res = await fetch(`/api/reviews/check-existing?vetId=${vetId}&parentId=${parentId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to check existing review");
      }
      const data = await res.json();
      setHasExistingReview(data.data.hasReview);
      return data.data.hasReview;
    } catch (error: any) {
      console.error("Error checking existing review:", error);
      toast.error("Failed to check existing review");
      return false;
    }
  }, []);

  // Check if virtual background is supported using the extension API
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;
        const { default: VirtualBackgroundExtension } = await import(
          "agora-extension-virtual-background"
        );
        const ext = new VirtualBackgroundExtension();
        const supported = ext.checkCompatibility();
        setIsVirtualBackgroundSupported(!!supported);
      } catch (e) {
        setIsVirtualBackgroundSupported(false);
      }
    })();
  }, []);

  // Load AgoraRTC (flag)
  useEffect(() => {
    try {
      AgoraRTC.setLogLevel(1);
      setAgoraLoaded(true);
    } catch (error) {
      console.error("Failed to load AgoraRTC:", error);
      setErrorMessage("Failed to load video call library.");
      setCallState("failed");
    }
  }, []);

  // Initialize Agora client
  useEffect(() => {
    if (agoraLoaded && !client.current) {
      try {
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setClientInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Agora client:", error);
        setErrorMessage("Failed to initialize video call client.");
        setCallState("failed");
      }
    }
  }, [agoraLoaded]);

  // Fetch token
  const fetchToken = useCallback(
    async (channelName: string, id: number, isPublisher: boolean) => {
      try {
        const res = await fetch(
          `/api/agora-token?channelName=${channelName}&uid=${id}&isPublisher=${isPublisher}`
        );
        if (!res.ok)
          throw new Error(`Token fetch failed with status: ${res.status}`);
        const data = await res.json();
        if (!data.token) throw new Error("No token received from server");
        return data.token as string;
      } catch (error) {
        console.error("Error fetching token:", error);
        setErrorMessage("Failed to authenticate. Please try again.");
        setCallState("failed");
        return null;
      }
    },
    []
  );

  // Apply virtual background using the extension API
  const applyVirtualBackground = useCallback(
    async (backgroundType: string | null) => {
      if (!localVideoTrack.current) return;
      setIsProcessingVirtualBg(true);
      setSelectedBackground(backgroundType);
      try {
        // Initialize extension once
        if (!vbExtensionRef.current) {
          const { default: VirtualBackgroundExtension } = await import(
            "agora-extension-virtual-background"
          );
          const ext = new VirtualBackgroundExtension();
          if (!ext.checkCompatibility()) {
            setIsProcessingVirtualBg(false);
            return;
          }
          AgoraRTC.registerExtensions([ext]);
          vbExtensionRef.current = ext;
        }
        // Remove existing processor if any
        if (virtualBackgroundProcessor.current) {
          try {
            await virtualBackgroundProcessor.current.disable();
          } catch {}
          try {
            (localVideoTrack.current as any).unpipe();
            virtualBackgroundProcessor.current.unpipe();
          } catch {}
          virtualBackgroundProcessor.current = null;
        }
        // None selected → exit
        if (!backgroundType || backgroundType === "none") {
          setIsProcessingVirtualBg(false);
          return;
        }
        // Create and init processor, inject into pipeline
        const processor = vbExtensionRef.current.createProcessor();
        await processor.init();
        (localVideoTrack.current as any)
          .pipe(processor)
          .pipe((localVideoTrack.current as any).processorDestination);
        // Configure options
        if (backgroundType === "blur") {
          await processor.setOptions({ type: "blur", blurDegree: 2 });
        } else {
          // Load image into HTMLImageElement
          await new Promise<void>((resolve, reject) => {
            if (typeof window === "undefined") {
              reject(new Error("Window is undefined"));
              return;
            }
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = async () => {
              try {
                await processor.setOptions({ type: "img", source: img });
                resolve();
              } catch (e) {
                reject(e);
              }
            };
            img.onerror = () =>
              reject(new Error("Failed to load background image"));
            img.src = backgroundType;
          });
        }
        await processor.enable();
        virtualBackgroundProcessor.current = processor;
      } catch (error) {
        console.error("Failed to apply virtual background:", error);
        setErrorMessage(
          "Failed to apply virtual background. Please try again."
        );
      } finally {
        setIsProcessingVirtualBg(false);
      }
    },
    []
  );

  // Join call function with guards to avoid double-join
  const joinCall = useCallback(async () => {
    if (isJoiningRef.current || isJoinedRef.current) return;
    if (!client.current || !clientInitialized) return;
    const state = (client.current as any).connectionState as string | undefined;
    if (state && state !== "DISCONNECTED") return;
    isJoiningRef.current = true;
    try {
      if (!APP_ID) throw new Error("Missing Agora App ID");
      setCallState("connecting");
      setErrorMessage(null);

      client.current.on("user-joined", (user: any) => {
        remoteUsers.current[user.uid] = user;
        setRemoteUsersState((prev) => ({ ...prev, [user.uid]: user }));
        setCallState("active");
      });
      client.current.on(
        "user-published",
        async (user: any, mediaType: "audio" | "video") => {
          try {
            await client.current!.subscribe(user, mediaType);
            remoteUsers.current[user.uid] = user;
            setRemoteUsersState((prev) => ({ ...prev, [user.uid]: user }));
            if (mediaType === "video" && remoteVideoRef.current)
              user.videoTrack?.play(remoteVideoRef.current);
            if (mediaType === "audio") user.audioTrack?.play();
          } catch (error) {
            console.error("Error in user-published:", error);
            setErrorMessage("Failed to subscribe to user stream.");
          }
        }
      );
      client.current.on("user-unpublished", (user: any, mediaType: string) => {
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
        if (Object.keys(remoteUsers.current).length <= 1)
          setCallState("waiting");
      });
      client.current.on("user-left", (user: any) => {
        delete remoteUsers.current[user.uid];
        setRemoteUsersState((prev) => {
          const next = { ...prev };
          delete next[user.uid];
          return next;
        });
        if (Object.keys(remoteUsers.current).length === 0)
          setCallState("waiting");
      });

      // Create and publish local tracks
      if (IS_PUBLISHER) {
        try {
          localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
          localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();
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
          } catch (error) {
            console.error("Error playing local video:", error);
            setErrorMessage("Failed to display local video.");
          }
        }
      }

      // Join and publish
      const token = await fetchToken(CHANNEL, uid, IS_PUBLISHER);
      if (!token) throw new Error("Failed to fetch token");
      await client.current.join(APP_ID, CHANNEL, token, uid);
      isJoinedRef.current = true;
      if (IS_PUBLISHER && localVideoTrack.current && localAudioTrack.current) {
        await client.current.publish([
          localVideoTrack.current,
          localAudioTrack.current,
        ]);
      }
      setCallState("waiting");
    } catch (error: any) {
      console.error("Failed to join call:", error);
      setCallState("failed");
      setErrorMessage(
        `Failed to join call: ${error.message || "Unknown error"}`
      );
    } finally {
      isJoiningRef.current = false;
    }
  }, [clientInitialized, fetchToken, uid]);

  useEffect(() => {
    if (clientInitialized) joinCall();
  }, [clientInitialized, joinCall]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const cleanupAgora = async () => {
        try {
          if (virtualBackgroundProcessor.current && localVideoTrack.current) {
            try {
              await virtualBackgroundProcessor.current.disable();
            } catch {}
            try {
              (localVideoTrack.current as any).unpipe();
              virtualBackgroundProcessor.current.unpipe();
            } catch {}
          }
          virtualBackgroundProcessor.current = null;
          if (localVideoTrack.current) {
            localVideoTrack.current.stop();
            localVideoTrack.current.close();
            localVideoTrack.current = null;
          }
          if (localAudioTrack.current) {
            localAudioTrack.current.stop();
            localAudioTrack.current.close();
            localAudioTrack.current = null;
          }
          if (client.current) {
            await client.current.leave();
            client.current.removeAllListeners();
            client.current = null;
          }
          isJoinedRef.current = false;
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
        await (localVideoTrack.current as any).setDevice(targetDeviceId);
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
      setErrorMessage(null);
    } catch (error) {
      console.error("Error ending call:", error);
      setErrorMessage("Failed to end call.");
      setCallState("ended");
    } finally {
      // Check if review already exists before showing modal
      if (appointmentDetails?.veterinarian && appointmentDetails?.petParent) {
        const hasReview = await checkExistingReview(
          appointmentDetails.veterinarian.toString(),
          appointmentDetails.petParent.toString()
        );
        
        if (hasReview) {
          // Review already exists, redirect to home
          toast.info("You have already reviewed this veterinarian. Redirecting to home...");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          // No review exists, show the modal
          setIsOpen(true);
        }
      } else {
        // Fallback: show modal if we can't check
        setIsOpen(true);
      }
    }
  }, [
    localAudioTrack,
    setIsOpen,
    remoteUsers,
    setRemoteUsersState,
    setCallState,
    setErrorMessage,
    router,
    onEndCall,
    appointmentDetails,
  ]);



  // Fetch appointment details
  const getAppointmentDetails = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch appointment details");
      }
      const data = await res.json();
      console.log("data appointment details", data);
      setAppointmentDetails(data?.data);
      
      // Check for existing review after getting appointment details
      if (data?.data?.veterinarian && data?.data?.petParent) {
        await checkExistingReview(data.data.veterinarian.toString(), data.data.petParent.toString());
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };
  const getPetParentDetails = async () => {
    setIsLoading(true);
    try {
      const userId =
        process.env.NODE_ENV === "development"
          ? "68a7067782bef66bac0d6b27"
          : user?.id;
      console.log("user id", userId);
      if (!user?.refId) {
        throw new Error("User reference ID is missing");
      }
      const res = await fetch(`/api/user/${userId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch pet parent details");
      }
      const data = await res.json();
      setPetParent(data?.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch pet parent details");
    } finally {
      setIsLoading(false);
    }
  };
  console.log("pet parent  details", petParent);
  useEffect(() => {
    if (user) {
      getPetParentDetails();
    }
    if (appointmentId) {
      getAppointmentDetails();
    }
  }, [appointmentId, user]);
  if (isLoading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
        }}
        className="h-screen flex flex-col gap-6 items-center justify-center"
      >
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-20 h-20 border-4 border-pink-500 border-b-transparent rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Loading Video Call
          </h1>
          <p className="text-gray-300 text-sm">
            Preparing your secure connection...
          </p>
        </div>
      </div>
    );
  }
  console.log("appointmentDetails", appointmentDetails);
  if (!appointmentDetails && !isLoading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
        }}
        className="h-screen flex flex-col gap-6 items-center justify-center p-6"
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 bg-red-500 rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">
            No Appointment Found
          </h1>
          <p className="text-gray-300 text-base mb-8 leading-relaxed">
            We couldn't find the appointment details. Please check the link or
            contact support for assistance.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }
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
              <NextImage
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
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg">
                  {petParent?.profileImage && (
                    <AvatarImage src={petParent?.profileImage} />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                    {petParent?.name?.toUpperCase()?.split("").slice(0, 1) ||
                      "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              <div className="text-white">
                <div className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {petParent?.name || "Pet Parent"}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300 font-medium">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                Secure Call
              </div>
            </div>
          </div>

          {/* Main Video Area */}
          <div className="flex-1 flex items-center justify-center p-6 pt-24">
            <div className="relative flex gap-4 w-full h-full">
              {callState === "connecting" && !errorMessage && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <div className="text-white text-xl font-semibold mb-2">
                    Connecting...
                  </div>
                  <div className="text-gray-300 text-sm">
                    Establishing secure connection
                  </div>
                </div>
              )}
              {callState === "failed" && errorMessage && (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="text-red-400 text-xl font-semibold mb-2">
                    Connection Failed
                  </div>
                  <div className="text-gray-300 text-sm max-w-md">
                    {errorMessage}
                  </div>
                </div>
              )}
              {callState !== "connecting" &&
                !errorMessage &&
                Object.keys(remoteUsersState).length !== 0 && (
                  <div className="w-full h-full rounded-[2.5rem] p-2 shadow-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <div className="w-full h-full bg-gray-900 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
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
                    <div className="text-center">
                      <div className="relative mb-6">
                        <Avatar className="w-[140px] h-[140px] border-4 border-white/20 shadow-2xl">
                          <AvatarImage src={petParent?.profileImage} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold">
                            {petParent?.name
                              ?.toUpperCase()
                              ?.split("")
                              .slice(0, 1) || "MM"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse"></div>
                      </div>
                      <div className="text-white">
                        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Waiting for {petParent?.name} ...
                        </h2>
                        <p className="text-gray-300 text-base mb-4">
                          Please wait while we establish the connection
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Local Video Preview */}
          <div className="w-[180px] h-[240px] absolute top-20 right-6 z-50 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-1 shadow-2xl border border-white/10">
            <div className="w-full h-full bg-black rounded-xl overflow-hidden relative">
              <div
                ref={localVideoRef}
                className="w-full h-full flex items-center justify-center"
              >
                {!localVideoTrack.current && (
                  <div className="text-white text-sm font-medium">
                    Local Video
                  </div>
                )}
                {!isVideoEnabled && localVideoTrack.current && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <FaVideoSlash className="text-white text-3xl opacity-60 mb-2 mx-auto" />
                      <div className="text-white text-xs opacity-60">
                        Camera Off
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                You
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 shadow-2xl">
              <Button
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isAudioEnabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                }`}
              >
                {isAudioEnabled ? (
                  <FaMicrophone className="text-white text-base" />
                ) : (
                  <FaMicrophoneSlash className="text-white text-base" />
                )}
              </Button>

              <Button
                onClick={endCall}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaPhoneSlash className="text-white text-base" />
              </Button>

              <Button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isVideoEnabled
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                }`}
              >
                <FaVideoSlash className="text-white text-base" />
              </Button>

              <Button
                onClick={switchCamera}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <AiOutlineCamera className="text-white text-base" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar — Hidden below md */}
        <div className="hidden md:block w-full md:w-[30%] bg-[#4346a0]/20 backdrop-blur-sm p-3 relative rounded-2xl">
          <Button
            onClick={onEndCall}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-white hover:bg-white/10 w-6 h-6 p-0"
          >
            <FaTimes className="w-3 h-3" />
          </Button>

          {/* Patient Avatar and Info */}
          <div className="text-center mb-4 pt-4">
            <div className="relative inline-block mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                <div className="text-white text-sm">🐾</div>
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <h3 className="text-white text-sm font-semibold mb-1">
              new image 2
            </h3>
            <p className="text-gray-200 text-xs mb-1">
              Amphibian • Male Neutered • fsdaf
            </p>
            <p className="text-gray-200 text-xs mb-1">Weight: 20</p>

            <Badge className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
              Active
            </Badge>
          </div>

          {/* Reason for appointment */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-1 text-base">
              Reason for appointment
            </h4>
            <Input
              value="Nutrition"
              readOnly
              className="bg-white/20 border-white/30 text-white placeholder-gray-300 h-10 text-xs"
            />
          </div>

          {/* Veterinarian Details */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2 text-sm">
              Veterinarian Details
            </h4>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">MM</span>
                </div>
                <div className="flex-1">
                  <h5 className="text-white font-semibold text-base">
                    {petParent?.name || "Veterinarian Name"}
                  </h5>
                  <p className="text-gray-200 text-xs">America/New_York</p>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Background Section */}
          <div className="mb-4">
            <h4 className="text-white font-semibold mb-2 text-base">
              Virtual Background
            </h4>
            <p className="text-gray-300 text-xs mb-2">
              Choose a beautiful background to enhance your video call
              experience
            </p>

            {!isVirtualBackgroundSupported && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-400 text-xs font-medium">
                    Virtual background is not supported on your device/browser
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              {VIRTUAL_BACKGROUNDS.map((bg) => (
                <div
                  key={bg.id}
                  className={`group relative flex flex-col items-center cursor-pointer p-1.5 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    selectedBackground === bg.url
                      ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25"
                      : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30"
                  }`}
                  onClick={() => applyVirtualBackground(bg.url)}
                >
                  <div className="relative w-[40px] h-[40px] rounded-lg overflow-hidden mb-1 group-hover:shadow-lg transition-all duration-300">
                    <NextImage
                      src={bg.image}
                      alt={bg.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      quality={90}
                      priority={bg.id <= 3}
                    />
                    {selectedBackground === bg.url && (
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent flex items-end justify-center pb-1">
                        <div className="bg-purple-500 text-white px-1 py-0.5 rounded-full text-xs font-semibold">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium transition-colors duration-300 text-center ${
                      selectedBackground === bg.url
                        ? "text-purple-300"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {bg.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <PostCallModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        doctorId="123"
        docType="Parent"
        appointmentDetails={appointmentDetails}
      />
    </div>
  );
};

export default VideoCall;
