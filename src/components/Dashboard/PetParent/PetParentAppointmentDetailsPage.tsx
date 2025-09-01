"use client";
import React, { use, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Video,
  FileText,
  Stethoscope,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { PetInfoCard } from "./Appointments/PetInfoCard";
import DoctorInfoCard from "./Appointments/DoctorInfoCard";
import DataAssessmentSection from "./Appointments/DataAssessmentSection";
import PrescriptionSection from "./Appointments/PetParentPrescriptionSection";
import ChatBox from "./Appointments/PetParentChatbox";
import { Appointment } from "@/lib/types";


export default function PetParentAppointmentDetailsPage({
  id,
}: {
  id: string;
}) {
  const [appointmentDetails, setAppointmentDetails] = useState<Appointment>(
    {} as Appointment
  );



  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await fetch(`/api/appointments/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }
        const data = await response.json();
        setAppointmentDetails(data?.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error);
      }
    };

    fetchAppointmentDetails();
  }, [id]);

  const handleJoinMeeting = () => {
    window.open(appointmentDetails?.meetingLink, "_blank");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
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
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/pet-parent/appointments">
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
                {appointmentDetails?.appointmentDate && formatDate(appointmentDetails.appointmentDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={`${getStatusColor(
                appointmentDetails?.status
              )} px-4 py-2 text-sm font-semibold capitalize`}
            >
              {appointmentDetails?.status}
            </Badge>
            <Button
              onClick={handleJoinMeeting}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Video className="w-4 h-4 mr-2" />
              Join Meeting
            </Button>
          </div>
        </div>

        {/* Appointment Overview Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold capitalize">
                  {appointmentDetails?.appointmentType?.replace("_", " ")}
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
                    {appointmentDetails?.appointmentDate && formatDate(appointmentDetails.appointmentDate)}
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
                    Appointment Time
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-2 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Service</p>
                  <p className="text-gray-600">
                    {appointmentDetails?.appointmentType?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Pet & Doctor Info */}
          <div className="xl:col-span-1 space-y-6">
            <PetInfoCard pet={appointmentDetails?.pet} />

            {appointmentDetails?.veterinarian && (
              <DoctorInfoCard doctor={appointmentDetails?.veterinarian} />
            )}
          </div>

          {/* Middle Column - Data Assessment & Prescription */}
          <div className="xl:col-span-1 space-y-6">
            {appointmentDetails?._id && (
              <DataAssessmentSection appointmentId={appointmentDetails?._id} />
            )}
            {appointmentDetails?._id && (
              <PrescriptionSection appointmentId={appointmentDetails._id} />
            )}
          </div>

          {/* Right Column - Chat */}
          <div className="xl:col-span-1">
            {appointmentDetails?._id && appointmentDetails?.veterinarian && (
              <ChatBox
                appointmentId={appointmentDetails._id}
                doctorName={appointmentDetails.veterinarian.name || "Doctor"}
                doctorImage={appointmentDetails.veterinarian.profileImage || ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
