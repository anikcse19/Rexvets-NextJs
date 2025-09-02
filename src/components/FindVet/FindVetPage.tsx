"use client";

import { Button } from "@/components/ui/button";
import { Filter, MapPin, Search, Stethoscope } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import DoctorCard from "./DoctorCard";
import { GetAllVetsResponse } from "./type";

export default function FindVetPage({ doctors }: { doctors: any }) {
  const [userLocation, setUserLocation] = useState<string>("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  console.log("Doctors", doctors);
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                Find Your Perfect Veterinarian
              </h1>
              <p className="text-blue-100 text-lg mb-6">
                Connect with experienced veterinarians in your area for expert
                pet care services
              </p>

              {userLocation && (
                <div
                  className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit"
                  role="status"
                  aria-label="Current location"
                >
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">{userLocation}</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => setIsLocationModalOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white"
              aria-label="Set your location to find nearby veterinarians"
            >
              <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
              Set Location
            </Button>
          </div>
        </header>

        {/* Search & Filter */}
        <section
          aria-label="Search and filter veterinarians"
          className="flex flex-col lg:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search by doctor name or specialty..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white shadow-sm"
              aria-label="Search veterinarians by name or specialty"
            />
          </div>

          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              aria-hidden="true"
            />
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="pl-10 pr-8 py-3 border rounded-xl bg-white shadow-sm appearance-none"
              aria-label="Filter veterinarians by state"
            >
              {bangladeshStates.map((state) => (
                <option key={state} value={state === "All States" ? "" : state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Count */}
        <p className="text-gray-600" role="status" aria-live="polite">
          Found <span className="font-semibold">{filteredDoctors.length}</span>{" "}
          veterinarians
        </p>

        {/* Grid */}
        <section
          aria-label="Veterinarian listings"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredDoctors.map((doc: any) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </section>

        {/* Empty */}
        {filteredDoctors.length === 0 && (
          <section className="text-center py-16" aria-label="No results found">
            <Stethoscope
              className="w-12 h-12 text-gray-400 mx-auto mb-6"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold mb-2">
              No veterinarians found
            </h2>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </section>
        )}

        {/* Modal */}
        {isLocationModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-modal-title"
            aria-describedby="location-modal-description"
          >
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <h3 id="location-modal-title" className="text-xl font-bold mb-4">
                Set Your Location
              </h3>
              <p id="location-modal-description" className="text-gray-600 mb-6">
                Help us find veterinarians near you
              </p>

              <div className="space-y-4">
                <Button
                  onClick={handleSetLocation}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
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
    </main>
  );
}
