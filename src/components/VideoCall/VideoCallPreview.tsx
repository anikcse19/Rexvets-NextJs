"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useVideoCallContext } from "@/hooks/VideoCallContext";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { IAppointment } from "@/models";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Loader,
  Mic,
  MicOff,
  Palette,
  PawPrint,
  Phone,
  Shield,
  User,
  Video,
  VideoOff,
  Wifi,
  X,
} from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import VirtualBackgroundSelector from "./VirtualBackgroundSelector";

// Custom hook for countdown timer
const useCountdownTimer = (targetDate: string | null) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    if (!targetDate) return;

    const updateTimer = () => {
      const now = moment();
      const target = moment(targetDate);
      const diff = target.diff(now);

      if (diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const duration = moment.duration(diff);
      setTimeLeft({
        days: Math.floor(duration.asDays()),
        hours: duration.hours(),
        minutes: duration.minutes(),
        seconds: duration.seconds(),
        isExpired: false,
      });
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const VideoCallPreview: React.FC = () => {
  const {data:session}=useSession()
  console.log("session",session?.user)
  const userRole=session?.user.role as any
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const vetId = searchParams.get("vetId");
  const petId = searchParams.get("petId");
  const petParentId = searchParams.get("petParentId");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { videoCallState, setVideoEnabled, setAudioEnabled, setHasInitializedCamera, setSelectedBackground, setVirtualBackgroundSupported } = useVideoCallContext();
  const { isVideoEnabled, isAudioEnabled, hasInitializedCamera, selectedBackground, isVirtualBackgroundSupported } = videoCallState;
  const [showVirtualBackgroundSelector, setShowVirtualBackgroundSelector] = useState(false);
  const [appointmentDetails, setAppointmentDetails] =
    useState<IAppointment | null>(null);
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [veterinarianInfo, setVeterinarianInfo] = useState<any>(null);
  const [petParentInfo, setPetParentInfo] = useState<any>(null);
  const [petInfo, setPetInfo] = useState<any>(null);
  const webcamRef = useRef<Webcam>(null);

  // Use countdown timer hook
  const timeLeft = useCountdownTimer(
    appointmentDetails?.appointmentDate?.toString() || null
  );

  // Check if appointment is more than 30 minutes away
  const isMoreThan30MinutesAway = () => {
    if (!appointmentDetails?.appointmentDate) return false;
    const now = moment();
    const appointmentTime = moment(appointmentDetails.appointmentDate);
    const diffInMinutes = appointmentTime.diff(now, "minutes");
    return diffInMinutes > 30;
  };

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

      // Fetch veterinarian, pet parent, and pet information
      if (data?.data) {
        await Promise.all([
          fetchVeterinarianInfo(data.data.veterinarian),
          fetchPetParentInfo(data.data.petParent),
          fetchPetInfo(data.data.pet),
        ]);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVeterinarianInfo = async (vetId: string) => {
    try {
      const res = await fetch(`/api/veterinarian/${vetId}`);
      if (res.ok) {
        const data = await res.json();
        setVeterinarianInfo(data?.data?.veterinarian);
      }
    } catch (error) {
      console.error("Failed to fetch veterinarian info:", error);
    }
  };

  const fetchPetParentInfo = async (parentId: string) => {
    try {
      const res = await fetch(`/api/pet-parent?id=${parentId}`);
      if (res.ok) {
        const data = await res.json();
        setPetParentInfo(data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch pet parent info:", error);
    }
  };

  const fetchPetInfo = async (petId: string) => {
    try {
      const res = await fetch(`/api/pet/${petId}`);
      if (res.ok) {
        const data = await res.json();
        setPetInfo(data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch pet info:", error);
    }
  };

  useEffect(() => {
    if (appointmentId && !appointmentDetails) {
      getAppointmentDetails();
    }
  }, [appointmentId]);

  // Check virtual background support
  useEffect(() => {
    const checkVirtualBackgroundSupport = async () => {
      try {
        if (typeof window !== 'undefined') {
          // Check if the browser supports the necessary APIs for virtual background
          const hasWebGL = !!window.WebGLRenderingContext;
          const hasCanvas = !!window.HTMLCanvasElement;
          const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
          
          setVirtualBackgroundSupported(hasWebGL && hasCanvas && hasGetUserMedia);
        }
      } catch (error) {
        console.warn('Virtual background not supported:', error);
        setVirtualBackgroundSupported(false);
      }
    };

    checkVirtualBackgroundSupport();
  }, [setVirtualBackgroundSupported]);

  // Format appointment date using convertTimesToUserTimezone
  const formatAppointmentDateTime = () => {
    if (!appointmentDetails?.appointmentDate) return { date: "", time: "" };

    const appointmentDate = moment(appointmentDetails.appointmentDate);
    const dateStr = appointmentDate.format("YYYY-MM-DD");
    const timeStr = appointmentDate.format("HH:mm");

    try {
      const { formattedDate, formattedStartTime } = convertTimesToUserTimezone(
        timeStr,
        timeStr, // Using same time for start and end since we only need the start time
        dateStr,
        "UTC" // Assuming appointmentDate is stored in UTC
      );

      return {
        date: moment(formattedDate).format("dddd, MMMM DD, YYYY"),
        time: formattedStartTime,
      };
    } catch (error) {
      // Fallback to direct formatting if timezone conversion fails
      return {
        date: appointmentDate.format("dddd, MMMM DD, YYYY"),
        time: appointmentDate.format("h:mm A"),
      };
    }
  };

  const { date: formattedDate, time: formattedTime } =
    formatAppointmentDateTime();

  console.log("appointment details:", appointmentDetails?.appointmentDate);

  const toggleVideo = () => {
    if (!hasInitializedCamera) {
      setHasInitializedCamera(true);
    }
    setVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    setAudioEnabled(!isAudioEnabled);
  };

  const handleJoinVideoCall = () => {
    // if (isMoreThan30MinutesAway()) {
    //   setShowEarlyAccessModal(true);
    // } else {
    //   router.push(
    //     `/join-video-call?appointmentId=${appointmentId}&vetId=${vetId}&petId=${petId}&petParentId=${petParentId}`
    //   );
    // }
    router.push(
      `/join-video-call?appointmentId=${appointmentId}&vetId=${vetId}&petId=${petId}&petParentId=${petParentId}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '1s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Preparing your video call...
          </h2>
          <p className="text-gray-300 text-lg">Loading appointment details</p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointmentDetails && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white text-center mb-3">
              Appointment Not Found
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-center text-base leading-relaxed mb-8">
              We couldn't locate the appointment details for this link.
            </p>

            {/* Reasons List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">
                  The appointment link has expired or is invalid
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">
                  The appointment may have been cancelled or rescheduled
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-300 text-sm">
                  You may not have permission to access this appointment
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Return to Home
              </button>
              
              <button
                onClick={() => router.push("/contact")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-6 rounded-2xl border border-white/20 transition-all duration-300"
              >
                Contact Support
              </button>
            </div>

            {/* Help Text */}
            <p className="text-gray-400 text-xs text-center mt-6">
              Need help? Our support team is available 24/7 to assist you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">RexVet</h1>
              </div>
              <div className="flex items-center space-x-2 text-white/60">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Secure Connection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* Left Side - Appointment Details */}
              <div className="space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-sm font-medium">Video Consultation</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                    {userRole === "veterinarian" || userRole === "technician" || userRole === "admin" 
                      ? "Appointment with" 
                      : "Appointment with Dr."}
                  </h1>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {userRole === "veterinarian" || userRole === "technician" || userRole === "admin"
                      ? petParentInfo
                        ? petParentInfo.firstName && petParentInfo.lastName
                          ? `${petParentInfo.firstName} ${petParentInfo.lastName}`
                          : petParentInfo.name || "Pet Parent"
                        : "Loading..."
                      : veterinarianInfo
                      ? veterinarianInfo.firstName && veterinarianInfo.lastName
                        ? `${veterinarianInfo.firstName} ${veterinarianInfo.lastName}`
                        : veterinarianInfo.name || "Veterinarian"
                      : "Loading..."}
                  </h2>
                  
                  {userRole==='veterinarian' && veterinarianInfo?.specialization && (
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="text-xl font-medium text-white/80">
                        {veterinarianInfo.specialization}
                      </span>
                    </div>
                  )}
                </div>

                {/* Appointment Time */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Appointment Details</h3>
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-white/60 text-sm">Date</p>
                      <p className="text-white font-medium">{formattedDate}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/60 text-sm">Time</p>
                      <p className="text-white font-medium">{formattedTime}</p>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 relative overflow-hidden">
                  {/* Animated background elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
                  
                  {timeLeft.isExpired ? (
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
                        <CheckCircle className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Call Time!
                      </h3>
                      <p className="text-white/80 text-lg">Your appointment is ready to start</p>
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center relative z-10">
                      <h3 className="text-xl font-semibold text-white mb-6">Time until your appointment</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {timeLeft.days > 0 && (
                          <div className="text-center group">
                            <div className="text-3xl font-bold text-white bg-gradient-to-br from-white/20 to-white/10 rounded-2xl py-4 border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/30">
                              {timeLeft.days.toString().padStart(2, "0")}
                            </div>
                            <div className="text-white/70 text-sm mt-3 font-medium">Days</div>
                          </div>
                        )}
                        <div className="text-center group">
                          <div className="text-3xl font-bold text-white bg-gradient-to-br from-white/20 to-white/10 rounded-2xl py-4 border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/30">
                            {timeLeft.hours.toString().padStart(2, "0")}
                          </div>
                          <div className="text-white/70 text-sm mt-3 font-medium">Hours</div>
                        </div>
                        <div className="text-center group">
                          <div className="text-3xl font-bold text-white bg-gradient-to-br from-white/20 to-white/10 rounded-2xl py-4 border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/30">
                            {timeLeft.minutes.toString().padStart(2, "0")}
                          </div>
                          <div className="text-white/70 text-sm mt-3 font-medium">Minutes</div>
                        </div>
                        <div className="text-center group">
                          <div className="text-3xl font-bold text-white bg-gradient-to-br from-white/20 to-white/10 rounded-2xl py-4 border border-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/30">
                            {timeLeft.seconds.toString().padStart(2, "0")}
                          </div>
                          <div className="text-white/70 text-sm mt-3 font-medium">Seconds</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pet Information */}
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <PawPrint className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Pet Information</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Name</span>
                      <span className="text-white font-medium">
                        {petInfo ? petInfo.name || "Pet" : "Loading..."}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Species</span>
                      <span className="text-white font-medium">
                        {petInfo?.species || "Loading..."}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60">Breed</span>
                      <span className="text-white font-medium">
                        {petInfo?.breed || "Loading..."}
                      </span>
                    </div>
                    {appointmentDetails?.concerns && appointmentDetails.concerns.length > 0 && (
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-white/60 text-sm">Reason for visit:</span>
                        <p className="text-white font-medium mt-1">
                          {appointmentDetails.concerns.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={handleJoinVideoCall}
                  className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl text-lg relative overflow-hidden group"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span>Join Video Call</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </button>

                {/* Info Text */}
                <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Secure, encrypted video consultation</span>
                </div>
              </div>

              {/* Right Side - Camera Preview */}
              <div className="relative">
                <div className="bg-black/20 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  {!hasInitializedCamera ? (
                    <div className="aspect-video flex flex-col items-center justify-center p-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
                        <Video className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Camera Preview</h3>
                      <p className="text-white/60 text-center mb-6">
                        Test your camera and microphone before joining the call
                      </p>
                      <button
                        onClick={toggleVideo}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Turn on Camera
                      </button>
                    </div>
                  ) : (
                    <div className="relative aspect-video">
                      {isVideoEnabled && (
                        <Webcam
                          ref={webcamRef}
                          audio={isAudioEnabled}
                          mirrored
                          className="w-full h-full object-cover"
                        />
                      )}

                      {!isVideoEnabled && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                            <VideoOff className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-white text-lg font-medium">Camera is off</p>
                        </div>
                      )}

                      {/* Camera Controls */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                        <button
                          onClick={toggleAudio}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border-2 ${
                            isAudioEnabled
                              ? "bg-white/20 border-white/30 hover:bg-white/30"
                              : "bg-red-500/80 border-red-400 hover:bg-red-600/80"
                          }`}
                        >
                          {isAudioEnabled ? (
                            <Mic className="w-6 h-6 text-white" />
                          ) : (
                            <MicOff className="w-6 h-6 text-white" />
                          )}
                        </button>

                        <button
                          onClick={toggleVideo}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border-2 ${
                            isVideoEnabled
                              ? "bg-white/20 border-white/30 hover:bg-white/30"
                              : "bg-red-500/80 border-red-400 hover:bg-red-600/80"
                          }`}
                        >
                          {isVideoEnabled ? (
                            <Video className="w-6 h-6 text-white" />
                          ) : (
                            <VideoOff className="w-6 h-6 text-white" />
                          )}
                        </button>

                        <button
                          onClick={() => setShowVirtualBackgroundSelector(true)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border-2 ${
                            selectedBackground && selectedBackground !== 'none'
                              ? "bg-purple-500/80 border-purple-400 hover:bg-purple-600/80"
                              : "bg-white/20 border-white/30 hover:bg-white/30"
                          }`}
                        >
                          <Palette className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Status Indicators */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <div className="flex items-center space-x-1 bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-white text-xs font-medium">Live</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-blue-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <Wifi className="w-3 h-3 text-white" />
                          <span className="text-white text-xs font-medium">HD</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Status */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                    <div className={`w-3 h-3 rounded-full ${isVideoEnabled ? 'bg-green-400' : 'bg-blue-400'} animate-pulse`}></div>
                    <span className="text-white/90 text-sm font-medium">
                      {isVideoEnabled ? "Camera Active" : "Camera Ready"}
                    </span>
                    {isVideoEnabled && (
                      <div className="flex items-center space-x-1">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Early Access Modal */}
      <Dialog
        open={showEarlyAccessModal}
        onOpenChange={setShowEarlyAccessModal}
      >
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col bg-white/95 backdrop-blur-xl border border-white/20">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Video Call Access Guidelines
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Please review the following guidelines before joining your video call
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* When you can join section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                When You Can Join the Video Call
              </h3>
              <div className="space-y-2 text-blue-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>5 minutes before your appointment:</strong> You can join the waiting room
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>At your scheduled time:</strong> The veterinarian will join and the call will begin
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Up to 15 minutes late:</strong> You can still join if you're running late
                  </span>
                </div>
              </div>
            </div>

            {/* Current status */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Current Status</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>
                  Your appointment is in{" "}
                  <strong>{timeLeft.hours}h {timeLeft.minutes}m</strong>. You can join the video call in{" "}
                  <strong>{Math.max(0, timeLeft.minutes - 5)} minutes</strong>.
                </span>
              </div>
            </div>

            {/* Preparation tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">While You Wait - Preparation Tips</h3>
              <div className="space-y-2 text-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ensure your pet is in a quiet, well-lit area</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Test your camera and microphone</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Have your pet's medical history ready if needed</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prepare any questions you have for the veterinarian</span>
                </div>
              </div>
            </div>

            {/* Reminder notification */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Reminder</h3>
              <p className="text-purple-800">
                You'll receive a notification when it's time to join your video call. You can also return to this page 5 minutes before your appointment time.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowEarlyAccessModal(false)}
              className="border-gray-300 hover:bg-gray-50"
            >
              Got it, I'll wait
            </Button>
            <Button
              onClick={() => {
                setShowEarlyAccessModal(false);
                router.push("/");
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Go to Home
            </Button>
          </div>
                 </DialogContent>
       </Dialog>

       {/* Virtual Background Selector */}
       <VirtualBackgroundSelector
         selectedBackground={selectedBackground}
         onBackgroundChange={setSelectedBackground}
         isOpen={showVirtualBackgroundSelector}
         onClose={() => setShowVirtualBackgroundSelector(false)}
       />
     </>
   );
 };

export default VideoCallPreview;
