import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTimeToUserTimezone, getUserTimezone } from "@/lib/timezone";
import { Appointment } from "@/lib/types";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [userTimezone, setUserTimezone] = useState<string>("UTC");

  useEffect(() => {
    setUserTimezone(getUserTimezone());
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: userTimezone,
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: userTimezone,
    });
  };

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const timeString = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: userTimezone,
    });
    return formatTimeToUserTimezone(timeString, userTimezone);
  }

  const isSeenBefore = appointment?.pet?.seenBy?.includes(
    session?.user?.refId ?? ""
  );

  function getAppointmentStatus() {
    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);

    if (appointmentDate < now) {
      if (appointment.status === "completed") {
        return "completed";
      }
      return "past";
    }

    if (appointmentDate > now) {
      if (appointment.status === "completed") {
        return "completed";
      }
      return "upcoming";
    }
  }

  return (
    <div className="relative  rounded-3xl p-6 bg-white/70 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
      {/* Pet Info */}
      <div className="flex justify-between items-center">
        <Link
          href={`/dashboard/doctor/appointments/${appointment._id}`}
          className="flex-1 flex items-center gap-5 cursor-pointer"
        >
          <Avatar className="w-20 h-20 border-4 border-white shadow-md">
            <AvatarImage
              src={appointment.pet?.image}
              alt={appointment.pet?.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-800 font-bold">
              {appointment.pet?.name?.charAt(0) || "P"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {appointment.pet?.name || "Unknown Pet"}
            </h3>
            <p className="text-sm text-gray-500">
              {appointment.pet?.species || "Unknown Species"}
            </p>
          </div>
        </Link>
        {isSeenBefore && (
          <Badge className="bg-fuchsia-200 text-fuchsia-700">Seen Before</Badge>
        )}
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

      {/* Appointment Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-sm">
          <Calendar className="w-5 h-5 text-blue-600 mb-1" />
          <p className="font-semibold">
            {formatDate(appointment.appointmentDate)}
          </p>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-white shadow-sm">
          <Clock className="w-5 h-5 text-purple-600 mb-1" />
          <p className="font-semibold">
            {formatTime(appointment?.appointmentDate)}
          </p>
          <span className="text-xs text-gray-500">{userTimezone}</span>
        </div>
      </div>

      {/* Booking Time */}
      <div className="flex items-center justify-between mt-3">
        {appointment.createdAt && (
          <p className=" text-xs text-gray-500 text-center">
            Booked on {formatDateTime(appointment.createdAt)}
          </p>
        )}
        <Badge className="capitalize">{getAppointmentStatus()}</Badge>
      </div>

      {/* Owner Info */}
      <div className="flex items-center gap-3 mt-5 p-4 rounded-2xl bg-gray-50/70 shadow-sm">
        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
          <AvatarImage
            src={undefined}
            alt={appointment.petParent?.name || "Pet Parent"}
          />
          <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
            {appointment.petParent?.name
              ?.split(" ")
              .map((n: string) => n.charAt(0))
              .join("") || "PO"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">
            {appointment.petParent?.name || "Unknown Owner"}
          </p>
          <p className="text-xs text-gray-500">Pet Parent</p>
        </div>
      </div>

      {isSeenBefore && (
        <Button
          onClick={() =>
            router.push(
              `/dashboard/doctor/pet-history/${appointment?.pet?._id}`
            )
          }
          className="mt-2 bg-[#1C1B36] w-full cursor-pointer"
        >
          See Pet History
        </Button>
      )}
    </div>
  );
}
