"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { IAppointment } from "@/models";
import {
  AlertCircle,
  Battery,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Loader,
  Mic,
  MicOff,
  PawPrint,
  Phone,
  Shield,
  Signal,
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
    // Only run on client side
    if (typeof window === "undefined") return;

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
  const { data: session } = useSession();
  console.log("session", session?.user.role);
  const userRole = session?.user.role as any;
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const vetId = searchParams.get("vetId");
  const petId = searchParams.get("petId");
  const petParentId = searchParams.get("petParentId");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [hasInitializedCamera, setHasInitializedCamera] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<any>(undefined);
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
    // Only run on client side
    if (typeof window === "undefined") return false;

    if (!appointmentDetails?.appointmentDate) return false;
    const now = moment();
    const appointmentTime = moment(appointmentDetails.appointmentDate);
    const diffInMinutes = appointmentTime.diff(now, "minutes");
    return diffInMinutes > 30;
  };

  const getAppointmentDetails = async () => {
    // Only run on client side
    if (typeof window === "undefined") return;

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
      // if (data?.data) {
      //   await Promise.all([
      //     fetchVeterinarianInfo(data.data.veterinarian),
      //     fetchPetParentInfo(data.data.petParent),
      //     fetchPetInfo(data.data.pet),
      //   ]);
      // }
    } catch (error: any) {
      setAppointmentDetails(null);
      toast.error(error.message || "Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVeterinarianInfo = async (vetId: string) => {
    // Only run on client side
    if (typeof window === "undefined") return;

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
    // Only run on client side
    if (typeof window === "undefined") return;

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
  const fetchPetInfo = async () => {
    try {
      if (!petId) {
        throw new Error("Pet ID is required");
        return;
      }
      const res = await fetch(`/api/pet?id=${petId}`);
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData?.message || "Failed to fetch pet info");
      }
      if (res.ok) {
        const data = await res.json();
        console.log("PET DATA: ", data?.data);
        setPetInfo(data?.data);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch pet info");
    }
  };
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    if (petParentId) {
      fetchPetParentInfo(petParentId);
    }
    if (vetId) {
      fetchVeterinarianInfo(vetId);
    }
    if (petId) {
      fetchPetInfo();
    }
    if (appointmentId && !appointmentDetails) {
      getAppointmentDetails();
    }
  }, [appointmentId, vetId, petId, petParentId]);
  // console.log("PET INFO:", petInfo);
  // Format appointment date using convertTimesToUserTimezone
  const formatAppointmentDateTime = () => {
    // Only run on client side
    if (typeof window === "undefined") return { date: "", time: "" };

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

  console.log("appointment details:", appointmentDetails);

  const toggleVideo = () => {
    // Only run on client side
    if (typeof window === "undefined") return;

    if (!hasInitializedCamera) {
      setHasInitializedCamera(true);
    }
    setIsVideoEnabled((prev) => !prev);
  };

  const toggleAudio = () => {
    // Only run on client side
    if (typeof window === "undefined") return;

    setIsAudioEnabled((prev) => !prev);
  };

  const handleJoinVideoCall = () => {
    // Only run on client side
    if (typeof window === "undefined") return;

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
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Preparing your video call...
          </h2>
          <p className="text-purple-200">Loading appointment details</p>
        </div>
      </div>
    );
  }

  // Show error screen only after API call completes and appointment is not found
  if (!isLoading && appointmentDetails === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            {/* Animated Error Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-red-500/40 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white text-center mb-4">
              Appointment Not Found
            </h1>

            <p className="text-white/70 text-center mb-8 leading-relaxed">
              We couldn't locate the appointment details for this link.
            </p>

            <div className="space-y-3 mb-8">
              {[
                "The appointment link has expired or is invalid",
                "The appointment may have been cancelled or rescheduled",
                "You may not have permission to access this appointment",
              ].map((reason, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></div>
                  <p className="text-white/60 text-sm">{reason}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Return to Home
              </button>

              <button
                onClick={() => router.push("/contact")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20 transition-all duration-300"
              >
                Contact Support
              </button>
            </div>

            <p className="text-white/50 text-xs text-center mt-6">
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
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative z-10 pt-8 pb-8 px-4 min-h-screen flex items-center justify-center">
          <div className="max-w-7xl w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Side - Appointment Details */}
              <div className="space-y-8">
                {/* Header Section */}
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span className="text-white/80 text-sm font-medium">
                      Video Consultation
                    </span>
                  </div>

                  <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                    {userRole === "veterinarian" ? (
                      <>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Appointment with
                        </span>
                        <br />
                        <span className="text-white">
                          {petParentInfo?.name || "Pet Parent"}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          Appointment with
                        </span>
                        <br />
                        <span className="text-white">
                          Dr. {veterinarianInfo?.name || "Veterinarian"}
                        </span>
                      </>
                    )}
                  </h1>

                  {/* {userRole === "pet_parent" &&
                    veterinarianInfo?.specialization && (
                      <p className="text-xl text-white/80 font-medium">
                        {veterinarianInfo.specialization}
                      </p>
                    )} */}
                </div>

                {/* Appointment Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Date</p>
                        <p className="text-white font-semibold">
                          {formattedDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Time</p>
                        <p className="text-white font-semibold">
                          {formattedTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="bg-gradient-to-r  items-center justify-center flex flex-col from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  {timeLeft.isExpired ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        Call Time!
                      </h3>
                      <p className="text-white/70">
                        Your appointment is ready to start
                      </p>
                    </div>
                  ) : (
                    <div className="text-center  w-full">
                      <h3 className="text-lg font-semibold text-white/90 mb-6">
                        Your appointment will start
                      </h3>
                      <div className="grid grid-cols-4 gap-4   mx-auto">
                        {timeLeft.days > 0 && (
                          <div className="text-center">
                            <div className="bg-white/10 rounded-xl p-4 mb-2">
                              <div className="text-2xl font-bold text-white">
                                {timeLeft.days.toString().padStart(2, "0")}
                              </div>
                            </div>
                            <div className="text-white/60 text-xs font-medium">
                              Days
                            </div>
                          </div>
                        )}
                        <div className="text-center">
                          <div className="bg-white/10 rounded-xl p-4 mb-2">
                            <div className="text-2xl font-bold text-white">
                              {timeLeft.hours.toString().padStart(2, "0")}
                            </div>
                          </div>
                          <div className="text-white/60 text-xs font-medium">
                            Hours
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-white/10 rounded-xl p-4 mb-2">
                            <div className="text-2xl font-bold text-white">
                              {timeLeft.minutes.toString().padStart(2, "0")}
                            </div>
                          </div>
                          <div className="text-white/60 text-xs font-medium">
                            Minutes
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-white/10 rounded-xl p-4 mb-2">
                            <div className="text-2xl font-bold text-white">
                              {timeLeft.seconds.toString().padStart(2, "0")}
                            </div>
                          </div>
                          <div className="text-white/60 text-xs font-medium">
                            Seconds
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pet Information */}
                {appointmentDetails?.pet &&
                  typeof appointmentDetails.pet === "object" && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center">
                          <PawPrint className="w-5 h-5 text-pink-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          Pet Information
                        </h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Name</span>
                          <span className="text-white font-medium">
                            {appointmentDetails?.pet?.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Gender</span>
                          <span className="text-white font-medium">
                            {appointmentDetails?.pet?.gender}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70">Species </span>
                          <span className="text-white font-medium">
                            {appointmentDetails?.pet?.species}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70"> Breed</span>
                          <span className="text-white font-medium">
                            {appointmentDetails?.pet?.breed}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/70"> Weight</span>
                          <span className="text-white font-medium">
                            {appointmentDetails?.pet?.weight}
                          </span>
                        </div>
                        {appointmentDetails?.concerns &&
                          appointmentDetails.concerns.length > 0 && (
                            <div className="pt-3 border-t border-white/10">
                              <span className="text-white/70 text-sm">
                                Reason for visit:
                              </span>
                              <p className="text-white font-medium mt-1">
                                {appointmentDetails.concerns.join(", ")}
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                {/* Join Button */}

                {/* Info Text */}
                <div className="flex items-center justify-center space-x-2 text-white/60 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>You can join using your phone or computer</span>
                </div>
              </div>

              {/* Right Side - Camera Preview */}
              <div className="relative">
                <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                  {!hasInitializedCamera ? (
                    <div className="aspect-video w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
                        <Video className="w-10 h-10 text-white/50" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-4">
                        Camera Preview
                      </h3>
                      <p className="text-white/60 text-center mb-6 max-w-xs">
                        Test your camera and microphone before joining the call
                      </p>
                      <button
                        onClick={toggleVideo}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                      >
                        Turn on Camera
                      </button>
                    </div>
                  ) : (
                    <div className="relative aspect-video w-full">
                      {isVideoEnabled && (
                        <Webcam
                          ref={webcamRef}
                          audio={isAudioEnabled}
                          mirrored
                          className="w-full h-full object-cover"
                        />
                      )}

                      {!isVideoEnabled && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                            <Video className="w-8 h-8 text-white/40" />
                          </div>
                          <p className="text-white text-lg font-medium">
                            Camera is off
                          </p>
                        </div>
                      )}

                      {/* Camera Controls */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                        <button
                          onClick={toggleAudio}
                          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border-2 ${
                            isAudioEnabled
                              ? "bg-white/20 border-white/30 hover:bg-white/30"
                              : "bg-red-500/80 border-red-400/50 hover:bg-red-600/80"
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
                              : "bg-red-500/80 border-red-400/50 hover:bg-red-600/80"
                          }`}
                        >
                          {isVideoEnabled ? (
                            <Video className="w-6 h-6 text-white" />
                          ) : (
                            <VideoOff className="w-6 h-6 text-white" />
                          )}
                        </button>
                      </div>

                      {/* Status Indicators */}
                      <div className="absolute top-4 left-4 flex space-x-2">
                        <div className="bg-green-500/80 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-xs font-medium">
                            Live
                          </span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className="text-white text-xs font-medium">
                            HD
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleJoinVideoCall}
                  className="w-full bg-transparent mt-1 border border-gray-300  text-white font-bold py-6 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Video className="w-6 h-6" />
                    <span>JOIN VIDEO CALL</span>
                  </div>
                </button>
                {/* Camera Tips */}
                <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-2 flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span>Privacy & Security</span>
                  </h4>
                  <p className="text-white/60 text-sm">
                    Your video call is encrypted and secure. Only authorized
                    participants can join.
                  </p>
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
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Video Call Access Guidelines
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  Please review the following guidelines before joining your
                  video call
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* When you can join section */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                When You Can Join the Video Call
              </h3>
              <div className="space-y-2 text-blue-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>5 minutes before your appointment:</strong> You can
                    join the waiting room
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>At your scheduled time:</strong> The veterinarian
                    will join and the call will begin
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Up to 15 minutes late:</strong> You can still join
                    if you're running late
                  </span>
                </div>
              </div>
            </div>

            {/* Current status */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Current Status
              </h3>
              <div className="flex items-center gap-2 text-gray-700">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>
                  Your appointment is in{" "}
                  <strong>
                    {timeLeft.hours}h {timeLeft.minutes}m
                  </strong>
                  . You can join the video call in{" "}
                  <strong>{Math.max(0, timeLeft.minutes - 5)} minutes</strong>.
                </span>
              </div>
            </div>

            {/* Preparation tips */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">
                While You Wait - Preparation Tips
              </h3>
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
                  <span>
                    Prepare any questions you have for the veterinarian
                  </span>
                </div>
              </div>
            </div>

            {/* Reminder notification */}
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">Reminder</h3>
              <p className="text-purple-800">
                You'll receive a notification when it's time to join your video
                call. You can also return to this page 5 minutes before your
                appointment time.
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
                // Optionally redirect to home or dashboard
                router.push("/");
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCallPreview;
