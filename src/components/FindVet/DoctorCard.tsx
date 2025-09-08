import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import moment from "moment";
import React, { useState } from "react";

import { useAppContext } from "@/hooks/StateContext";
import { ChevronRight, Heart, Shield, Star } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import FamilyPlanModal from "./FamilyPlanModal";
import { Veterinarian } from "./type";

interface DoctorCardProps {
  doctor: Veterinarian & {
    nextAvailableSlots?: Array<{
      _id: string;
      date: string;
      startTime: string;
      endTime: string;
      timezone: string;
      status: string;
      notes?: string;
    }>;
    averageRating?: number;
    reviewCount?: number;
    ratingCount?: number;
  };
  viewMode: "grid" | "list";
}

export default function DoctorCard({ doctor, viewMode }: DoctorCardProps) {
  const router = useRouter();
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  const searchParams = useSearchParams();
  const { setAppState } = useAppContext();

  const formatDate = (dateString: string, timezone?: string) => {
    if (timezone) {
      const { formattedDate } = convertTimesToUserTimezone(
        "00:00",
        "00:00",
        dateString,
        timezone
      );
      return moment(formattedDate).format("dddd, MMM DD, YYYY");
    }
    return moment(dateString).format("dddd, MMM DD, YYYY");
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };
  const onSelectFamilyPlan = (plan: number) => {
    if (plan > 0) {
      setAppState((prev) => ({
        ...prev,
        selectedFamilyPlan: plan.toString(),
      }));
    }
    router.push(`/find-a-vet/${doctor.id || doctor._id}`);
    // const queryParams = new URLSearchParams();

    // if (plan > 0) {
    //   queryParams.set("selected-family-plan", plan.toString());
    // }

    // const url = `/find-a-vet/${doctor.id || doctor._id}${
    //   queryParams.toString() ? `?${queryParams.toString()}` : ""
    // }`;

    // router.push(url);
  };
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const handleSlotClick = (slot: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setAppState((prev) => ({
      ...prev,
      slotId: slot._id,
      slotDate: slot.date,
      selectedFamilyPlan: null,
    }));
    router.push(`/find-a-vet/${doctor.id || doctor._id}`);
  };

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <article
      itemScope
      itemType="https://schema.org/Veterinary"
      className="group"
    >
      <Link href={`/find-a-vet/${doctor.id || doctor._id}`}>
        <Card className="group cursor-pointer p-0  shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 overflow-hidden bg-white">
          {/* Content */}
          <CardContent className="p-6 space-y-6">
            {/* Top Section: Veterinarian Profile */}
            <div className="flex items-start gap-4">
              {/* Profile Picture with Verification Badge */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden border-2 border-gray-200">
                  {doctor.profileImage ? (
                    <img
                      src={doctor.profileImage}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-700">
                      {doctor.name
                        .split(" ")
                        .map((n) => n.charAt(0))
                        .join("")}
                    </span>
                  )}
                </div>
                {/* Verification Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Name, Title, Rating, and Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className=" w-[180px]  truncate text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-gray-600 w-[210] truncate  text-sm font-medium">
                      {/* Veterinarian, DVM */}
                      {doctor?.specialities?.join(", ") || "Veterinarian"}
                    </p>
                  </div>
                  {/* Navigation Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {renderStars(doctor.averageRating || 0)}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {doctor.averageRating?.toFixed(1) || "0"}
                  </span>
                  <span className="text-sm text-gray-600">
                    {doctor.reviewCount || 0} reviews
                  </span>
                </div>

                {/* Badges */}
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700 border-0 gap-1 px-3 py-1">
                    <Heart className="w-3 h-3 text-green-600" />
                    Prescriptions
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border-0 gap-1 px-3 py-1">
                    <Shield className="w-3 h-3 text-blue-600" />
                    Verified
                  </Badge>
                </div>
              </div>
            </div>

            {/* Middle Section: Promotional Offer (button to open modal) */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPlanOpen(true);
              }}
              className="bg-[#FEF3C7] cursor-pointer rounded-xl p-4 border border-yellow-200 w-full text-left  transition"
            >
              <div className=" w-full  flex items-center  gap-3">
                <div className="w-10 h-10 bg-[#F59E0B] rounded text-white flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-orange-700 mb-1">
                    Save with Family Plan
                  </h4>
                  <p className="text-xs text-orange-600">
                    Subscribe for just $10/month and get unlimited consultations
                  </p>
                </div>
              </div>
            </button>

            {/* Bottom Section: Available Appointment Slots */}
            {doctor.nextAvailableSlots &&
            doctor.nextAvailableSlots.length > 0 ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {doctor.nextAvailableSlots.slice(0, 2).map((slot, index) => {
                    const { formattedStartTime, formattedEndTime } =
                      convertTimesToUserTimezone(
                        slot.startTime,
                        slot.endTime,
                        slot.date,
                        slot.timezone || "UTC"
                      );
                    return (
                      <button
                        key={slot._id}
                        onClick={(e) => handleSlotClick(slot, e)}
                        className="w-full text-left p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300 cursor-pointer group/slot"
                      >
                        <div className="w-full flex items-center">
                          <span className="w-[60%] truncate">
                            {formatDate(slot.date, slot.timezone)}
                          </span>

                          <span className="w-[40%] truncate text-right  text-sm font-medium text-gray-800 group-hover/slot:text-gray-900">
                            {formattedStartTime} - {formattedEndTime}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-3">
                      No immediate slots available
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-3 py-1 border-gray-300 text-gray-600 hover:bg-gray-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.push(`/find-a-vet/${doctor.id || doctor._id}`);
                      }}
                    >
                      View Full Schedule
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* Family Plan Modal */}
      <FamilyPlanModal
        onSelectPlan={onSelectFamilyPlan}
        isPlanOpen={isPlanOpen}
        setIsPlanOpen={setIsPlanOpen}
      />
    </article>
  );
}
