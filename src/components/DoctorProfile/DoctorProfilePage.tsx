"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
import { mockDoctor } from "./data";
import { Doctor } from "./type";

export default function DoctorProfilePage({
  doctorData,
}: {
  doctorData: Doctor;
}) {
  const searchParams = useSearchParams();
  const slotDate = searchParams.get("slotDate");
  const slotId = searchParams.get("slotId");
  console.log("slotDate", slotDate);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-01-16");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [showForm, setShowForm] = useState(false);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
      {/* Donation Modal */}
      {showForm ? (
        <div className="max-w-2xl mx-auto">
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
              <ClinicAddress doctor={doctorData} />
              <Specialties doctor={doctorData} />
              <SpeciesTreated doctor={doctorData} />
              <ReviewsSection
                doctor={mockDoctor}
                showAll={showAllReviews}
                setShowAll={setShowAllReviews}
              />
            </div>

            {/* Booking */}
            <div className="xl:col-span-1">
              <BookingCard
                selectedSlotDate={slotDate}
                selectedSlotId={slotId}
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
