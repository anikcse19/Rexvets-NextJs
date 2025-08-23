"use client";

import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Heart,
  Clock,
  Activity,
  Stethoscope,
  PawPrint,
  Plus,
  Eye,
  Video,
  MessageCircle,
  FileText,
  Shield,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { PetRegistrationData } from "@/lib/validation/pet";
import AddPetModal from "./Pets/AddPetModal";

// Mock data for pet parent
const mockParentData = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  profileImage:
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face",
  memberSince: "2022-03-15",
  totalPets: 3,
  nextAppointment: {
    date: "2025-01-18",
    time: "2:30 PM",
    petName: "Max",
    doctorName: "Dr. Anik Rahman",
    service: "Routine Checkup",
  },
};

const mockPets = [
  {
    id: "1",
    name: "Max",
    image:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    breed: "Golden Retriever",
    age: "3 years",
    weight: "28 kg",
    lastVisit: "2025-01-15",
    nextVaccination: "2025-06-15",
    healthStatus: "Healthy",
    microchipped: true,
  },
  {
    id: "2",
    name: "Luna",
    image:
      "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    breed: "Siamese Cat",
    age: "2 years",
    weight: "4.5 kg",
    lastVisit: "2024-12-20",
    nextVaccination: "2025-03-20",
    healthStatus: "Healthy",
    microchipped: true,
  },
  {
    id: "3",
    name: "Charlie",
    image:
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop",
    breed: "Beagle",
    age: "5 years",
    weight: "15 kg",
    lastVisit: "2025-01-10",
    nextVaccination: "2025-04-10",
    healthStatus: "Under Treatment",
    microchipped: true,
  },
];

const mockUpcomingAppointments = [
  {
    id: "1",
    petName: "Max",
    petImage:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "2025-01-18",
    time: "2:30 PM",
    doctorName: "Dr. Anik Rahman",
    doctorImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    service: "Routine Checkup",
    status: "confirmed",
  },
  {
    id: "2",
    petName: "Luna",
    petImage:
      "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "2025-01-22",
    time: "10:00 AM",
    doctorName: "Dr. Anik Rahman",
    doctorImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    service: "Vaccination",
    status: "confirmed",
  },
  {
    id: "3",
    petName: "Charlie",
    petImage:
      "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
    date: "2025-01-25",
    time: "4:15 PM",
    doctorName: "Dr. Anik Rahman",
    doctorImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    service: "Follow-up",
    status: "pending",
  },
];

const quickActions = [
  {
    title: "Book Appointment",
    description: "Schedule a new appointment",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    href: "/book-appointment",
  },
  {
    title: "My Appointments",
    description: "View all appointments",
    icon: Clock,
    color: "from-purple-500 to-purple-600",
    href: "/appointments",
  },
  {
    title: "Pet Records",
    description: "Access medical records",
    icon: FileText,
    color: "from-green-500 to-green-600",
    href: "/pet-records",
  },
  {
    title: "Emergency Contact",
    description: "24/7 emergency support",
    icon: Phone,
    color: "from-red-500 to-red-600",
    href: "/emergency",
  },
  {
    title: "Messages",
    description: "Chat with veterinarians",
    icon: MessageCircle,
    color: "from-teal-500 to-teal-600",
    href: "/messages",
  },
  {
    title: "Health Tips",
    description: "Pet care resources",
    icon: Heart,
    color: "from-pink-500 to-pink-600",
    href: "/health-tips",
  },
];

