"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Pill,
  Heart,
  AlertTriangle,
  TrendingUp,
  Activity,
  Stethoscope,
  User,
  MapPin,
  Phone,
  Mail,
  History,
  Eye,
  Download,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import PetHistoryTimeline from "./PetHistoryTimeline";
import PetHistoryCard from "./PetHistoryCard";
import PetHealthSummary from "./PetHealthSummary";
import { useSession } from "next-auth/react";

// Mock pet data
const mockPet = {
  id: "pet-123",
  name: "Max",
  image:
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  breed: "Golden Retriever",
  species: "Dog",
  age: "3 years 2 months",
  weight: "28 kg",
  gender: "Male",
  color: "Golden",
  microchipId: "123456789012345",
  owner: {
    name: "Sarah Johnson",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop&crop=face",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    memberSince: "2022-03-15",
  },
  registrationDate: "2022-03-20",
  totalVisits: 8,
  lastVisit: "2025-01-15",
  healthStatus: "Healthy",
};

// Mock pet history data based on your schema
const mockPetHistory = [
  {
    id: "hist-1",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-1",
    visitDate: "2025-01-15T10:30:00Z",
    diagnosis:
      "Mild upper respiratory infection with slight fever. No signs of serious complications.",
    treatment:
      "Prescribed antibiotics and anti-inflammatory medication. Rest and monitoring recommended.",
    medications: ["Amoxicillin 250mg", "Metacam 1.5mg", "Vitamin C supplement"],
    notes:
      "Patient responded well to treatment. Owner reported improved appetite and energy levels. Continue monitoring for next 3 days.",
    followUpNeeded: true,
    followUpDate: "2025-01-22T10:30:00Z",
    createdAt: "2025-01-15T10:45:00Z",
    updatedAt: "2025-01-15T10:45:00Z",
  },
  {
    id: "hist-2",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-2",
    visitDate: "2024-12-15T14:00:00Z",
    diagnosis:
      "Routine health checkup. All vital signs normal. Vaccinations up to date.",
    treatment:
      "No treatment required. Preventive care recommendations provided.",
    medications: ["Heartgard Plus (monthly)", "Flea prevention"],
    notes:
      "Excellent health condition. Owner maintaining proper diet and exercise routine. Recommended dental cleaning in 6 months.",
    followUpNeeded: false,
    followUpDate: null,
    createdAt: "2024-12-15T14:30:00Z",
    updatedAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "hist-3",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-3",
    visitDate: "2024-09-10T11:15:00Z",
    diagnosis:
      "Minor cut on left paw from outdoor play. No signs of infection.",
    treatment: "Wound cleaning and bandaging. Topical antibiotic applied.",
    medications: ["Topical antibiotic ointment", "Pain relief medication"],
    notes:
      "Wound healing well. Owner advised to keep area clean and dry. Return if signs of infection develop.",
    followUpNeeded: true,
    followUpDate: "2024-09-17T11:15:00Z",
    createdAt: "2024-09-10T11:45:00Z",
    updatedAt: "2024-09-10T11:45:00Z",
  },
  {
    id: "hist-4",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-4",
    visitDate: "2024-06-20T09:30:00Z",
    diagnosis:
      "Annual vaccination and health screening. All parameters normal.",
    treatment:
      "Administered DHPP and Rabies vaccinations. Dental examination performed.",
    medications: ["Post-vaccination monitoring"],
    notes:
      "Excellent response to vaccinations. No adverse reactions observed. Next vaccination due in 12 months.",
    followUpNeeded: false,
    followUpDate: null,
    createdAt: "2024-06-20T10:00:00Z",
    updatedAt: "2024-06-20T10:00:00Z",
  },
  {
    id: "hist-5",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-5",
    visitDate: "2024-03-25T16:45:00Z",
    diagnosis: "Gastrointestinal upset likely due to dietary indiscretion.",
    treatment:
      "Prescribed probiotics and bland diet. Fluid therapy administered.",
    medications: [
      "Probiotics",
      "Anti-nausea medication",
      "Electrolyte solution",
    ],
    notes:
      "Symptoms resolved within 48 hours. Owner educated about proper diet management and avoiding table scraps.",
    followUpNeeded: true,
    followUpDate: "2024-04-01T16:45:00Z",
    createdAt: "2024-03-25T17:15:00Z",
    updatedAt: "2024-03-25T17:15:00Z",
  },
  {
    id: "hist-6",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-6",
    visitDate: "2023-12-18T13:20:00Z",
    diagnosis: "Routine puppy checkup. Growth and development on track.",
    treatment: "Puppy vaccination series continued. Deworming administered.",
    medications: ["Puppy vaccines", "Deworming medication"],
    notes:
      "Healthy puppy development. Owner provided with puppy care guidelines and training resources.",
    followUpNeeded: true,
    followUpDate: "2024-01-18T13:20:00Z",
    createdAt: "2023-12-18T13:50:00Z",
    updatedAt: "2023-12-18T13:50:00Z",
  },
  {
    id: "hist-7",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-7",
    visitDate: "2023-09-05T10:00:00Z",
    diagnosis: "Initial puppy examination and health assessment.",
    treatment: "First puppy vaccination. Health screening completed.",
    medications: ["First puppy vaccines", "Vitamin supplements"],
    notes:
      "Healthy 4-month-old puppy. Owner educated about vaccination schedule and puppy care basics.",
    followUpNeeded: true,
    followUpDate: "2023-10-05T10:00:00Z",
    createdAt: "2023-09-05T10:30:00Z",
    updatedAt: "2023-09-05T10:30:00Z",
  },
  {
    id: "hist-8",
    pet: "pet-123",
    veterinarian: "vet-1",
    appointment: "app-8",
    visitDate: "2022-06-10T15:30:00Z",
    diagnosis: "New patient registration and initial health assessment.",
    treatment:
      "Complete physical examination. Established baseline health metrics.",
    medications: ["Preventive care recommendations"],
    notes:
      "New patient registration completed. Healthy young dog with no immediate concerns. Vaccination schedule established.",
    followUpNeeded: true,
    followUpDate: "2022-07-10T15:30:00Z",
    createdAt: "2022-06-10T16:00:00Z",
    updatedAt: "2022-06-10T16:00:00Z",
  },
];

