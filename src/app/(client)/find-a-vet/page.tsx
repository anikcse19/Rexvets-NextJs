"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Star,
  Award,
  Clock,
  Users,
  Search,
  Filter,
  Calendar,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

// Mock data for doctors
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Anik Rahman",
    image:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    degree: "DVM, PhD in Veterinary Medicine",
    rating: 4.9,
    totalReviews: 847,
    licenseNumber: "VET-BD-2012-001234",
    state: "Dhaka",
    specialties: ["Small Animal Surgery", "Emergency Medicine", "Cardiology"],
    availableSlots: [
      { time: "10:00 AM", timezone: "GMT+6" },
      { time: "2:30 PM", timezone: "GMT+6" },
    ],
    subscriptionPlan: "Premium Family Plan",
  },
  {
    id: "2",
    name: "Dr. Sarah Ahmed",
    image:
      "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    degree: "DVM, MS in Animal Behavior",
    rating: 4.8,
    totalReviews: 623,
    licenseNumber: "VET-BD-2015-002156",
    state: "Chittagong",
    specialties: ["Animal Behavior", "Dermatology", "Nutrition"],
    availableSlots: [
      { time: "9:30 AM", timezone: "GMT+6" },
      { time: "4:00 PM", timezone: "GMT+6" },
    ],
    subscriptionPlan: "Basic Family Plan",
  },
  {
    id: "3",
    name: "Dr. Mohammad Hasan",
    image:
      "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    degree: "DVM, Specialist in Exotic Animals",
    rating: 4.7,
    totalReviews: 445,
    licenseNumber: "VET-BD-2018-003287",
    state: "Sylhet",
    specialties: ["Exotic Animals", "Wildlife Medicine", "Orthopedics"],
    availableSlots: [
      { time: "11:00 AM", timezone: "GMT+6" },
      { time: "3:15 PM", timezone: "GMT+6" },
    ],
    subscriptionPlan: "Premium Family Plan",
  },
  {
    id: "4",
    name: "Dr. Fatima Khan",
    image:
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    degree: "DVM, MS in Veterinary Pathology",
    rating: 4.9,
    totalReviews: 756,
    licenseNumber: "VET-BD-2013-001789",
    state: "Dhaka",
    specialties: ["Pathology", "Internal Medicine", "Oncology"],
    availableSlots: [
      { time: "8:30 AM", timezone: "GMT+6" },
      { time: "1:45 PM", timezone: "GMT+6" },
    ],
    subscriptionPlan: "Premium Family Plan",
  },
  {
    id: "5",
    name: "Dr. Rashid Ali",
    image:
      "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    degree: "DVM, Certificate in Emergency Medicine",
    rating: 4.6,
    totalReviews: 389,
    licenseNumber: "VET-BD-2019-004123",
    state: "Rajshahi",
    specialties: ["Emergency Medicine", "Critical Care", "Surgery"],
    availableSlots: [
      { time: "12:00 PM", timezone: "GMT+6" },
      { time: "5:30 PM", timezone: "GMT+6" },
    ],
    subscriptionPlan: "Basic Family Plan",
  },
  {
    id: "6",
    name: "Dr. Nusrat Jahan",
    image:
      "https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
    degree: "DVM, MS in Reproductive Medicine",
    rating: 4.8,
    totalReviews: 512,
    licenseNumber: "VET-BD-2016-002634",
    state: "Khulna",
    specialties: ["Reproductive Medicine", "Obstetrics", "Pediatrics"],
    availableSlots: [
      { time: "9:00 AM", timezone: "GMT+6" },
      { time: "2:00 PM", timezone: "GMT+6" },
    ],
    subscriptionPlan: "Premium Family Plan",
  },
];

export default function FindVetPage() {
  const [userLocation, setUserLocation] = useState<string>("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const bangladeshStates = [
    "All States",
    "Barisal",
    "Chittagong",
    "Dhaka",
    "Khulna",
    "Mymensingh",
    "Rajshahi",
    "Rangpur",
    "Sylhet",
  ];

  const handleSetLocation = () => {
    // In a real app, this would use geolocation API or address input
    setUserLocation("Dhaka, Bangladesh");
    setIsLocationModalOpen(false);
  };

  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesState =
      selectedState === "" ||
      selectedState === "All States" ||
      doctor.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  Find Your Perfect Veterinarian
                </h1>
                <p className="text-blue-100 text-lg mb-6">
                  Connect with experienced veterinarians in your area for the
                  best pet care
                </p>

                {/* Location Display */}
                {userLocation && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{userLocation}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Set Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm appearance-none cursor-pointer"
            >
              {bangladeshStates.map((state) => (
                <option key={state} value={state === "All States" ? "" : state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Found{" "}
            <span className="font-semibold text-gray-900">
              {filteredDoctors.length}
            </span>{" "}
            veterinarians
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No veterinarians found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or location
            </p>
          </div>
        )}

        {/* Location Modal */}
        {isLocationModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Set Your Location
              </h3>
              <p className="text-gray-600 mb-6">
                Help us find veterinarians near you
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleSetLocation}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>

                <Button
                  onClick={() => setIsLocationModalOpen(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    image: string;
    degree: string;
    rating: number;
    totalReviews: number;
    licenseNumber: string;
    state: string;
    specialties: string[];
    availableSlots: Array<{ time: string; timezone: string }>;
    subscriptionPlan: string;
  };
}

function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Link href={`/doctor/${doctor.id}`}>
      <Card className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden">
        <CardContent className="p-0">
          {/* Header with Image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Avatar className="absolute bottom-4 left-4 w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage
                src={doctor.image}
                alt={doctor.name}
                className="object-cover"
              />
              <AvatarFallback className="text-xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-purple-100">
                {doctor.name
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* State Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/90 text-gray-700 border-0">
                <MapPin className="w-3 h-3 mr-1" />
                {doctor.state}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Doctor Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {doctor.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{doctor.degree}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(doctor.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {doctor.rating} ({doctor.totalReviews} reviews)
                </span>
              </div>
            </div>

            {/* License */}
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <Award className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-xs text-green-700 font-medium">
                  Licensed & Verified
                </p>
                <p className="text-xs text-green-600">{doctor.licenseNumber}</p>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Specialties:
              </p>
              <div className="flex flex-wrap gap-1">
                {doctor.specialties.slice(0, 2).map((specialty, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-100 text-blue-700 border-blue-300 text-xs"
                  >
                    {specialty}
                  </Badge>
                ))}
                {doctor.specialties.length > 2 && (
                  <Badge className="bg-gray-100 text-gray-600 border-gray-300 text-xs">
                    +{doctor.specialties.length - 2} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Subscription Plan */}
            <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-1">
                Family Plan Available
              </p>
              <p className="text-xs text-purple-700">
                {doctor.subscriptionPlan}
              </p>
            </div>

            {/* Available Slots */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Next Available Slots:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {doctor.availableSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-center"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      {slot.time}
                    </p>
                    <p className="text-xs text-gray-600">{slot.timezone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* View Profile Button */}
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4 mr-2" />
              View Profile & Book
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