export default function PetParentOverviewPage() {
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const handlePetRegistrationSuccess = (petData: PetRegistrationData) => {
    console.log("Pet registered successfully:", petData);
    // Here you would typically update your pets list or refetch data
    // For now, we'll just log the success
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

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-700 border-green-300";
      case "Under Treatment":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto space-y-8">
        {/* Welcome Section */}
        <div
          style={{
            background: "linear-gradient(to right,#002366,#1a8693",
          }}
          className="relative overflow-hidden rounded-xl  p-8 text-white shadow-2xl"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 lg:w-28 lg:h-28 border-4 border-white/20 shadow-xl">
                <AvatarImage
                  src={mockParentData.profileImage}
                  alt={mockParentData.name}
                />
                <AvatarFallback className="text-2xl font-bold text-gray-800">
                  {mockParentData.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  Welcome back, {mockParentData.name}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Caring for your beloved pets since{" "}
                  {new Date(mockParentData.memberSince).getFullYear()}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <PawPrint className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {mockParentData.totalPets}
                      </p>
                      <p className="text-blue-100 text-sm">Registered Pets</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-3 rounded-xl">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Next Appointment</p>
                      <p className="text-blue-100 text-sm">
                        {formatDate(mockParentData.nextAppointment.date)} at{" "}
                        {mockParentData.nextAppointment.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-2 rounded-xl">
              <Zap className="w-6 h-6" />
            </div>
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`bg-gradient-to-r ${action.color} text-white p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {action.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Upcoming Appointments */}
          <div className="xl:col-span-2">
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">
                      Upcoming Appointments
                    </CardTitle>
                    <p className="text-green-100 mt-1">
                      Your scheduled veterinary visits
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockUpcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="group">
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-200/60 hover:border-green-300/60 transition-all duration-300 hover:shadow-xl p-6">
                        {/* Status indicator line */}
                        <div
                          className={`absolute top-0 left-0 right-0 h-1 ${
                            appointment.status === "confirmed"
                              ? "bg-gradient-to-r from-green-400 to-green-600"
                              : "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          }`}
                        />

                        <div className="flex items-center gap-4">
                          {/* Pet Avatar */}
                          <div className="relative">
                            <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-2 ring-green-100">
                              <AvatarImage
                                src={appointment.petImage}
                                alt={appointment.petName}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-green-100 to-green-200 text-green-700 font-bold">
                                {appointment.petName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-lg ${
                                appointment.status === "confirmed"
                                  ? "bg-gradient-to-br from-green-400 to-green-600"
                                  : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                              }`}
                            >
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          {/* Appointment Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {appointment.petName}
                              </h3>
                              <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                                {appointment.service}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="text-gray-700">
                                  {formatDate(appointment.date)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span className="text-gray-700">
                                  {appointment.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-green-600" />
                                <span className="text-gray-700">
                                  {appointment.doctorName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={`${
                                    appointment.status === "confirmed"
                                      ? "bg-green-100 text-green-700 border-green-300"
                                      : "bg-yellow-100 text-yellow-700 border-yellow-300"
                                  } text-xs`}
                                >
                                  {appointment.status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            <Link href={`/appointments/${appointment.id}`}>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pet List */}
          <div className="xl:col-span-1">
            <Card className="shadow-xl border-0 bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-white">
                      My Pets
                    </CardTitle>
                    <p className="text-pink-100 mt-1">
                      Your beloved companions
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockPets.map((pet) => (
                    <div key={pet.id} className="group">
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-pink-50/30 border border-gray-200/60 hover:border-pink-300/60 transition-all duration-300 hover:shadow-lg p-4">
                        <div className="flex items-center gap-4">
                          {/* Pet Avatar */}
                          <div className="relative">
                            <Avatar className="w-14 h-14 border-3 border-white shadow-md ring-2 ring-pink-100">
                              <AvatarImage src={pet.image} alt={pet.name} />
                              <AvatarFallback className="bg-gradient-to-br from-pink-100 to-pink-200 text-pink-700 font-bold">
                                {pet.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {pet.microchipped && (
                              <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full p-1">
                                <Shield className="w-3 h-3" />
                              </div>
                            )}
                          </div>

                          {/* Pet Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-gray-900">
                                {pet.name}
                              </h3>
                              <Badge
                                className={`${getHealthStatusColor(
                                  pet.healthStatus
                                )} text-xs`}
                              >
                                {pet.healthStatus}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {pet.breed} • {pet.age}
                            </p>

                            <div className="space-y-1 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Last visit:{" "}
                                  {new Date(pet.lastVisit).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                <span>
                                  Next vaccination:{" "}
                                  {new Date(
                                    pet.nextVaccination
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add New Pet Button */}

                  <div
                    onClick={() => setIsAddPetModalOpen(true)}
                    className="group cursor-pointer"
                  >
                    <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 hover:border-pink-400 transition-all duration-300 p-6 text-center group-hover:bg-pink-50">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform duration-300">
                          <Plus className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                            Add New Pet
                          </h3>
                          <p className="text-gray-600 text-sm">
                            Register a new companion
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Health Insights Section */}
        <Card className="shadow-xl border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Health Insights
                </CardTitle>
                <p className="text-indigo-100 mt-1">
                  Keep track of your pets&apos; wellness
                </p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <div className="bg-green-500 text-white p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">2</h3>
                <p className="text-green-700 font-medium">Healthy Pets</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                <div className="bg-yellow-500 text-white p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-yellow-600 mb-2">1</h3>
                <p className="text-yellow-700 font-medium">Under Treatment</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <div className="bg-blue-500 text-white p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-blue-600 mb-2">100%</h3>
                <p className="text-blue-700 font-medium">Vaccination Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onSuccess={handlePetRegistrationSuccess}
      />
    </div>
  );
}
