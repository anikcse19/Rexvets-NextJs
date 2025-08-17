"use client";
import React, { useState, useEffect } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Doctor, Location } from "@/lib/types";
import { useLocation } from "@/hooks/use-location";
import { mockDoctors } from "@/lib";
import LocationSelector from "@/components/FindVet/LocationSelector";
import DoctorCard from "@/components/FindVet/DoctorCard";

interface FindVetPageProps {
  onDoctorSelect: (doctor: Doctor) => void;
}

const FindVetPage: React.FC<FindVetPageProps> = ({ onDoctorSelect }) => {
  const { location } = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  const specialties = Array.from(
    new Set(mockDoctors.flatMap((doctor) => doctor.specialties))
  );

  useEffect(() => {
    let filtered = mockDoctors;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialties.some((specialty) =>
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          doctor.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter((doctor) =>
        doctor.specialties.includes(selectedSpecialty)
      );
    }

    // Filter by rating
    if (selectedRating > 0) {
      filtered = filtered.filter((doctor) => doctor.rating >= selectedRating);
    }

    setFilteredDoctors(filtered);
  }, [searchQuery, selectedSpecialty, selectedRating]);

  const handleLocationSet = (newLocation: Location) => {
    console.log("Location updated:", newLocation);
    // In a real app, you would filter doctors based on location
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with location */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Find a Veterinarian
              </h1>
              <p className="text-gray-600 mt-1">
                Find the perfect vet for your beloved pet
              </p>
            </div>

            <div className="flex items-center gap-4">
              {location && (
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {location.city}, {location.state}
                  </span>
                </div>
              )}
              <LocationSelector onLocationSet={handleLocationSet} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty) => (
                    <option key={specialty} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.7}>4.7+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Location Display for Mobile */}
        {location && (
          <div className="md:hidden mb-6 flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm">
            <MapPin className="w-4 h-4" />
            <span>
              {location.city}, {location.state}
            </span>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {filteredDoctors.length} Veterinarians Found
          </h2>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClick={onDoctorSelect}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No veterinarians found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or location
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindVetPage;
