"use client";

import React, { useEffect, useState } from "react";
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
import { useSession } from "next-auth/react";
import { PetParent } from "@/lib/types";
import { toast } from "sonner";
import WelcomeSection from "./overview/WelcomeSection";
import UpcomingAppointments from "./overview/UpcomingAppointments";
import PetList from "./overview/PetList";

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
    href: "/find-a-vet",
  },
  {
    title: "My Appointments",
    description: "View all appointments",
    icon: Clock,
    color: "from-purple-500 to-purple-600",
    href: "/dashboard/pet-parent/appointments",
  },
  {
    title: "Pet Records",
    description: "Access medical records",
    icon: FileText,
    color: "from-green-500 to-green-600",
    href: "/dashboard/pet-parent/my-pets",
  },
];

export default function PetParentOverviewPage() {
  const { data: session } = useSession();
  const [petParentData, setPetParentData] = useState<PetParent>();
  const fetchPetParent = async () => {
    try {
      const res = await fetch(`/api/pet-parent/${session?.user?.refId}`);
      if (!res?.ok) {
        throw new Error();
      }

      const data = await res.json();

      console.log(data?.data);
      setPetParentData(data?.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (session) {
      fetchPetParent();
    }
  }, [session]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="mx-auto space-y-8">
        {/* Welcome Section */}
        <WelcomeSection petParentData={petParentData!} />

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
          <div className="xl:col-span-2 space-y-5">
            <UpcomingAppointments />
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
                    <h3 className="text-2xl font-bold text-green-600 mb-2">
                      2
                    </h3>
                    <p className="text-green-700 font-medium">Healthy Pets</p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                    <div className="bg-yellow-500 text-white p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-600 mb-2">
                      1
                    </h3>
                    <p className="text-yellow-700 font-medium">
                      Under Treatment
                    </p>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                    <div className="bg-blue-500 text-white p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-600 mb-2">
                      100%
                    </h3>
                    <p className="text-blue-700 font-medium">
                      Vaccination Rate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pet List */}
          <PetList />
        </div>
      </div>
    </div>
  );
}
