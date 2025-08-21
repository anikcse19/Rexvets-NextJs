"use client";
import React, { useState } from "react";
import { ArrowLeft, Heart, Users, Award, TrendingUp } from "lucide-react";
import DonationFormWrapper from "./DonationFormWrapper";
import BookingSystem from "../DoctorProfile/BookingSystem";

const DonationPage = () => {
  const [showForm, setShowForm] = useState(false);

  const stats = [
    {
      icon: Heart,
      label: "Dogs Helped",
      value: "2,847",
      color: "text-red-600",
    },
    {
      icon: Users,
      label: "Families Served",
      value: "1,234",
      color: "text-blue-600",
    },
    {
      icon: Award,
      label: "Success Rate",
      value: "98%",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Monthly Growth",
      value: "+24%",
      color: "text-purple-600",
    },
  ];

  const handleDonationComplete = (amount: number) => {
    console.log("Donation completed:", amount);
    // Here you would typically redirect to a confirmation page
    // or show a success message and handle the booking confirmation
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            // onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to appointment
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!showForm ? (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Help Street Dogs
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Your veterinary appointment fee goes directly to supporting
                street dogs in need. Every donation provides food, medical care,
                and shelter for abandoned animals.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:from-red-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <Heart className="w-5 h-5" />
                Make Your Donation
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Impact Stories */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Recent Impact Stories
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <img
                    src="https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Rescued dog"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Max's Recovery
                  </h3>
                  <p className="text-sm text-gray-600">
                    Found injured on the street, Max received emergency surgery
                    and is now healthy and adopted.
                  </p>
                </div>

                <div className="text-center">
                  <img
                    src="https://images.pexels.com/photos/1851477/pexels-photo-1851477.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Feeding program"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Daily Feeding
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our volunteers provide daily meals to over 100 street dogs
                    across the city.
                  </p>
                </div>

                <div className="text-center">
                  <img
                    src="https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Vaccination drive"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Vaccination Drive
                  </h3>
                  <p className="text-sm text-gray-600">
                    Monthly vaccination programs protect street dogs from
                    diseases and improve community health.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <DonationFormWrapper onDonationComplete={handleDonationComplete} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationPage;
