"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  FileText,
  Stethoscope,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PetInfoCard from "./Appointments/PetInfoCard";
import ParentInfoCard from "./Appointments/ParentInfoCard";
import DataAssessmentSection from "./Appointments/DataAssessmentSection";
import PrescriptionSection from "./Appointments/PrescriptionSection";
import ChatBox from "./Appointments/Chatbox";
import DataAssessmentModal from "./Appointments/DataAssessmentModal";
import PrescriptionModal from "./Appointments/PrescriptionModal";
import { Appointment, Doctor, Pet, PetParent } from "@/lib/types";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface AppointmentData {
  _id: string;
  appointmentDate: string;
  durationMinutes: number;
  status: string;
  appointmentType: string;
  meetingLink?: string;
  notes?: string;
  feeUSD: number;
  veterinarian: Doctor;
  petParent: PetParent;
  pet: Pet;
  concerns: string[];
  createdAt: string;
  updatedAt: string;
}

export default function AppointmentDetailsPage() {
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentPrescription, setCurrentPrescription] = useState(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const appointmentId = params.id as string;

  const router = useRouter();

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const data = await response.json();

      console.log("1", data?.data);

      if (data.success) {
        setAppointment(data?.data);
      } else {
        setError(data.message || "Failed to fetch appointment");
      }
    } catch (err) {
      setError("Failed to fetch appointment data");
      console.error("Error fetching appointment:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  const handleJoinMeeting = () => {
    if (appointment?.meetingLink) {
      window.open(appointment.meetingLink, "_blank");
    }
  };

  console.log("appointment", appointment);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      case "completed":
        return "bg-gradient-to-r from-green-500 to-green-600 text-white";
      case "upcoming":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      case "scheduled":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch("/api/appointments/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment?._id,
          newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      toast.success("Status updated successfully!");
      fetchAppointment();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (error || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Appointment not found"}
          </p>
          <Link href="/dashboard/doctor/appointments">
            <Button variant="outline">Back to Appointments</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      {loading ? (
        <div className="flex items-center gap-4">
          {/* Avatar placeholder */}
          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-400 text-sm font-medium">
            AV
          </div>

          <div>
            {/* Hardcoded title */}
            <p className="h-6 w-40 mb-2 text-gray-400 font-semibold">
              Appointment Details
            </p>
            {/* Hardcoded subtitle */}
            <p className="h-4 w-60 text-gray-300 text-sm">
              Loading date & time...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/doctor/appointments">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Appointment Details
              </h1>
              <p className="text-gray-600 mt-1">
                {formatDate(appointment.appointmentDate)} at{" "}
                {formatTime(appointment.appointmentDate)}
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="status" className="font-semibold">
                Update Status:
              </label>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    <button className="bg-transparent">
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </button>
                    <ChevronDown />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => updateStatus("upcoming")}>
                    Upcoming
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("cancelled")}>
                    Cancelled
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("completed")}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {appointment.status === "upcoming" && appointment.meetingLink && (
              <Button
                onClick={handleJoinMeeting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Video className="w-4 h-4 mr-2" />
                Join Meeting
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Appointment Overview Card */}

      {loading ? (
        <Card className="p-6 space-y-4 hidden">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      ) : (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {appointment.appointmentType}
                </h2>
                <p className="text-blue-100">Appointment Overview</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Date</p>
                  <p className="text-gray-600">
                    {formatDate(appointment.appointmentDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-500 text-white p-2 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Time</p>
                  <p className="text-gray-600">
                    {formatTime(appointment.appointmentDate)} (
                    {appointment.durationMinutes} min)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-2 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service</p>
                  <p className="text-gray-600">{appointment.appointmentType}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {loading ? (
          <>
            <Card className="p-6 space-y-4">
              <Skeleton className="h-24 w-full" />
            </Card>
            <Card className="p-6 space-y-4">
              <Skeleton className="h-24 w-full" />
            </Card>
            <Card className="p-6 space-y-4">
              <Skeleton className="h-48 w-full" />
            </Card>
          </>
        ) : (
          <>
            {/* Left Column - Pet & Parent Info */}
            <div className="xl:col-span-1 space-y-6 xl:order-1 order-1">
              <PetInfoCard appointment={appointment} />
              {appointment?.petParent && (
                <ParentInfoCard parent={appointment.petParent} />
              )}
            </div>

            {/* Middle Column - Data Assessment & Prescription */}
            <div className="xl:col-span-1 space-y-6 xl:order-2 order-3">
              {appointment && (
                <>
                  <DataAssessmentSection
                    appointmentId={appointment._id}
                    onOpenModal={() => setIsDataModalOpen(true)}
                    setCurrentAssessment={setCurrentAssessment}
                  />
                  <PrescriptionSection
                    appointmentId={appointment?._id}
                    onOpenModal={() => setIsPrescriptionModalOpen(true)}
                  />
                </>
              )}
            </div>

            {/* Right Column - Chat */}
            <div className="xl:col-span-1 xl:order-3 order-2">
              {appointment?._id && appointment?.petParent ? (
                <ChatBox
                  appointmentId={appointment._id}
                  parentName={appointment.petParent.name || "Pet Parent"}
                  parentImage={appointment.petParent.profileImage || ""}
                />
              ) : (
                <div className="text-center p-4 text-gray-500">
                  Chat not available
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <DataAssessmentModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        appointmentId={appointment._id}
        petName={appointment.pet.name}
        vetId={appointment.veterinarian._id}
        assessment={currentAssessment}
      />

      {appointment && appointment?.petParent && (
        <PrescriptionModal
          isOpen={isPrescriptionModalOpen}
          onClose={() => {
            setIsPrescriptionModalOpen(false);
          }}
          appointmentId={appointment._id}
          appointment={appointment}
          pet={appointment?.pet}
          petParent={appointment?.petParent}
          veterinarian={appointment?.veterinarian}
        />
      )}
    </div>
  );
}
