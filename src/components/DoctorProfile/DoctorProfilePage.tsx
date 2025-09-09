"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { useAppContext } from "@/hooks/StateContext";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DonationFormWrapper from "../Donation/DonationFormWrapper";
import AboutDoctor from "./AboutDoctor";
import BookingCard from "./BookingCard";
import ClinicAddress from "./ClinicAddress";
import DoctorHeader from "./DoctorHeader";
import ReviewsSection from "./ReviewsSection";
import Specialties from "./Specialties";
import SpeciesTreated from "./SpeciesTreated";
import { Doctor } from "./type";

export default function DoctorProfilePage({
  doctorData,
  vetTimezone,
}: {
  doctorData: Doctor;
  vetTimezone: string;
}) {
  const { appState, setAppState } = useAppContext();
  const { slotDate, slotId } = appState;
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-01-16");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showForm, setShowForm] = useState<boolean>(() => {
    if (typeof window === "undefined") return false; // SSR safe
    const stored = localStorage.getItem("showForm");
    return stored ? JSON.parse(stored) : false;
  });

  const router = useRouter();

  const handleDonationComplete = (amount: number) => {
    localStorage.setItem("doctorData", JSON.stringify(doctorData));
    console.log("Donation completed:", amount);

    router.push(
      "/appointment-confirmation?date=" +
        selectedDate +
        "&time=" +
        selectedTime +
        "&slot=" +
        selectedSlot
    );
    toast.success("Donation successful! Thank you for your support.");

    localStorage.removeItem("showForm");
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedTime");
    localStorage.removeItem("selectedSlot");
  };
  console.log("doctorData", doctorData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
      {/* Donation Modal */}
      {showForm ? (
        <div className="max-w-2xl mx-auto mt-12">
          <DonationFormWrapper onDonationComplete={handleDonationComplete} />
        </div>
      ) : (
        <div className="max-w-[1366px] mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/find-a-vet">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Find Vet
            </Button>
          </Link>
          {/* Doctor Header */}
          <DoctorHeader doctor={doctorData} />

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <AboutDoctor doctor={doctorData} />
              {(doctorData as any)?.clinicName && (
                <ClinicAddress doctor={doctorData} />
              )}
              {doctorData?.specialities &&
                doctorData.specialities?.length > 0 && (
                  <Specialties doctor={doctorData} />
                )}
              {(doctorData as any)?.treatedSpecies &&
                (doctorData as any)?.treatedSpecies?.length > 0 && (
                  <SpeciesTreated doctor={doctorData} />
                )}
              <ReviewsSection doctorId={doctorData._id} />
            </div>

            {/* Booking */}
            <div className="xl:col-span-1">
              <BookingCard
                vetTimezone={vetTimezone}
                // selectedSlotDate={slotDate}
                // selectedSlotId={slotId}
                doctorName={doctorData?.name}
                doctorData={doctorData}
                onConfirm={(date: string, time: string, slot: string) => {
                  console.log(`Booking appointment for ${date} at ${time}`);
                  setShowForm(true);
                  setSelectedDate(date);
                  setSelectedSlot(slot);
                  setSelectedTime(time);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
