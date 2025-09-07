"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Pet } from "@/lib/types";
import {
  AlertTriangle,
  Calendar,
  Heart,
  Palette,
  Pill,
  Shield,
  Syringe,
  Weight,
} from "lucide-react";
import React from "react";

interface PetCardProps {
  pet: Pet | null | undefined;
}
export const PetInfoCard = ({ pet }: PetCardProps) => {
  if (!pet) {
    return (
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Pet Information
              </CardTitle>
              <p className="text-pink-100">Your pet's complete profile</p>
            </div>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <p>Pet information not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  function getInitial(name: string | undefined | null): string {
    if (!name || typeof name !== "string" || name.length === 0) {
      return "P";
    }
    return name.charAt(0).toUpperCase();
  }

  function calculatePetAge(dob: string | undefined) {
    if (!dob) return "Age not available";
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else if (months > 0) {
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  }

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Pet Information
            </CardTitle>
            <p className="text-pink-100">Your pet's complete profile</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Pet Profile */}
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-pink-100 shadow-lg">
              <AvatarImage
                src={pet?.image}
                alt={pet?.name}
                className="object-cover"
              />
              {/* <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-pink-100 to-rose-100">
                {getInitial(pet?.name)}
              </AvatarFallback> */}
            </Avatar>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {pet?.name || "Pet"}
            </h3>
            <p className="text-gray-600 mb-3">
              {pet?.breed || "Breed not specified"}
            </p>
            <Badge className="bg-pink-100 text-pink-700 border-pink-300">
              Patient ID: {pet?._id || "N/A"}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              icon={<Calendar className="w-4 h-4 text-blue-600" />}
              label="Age"
              value={calculatePetAge(pet?.dateOfBirth)}
            />
            <InfoItem
              icon={<Weight className="w-4 h-4 text-green-600" />}
              label="Weight"
              value={
                pet?.weight
                  ? `${Number(pet.weight || 0).toFixed(1)} ${
                      pet.weightUnit || "kg"
                    }`
                  : "Weight not available"
              }
            />
            <InfoItem
              icon={<Heart className="w-4 h-4 text-pink-600" />}
              label="Gender"
              value={pet?.gender || "Not specified"}
            />
            <InfoItem
              icon={<Palette className="w-4 h-4 text-purple-600" />}
              label="Color"
              value={pet?.primaryColor || "Not specified"}
            />
          </div>

          {/* Microchip */}
          {/* <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-blue-900">Microchip ID</p>
                <p className="text-blue-700 font-mono text-sm">
                  {pet.microchipId}
                </p>
              </div>
            </div>
          </div> */}

          {/* Allergies */}
          {pet?.allergies?.length > 0 && (
            <div className="hidden">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {pet?.allergies?.map((allergy, index) => (
                  <Badge
                    key={index}
                    className="bg-red-100 text-red-700 border-red-300"
                  >
                    {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Current Medications */}
          {pet?.currentMedications?.length > 0 && (
            <div className="hidden">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-orange-600" />
                Current Medications
              </h4>
              <div className="space-y-2">
                {pet?.currentMedications?.map((medication, index) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <p className="font-medium text-orange-900">{medication}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vaccinations */}
          {/* <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Syringe className="w-4 h-4 text-green-600" />
              Vaccinations
            </h4>
            <div className="space-y-3">
              {pet.vaccinations.map((vaccination, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-green-900">
                        {vaccination.name}
                      </p>
                      <p className="text-sm text-green-700">
                        Last: {formatDate(vaccination.date)}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                      Due: {formatDate(vaccination.nextDue)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* Last Visit */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 hidden">
            <div className="flex items-center gap-3">
              <div className="bg-gray-500 text-white p-2 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Last Visit</p>
                {/* <p className="text-gray-700">{formatDate(pet.lastVisit)}</p> */}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <p className="text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className="font-semibold text-gray-900">{value}</p>
    </div>
  );
}
