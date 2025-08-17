"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Badge,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Doctor, TimeSlots } from "@/lib/types";
import { mockReviews } from "@/lib";
import ReviewCard from "@/components/DoctorProfile/ReviewCard";
import BookingSystem from "@/components/DoctorProfile/BookingSystem";

interface DoctorProfilePageProps {
  doctor: Doctor;
}

const DoctorProfilePage: React.FC<DoctorProfilePageProps> = ({ doctor }) => {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlots | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const reviews = mockReviews[doctor.id] || [];
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const handleBookSlot = (slot: TimeSlots) => {
    setSelectedSlot(slot);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            // onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to search
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-32 h-32 rounded-xl object-cover border-4 border-blue-100"
                  />
                  {doctor.prescriptionBadge && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                      <Badge className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {doctor.name}
                  </h1>
                  <p className="text-lg text-gray-600 mb-3">{doctor.degree}</p>

                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(Math.floor(doctor.rating))}
                    <span className="text-lg font-medium text-gray-900 ml-2">
                      {doctor.rating}
                    </span>
                    <span className="text-gray-500">
                      ({doctor.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Badge className="w-4 h-4" />
                      <span>License: {doctor.license}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{doctor.state}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-blue-600">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">
                      Subscribe to Family Plan
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About Dr. {doctor.name.split(" ")[1]}
              </h2>
              <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Address
              </h2>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-gray-700">{doctor.address}</p>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Specialties
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Species Treated */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Species Treated
              </h2>
              <div className="flex flex-wrap gap-2">
                {doctor.speciesTreated.map((species, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {species}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Patient Reviews ({reviews.length})
              </h2>

              <div className="space-y-4">
                {displayedReviews.map((review) => (
                  <div
                    key={review.id}
                    className={`transition-all duration-500 ${
                      showAllReviews ? "animate-fade-up" : ""
                    }`}
                  >
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>

              {reviews.length > 4 && (
                <button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {showAllReviews ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      View All Reviews
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingSystem doctor={doctor} onBookSlot={handleBookSlot} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
