"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter, Stethoscope } from "lucide-react";
import DoctorCard from "./DoctorCard";
import { GetAllVetsResponse } from "./type";
import { useRouter, useSearchParams } from "next/navigation";

export default function FindVetPage({ doctors }: { doctors: any }) {
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

  const filteredDoctors = (doctors || []).filter((doctor: any) => {
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
          {filteredDoctors.map((doc: any) => (
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
