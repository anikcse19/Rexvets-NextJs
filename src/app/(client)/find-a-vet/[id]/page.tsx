"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Heart,
  Stethoscope,
  GraduationCap,
  Building,
  Users,
  CheckCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import DonationModal from "@/components/Donation/DonationModal";

// Mock doctor data
const mockDoctor = {
  id: "1",
  name: "Dr. Anik Rahman",
  image:
    "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop&crop=face",
  degree: "DVM, PhD in Veterinary Medicine",
  bio: "Dr. Anik Rahman is a highly experienced veterinarian with over 12 years of practice in small animal medicine and surgery. He specializes in emergency medicine, cardiology, and complex surgical procedures. Dr. Rahman is passionate about providing compassionate care to pets and educating pet owners about preventive healthcare.",
  rating: 4.9,
  totalReviews: 847,
  licenseNumber: "VET-BD-2012-001234",
  experience: "12 years",

  contact: {
    phone: "+880 1234-567890",
    email: "anik@rexvet.com",
    clinicName: "RexVet Animal Hospital",
    address: "456 Pet Care Avenue, Gulshan, Dhaka 1212, Bangladesh",
  },

  specialties: [
    "Small Animal Surgery",
    "Emergency Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Oncology",
    "Dental Care",
    "Nutrition",
  ],

  speciesTreated: [
    { name: "Dogs", experience: "Expert", count: "1,245+" },
    { name: "Cats", experience: "Expert", count: "987+" },
    { name: "Birds", experience: "Advanced", count: "234+" },
    { name: "Rabbits", experience: "Advanced", count: "156+" },
    { name: "Hamsters", experience: "Intermediate", count: "89+" },
    { name: "Guinea Pigs", experience: "Intermediate", count: "67+" },
  ],

  reviews: [
    {
      id: "1",
      patientName: "Sarah Johnson",
      petName: "Max",
      rating: 5,
      date: "2025-01-10",
      comment:
        "Dr. Rahman was absolutely wonderful with Max. He took the time to explain everything and made sure we understood the treatment plan. Max is doing much better now!",
    },
    {
      id: "2",
      patientName: "Mike Chen",
      petName: "Luna",
      rating: 5,
      date: "2025-01-08",
      comment:
        "Excellent care and very professional. Dr. Rahman diagnosed Luna's condition quickly and the treatment was very effective. Highly recommended!",
    },
    {
      id: "3",
      patientName: "Emma Davis",
      petName: "Charlie",
      rating: 5,
      date: "2025-01-05",
      comment:
        "Amazing veterinarian! Charlie was very anxious but Dr. Rahman was so gentle and patient. The surgery went perfectly and Charlie recovered quickly.",
    },
    {
      id: "4",
      patientName: "James Wilson",
      petName: "Bella",
      rating: 4,
      date: "2025-01-03",
      comment:
        "Great experience overall. Dr. Rahman is very knowledgeable and caring. The only minor issue was the wait time, but the quality of care made up for it.",
    },
    {
      id: "5",
      patientName: "Lisa Brown",
      petName: "Rocky",
      rating: 5,
      date: "2024-12-28",
      comment:
        "Dr. Rahman saved Rocky's life during an emergency visit. His quick thinking and expertise were incredible. We're forever grateful!",
    },
    {
      id: "6",
      patientName: "David Kim",
      petName: "Milo",
      rating: 5,
      date: "2024-12-25",
      comment:
        "Outstanding veterinarian! Milo's chronic condition is now well-managed thanks to Dr. Rahman's comprehensive treatment plan.",
    },
  ],
};

// Mock available slots for booking
const mockAvailableSlots = {
  "2025-01-16": [
    { time: "09:00", available: true },
    { time: "09:30", available: false },
    { time: "10:00", available: true },
    { time: "10:30", available: true },
    { time: "11:00", available: false },
    { time: "11:30", available: true },
    { time: "14:00", available: true },
    { time: "14:30", available: true },
    { time: "15:00", available: false },
    { time: "15:30", available: true },
    { time: "16:00", available: true },
    { time: "16:30", available: false },
  ],
  "2025-08-17": [
    { time: "09:00", available: true },
    { time: "09:30", available: true },
    { time: "10:00", available: false },
    { time: "10:30", available: true },
    { time: "11:00", available: true },
    { time: "11:30", available: false },
    { time: "14:00", available: false },
    { time: "14:30", available: true },
    { time: "15:00", available: true },
    { time: "15:30", available: true },
    { time: "16:00", available: false },
    { time: "16:30", available: true },
  ],
  "2025-08-18": [],
  "2025-08-19": [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
  ],
};

