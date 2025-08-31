"use client";
import config from "@/config/env.config";
import { IAppointment, IUser } from "@/models";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useVideoCallContext } from "./VideoCallContext";

type CallState = "connecting" | "waiting" | "active" | "ended" | "failed";

const APP_ID = config.AGORA_PUBLIC_ID;
const CHANNEL = "testChannel";
const IS_PUBLISHER = true;

export const useVideoCall = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();
  const { videoCallState, setVideoEnabled, setAudioEnabled, setSelectedBackground, setVirtualBackgroundSupported } = useVideoCallContext();

  // State
  const [petParent, setPetParent] = useState<IUser | null>(null);
  const [appointmentDetails, setAppointmentDetails] =
    useState<IAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState<boolean | null>(
    null
  );
  const [isAudioEnabled, setIsAudioEnabled] = useState(videoCallState.isAudioEnabled);
  const [isVideoEnabled, setIsVideoEnabled] = useState(videoCallState.isVideoEnabled);
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
  const [isProcessingVirtualBg, setIsProcessingVirtualBg] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Refs
  const client = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrack = useRef<ILocalVideoTrack | null>(null);
  const localAudioTrack = useRef<ILocalAudioTrack | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const remoteUsers = useRef<{ [uid: string]: any }>({});
  const isJoiningRef = useRef(false);
  const isJoinedRef = useRef(false);
  const vbExtensionRef = useRef<any>(null);
  const virtualBackgroundProcessor = useRef<any>(null);

  // Generate unique UID
  const [uid] = useState(Math.floor(Math.random() * 100000));

  // Get URL parameters
  const appointmentId = searchParams.get("appointmentId");
  const vetId = searchParams.get("vetId");
  const petParentId = searchParams.get("petParentId");

  // Check for existing review
  const checkExistingReview = useCallback(
    async (vetId: string, parentId: string) => {
      try {
        const res = await fetch(
          `/api/reviews/check-existing?vetId=${vetId}&parentId=${parentId}`
        );
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
    },
    []
  );

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
      setAppointmentDetails(data?.data);

      // Check for existing review after getting appointment details
      if (data?.data?.veterinarian && data?.data?.petParent) {
        await checkExistingReview(
          data.data.veterinarian.toString(),
          data.data.petParent.toString()
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch pet parent details
  const getPetParentDetails = async () => {
    setIsLoading(true);
    try {
      
      if (!petParentId) {
        throw new Error("Pet parent ID is missing");
      }
      const res = await fetch(`/api/pet-parent/${petParentId}`);
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

  // Apply virtual background
  const applyVirtualBackground = useCallback(
    async (backgroundType: string | null) => {
      if (!localVideoTrack.current) return;
      setIsProcessingVirtualBg(true);
      setSelectedBackground(backgroundType);
      
      // Also update the context
      setSelectedBackground(backgroundType);
      try {
        // Clean up existing processor first
        if (virtualBackgroundProcessor.current) {
          try {
            await virtualBackgroundProcessor.current.disable();
          } catch (error) {
            console.warn("Error disabling virtual background processor:", error);
          }
          try {
            // Unpipe from both directions
            (localVideoTrack.current as any).unpipe(virtualBackgroundProcessor.current);
            virtualBackgroundProcessor.current.unpipe();
          } catch (error) {
            console.warn("Error unpiping virtual background processor:", error);
          }
          virtualBackgroundProcessor.current = null;
        }

        // If no background or "none", just return
        if (!backgroundType || backgroundType === "none") {
          setIsProcessingVirtualBg(false);
          return;
        }

        // Initialize extension if not already done
        if (!vbExtensionRef.current) {
          const { default: VirtualBackgroundExtension } = await import(
            "agora-extension-virtual-background"
          );
          const ext = new VirtualBackgroundExtension();
          if (!ext.checkCompatibility()) {
            console.warn("Virtual background extension not compatible");
            setIsProcessingVirtualBg(false);
            return;
          }
          AgoraRTC.registerExtensions([ext]);
          vbExtensionRef.current = ext;
        }

        // Create new processor
        const processor = vbExtensionRef.current.createProcessor();
        await processor.init();

        // Set up the processing pipeline with error handling
        try {
          // Create a new processing pipeline
          (localVideoTrack.current as any)
            .pipe(processor)
            .pipe((localVideoTrack.current as any).processorDestination);
        } catch (pipeError: any) {
          console.warn("Pipe error, trying alternative approach:", pipeError);
          
          // Alternative approach: try to unpipe everything first
          try {
            (localVideoTrack.current as any).unpipe();
          } catch {}
          
          // Then try piping again
          (localVideoTrack.current as any)
            .pipe(processor)
            .pipe((localVideoTrack.current as any).processorDestination);
        }

        // Configure the processor based on background type
        if (backgroundType === "blur") {
          await processor.setOptions({ type: "blur", blurDegree: 2 });
        } else if (backgroundType.startsWith("linear-gradient")) {
          // Handle gradient backgrounds - use a solid color instead
          await processor.setOptions({ type: "color", color: "#000000" });
        } else {
          // Handle image backgrounds
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

        // Enable the processor
        await processor.enable();
        virtualBackgroundProcessor.current = processor;
        
        console.log("Virtual background applied successfully:", backgroundType);
      } catch (error) {
        console.error("Failed to apply virtual background:", error);
        setErrorMessage(
          "Failed to apply virtual background. Please try again."
        );
        // Reset the selected background on error
        setSelectedBackground(null);
      } finally {
        setIsProcessingVirtualBg(false);
      }
    },
    []
  );

  // Initialize local video track immediately
  const initializeLocalVideo = useCallback(async () => {
    if (!agoraLoaded || localVideoTrack.current) return;

    // Only initialize on the client side
    if (typeof window === "undefined") {
      console.log("Skipping local video initialization on server side");
      return;
    }

    try {
      console.log("Initializing local video track...");
      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();

      // Play local video immediately
      if (localVideoRef.current && localVideoTrack.current) {
        console.log("Playing local video...");
        localVideoTrack.current.play(localVideoRef.current);
      }

      console.log("Local video track initialized successfully");
    } catch (error) {
      console.error("Error initializing local video track:", error);
      setErrorMessage("Please allow camera and microphone access.");
      setCallState("failed");
    }
  }, [agoraLoaded]);

  // Effect to ensure video is played when ref becomes available
  useEffect(() => {
    if (localVideoTrack.current && localVideoRef.current) {
      try {
        localVideoTrack.current.play(localVideoRef.current);
        console.log("Local video played in effect");
      } catch (error) {
        console.error("Error playing local video in effect:", error);
      }
    }
  }, [localVideoRef.current, localVideoTrack.current]);

  // Join call
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
        console.log("User joined:", user.uid);
        remoteUsers.current[user.uid] = user;
        setRemoteUsersState((prev) => ({ ...prev, [user.uid]: user }));
        setCallState("active");
      });

      client.current.on(
        "user-published",
        async (user: any, mediaType: "audio" | "video") => {
          try {
            console.log(`User ${user.uid} published ${mediaType}`);

            // Check if user still exists before subscribing
            if (!remoteUsers.current[user.uid]) {
              console.warn(
                `User ${user.uid} not found in remoteUsers, skipping subscription`
              );
              return;
            }

            // Add retry mechanism for subscription
            let retryCount = 0;
            const maxRetries = 3;

            while (retryCount < maxRetries) {
              try {
                await client.current!.subscribe(user, mediaType);
                console.log(
                  `Successfully subscribed to ${user.uid} ${mediaType}`
                );
                break;
              } catch (subscribeError: any) {
                retryCount++;
                console.warn(
                  `Subscription attempt ${retryCount} failed for ${user.uid} ${mediaType}:`,
                  subscribeError
                );

                if (subscribeError.code === 2021) {
                  console.warn(
                    `Stream ${user.uid} no longer available, skipping subscription`
                  );
                  return; // Don't retry for stream not found errors
                }

                if (retryCount >= maxRetries) {
                  throw subscribeError;
                }

                // Wait before retrying
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * retryCount)
                );
              }
            }

            remoteUsers.current[user.uid] = user;
            setRemoteUsersState((prev) => ({ ...prev, [user.uid]: user }));

            if (mediaType === "video" && remoteVideoRef.current) {
              try {
                user.videoTrack?.play(remoteVideoRef.current);
              } catch (playError) {
                console.error("Error playing remote video:", playError);
              }
            }
            if (mediaType === "audio") {
              try {
                user.audioTrack?.play();
              } catch (playError) {
                console.error("Error playing remote audio:", playError);
              }
            }
          } catch (error: any) {
            console.error(
              `Error subscribing to user ${user.uid} ${mediaType}:`,
              error
            );
            // Don't set error message for subscription errors as they might be temporary
            // Only set error if it's a critical failure
            if (error.code === 2021) {
              console.warn(
                `Stream ${user.uid} no longer available, skipping subscription`
              );
            } else {
              setErrorMessage("Failed to subscribe to user stream.");
            }
          }
        }
      );

      client.current.on("user-unpublished", (user: any, mediaType: string) => {
        console.log(`User ${user.uid} unpublished ${mediaType}`);
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
        console.log(`User ${user.uid} left`);
        delete remoteUsers.current[user.uid];
        setRemoteUsersState((prev) => {
          const next = { ...prev };
          delete next[user.uid];
          return next;
        });
        if (Object.keys(remoteUsers.current).length === 0)
          setCallState("waiting");
      });

      // Add error handling for client events
      client.current.on("error", (error: any) => {
        console.error("Agora client error:", error);
        if (error.code === 2021) {
          console.warn(
            "Stream subscription error - stream may have been removed"
          );
        } else {
          setErrorMessage(
            `Connection error: ${error.message || "Unknown error"}`
          );
        }
      });

      // Ensure local tracks are initialized
      if (!localVideoTrack.current || !localAudioTrack.current) {
        await initializeLocalVideo();
      }

      const token = await fetchToken(CHANNEL, uid, IS_PUBLISHER);
      if (!token) throw new Error("Failed to fetch token");

      console.log("Joining channel:", CHANNEL, "with UID:", uid);
      await client.current.join(APP_ID, CHANNEL, token, uid);
      isJoinedRef.current = true;

      if (IS_PUBLISHER && localVideoTrack.current && localAudioTrack.current) {
        console.log("Publishing local tracks");
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
  }, [clientInitialized, fetchToken, uid, initializeLocalVideo]);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!localAudioTrack.current) return;
    try {
      const shouldMute = isAudioEnabled;
      await localAudioTrack.current.setEnabled(!shouldMute);
      const newState = !shouldMute;
      setIsAudioEnabled(newState);
      setAudioEnabled(newState);
    } catch (error) {
      console.error("Error toggling audio:", error);
      setErrorMessage("Failed to toggle audio.");
    }
  }, [isAudioEnabled, setAudioEnabled]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (!localVideoTrack.current) return;
    try {
      const shouldMute = isVideoEnabled;
      await localVideoTrack.current.setEnabled(!shouldMute);
      const newState = !shouldMute;
      setIsVideoEnabled(newState);
      setVideoEnabled(newState);
    } catch (error) {
      console.error("Error toggling video:", error);
      setErrorMessage("Failed to toggle video.");
    }
  }, [isVideoEnabled, setVideoEnabled]);

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
          toast.info(
            "You have already reviewed this veterinarian. Redirecting to home..."
          );
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setIsOpen(true);
        }
      } else {
        setIsOpen(true);
      }
    }
  }, [appointmentDetails, checkExistingReview, router]);

  // Effects
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // Only check virtual background support on the client side and when mounted
        if (typeof window === "undefined" || !isMounted) {
          console.log(
            "Skipping virtual background check on server side or not mounted"
          );
          return;
        }

        const { default: VirtualBackgroundExtension } = await import(
          "agora-extension-virtual-background"
        );
        const ext = new VirtualBackgroundExtension();
        const supported = ext.checkCompatibility();
        const isSupported = !!supported;
        setIsVirtualBackgroundSupported(isSupported);
        setVirtualBackgroundSupported(isSupported);
        console.log("Virtual background support checked:", isSupported);
      } catch (e) {
        console.warn("Virtual background not supported:", e);
        setIsVirtualBackgroundSupported(false);
        setVirtualBackgroundSupported(false);
      }
    })();
  }, [isMounted, setVirtualBackgroundSupported]);

  useEffect(() => {
    try {
      // Only load AgoraRTC on the client side and when mounted
      if (typeof window === "undefined" || !isMounted) {
        console.log(
          "Skipping AgoraRTC initialization on server side or not mounted"
        );
        return;
      }

      console.log("Initializing AgoraRTC...");
      AgoraRTC.setLogLevel(1);
      setAgoraLoaded(true);
      console.log("AgoraRTC initialized successfully");
    } catch (error) {
      console.error("Failed to load AgoraRTC:", error);
      setErrorMessage("Failed to load video call library.");
      setCallState("failed");
    }
  }, [isMounted]);

  useEffect(() => {
    if (agoraLoaded && !client.current && isMounted) {
      try {
        // Only create client on the client side and when mounted
        if (typeof window === "undefined") {
          console.log("Skipping client creation on server side");
          return;
        }

        console.log("Creating Agora client...");
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        setClientInitialized(true);
        console.log("Agora client created successfully");
      } catch (error) {
        console.error("Failed to initialize Agora client:", error);
        setErrorMessage("Failed to initialize video call client.");
        setCallState("failed");
      }
    }
  }, [agoraLoaded, isMounted]);

  useEffect(() => {
    if (agoraLoaded && isMounted) {
      initializeLocalVideo();
    }
  }, [agoraLoaded, initializeLocalVideo, isMounted]);

  useEffect(() => {
    if (clientInitialized && isMounted) joinCall();
  }, [clientInitialized, joinCall, isMounted]);

  useEffect(() => {
    if (user && isMounted) {
      getPetParentDetails();
    }
    if (appointmentId && isMounted) {
      getAppointmentDetails();
    }
  }, [appointmentId, user, isMounted]);

  // Sync context background changes with local virtual background
  useEffect(() => {
    if (videoCallState.selectedBackground && localVideoTrack.current) {
      applyVirtualBackground(videoCallState.selectedBackground);
    }
  }, [videoCallState.selectedBackground, applyVirtualBackground]);

  useEffect(() => {
    return () => {
      const cleanupAgora = async () => {
        try {
          console.log("Cleaning up Agora resources...");

          // Clean up virtual background processor
          if (virtualBackgroundProcessor.current && localVideoTrack.current) {
            try {
              await virtualBackgroundProcessor.current.disable();
              console.log("Virtual background processor disabled");
            } catch (error) {
              console.warn(
                "Error disabling virtual background processor:",
                error
              );
            }
            try {
              (localVideoTrack.current as any).unpipe();
              virtualBackgroundProcessor.current.unpipe();
              console.log("Virtual background processor unpiped");
            } catch (error) {
              console.warn(
                "Error unpiping virtual background processor:",
                error
              );
            }
          }
          virtualBackgroundProcessor.current = null;

          // Clean up local video track
          if (localVideoTrack.current) {
            try {
              localVideoTrack.current.stop();
              localVideoTrack.current.close();
              console.log("Local video track cleaned up");
            } catch (error) {
              console.warn("Error cleaning up local video track:", error);
            }
            localVideoTrack.current = null;
          }

          // Clean up local audio track
          if (localAudioTrack.current) {
            try {
              localAudioTrack.current.stop();
              localAudioTrack.current.close();
              console.log("Local audio track cleaned up");
            } catch (error) {
              console.warn("Error cleaning up local audio track:", error);
            }
            localAudioTrack.current = null;
          }

          // Clean up client
          if (client.current) {
            try {
              // Remove all event listeners first
              client.current.removeAllListeners();
              console.log("Client event listeners removed");

              // Leave the channel
              await client.current.leave();
              console.log("Client left channel");
            } catch (error) {
              console.warn("Error cleaning up client:", error);
            }
            client.current = null;
          }

          // Reset state
          isJoinedRef.current = false;
          remoteUsers.current = {};
          setRemoteUsersState({});
          console.log("Agora cleanup completed");
        } catch (error) {
          console.error("Error during Agora cleanup:", error);
        }
      };
      cleanupAgora();
    };
  }, []);

  return {
    // State
    petParent,
    appointmentDetails,
    isLoading,
    isOpen,
    setIsOpen,
    isAudioEnabled,
    isVideoEnabled,
    callState,
    errorMessage,
    remoteUsersState,
    isVirtualBackgroundSupported,
    selectedBackground: videoCallState.selectedBackground,
    isProcessingVirtualBg,

    // Refs
    localVideoRef,
    remoteVideoRef,
    localVideoTrack,

    // Functions
    toggleAudio,
    toggleVideo,
    endCall,
    switchCamera,
    applyVirtualBackground,
  };
};
