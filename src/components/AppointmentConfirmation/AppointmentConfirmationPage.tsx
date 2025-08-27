"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Clock,
  Plus,
  Heart,
  Stethoscope,
  Calendar,
  PawPrint,
  FileText,
  CheckCircle,
  Star,
  Sparkles,
  Shield,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Doctor } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { getPetsByParent } from "../Dashboard/PetParent/Service/pet";
import AddPetModal from "../Dashboard/PetParent/Pets/AddPetModal";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import PetConcerns from "./PetConcerns";
import PetSelection from "./PetSelection";
import DoctorDetails from "./DoctorDetails";

export default function AppointmentConfirmation() {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [customConcerns, setCustomConcerns] = useState<string[]>([]);
  const [moreDetails, setMoreDetails] = useState("");
  const [veterinarian, setVeterinarian] = useState<Doctor | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationStatus, setDonationStatus] = useState<{
    donationPaid: boolean;
    lastDonationDate?: string;
  } | null>(null);
  const [isCheckingDonation, setIsCheckingDonation] = useState(true);

  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const slot = searchParams.get("slot");

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctorData");
    if (storedDoctor) {
      setVeterinarian(JSON.parse(storedDoctor));
    }
  }, []);

  // Check access and donation status when session is available
  useEffect(() => {
    const checkAccess = async () => {
      if (session?.user?.refId) {
        try {
          const response = await fetch('/api/appointment-confirmation/check-access');
          const data = await response.json();
          
          if (!response.ok) {
            // Access denied - redirect based on error
            toast.error(data.message);
            window.location.href = data.redirectTo || "/donate";
            return;
          }
          
          // Access granted
          setDonationStatus(data.donationStatus);
        } catch (error) {
          console.error("Error checking access:", error);
          toast.error("Error checking access. Please try again.");
          window.location.href = "/donate";
          return;
        }
      }
      setIsCheckingDonation(false);
    };

    checkAccess();
  }, [session?.user?.refId]);

  const completeAppointment = async () => {
    // Prevent multiple submissions
    if (isProcessing) {
      toast.error("Appointment is being processed. Please wait...");
      return;
    }

    // Check if user is authenticated
    if (!session?.user?.refId) {
      toast.error("Please sign in to book an appointment.");
      return;
    }

    // Check donation status
    if (!donationStatus?.donationPaid) {
      toast.error("Please make a donation first to book an appointment.");
      window.location.href = "/donate";
      return;
    }

    if (!selectedPet) {
      toast.error("Please select at least one pet for the appointment.");
      return;
    }

    const allConcerns = [...selectedConcerns, ...customConcerns];
    if (allConcerns.length === 0) {
      toast.error("Please select or add at least one concern.");
      return;
    }

    setIsProcessing(true);

    try {
      console.log({
        doctor: veterinarian,
        selectedPets: selectedPet,
        concerns: allConcerns,
        details: moreDetails,
      });

      const appointmentCreateData = {
        veterinarian: veterinarian?._id,
        petParent: session.user.refId,
        pet: selectedPet,
        notes: moreDetails,
        feeUSD: 0,
        reasonForVisit: "",
        reminderSent: true,
        slotId: slot,
        appointmentType: "general_checkup",
        isFollowUp: false,
        concerns: allConcerns,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appointmentCreateData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create appointment");
      }

      const data = await res.json();
      console.log("Appointment created:", data);
      
      if (data.success) {
        // Mark donation as used
        try {
          await fetch("/api/pet-parent/update-donation-status", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              petParentId: session.user.refId,
              donationPaid: false,
            }),
          });
        } catch (error) {
          console.error("Error updating donation status:", error);
        }

        toast.success("Appointment successfully created!");
        localStorage.removeItem("doctorData");
        window.location.href = "/dashboard/pet-parent/appointments";
      } else {
        throw new Error(data.message || "Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create appointment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Show loading while checking donation status
  if (isCheckingDonation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking donation status...</p>
        </div>
      </div>
    );
  }

  // Show error if no session
  if (!session?.user?.refId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please sign in to access this page.</p>
          <Button onClick={() => window.location.href = "/auth/signin"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white/50"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-200/30 rounded-full blur-3xl animate-pulse"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {/* Floating Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-full px-6 py-3 mb-6 border border-gray-200 shadow-lg">
            <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="text-gray-700 font-medium">Premium Pet Care</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4 leading-tight">
            Confirm Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Pet&apos;s Appointment
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Review and finalize your appointment details with our expert
            veterinary team
          </p>
        </div>

        {/* Doctor Card */}
        <DoctorDetails veterinarian={veterinarian} date={date} time={time} />

        {/* Pet Selection */}
        <PetSelection
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
        />

        {/* Concerns Selection */}
        <PetConcerns
          selectedConcerns={selectedConcerns}
          setSelectedConcerns={setSelectedConcerns}
          customConcerns={customConcerns}
          setCustomConcerns={setCustomConcerns}
        />

        {/* Additional Details */}
        <Card className="mb-10 border border-gray-200 shadow-xl bg-white backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-slate-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              Additional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Share any additional details about your pet's condition, recent changes in behavior, eating habits, or specific questions you'd like to discuss with Dr. Johnson..."
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
              className="min-h-40 resize-none border-2 border-gray-200 focus:border-purple-500 transition-colors duration-300 text-base leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Donation Status Indicator */}
        {session?.user?.refId && (
          <Card className="mb-6 border border-gray-200 shadow-lg bg-white backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${donationStatus?.donationPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Donation Status
                    </h3>
                    <p className="text-sm text-gray-600">
                      {donationStatus?.donationPaid 
                        ? `Donation paid - You can book your appointment`
                        : `No donation found - Please donate first to book an appointment`
                      }
                    </p>
                  </div>
                </div>
                {!donationStatus?.donationPaid && (
                  <Button
                    onClick={() => window.location.href = "/donate"}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Donate Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Appointment Button */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <Button
              onClick={completeAppointment}
              disabled={isProcessing || !donationStatus?.donationPaid}
              size="lg"
              className="relative px-12 py-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl border-0 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center gap-3">
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Complete Appointment
                    <Sparkles className="w-6 h-6" />
                  </>
                )}
              </div>
            </Button>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Your appointment will be confirmed instantly
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 right-10 animate-bounce delay-1000">
        <div className="w-3 h-3 bg-blue-400 rounded-full opacity-40"></div>
      </div>
      <div className="fixed bottom-32 left-10 animate-bounce delay-2000">
        <div className="w-2 h-2 bg-indigo-400 rounded-full opacity-40"></div>
      </div>
      <div className="fixed top-1/3 right-20 animate-bounce delay-3000">
        <div className="w-4 h-4 bg-slate-400 rounded-full opacity-30"></div>
      </div>
    </div>
  );
}
