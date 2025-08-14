import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Timer,
  XCircle,
} from "lucide-react";
import React from "react";

interface AppointmentCardProps {
  appointment: Appointment;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Timer className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-500/20 text-green-700",
      confirmed: "bg-blue-500/20 text-blue-700",
      pending: "bg-yellow-500/20 text-yellow-700",
      cancelled: "bg-red-500/20 text-red-700",
    };
    return colors[status] || "bg-gray-500/20 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="relative  rounded-3xl p-6 bg-white/70 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20">
      {/* Floating Status */}
      {appointment?.seenBefore && (
        <div
          className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium shadow-sm bg-blue-500/20 text-blue-700 `}
        >
          {appointment?.seenBefore && "Seen Before"}
        </div>
      )}

      {/* Pet Info */}
      <div className="flex items-center gap-5 cursor-pointer">
        <Avatar className="w-20 h-20 border-4 border-white shadow-md">
          <AvatarImage src={appointment.petImage} alt={appointment.petName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-800 font-bold">
            {appointment.petName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {appointment.petName}
          </h3>
          <p className="text-sm text-gray-500">{appointment.petType}</p>
        </div>
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
          <p className="font-semibold">{appointment.appointmentTime}</p>
          <span className="text-xs text-gray-500">{appointment.timezone}</span>
        </div>
      </div>

      {/* Booking Time */}
      {appointment.bookingTime && (
        <p className="mt-3 text-xs text-gray-500 text-center">
          Booked on {formatDateTime(appointment.bookingTime)}
        </p>
      )}

      {/* Owner Info */}
      <div className="flex items-center gap-3 mt-5 p-4 rounded-2xl bg-gray-50/70 shadow-sm">
        <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
          <AvatarImage
            src={appointment.parentImage}
            alt={appointment.parentName}
          />
          <AvatarFallback className="bg-gray-200 text-gray-700 font-semibold">
            {appointment.parentName
              .split(" ")
              .map((n) => n.charAt(0))
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{appointment.parentName}</p>
          <p className="text-xs text-gray-500">Pet Owner</p>
        </div>
      </div>

      {/* Notes */}
      {appointment.notes && (
        <div className="mt-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-100">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-amber-700">{appointment.notes}</p>
          </div>
        </div>
      )}

      {appointment?.seenBefore && (
        <Button className="mt-2 bg-[#1C1B36] w-full cursor-pointer">
          See Pet History
        </Button>
      )}
    </div>
  );
}
