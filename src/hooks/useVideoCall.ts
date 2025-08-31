"use client";
import config from "@/config/env.config";
import { IAppointment, IUser, IVeterinarian } from "@/models";
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  ILocalVideoTrack,
} from "agora-rtc-sdk-ng";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type CallState = "connecting" | "waiting" | "active" | "ended" | "failed";

const APP_ID = config.AGORA_PUBLIC_ID;
const CHANNEL = "testChannel";
const IS_PUBLISHER = true;

export const useVideoCall = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const searchParams = useSearchParams();

  // State
  const [petParent, setPetParent] = useState<IUser | null>(null);
  const [veterinarian, setVeterinarian] = useState<IVeterinarian | null>(null);
  const [profileInfo, setProfileInfo] = useState<IUser | null>(null);
  const [appointmentDetails, setAppointmentDetails] =
    useState<IAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState<boolean | null>(
    null
  );
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

  // Helper function to clean up virtual background processor
  const cleanupVirtualBackgroundProcessor = useCallback(async () => {
    if (virtualBackgroundProcessor.current && localVideoTrack.current) {
      try {
        // First disable the processor
        await virtualBackgroundProcessor.current.disable();
      } catch (error) {
        console.warn("Error disabling virtual background processor:", error);
      }

      try {
        // Unpipe the processor from the video track
        virtualBackgroundProcessor.current.unpipe();
      } catch (error) {
        console.warn("Error unpiping virtual background processor:", error);
      }

      try {
        // Unpipe the video track from the processor
        (localVideoTrack.current as any).unpipe();
      } catch (error) {
        console.warn("Error unpiping video track:", error);
      }

      try {
        // Unpipe the processor destination if it exists
        if ((localVideoTrack.current as any).processorDestination) {
          (localVideoTrack.current as any).processorDestination.unpipe();
        }
      } catch (error) {
        console.warn("Error unpiping processor destination:", error);
      }
    }
    virtualBackgroundProcessor.current = null;
  }, []);

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
  const isInitializedRef = useRef(false);

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
  const fetchVetInfo = async () => {
    try {
      if (!vetId) {
        return;
      }
      const res = await fetch(`/api/veterinarian/${vetId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch veterinarian info");
      }
      const data = await res.json();
      setVeterinarian(data.data);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch veterinarian info");
      console.error("Error fetching veterinarian info:", error);
    }
  };
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
        const vet_id =
          typeof data.data.veterinarian === "object"
            ? data.data.veterinarian?._id
            : data.data.veterinarian;
        const parent_id =
          typeof data.data.petParent === "object"
            ? data.data.petParent?._id
            : data.data.petParent;
        console.log("VET ID FORMAT", vet_id, parent_id);
        await checkExistingReview(vet_id, parent_id);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };
  // fetch my profile
  const fetchMyProfile = async () => {
    try {
      if (!user?.id) {
        return;
      }
      const res = await fetch(`/api/user/profile`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch my profile");
      }
      const data = await res.json();
      setProfileInfo(data.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch my profile");
      console.error("Error fetching my profile:", error);
    }
  };

  // Fetch pet parent details
  const getPetParentDetails = async () => {
    try {
      if (!petParentId) {
        return;
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
      if (!localVideoTrack.current) {
        console.warn("No local video track available for virtual background");
        return;
      }

      // Check if video track is enabled
      if (!localVideoTrack.current.enabled) {
        console.warn(
          "Video track is disabled, cannot apply virtual background"
        );
        return;
      }
      setIsProcessingVirtualBg(true);
      setSelectedBackground(backgroundType);
      try {
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
        // Clean up any existing virtual background processor
        await cleanupVirtualBackgroundProcessor();

        // Small delay to ensure cleanup is complete
        await new Promise((resolve) => setTimeout(resolve, 50));

        if (!backgroundType || backgroundType === "none") {
          setIsProcessingVirtualBg(false);
          return;
        }
        const processor = vbExtensionRef.current.createProcessor();
        await processor.init();

        // Ensure clean piping by unpiping any existing connections first
        try {
          // Unpipe the video track from any existing processors
          (localVideoTrack.current as any).unpipe();
        } catch (error) {
          console.warn(
            "Error unpiping video track before new processor:",
            error
          );
        }

        try {
          // Unpipe the processor destination if it exists
          if ((localVideoTrack.current as any).processorDestination) {
            (localVideoTrack.current as any).processorDestination.unpipe();
          }
        } catch (error) {
          console.warn(
            "Error unpiping processor destination before new processor:",
            error
          );
        }

        // Create the new pipe chain
        try {
          // First pipe the video track to the processor
          (localVideoTrack.current as any).pipe(processor);

          // Then pipe the processor to the destination
          if ((localVideoTrack.current as any).processorDestination) {
            processor.pipe(
              (localVideoTrack.current as any).processorDestination
            );
          } else {
            console.warn(
              "No processor destination found, virtual background may not work properly"
            );
          }
        } catch (pipeError) {
          console.error("Error creating pipe chain:", pipeError);
          // If piping fails, try to clean up and throw error
          await cleanupVirtualBackgroundProcessor();
          throw new Error(
            "Failed to set up virtual background processing pipeline"
          );
        }

        // Small delay to ensure pipe chain is established
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (backgroundType === "blur") {
          await processor.setOptions({ type: "blur", blurDegree: 2 });
        } else if (backgroundType.startsWith("linear-gradient")) {
          // Handle color gradients by creating a canvas with the gradient
          await new Promise<void>((resolve, reject) => {
            if (typeof window === "undefined") {
              reject(new Error("Window is undefined"));
              return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = 1920;
            canvas.height = 1080;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            // Create gradient
            const gradient = ctx.createLinearGradient(
              0,
              0,
              canvas.width,
              canvas.height
            );

            // Parse the linear-gradient string
            const gradientMatch = backgroundType.match(
              /linear-gradient\(([^)]+)\)/
            );
            if (!gradientMatch) {
              reject(new Error("Invalid gradient format"));
              return;
            }

            const gradientStr = gradientMatch[1];
            console.log("Original gradient string:", gradientStr);

            // Remove the angle/direction part (e.g., "135deg") and split by commas
            const colorStopsStr = gradientStr.replace(/^\d+deg\s*/, "");
            console.log("Color stops string:", colorStopsStr);
            const colorStops = colorStopsStr.split(",").map((s) => s.trim());
            console.log("Parsed color stops:", colorStops);

            // Extract colors and positions
            const colors = [];
            for (let i = 0; i < colorStops.length; i++) {
              const stop = colorStops[i];
              if (stop.includes("%")) {
                // Handle color stops with percentages like "#667eea 0%"
                const parts = stop.split(/\s+/);
                if (parts.length >= 2) {
                  const color = parts[0];
                  const position = parseFloat(parts[1]) / 100;
                  colors.push({ color, position });
                } else {
                  colors.push({
                    color: stop,
                    position: i / (colorStops.length - 1),
                  });
                }
              } else {
                // Handle color stops without percentages
                colors.push({
                  color: stop,
                  position: i / (colorStops.length - 1),
                });
              }
            }

            // Add gradient stops
            colors.forEach(({ color, position }) => {
              console.log(
                `Adding gradient stop: color=${color}, position=${position}`
              );
              // Validate color format
              if (!color || typeof color !== "string") {
                throw new Error(`Invalid color: ${color}`);
              }
              // Ensure position is between 0 and 1
              const validPosition = Math.max(0, Math.min(1, position));
              gradient.addColorStop(validPosition, color);
            });

            // Fill canvas with gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Convert canvas to image
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error("Failed to create gradient image"));
                return;
              }

              const img = new window.Image();
              img.onload = async () => {
                try {
                  await processor.setOptions({ type: "img", source: img });
                  resolve();
                } catch (e) {
                  reject(e);
                }
              };
              img.onerror = () =>
                reject(new Error("Failed to load gradient image"));
              img.src = URL.createObjectURL(blob);
            }, "image/png");
          });
        } else {
          // Handle regular image backgrounds
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
            img.onerror = () => {
              console.error("Failed to load image:", backgroundType);
              reject(new Error("Failed to load background image"));
            };

            // Handle both absolute URLs and relative paths
            let imageUrl = backgroundType;
            if (backgroundType.startsWith("/")) {
              // Convert relative path to absolute URL
              imageUrl = window.location.origin + backgroundType;
            }

            console.log("Loading background image:", imageUrl);
            img.src = imageUrl;
          });
        }
        await processor.enable();
        virtualBackgroundProcessor.current = processor;

        // Show success message
        if (backgroundType === "blur") {
          toast.success("Blur background applied successfully");
        } else if (backgroundType.startsWith("linear-gradient")) {
          toast.success("Gradient background applied successfully");
        } else if (backgroundType === "none") {
          toast.success("Background removed successfully");
        } else {
          toast.success("Image background applied successfully");
        }
      } catch (error) {
        console.error("Failed to apply virtual background:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

        if (errorMessage.includes("Failed to load background image")) {
          setErrorMessage(
            "Background image could not be loaded. Please try a different background."
          );
        } else if (errorMessage.includes("Invalid gradient format")) {
          setErrorMessage(
            "Invalid background format. Please try a different background."
          );
        } else if (
          errorMessage.includes(
            "Failed to set up virtual background processing pipeline"
          )
        ) {
          setErrorMessage(
            "Failed to initialize virtual background. Please try again."
          );
        } else {
          setErrorMessage(
            "Failed to apply virtual background. Please try again."
          );
        }

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

      // Ensure local tracks are initialized
      if (!localVideoTrack.current || !localAudioTrack.current) {
        await initializeLocalVideo();
      }

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
  }, [clientInitialized, fetchToken, uid, initializeLocalVideo]);

  // Toggle audio
  const toggleAudio = useCallback(async () => {
    if (!localAudioTrack.current) return;
    try {
      const shouldMute = isAudioEnabled;
      await localAudioTrack.current.setEnabled(!shouldMute);
      setIsAudioEnabled(!shouldMute);
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

  useEffect(() => {
    if (agoraLoaded) {
      initializeLocalVideo();
    }
  }, [agoraLoaded, initializeLocalVideo]);

  useEffect(() => {
    if (clientInitialized) joinCall();
  }, [clientInitialized, joinCall]);

  useEffect(() => {
    if (user && !isInitializedRef.current) {
      getPetParentDetails();
    }
    if (user?.id && !isInitializedRef.current) {
      fetchMyProfile();
    }

    if (vetId && !isInitializedRef.current) {
      fetchVetInfo();
    }
    if (appointmentId && !isInitializedRef.current) {
      getAppointmentDetails();
      isInitializedRef.current = true;
    }
  }, [appointmentId, user, vetId, isInitializedRef]);

  useEffect(() => {
    return () => {
      const cleanupAgora = async () => {
        try {
          await cleanupVirtualBackgroundProcessor();
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
          isInitializedRef.current = false;
          remoteUsers.current = {};
          setRemoteUsersState({});
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
    selectedBackground,
    isProcessingVirtualBg,
    veterinarian,
    hasExistingReview,
    profileInfo,
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
