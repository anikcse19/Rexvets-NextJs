"use client";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { IAppointment } from "@/models";
import {
  Calendar,
  Clock,
  Loader,
  Mic,
  MicOff,
  Phone,
  Video,
  VideoOff,
} from "lucide-react";
import moment from "moment";
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
  const webcamRef = useRef<Webcam>(null);

  // Use countdown timer hook
  const timeLeft = useCountdownTimer(appointmentDetails?.appointmentDate?.toString() || null);

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
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId && !appointmentDetails) {
      getAppointmentDetails();
    }
  }, [appointmentId]);

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

  const { date: formattedDate, time: formattedTime } = formatAppointmentDateTime();

  console.log("appointment details:", appointmentDetails?.appointmentDate);
  
  const toggleVideo = () => {
    if (!hasInitializedCamera) {
      setHasInitializedCamera(true);
    }
    setIsVideoEnabled((prev) => !prev);
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => !prev);
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
      <div className="h-screen flex flex-col gap-y-3 items-center justify-center">
        <h1 className="text-xl font-semibold">No appointment found</h1>
        <p className="text-gray-600">
          We couldn't find the appointment details. Please check the link or
          contact support.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
      </div>
    );
  }

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
          <div className="flex flex-col justify-center rounded-2xl p-8 h-[450px]">
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
                          {timeLeft.days.toString().padStart(2, '0')}
                        </div>
                        <div className="text-white/60 text-xs">Days</div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-white text-2xl font-bold">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-2xl font-bold">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-white text-2xl font-bold">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </div>
                      <div className="text-white/60 text-xs">Seconds</div>
                    </div>
                  </div>
                </div>
              )}
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
              onClick={() =>
                router.push(
                  `/join-video-call?appointmentId=${appointmentId}&vetId=${vetId}&petId=${petId}&petParentId=${petParentId}`
                )
              }
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
  );
};

export default VideoCallPreview;