export default function DoctorProfilePage() {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2025-01-16");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showDonationModal, setShowDonationModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getNextFewDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      days.push({
        date: dateString,
        display:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
      });
    }
    return days;
  };

  const handleBookAppointment = () => {
    if (selectedSlot) {
      // Here you would handle the booking logic
      console.log(`Booking appointment for ${selectedDate} at ${selectedSlot}`);
      setShowDonationModal(true);
    }
  };

  const availableDays = getNextFewDays();
  const selectedDateSlots =
    mockAvailableSlots[selectedDate as keyof typeof mockAvailableSlots] || [];
  const availableSlots = selectedDateSlots.filter((slot) => slot.available);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-[1366px] mx-auto space-y-8">
        {/* Back Button */}
        <Link href="/find-vet">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Find Vet
          </Button>
        </Link>

        {/* Doctor Profile Header */}
        <Card className="shadow-xl border-0 bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <Avatar className="w-32 h-32 border-4 border-white/20 shadow-xl">
                <AvatarImage src={mockDoctor.image} alt={mockDoctor.name} />
                <AvatarFallback className="text-3xl font-bold text-gray-800">
                  {mockDoctor.name
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {mockDoctor.name}
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  {mockDoctor.degree}
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(mockDoctor.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-white/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-medium">
                      {mockDoctor.rating} ({mockDoctor.totalReviews} reviews)
                    </span>
                  </div>

                  <Badge className="bg-white/20 text-white border-white/30">
                    <Award className="w-4 h-4 mr-1" />
                    {mockDoctor.experience} Experience
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100">
                      {mockDoctor.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100">
                      {mockDoctor.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100">
                      {mockDoctor.contact.clinicName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-200" />
                    <span className="text-blue-100">Dhaka, Bangladesh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Doctor Info */}
          <div className="xl:col-span-2 space-y-8">
            {/* Bio Section */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  About Dr. {mockDoctor.name.split(" ")[1]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {mockDoctor.bio}
                </p>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 text-white p-2 rounded-lg">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">
                        Licensed & Verified
                      </p>
                      <p className="text-green-700 text-sm">
                        License: {mockDoctor.licenseNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Clinic Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                  <p className="font-semibold text-red-900 mb-1">
                    {mockDoctor.contact.clinicName}
                  </p>
                  <p className="text-red-700">{mockDoctor.contact.address}</p>
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {mockDoctor.specialties.map((specialty, index) => (
                    <Badge
                      key={index}
                      className="bg-purple-100 text-purple-700 border-purple-300 justify-center py-2"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Species Treated */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Species Treated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockDoctor.speciesTreated.map((species, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200"
                    >
                      <div>
                        <p className="font-semibold text-pink-900">
                          {species.name}
                        </p>
                        <p className="text-pink-700 text-sm">
                          {species.count} treated
                        </p>
                      </div>
                      <Badge
                        className={`${
                          species.experience === "Expert"
                            ? "bg-green-100 text-green-700 border-green-300"
                            : species.experience === "Advanced"
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-yellow-100 text-yellow-700 border-yellow-300"
                        }`}
                      >
                        {species.experience}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Patient Reviews ({mockDoctor.totalReviews})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(showAllReviews
                    ? mockDoctor.reviews
                    : mockDoctor.reviews.slice(0, 4)
                  ).map((review) => (
                    <div
                      key={review.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {review.patientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            Pet: {review.petName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}

                  {mockDoctor.reviews.length > 4 && (
                    <Button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      variant="outline"
                      className="w-full border-gray-300 hover:bg-gray-50"
                    >
                      {showAllReviews ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Show Less Reviews
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View All {mockDoctor.reviews.length} Reviews
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking System */}
          <div className="xl:col-span-1">
            <Card className="shadow-xl border-0 bg-white sticky top-6">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  Book Appointment
                </CardTitle>
                <p className="text-green-100 mt-1">
                  Select your preferred date and time
                </p>
              </div>

              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Select Date
                    </Label>
                    <div className="grid grid-cols-1 gap-2">
                      {availableDays.map((day) => (
                        <button
                          key={day.date}
                          onClick={() => {
                            setSelectedDate(day.date);
                            setSelectedSlot(null);
                          }}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedDate === day.date
                              ? "border-green-500 bg-green-50 text-green-900"
                              : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                          }`}
                        >
                          <p className="font-medium">{day.display}</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(day.date)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">
                      Available Times
                    </Label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`p-3 rounded-lg border text-center transition-all ${
                              selectedSlot === slot.time
                                ? "border-green-500 bg-green-50 text-green-900"
                                : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                            }`}
                          >
                            <p className="font-medium">
                              {formatTime(slot.time)}
                            </p>
                            <p className="text-xs text-gray-600">GMT+6</p>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600 font-medium">
                          Dr. {mockDoctor.name.split(" ")[1]} is not available
                          on {formatDate(selectedDate)}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          Please select another date
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selected Appointment Summary */}
                  {selectedSlot && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="font-semibold text-green-900">
                          Appointment Selected
                        </p>
                      </div>
                      <p className="text-green-700 text-sm">
                        {formatDate(selectedDate)} at {formatTime(selectedSlot)}{" "}
                        (GMT+6)
                      </p>
                    </div>
                  )}

                  {/* Book Button */}
                  <Button
                    onClick={handleBookAppointment}
                    disabled={!selectedSlot}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedSlot ? "Confirm Booking" : "Select Time Slot"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        doctorName={mockDoctor.name}
        appointmentDate={formatDate(selectedDate)}
        appointmentTime={selectedSlot ? formatTime(selectedSlot) : ""}
      />
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}
