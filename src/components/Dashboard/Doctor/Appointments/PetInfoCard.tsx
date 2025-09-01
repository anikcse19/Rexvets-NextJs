"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Calendar,
  Weight,
  Palette,
  Shield,
  AlertTriangle,
  Pill,
  Syringe,
  FileText,
} from "lucide-react";
import { Pet } from "@/lib/types";

interface PetInfoCardProps {
  pet: Pet;
}

export default function PetInfoCard({ pet }: PetInfoCardProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "Not available";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return `${ageInYears - 1} years`;
    }
    return `${ageInYears} years`;
  };

  const formatWeight = (weight: string | number, unit?: string) => {
    if (!weight) return "Not available";
    const weightValue = typeof weight === "string" ? weight : weight.toString();
    const weightUnit = unit || "kg";
    return `${weightValue} ${weightUnit}`;
  };

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
            <p className="text-pink-100">
              Complete pet profile and medical history
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Pet Profile */}
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-pink-100 shadow-lg">
              <AvatarImage
                src={pet.image}
                alt={pet.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-pink-100 to-rose-100">
                {pet.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {pet.name}
            </h3>
            <p className="text-gray-600 mb-3">{pet.breed || pet.species}</p>
            <Badge className="bg-pink-100 text-pink-700 border-pink-300">
              Patient ID: {pet._id}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <InfoItem
              icon={<Calendar className="w-4 h-4 text-blue-600" />}
              label="Age"
              value={
                pet?.dateOfBirth ||
                (pet.dateOfBirth
                  ? calculateAge(pet.dateOfBirth)
                  : "Not available")
              }
            />
            <InfoItem
              icon={<Weight className="w-4 h-4 text-green-600" />}
              label="Weight"
              value={formatWeight(pet.weight || "", pet.weightUnit)}
            />
            <InfoItem
              icon={<Heart className="w-4 h-4 text-pink-600" />}
              label="Gender"
              value={pet.gender || "Not available"}
            />
            <InfoItem
              icon={<Palette className="w-4 h-4 text-purple-600" />}
              label="Color"
              value={pet.primaryColor || pet.primaryColor || "Not available"}
            />
          </div>

          {/* Species & Spay/Neuter Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white p-2 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Species</p>
                  <p className="text-blue-700 font-medium text-sm capitalize">
                    {pet.species}
                  </p>
                </div>
              </div>
            </div>

            {pet.spayedNeutered && (
              <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-500 text-white p-2 rounded-lg">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-orange-900">Status</p>
                    <p className="text-orange-700 font-medium text-sm capitalize">
                      {pet.spayedNeutered}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Allergies */}
          {pet.allergies && pet.allergies.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Allergies
              </h4>
              <div className="flex flex-wrap gap-2">
                {pet.allergies.map((allergy, index) => (
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

          {/* Medical Conditions */}
          {pet.medicalConditions && pet.medicalConditions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                Medical Conditions
              </h4>
              <div className="flex flex-wrap gap-2">
                {pet.medicalConditions.map((condition, index) => (
                  <Badge
                    key={index}
                    className="bg-orange-100 text-orange-700 border-orange-300"
                  >
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Current Medications */}
          {pet.currentMedications && pet.currentMedications.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Pill className="w-4 h-4 text-orange-600" />
                Current Medications
              </h4>
              <div className="space-y-2">
                {pet.currentMedications.map((medication, index) => (
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

          {/* Health Status */}
          {pet.healthStatus && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white p-2 rounded-lg">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Health Status</p>
                  <p className="text-green-700">{pet.healthStatus}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Vaccination */}
          {pet.nextVaccination && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 text-white p-2 rounded-lg">
                  <Syringe className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-purple-900">
                    Next Vaccination
                  </p>
                  <p className="text-purple-700">
                    {formatDate(pet.nextVaccination)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Last Visit */}
          {pet.lastVisit && (
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-gray-500 text-white p-2 rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Last Visit</p>
                  <p className="text-gray-700">{formatDate(pet.lastVisit)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {pet.emergencyContact && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
              <div className="flex items-center gap-3">
                <div className="bg-red-500 text-white p-2 rounded-lg">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-red-900">
                    Emergency Contact
                  </p>
                  <p className="text-red-700">{pet.emergencyContact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Veterinarian Notes */}
          {pet.veterinarianNotes && (
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-500 text-white p-2 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">Vet Notes</p>
                  <p className="text-indigo-700 text-sm">
                    {pet.veterinarianNotes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

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
