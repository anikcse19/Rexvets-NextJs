"use client";

import { Button } from "@/components/ui/button";
import { IAppointment } from "@/models";
import { AlertCircle, Loader, Shield, Video, User, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const VideoCallMonitor: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  
  // Get appointment ID from URL path
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const appointmentIdFromPath = pathname.split("/VideoCall/")[1]?.split("/monitor")[0];
  const appointmentId = appointmentIdFromPath || searchParams.get("appointmentId");

  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<IAppointment | null>(null);
  const [participantCount, setParticipantCount] = useState(0);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [hasRemoteAudio, setHasRemoteAudio] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);

  const router = useRouter();
  const clientRef = useRef<any>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Agora configuration
  const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || "";
  const CHANNEL_NAME = appointmentId || "";

  // Fetch appointment details
  const getAppointmentDetails = async () => {
    if (!appointmentId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/video-call/${appointmentId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch appointment details");
      }
      
      const data = await response.json();
      setAppointmentDetails(data?.data);
    } catch (error) {
      console.error("Error fetching appointment details:", error);
      toast.error("Failed to load appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Agora monitoring
  const initializeAgoraMonitor = async () => {
    if (!appointmentId || !APP_ID) {
      console.error("Missing appointment ID or Agora App ID");
      return;
    }

    console.log("Initializing Agora monitor with:", {
      appointmentId,
      APP_ID,
      CHANNEL_NAME
    });

    try {
      setIsConnecting(true);
      
      // Dynamic import of Agora RTC
      const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
      
      // Create Agora client
      const client = AgoraRTC.createClient({ 
        mode: "live", 
        codec: "vp8" 
      });
      
      clientRef.current = client;

      // Get Agora token
      const tokenResponse = await fetch("/api/agora-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelName: CHANNEL_NAME,
          uid: 0, // Use 0 for monitoring
          role: "audience", // Audience role for monitoring
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to get Agora token");
      }

      const { token } = await tokenResponse.json();
      
      if (!token) {
        throw new Error("No token received");
      }

      // Join channel
      await client.join(APP_ID, CHANNEL_NAME, token, 0);
      setIsConnected(true);
      setCallStartTime(new Date());

      // Check for existing users in the channel
      const existingUsers = client.remoteUsers;
      console.log("Existing users in channel:", existingUsers.length);
      
      const newParticipants: any[] = [];
      for (const user of existingUsers) {
        if (user.hasVideo) {
          setHasRemoteVideo(true);
          setParticipantCount(prev => prev + 1);
          newParticipants.push(user);
          
          // Subscribe to video track
          await client.subscribe(user, "video");
          
          if (user.videoTrack) {
            // Create a unique video element for this participant
            const videoElement = document.createElement("div");
            videoElement.id = `video-${user.uid}`;
            videoElement.className = "w-full h-full";
            remoteVideoRefs.current[user.uid] = videoElement;
            
            console.log("Playing existing video track for user:", user.uid);
            user.videoTrack.play(videoElement);
          }
        }
        
        if (user.hasAudio) {
          setHasRemoteAudio(true);
          await client.subscribe(user, "audio");
        }
      }
      
      setParticipants(newParticipants);

      // Set up event listeners
      client.on("user-published", async (user: any, mediaType: "video" | "audio") => {
        console.log("User published:", user.uid, mediaType);
        
        if (mediaType === "video") {
          setHasRemoteVideo(true);
          setParticipantCount(prev => prev + 1);
          
          // Subscribe to the user's video track
          await client.subscribe(user, mediaType);
          
          // Add participant to state
          setParticipants(prev => [...prev, user]);
          
          // Play the video track
          if (user.videoTrack) {
            // Create a unique video element for this participant
            const videoElement = document.createElement("div");
            videoElement.id = `video-${user.uid}`;
            videoElement.className = "w-full h-full";
            remoteVideoRefs.current[user.uid] = videoElement;
            
            console.log("Playing video track for user:", user.uid);
            user.videoTrack.play(videoElement);
          }
        }
        
        if (mediaType === "audio") {
          setHasRemoteAudio(true);
          await client.subscribe(user, mediaType);
        }
      });

      client.on("user-unpublished", (user: any, mediaType: "video" | "audio") => {
        console.log("User unpublished:", user.uid, mediaType);
        
        if (mediaType === "video") {
          setHasRemoteVideo(false);
          setParticipantCount(prev => Math.max(0, prev - 1));
          setParticipants(prev => prev.filter(p => p.uid !== user.uid));
          
          // Remove video element
          const videoElement = document.getElementById(`video-${user.uid}`);
          if (videoElement) {
            videoElement.remove();
          }
          delete remoteVideoRefs.current[user.uid];
        }
        
        if (mediaType === "audio") {
          setHasRemoteAudio(false);
        }
      });

      client.on("user-left", (user: any) => {
        console.log("User left:", user.uid);
        setParticipantCount(prev => Math.max(0, prev - 1));
        setParticipants(prev => prev.filter(p => p.uid !== user.uid));
        
        // Remove video element
        const videoElement = document.getElementById(`video-${user.uid}`);
        if (videoElement) {
          videoElement.remove();
        }
        delete remoteVideoRefs.current[user.uid];
      });

      // Start call duration timer
      durationIntervalRef.current = setInterval(() => {
        if (callStartTime) {
          const duration = Math.floor((Date.now() - callStartTime.getTime()) / 1000);
          // Update duration display if needed
        }
      }, 1000);

    } catch (error) {
      console.error("Error initializing Agora monitor:", error);
      toast.error("Failed to initialize monitoring");
    } finally {
      setIsConnecting(false);
    }
  };

  // End monitoring
  const endMonitoring = async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      setIsConnected(false);
      setParticipantCount(0);
      setHasRemoteVideo(false);
      setHasRemoteAudio(false);
      setParticipants([]);
      
      // Clean up video elements
      Object.keys(remoteVideoRefs.current).forEach(uid => {
        const videoElement = document.getElementById(`video-${uid}`);
        if (videoElement) {
          videoElement.remove();
        }
      });
      remoteVideoRefs.current = {};
      
      toast.success("Monitoring ended");
      router.push("/admin-panel/dashboard");
    } catch (error) {
      console.error("Error ending monitoring:", error);
      toast.error("Failed to end monitoring");
    }
  };

  // Load data on mount
  useEffect(() => {
    getAppointmentDetails();
  }, [appointmentId]);

  // Initialize monitoring when appointment details are loaded
  useEffect(() => {
    if (appointmentDetails && !isConnected && !isConnecting) {
      initializeAgoraMonitor();
    }
  }, [appointmentDetails]);

  // Handle video element mounting
  useEffect(() => {
    participants.forEach(participant => {
      const videoElement = document.getElementById(`video-${participant.uid}`);
      if (videoElement && participant.videoTrack) {
        participant.videoTrack.play(videoElement);
      }
    });
  }, [participants]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (clientRef.current) {
        clientRef.current.leave();
      }
      // Clean up video elements
      Object.keys(remoteVideoRefs.current).forEach(uid => {
        const videoElement = document.getElementById(`video-${uid}`);
        if (videoElement) {
          videoElement.remove();
        }
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Loading appointment details...</h2>
          <p className="text-purple-200">Please wait while we fetch the appointment information</p>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Connecting to video call...</h2>
          <p className="text-purple-200">Please wait while we establish the monitoring connection</p>
        </div>
      </div>
    );
  }

  if (!appointmentDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Appointment Not Found</h2>
          <p className="text-purple-200 mb-6">We couldn't locate the appointment details for this monitoring session</p>
          <Button onClick={() => router.push("/admin-panel/dashboard")} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Video Call Monitor</h1>
                <p className="text-purple-200">Silent monitoring session</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : isConnecting ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                <span className="text-white text-sm">
                  {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>
              <Button 
                onClick={endMonitoring}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                End Monitor
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden">
              {/* Video Display */}
              <div className="relative aspect-video bg-black">
                {participants.length > 0 ? (
                  <div className="w-full h-full flex">
                    {participants.map((participant, index) => (
                      <div 
                        key={participant.uid}
                        className={`relative bg-gray-800 ${
                          participants.length === 1 
                            ? 'w-full' 
                            : participants.length === 2 
                            ? 'w-1/2' 
                            : 'w-1/2'
                        }`}
                        style={{ minHeight: '300px' }}
                      >
                        <div 
                          id={`video-${participant.uid}`}
                          className="w-full h-full"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                          Participant {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {participantCount > 0 ? 'Video not available' : 'Waiting for participants'}
                      </h3>
                      <p className="text-purple-200">
                        {participantCount > 0 
                          ? 'Participant has joined but video is not available'
                          : 'Participants will appear here when they join the call'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Status Bar */}
              <div className="bg-black/60 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-medium">
                        {participantCount} participants
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Video className={`w-5 h-5 ${hasRemoteVideo ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`text-sm ${hasRemoteVideo ? 'text-green-400' : 'text-red-400'}`}>
                        {hasRemoteVideo ? 'Video On' : 'Video Off'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className={`w-5 h-5 ${hasRemoteAudio ? 'text-green-400' : 'text-red-400'}`} />
                      <span className={`text-sm ${hasRemoteAudio ? 'text-green-400' : 'text-red-400'}`}>
                        {hasRemoteAudio ? 'Audio On' : 'Audio Off'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Admin Monitor
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Monitoring Information */}
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                Monitoring Information
              </h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                You are silently monitoring this video call. Participants cannot see or hear you. 
                This session is recorded for quality assurance purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallMonitor;
