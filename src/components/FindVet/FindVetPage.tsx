"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter, Stethoscope } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { GetAllVetsResponse } from "./type";
import { useRouter, useSearchParams } from "next/navigation";

// mockDoctors stays here or can move into a data file
// import { mockDoctors } from "./mockDoctors";

// const mockDoctors = [
//   {
//     id: "1",
//     name: "Dr. Anik Rahman",
//     image:
//       "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
//     degree: "DVM, PhD in Veterinary Medicine",
//     rating: 4.9,
//     totalReviews: 847,
//     licenseNumber: "VET-BD-2012-001234",
//     state: "Dhaka",
//     specialties: ["Small Animal Surgery", "Emergency Medicine", "Cardiology"],
//     availableSlots: [
//       { time: "10:00 AM", timezone: "GMT+6" },
//       { time: "2:30 PM", timezone: "GMT+6" },
//     ],
//     subscriptionPlan: "Premium Family Plan",
//   },
//   {
//     id: "2",
//     name: "Dr. Sarah Ahmed",
//     image:
//       "https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
//     degree: "DVM, MS in Animal Behavior",
//     rating: 4.8,
//     totalReviews: 623,
//     licenseNumber: "VET-BD-2015-002156",
//     state: "Chittagong",
//     specialties: ["Animal Behavior", "Dermatology", "Nutrition"],
//     availableSlots: [
//       { time: "9:30 AM", timezone: "GMT+6" },
//       { time: "4:00 PM", timezone: "GMT+6" },
//     ],
//     subscriptionPlan: "Basic Family Plan",
//   },
//   {
//     id: "3",
//     name: "Dr. Mohammad Hasan",
//     image:
//       "https://images.pexels.com/photos/6749778/pexels-photo-6749778.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
//     degree: "DVM, Specialist in Exotic Animals",
//     rating: 4.7,
//     totalReviews: 445,
//     licenseNumber: "VET-BD-2018-003287",
//     state: "Sylhet",
//     specialties: ["Exotic Animals", "Wildlife Medicine", "Orthopedics"],
//     availableSlots: [
//       { time: "11:00 AM", timezone: "GMT+6" },
//       { time: "3:15 PM", timezone: "GMT+6" },
//     ],
//     subscriptionPlan: "Premium Family Plan",
//   },
//   {
//     id: "4",
//     name: "Dr. Fatima Khan",
//     image:
//       "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
//     degree: "DVM, MS in Veterinary Pathology",
//     rating: 4.9,
//     totalReviews: 756,
//     licenseNumber: "VET-BD-2013-001789",
//     state: "Dhaka",
//     specialties: ["Pathology", "Internal Medicine", "Oncology"],
//     availableSlots: [
//       { time: "8:30 AM", timezone: "GMT+6" },
//       { time: "1:45 PM", timezone: "GMT+6" },
//     ],
//     subscriptionPlan: "Premium Family Plan",
//   },
//   {
//     id: "5",
//     name: "Dr. Rashid Ali",
//     image:
//       "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
//     degree: "DVM, Certificate in Emergency Medicine",
//     rating: 4.6,
//     totalReviews: 389,
//     licenseNumber: "VET-BD-2019-004123",
//     state: "Rajshahi",
//     specialties: ["Emergency Medicine", "Critical Care", "Surgery"],
//     availableSlots: [
//       { time: "12:00 PM", timezone: "GMT+6" },
//       { time: "5:30 PM", timezone: "GMT+6" },
//     ],
//     subscriptionPlan: "Basic Family Plan",
//   },
//   {
//     id: "6",
//     name: "Dr. Nusrat Jahan",
//     image:
//       "https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop&crop=face",
//     degree: "DVM, MS in Reproductive Medicine",
//     rating: 4.8,
//     totalReviews: 512,
//     licenseNumber: "VET-BD-2016-002634",
//     state: "Khulna",
//     specialties: ["Reproductive Medicine", "Obstetrics", "Pediatrics"],
//     availableSlots: [
//       { time: "9:00 AM", timezone: "GMT+6" },
//       { time: "2:00 PM", timezone: "GMT+6" },
//     ],
//     subscriptionPlan: "Premium Family Plan",
//   },
// ];

export default function FindVetPage({
  doctors,
}: {
  doctors: GetAllVetsResponse;
}) {
  const [userLocation, setUserLocation] = useState<string>("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search") || "";
  const selectedState = searchParams.get("state") || "";

  console.log("doctors in find a vet page component", doctors);

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
    setUserLocation("Dhaka, Bangladesh");
    setIsLocationModalOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router.replace(`/find-vet?search=${value}&state=${selectedState}`);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    router.replace(`/find-vet?search=${searchQuery}&state=${value}`);
  };

  const filteredDoctors = doctors.veterinarians.filter((doctor) => {
    const matchesSearch = doctor.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    // doctor.specialties.some((s) =>
    //   s.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const matchesState = selectedState === "" || doctor.state === selectedState;

    return matchesSearch && matchesState;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Find Your Perfect Veterinarian
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                Connect with experienced veterinarians in your area
              </p>

              {userLocation && (
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{userLocation}</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => setIsLocationModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Set Location
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white shadow-sm"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="pl-10 pr-8 py-3 border rounded-xl bg-white shadow-sm appearance-none"
            >
              {bangladeshStates.map((state) => (
                <option key={state} value={state === "All States" ? "" : state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="text-gray-600">
          Found <span className="font-semibold">{filteredDoctors.length}</span>{" "}
          veterinarians
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>

        {/* Empty */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-2">
              No veterinarians found
            </h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        )}

        {/* Modal */}
        {isLocationModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Set Your Location</h3>
              <p className="text-gray-600 mb-6">
                Help us find veterinarians near you
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleSetLocation}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
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
