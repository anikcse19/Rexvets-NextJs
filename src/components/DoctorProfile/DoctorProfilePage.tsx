"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import DonationModal from "@/components/Donation/DonationModal";

import DoctorHeader from "./DoctorHeader";
import AboutDoctor from "./AboutDoctor";
import ClinicAddress from "./ClinicAddress";
import Specialties from "./Specialties";
import SpeciesTreated from "./SpeciesTreated";
import ReviewsSection from "./ReviewsSection";
import { formatDate } from "./lib/utils";
import { mockDoctor } from "./data";
import { Doctor } from "./type";
import BookingCard from "./BookingCard";

export default function DoctorProfilePage({
  doctorData,
}: {
  doctorData: Doctor;
}) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-01-16");

  const [showDonationModal, setShowDonationModal] = useState(false);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
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
              doctorName={mockDoctor.name}
              doctorData={doctorData}
              onConfirm={(date: string, time: string) => {
                console.log(`Booking appointment for ${date} at ${time}`);
                setShowDonationModal(true);
                setSelectedDate(date);
              }}
            />
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        doctorName={mockDoctor.name}
        appointmentDate={formatDate(selectedDate)}
        // appointmentTime={selectedSlot ? formatTime(selectedSlot) : ""}
      />
    </div>
  );
}
