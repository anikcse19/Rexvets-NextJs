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
  Calendar,
  CheckCircle,
  Clock,
  Loader,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
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
  console.log("session", session?.user);
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

  const fetchPetInfo = async (petId: string) => {
    // Only run on client side
    if (typeof window === "undefined") return;

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
    // Only run on client side
    if (typeof window === "undefined") return;
    if (petParentId) {
      alert(petParentId);
      fetchPetParentInfo(petParentId);
    }
    if (vetId) {
      fetchVeterinarianInfo(vetId);
    }
    // if (petId) {
    //   fetchPetInfo(petId);
    // }
    if (appointmentId && !appointmentDetails) {
      getAppointmentDetails();
    }
  }, [appointmentId, vetId, petId, petParentId]);

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

  console.log("appointment details:", appointmentDetails?.appointmentDate);

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
      <div className="h-screen flex gap-x-3 items-center justify-center">
        <h1> Loading...</h1>
        <Loader />
      </div>
    );
  }

  if (!appointmentDetails && !isLoading) {
    return (
      <div
        style={{
          background:
            "linear-gradient(135deg, rgb(15, 12, 41) 0%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(0, 35, 102) 100%)",
        }}
        className="min-h-screen w-full flex items-center justify-center p-4"
      >
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-3">
              Appointment Not Found
            </h1>

            {/* Description */}
            <p className="text-white/70 text-base leading-relaxed mb-8">
              We couldn't locate the appointment details for this link. This
              could be due to:
            </p>

            {/* Reasons List */}
            <div className="text-left mb-8 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/60 text-sm">
                  The appointment link has expired or is invalid
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/60 text-sm">
                  The appointment may have been cancelled or rescheduled
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-white/60 text-sm">
                  You may not have permission to access this appointment
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={() => router.push("/")}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Return to Home
              </button>

              <button
                onClick={() => router.push("/contact")}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20 transition-all duration-200"
              >
                Contact Support
              </button>
            </div>

            {/* Help Text */}
            <p className="text-white/50 text-xs mt-6">
              Need help? Our support team is available 24/7 to assist you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
            <div className="flex flex-col justify-center rounded-2xl p-8 h-[450px]">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-1">
                  {userRole === "veterinarian" ||
                  userRole === "technician" ||
                  userRole === "admin"
                    ? "Appointment with"
                    : "Appointment with Dr."}
                </h1>
                <h2 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-1">
                  {userRole === "veterinarian" ||
                  userRole === "technician" ||
                  userRole === "admin"
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
                {userRole === "veterinarian" &&
                  veterinarianInfo?.specialization && (
                    <h3 className="text-xl font-medium text-white/80 leading-tight">
                      {veterinarianInfo.specialization}
                    </h3>
                  )}
              </div>

              <div className="flex items-center space-x-8 mb-8">
                <div className="flex items-center text-white/70">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formattedDate}</span>
                </div>
                <div className="flex items-center text-white/70">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">{formattedTime}</span>
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 border border-white/20">
                {timeLeft.isExpired ? (
                  <div className="text-center">
                    <div className="text-white/90 text-lg font-semibold mb-2">
                      Call Time!
                    </div>
                    <div className="text-white/70 text-sm">
                      Your appointment is ready to start
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-white/90 text-sm mb-3">
                      Time until your appointment:
                    </div>
                    <div className="flex justify-center space-x-4">
                      {timeLeft.days > 0 && (
                        <div className="text-center">
                          <div className="text-white text-2xl font-bold">
                            {timeLeft.days.toString().padStart(2, "0")}
                          </div>
                          <div className="text-white/60 text-xs">Days</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-white text-2xl font-bold">
                          {timeLeft.hours.toString().padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs">Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white text-2xl font-bold">
                          {timeLeft.minutes.toString().padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs">Minutes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white text-2xl font-bold">
                          {timeLeft.seconds.toString().padStart(2, "0")}
                        </div>
                        <div className="text-white/60 text-xs">Seconds</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 border border-white/20">
                <div className="text-white/90 text-sm mb-2">
                  <span className="font-medium">
                    Pet:{" "}
                    {petInfo
                      ? `${petInfo.name || "Pet"} • ${
                          petInfo.gender || "Unknown"
                        }`
                      : "Loading..."}
                  </span>
                </div>
                <div className="text-white/70 text-sm">
                  <span>
                    {petInfo?.species && petInfo?.breed
                      ? `${petInfo.species} • ${petInfo.breed}`
                      : petInfo?.species || "Pet details loading..."}
                  </span>
                </div>
                {appointmentDetails?.concerns &&
                  appointmentDetails.concerns.length > 0 && (
                    <div className="text-white/70 text-sm mt-2">
                      <span>
                        Reason: {appointmentDetails.concerns.join(", ")}
                      </span>
                    </div>
                  )}
              </div>

              <button
                style={{
                  background:
                    "linear-gradient(135deg, rgb(13, 79, 60) 0%, rgb(74, 20, 140) 50%, rgb(21, 101, 192) 100%)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
                onClick={handleJoinVideoCall}
                className="w-full cursor-pointer bg-gradient-to-r text-white font-semibold py-4 px-6 rounded-xl mb-4"
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
                {!hasInitializedCamera ? (
                  <div className="h-full w-full flex flex-col items-center justify-center">
                    <Video className="w-12 h-12 mb-3 text-white/50" />
                    <p className="text-white text-lg font-medium mb-4">
                      Camera is off
                    </p>
                    <button
                      onClick={toggleVideo}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
                    >
                      Turn on camera
                    </button>
                  </div>
                ) : (
                  <div className="relative h-full w-full flex flex-col">
                    {isVideoEnabled && (
                      <Webcam
                        ref={webcamRef}
                        audio={isAudioEnabled}
                        mirrored
                        className="h-full w-full object-cover"
                      />
                    )}

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
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md bg-black/30 border border-white/20 ${
                          isAudioEnabled
                            ? "hover:bg-gray-700/80"
                            : "bg-red-500/80 hover:bg-red-600/80"
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
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md bg-black/30 border border-white/20 ${
                          isVideoEnabled
                            ? "hover:bg-gray-700/80"
                            : "bg-red-500/80 hover:bg-red-600/80"
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
            </div>
          </div>
        </div>
      </div>

      {/* Early Access Modal */}
      <Dialog
        open={showEarlyAccessModal}
        onOpenChange={setShowEarlyAccessModal}
      >
        <DialogContent className="max-w-2xl h-[70vh] flex flex-col">
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
