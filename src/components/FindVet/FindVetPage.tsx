"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from "@/hooks/useDebounce";

import {
  Award,
  Clock,
  MapPin,
  Search,
  Star,
  Stethoscope,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Loader from "../shared/Loader";
import DoctorCard from "./DoctorCard";

// Google Places API types
interface GooglePlace {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function FindVetPage({
  doctors: initialDoctors,
}: {
  doctors: any;
}) {
  const [userLocation, setUserLocation] = useState<string>("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [userTimezone, setUserTimezone] = useState<string>("UTC");
  const [doctors, setDoctors] = useState<any>(initialDoctors || []);
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoadingTime, setApiLoadingTime] = useState<number | null>(null);

  // Google Places API states
  const [locationInput, setLocationInput] = useState<string>("");
  const [locationSuggestions, setLocationSuggestions] = useState<GooglePlace[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<GooglePlace | null>(null);
  const [isLocationSearching, setIsLocationSearching] = useState(false);

  // Debounced location input for API calls
  const debouncedLocationInput = useDebounce(locationInput, 300);

  // Ref for click outside detection
  const locationInputRef = useRef<HTMLDivElement>(null);

  //PUSH NOTIFICATION TESTING_______________
  const { data: session } = useSession();
  const user = session?.user;

  const tokenSavedRef = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search") || "";
  const selectedState = searchParams.get("state") || "";

  // Function to fetch doctors with timezone
  const fetchDoctorsWithTimezone = async () => {
    try {
      setIsLoading(true);
      const startTime = Date.now(); // Record start time

      const response = await fetch(`/api/veterinarian`);

      const endTime = Date.now(); // Record end time
      const duration = endTime - startTime; // Calculate duration in milliseconds
      setApiLoadingTime(duration); // Store the loading time

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setDoctors(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching doctors with timezone:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Detect user's timezone on component mount and fetch doctors
  useEffect(() => {
    try {
      // Try to get timezone from Intl API
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      setUserTimezone(timezone);
      console.log("Detected user timezone:", timezone);
      // Fetch doctors with the detected timezone
      fetchDoctorsWithTimezone();
    } catch (error) {
      console.warn("Could not detect timezone, using UTC:", error);
      setUserTimezone("UTC");
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Trigger search when debounced location input changes
  useEffect(() => {
    if (debouncedLocationInput && debouncedLocationInput.length >= 3) {
      searchPlaces(debouncedLocationInput);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      setIsLocationSearching(false);
    }
  }, [debouncedLocationInput]);

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

  const sortOptions = [
    { value: "rating", label: "Highest Rated", icon: Star },
    { value: "experience", label: "Most Experienced", icon: Award },
    { value: "availability", label: "Most Available", icon: Clock },
    { value: "reviews", label: "Most Reviews", icon: Users },
    { value: "name", label: "Name A-Z", icon: Stethoscope },
  ];

  // Google Places API functions
  const searchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      setIsLocationSearching(false);
      return;
    }

    try {
      setIsLocationSearching(true);
      const response = await fetch(
        `/api/places/autocomplete?input=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data.predictions || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setLocationSuggestions([]);
    } finally {
      setIsLocationSearching(false);
    }
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    setSelectedPlace(null);
  };

  const handlePlaceSelect = (place: GooglePlace) => {
    setSelectedPlace(place);
    setLocationInput(place.description);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSetLocation = () => {
    if (selectedPlace) {
      setUserLocation(selectedPlace.description);
      toast.success(`Location set to: ${selectedPlace.description}`);
    } else {
      setUserLocation("Dhaka, Bangladesh");
      toast.success("Location set to: Dhaka, Bangladesh");
    }
    setIsLocationModalOpen(false);
    setLocationInput("");
    setSelectedPlace(null);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleCloseModal = () => {
    setIsLocationModalOpen(false);
    setLocationInput("");
    setSelectedPlace(null);
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    router.replace(`/find-vet?search=${value}&state=${selectedState}`);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    router.replace(`/find-vet?search=${value}&state=${selectedState}`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6 lg:mt-5">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header
          style={{
            background: "linear-gradient(to right,#002366,#1a8693",
          }}
          className="relative overflow-hidden rounded-3xl  p-8 text-white shadow-2xl"
        >
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-xl lg:text-4xl font-bold mb-4">
                Find Your Veterinarian
              </h1>
              <p className="text-blue-100 text-base lg:text-lg mb-6">
                Connect with experienced veterinarians for expert pet care
                services
              </p>

              <div className="flex flex-wrap gap-3">
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

                {/* API Loading Time */}
                {process.env.NODE_ENV !== "production" &&
                  apiLoadingTime !== null && (
                    <div
                      className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit"
                      role="status"
                      aria-label="API loading time"
                    >
                      <Clock className="w-4 h-4" aria-hidden="true" />
                      <span className="text-sm font-medium">
                        Load Time:{" "}
                        {apiLoadingTime < 1000
                          ? `${apiLoadingTime}ms`
                          : `${(apiLoadingTime / 1000).toFixed(1)}s`}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </header>

        {/* Search & Filter */}
        {/* <section
          aria-label="Search and filter veterinarians"
          className="bg-white rounded-2xl shadow-lg p-6 border-0"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
                className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
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
                className="pl-10 pr-8 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none min-w-[180px]"
                aria-label="Filter veterinarians by state"
              >
                {bangladeshStates.map((state) => (
                  <option
                    key={state}
                    value={state === "All States" ? "" : state}
                  >
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="pl-4 pr-8 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all appearance-none min-w-[200px]"
                aria-label="Sort veterinarians"
              >
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-4"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-4"
              >
                List
              </Button>
            </div>
          </div>

          {(searchQuery || selectedState) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-2">
                  Search: "{searchQuery}"
                  <button
                    onClick={() =>
                      router.replace(`/find-vet?state=${selectedState}`)
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedState && (
                <Badge variant="secondary" className="gap-2">
                  State: {selectedState}
                  <button
                    onClick={() =>
                      router.replace(`/find-vet?search=${searchQuery}`)
                    }
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </section> */}

        {/* Grid/List View */}
        {isLoading ? (
          <Loader size={60} height="300px" />
        ) : (
          // <section
          //   className="text-center py-16"
          //   aria-label="Loading veterinarians"
          // >
          //   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
          //   <h2 className="text-xl font-semibold mb-2">
          //     Loading veterinarians...
          //   </h2>
          //   <p className="text-gray-600">
          //     Fetching data for timezone: {userTimezone}
          //   </p>
          // </section>
          <section
            aria-label="Veterinarian listings"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {doctors &&
              doctors?.length > 0 &&
              doctors?.map((doc: any) => (
                <DoctorCard
                  key={doc.id || doc._id}
                  doctor={doc}
                  viewMode={viewMode}
                />
              ))}
          </section>
        )}

        {/* Empty */}
        {doctors.length === 0 && (
          <section className="text-center py-16" aria-label="No results found">
            <Stethoscope
              className="w-12 h-12 text-gray-400 mx-auto mb-6"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold mb-2">
              No veterinarians found
            </h2>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria
            </p>
            <Button
              onClick={() => router.replace("/find-a-vet")}
              variant="outline"
            >
              Refresh
            </Button>
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
                Set Location & Timezone
              </h3>
              <p id="location-modal-description" className="text-gray-600 mb-6">
                Search for your location to see accurate appointment
                availability and help us find veterinarians near you
              </p>

              <div className="space-y-4">
                {/* Location Search Input */}
                <div className="relative" ref={locationInputRef}>
                  <label
                    htmlFor="location-input"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Search Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="location-input"
                      type="text"
                      placeholder="Start typing your city, state, or address..."
                      value={locationInput}
                      onChange={(e) =>
                        handleLocationInputChange(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                      autoComplete="off"
                    />

                    {/* Loading indicator */}
                    {isLocationSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      </div>
                    )}

                    {/* Location Suggestions Dropdown */}
                    {showSuggestions && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {isLocationSearching ? (
                          <div className="px-4 py-3 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            Searching...
                          </div>
                        ) : locationSuggestions.length > 0 ? (
                          locationSuggestions.map((place) => (
                            <button
                              key={place.place_id}
                              onClick={() => handlePlaceSelect(place)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                              <div className="font-medium text-gray-900">
                                {place.structured_formatting.main_text}
                              </div>
                              <div className="text-sm text-gray-500">
                                {place.structured_formatting.secondary_text}
                              </div>
                            </button>
                          ))
                        ) : locationInput.length >= 3 ? (
                          <div className="px-4 py-3 text-center text-gray-500">
                            No locations found
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Location Display */}
                {selectedPlace && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Selected: {selectedPlace.description}
                      </span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => {
                    fetchDoctorsWithTimezone();
                    setIsLocationModalOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                  Update Timezone & Refresh
                </Button>

                <Button
                  onClick={handleSetLocation}
                  disabled={!selectedPlace}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapPin className="w-4 h-4 mr-2" aria-hidden="true" />
                  {selectedPlace
                    ? "Set Selected Location"
                    : "Select a location first"}
                </Button>

                <Button
                  onClick={handleCloseModal}
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
