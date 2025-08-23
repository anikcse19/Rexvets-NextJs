"use client";

import React, { useState } from "react";
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
import PetInfoCard from "./Appointments/PetInfoCard";
import ParentInfoCard from "./Appointments/ParentInfoCard";
import DataAssessmentSection from "./Appointments/DataAssessmentSection";
import PrescriptionSection from "./Appointments/PrescriptionSection";
import ChatBox from "./Appointments/Chatbox";
import DataAssessmentModal from "./Appointments/DataAssessmentModal";
import PrescriptionModal from "./Appointments/Prescriptionodal";

// Mock appointment data
const mockAppointment = {
  id: "1",
  appointmentDate: "2025-01-15",
  appointmentTime: "10:30 AM",
  timezone: "GMT+6",
  status: "in-progress" as const,
  service: "Routine Checkup",
  meetingLink: "https://meet.google.com/abc-defg-hij",

  pet: {
    id: "pet-1",
    name: "Max",
    image:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
    breed: "Golden Retriever",
    age: "3 years",
    weight: "28 kg",
    gender: "Male",
    color: "Golden",
    microchipId: "123456789012345",
    allergies: ["Chicken", "Dairy"],
    medications: ["Heartgard Plus"],
    lastVisit: "2024-12-15",
    vaccinations: [
      { name: "Rabies", date: "2024-06-15", nextDue: "2025-06-15" },
      { name: "DHPP", date: "2024-06-15", nextDue: "2025-06-15" },
    ],
  },

  parent: {
    id: "parent-1",
    name: "Sarah Johnson",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Pet Street, Animal City, AC 12345",
    emergencyContact: "+1 (555) 987-6543",
    relationshipToPet: "Owner",
    memberSince: "2022-03-15",
  },
};

export default function AppointmentDetailsPage() {
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const handleJoinMeeting = () => {
    window.open(mockAppointment.meetingLink, "_blank");
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
    <div className="space-y-6">
      {/* Header */}
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
              {formatDate(mockAppointment.appointmentDate)} at{" "}
              {mockAppointment.appointmentTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={`${getStatusColor(
              mockAppointment.status
            )} px-4 py-2 text-sm font-semibold`}
          >
            {mockAppointment.status.replace("-", " ").toUpperCase()}
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
              <h2 className="text-xl font-bold">{mockAppointment.service}</h2>
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
                  {formatDate(mockAppointment.appointmentDate)}
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
                  {mockAppointment.appointmentTime} ({mockAppointment.timezone})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-500 text-white p-2 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Service</p>
                <p className="text-gray-600">{mockAppointment.service}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Pet & Parent Info */}
        <div className="xl:col-span-1 space-y-6">
          <PetInfoCard pet={mockAppointment.pet} />
          <ParentInfoCard parent={mockAppointment.parent} />
        </div>

        {/* Middle Column - Data Assessment & Prescription */}
        <div className="xl:col-span-1 space-y-6">
          <DataAssessmentSection
            appointmentId={mockAppointment.id}
            onOpenModal={() => setIsDataModalOpen(true)}
          />
          <PrescriptionSection
            appointmentId={mockAppointment.id}
            onOpenModal={() => setIsPrescriptionModalOpen(true)}
          />
        </div>

        {/* Right Column - Chat */}
        <div className="xl:col-span-1">
          <ChatBox
            appointmentId={mockAppointment.id}
            parentName={mockAppointment.parent.name}
            parentImage={mockAppointment.parent.image}
          />
        </div>
      </div>

      {/* Modals */}
      <DataAssessmentModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        appointmentId={mockAppointment.id}
        petName={mockAppointment.pet.name}
      />

      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        appointmentId={mockAppointment.id}
        petName={mockAppointment.pet.name}
        petDetails={{
          breed: mockAppointment.pet.breed,
          age: mockAppointment.pet.age,
          weight: mockAppointment.pet.weight,
        }}
      />
    </div>
  );
}