export default function PetHistoryPage({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [petHistory, setPetHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();

  const fetchPetHistory = async () => {
    try {
      const response = await fetch(
        `/api/pet-history/by-pet-and-vet?petId=${id}&veterinarianId=${session?.user?.refId}`
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      console.log(data);
      setPetHistory(data?.data);
    } catch (error: any) {
      console.log(error?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPetHistory();
  }, [session]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // Day name (Sunday, Monday, etc.)
      year: "numeric", // Year
      month: "long", // Full month name
      day: "numeric", // Day of the month
    };

    return date.toLocaleDateString("en-US", options);
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredHistory = mockPetHistory.filter((record) => {
    const matchesSearch =
      record.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.treatment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "follow-up" && record.followUpNeeded) ||
      (filterType === "medications" &&
        record.medications &&
        record.medications.length > 0) ||
      (filterType === "recent" &&
        new Date(record.visitDate) >
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

    return matchesSearch && matchesFilter;
  });

  const getHealthTrend = () => {
    const recentVisits = mockPetHistory.slice(0, 3);
    const hasRecentIssues = recentVisits.some(
      (visit) =>
        visit.diagnosis?.toLowerCase().includes("infection") ||
        visit.diagnosis?.toLowerCase().includes("injury") ||
        visit.followUpNeeded
    );
    return hasRecentIssues ? "needs-attention" : "stable";
  };

  function calculatePetAge(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/doctor/appointments">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Appointments
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Pet Medical History
            </h1>
            <p className="text-gray-600 mt-1">
              Complete medical records for {mockPet.name}
            </p>
          </div>
        </div>
      </div>

      {/* Pet Overview Card */}
      <Card className="shadow-xl border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <Avatar className="w-32 h-32 border-4 border-white/20 shadow-xl">
              <AvatarImage
                src={petHistory[0]?.pet?.image}
                alt={petHistory[0]?.pet?.name}
              />
              <AvatarFallback className="text-3xl font-bold text-gray-800">
                {petHistory[0]?.pet?.name}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                  {petHistory[0]?.pet?.name}
                </h2>
                <p className="text-blue-100 text-lg">
                  {petHistory[0]?.pet?.breed} •{" "}
                  {calculatePetAge(petHistory[0]?.pet?.dateOfBirth)} •{" "}
                  {petHistory[0]?.pet?.weight} {petHistory[0]?.pet?.weightUnit}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{petHistory?.length}</p>
                      <p className="text-blue-100 text-sm">Total Visits</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Last Visit</p>
                      <p className="text-blue-100 text-sm">
                        {formatDate(
                          petHistory[petHistory.length - 1]?.createdAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Patient Since</p>
                      <p className="text-blue-100 text-sm">
                        {formatDate(petHistory[0]?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Health Status</p>
                      <Badge className="bg-green-100 text-green-700 border-green-300 mt-1">
                        {petHistory[petHistory?.length - 1]?.pet?.healthStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Owner Information */}
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Pet Owner Information
              </CardTitle>
              <p className="text-teal-100">
                Contact details and relationship info
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-teal-100 shadow-lg">
              <AvatarImage
                src={petHistory[0]?.petParent?.profileImage}
                alt={petHistory[0]?.petParent?.name}
              />
              <AvatarFallback className="text-xl font-bold text-gray-800">
                {petHistory[0]?.petParent?.name
                  .split(" ")
                  .map((n: any) => n.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {petHistory[0].petParent.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    {petHistory[0]?.petParent?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    {petHistory[0]?.petParent?.phoneNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">
                    Member since{" "}
                    {formatDate(petHistory[0]?.petParent?.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search medical records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none cursor-pointer"
          >
            <option value="all">All Records</option>
            <option value="recent">Recent (90 days)</option>
            <option value="follow-up">Needs Follow-up</option>
            <option value="medications">With Medications</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Found{" "}
          <span className="font-semibold text-gray-900">
            {petHistory.length}
          </span>{" "}
          medical records
        </p>
        <Badge className="bg-blue-100 text-blue-700 border-blue-300">
          {getHealthTrend() === "stable" ? "Health Stable" : "Needs Attention"}
        </Badge>
      </div>

      <PetHistoryTimeline history={petHistory} />
      {/* Tabs for different views */}
      {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            Timeline View
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Detailed Cards
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Health Summary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <PetHistoryTimeline history={petHistory} />
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          <div className="grid gap-6">
            {filteredHistory.map((record) => (
              <PetHistoryCard key={record.id} record={record} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <PetHealthSummary
            pet={mockPet}
            history={mockPetHistory}
            healthTrend={getHealthTrend()}
          />
        </TabsContent>
      </Tabs> */}

      {/* No Results */}
      {filteredHistory.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No records found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}
