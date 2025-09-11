"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Plus,
  Edit3,
  Calendar,
  Weight,
  Palette,
  Shield,
  AlertTriangle,
  Pill,
  Syringe,
  User,
  Activity,
  PawPrint,
} from "lucide-react";
import AddPetModal from "./Pets/AddPetModal";
import { getPetsByParent } from "./Service/pet";
import { useSession } from "next-auth/react";

// Mock pets data - this would come from your API

interface SessionUserWithId {
  refId: string;
  name: string;
  email: string;
  image?: string;
}

export default function MyPetsPage() {
  const { data: session } = useSession();

  // console.log("session", session);
  const [loading, setLoading] = useState(true);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);

  const fetchPets = async () => {
    setLoading(true); // start loading
    const user = session?.user as SessionUserWithId | undefined;
    if (!user?.refId) {
      setPets([]);
      setLoading(false);
      return;
    }
    try {
      const data = await getPetsByParent(user.refId);
      console.log("pet data", data);
      setPets(data?.data || []);
    } catch (err) {
      console.error(err);
      setPets([]);
    } finally {
      setLoading(false); // finish loading
    }
  };

  useEffect(() => {
    fetchPets();
  }, [session]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const formatAge = (dateOfBirth: string) => {
    const age = calculateAge(dateOfBirth);
    const parts = [];

    if (age.years > 0)
      parts.push(`${age.years} year${age.years !== 1 ? "s" : ""}`);
    if (age.months > 0)
      parts.push(`${age.months} month${age.months !== 1 ? "s" : ""}`);
    if (age.days > 0 && age.years === 0)
      parts.push(`${age.days} day${age.days !== 1 ? "s" : ""}`);

    return parts.join(", ") || "Less than a day";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-green-100 text-green-700 border-green-300";
      case "Under Treatment":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Critical":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleAddPet = () => {
    setEditingPet(null);
    setIsAddPetModalOpen(true);
  };

  const handleEditPet = (pet: any) => {
    setEditingPet(pet);
    setIsAddPetModalOpen(true);
  };

  // const handlePetSuccess = (petData: any) => {
  //   if (editingPet) {
  //     // Update existing pet
  //     setPets(
  //       pets.map((pet) =>
  //         pet.id === editingPet.id ? { ...pet, ...petData } : pet
  //       )
  //     );
  //     console.log("Updating pet:", { id: editingPet.id, ...petData });
  //   } else {
  //     // Add new pet
  //     const newPet = {
  //       id: Date.now().toString(),
  //       ...petData,
  //       lastVisit: new Date().toISOString().split("T")[0],
  //       nextVaccination: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
  //         .toISOString()
  //         .split("T")[0],
  //       healthStatus: "Healthy",
  //     };
  //     setPets([...pets, newPet]);
  //     console.log("Adding new pet:", newPet);
  //   }
  // };

  const handleCloseModal = () => {
    setIsAddPetModalOpen(false);
    setEditingPet(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            My Pets
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your beloved companions and their information.
          </p>
        </div>

        <Button
          onClick={handleAddPet}
          className="bg-gradient-to-r cursor-pointer from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Pet
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl">
                <PawPrint className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">
                  {pets?.length}
                </p>
                <p className="text-blue-700 text-sm">Total Pets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-900">
                  {
                    pets.filter((pet) => pet?.healthStatus === "Healthy")
                      ?.length
                  }
                </p>
                <p className="text-green-700 text-sm">Healthy Pets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-900">
                  {
                    pets.filter((pet) => pet.healthStatus === "Under Treatment")
                      .length
                  }
                </p>
                <p className="text-yellow-700 text-sm">Under Treatment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">
                  {pets.filter((pet) => pet.microchipId)?.length}
                </p>
                <p className="text-purple-700 text-sm">Microchipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          // Skeletons
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="group shadow-xl border-0 bg-white overflow-hidden rounded-xl animate-pulse"
            >
              {/* Image skeleton */}
              <div className="relative h-48 bg-gray-200" />

              {/* Content skeleton */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                {/* Breed */}
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                {/* Age */}
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : pets.length === 0 ? (
          // No pets message
          <div className="col-span-full text-center py-20 text-gray-500">
            <PawPrint className="w-10 h-10 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold">No pets available</p>
            <p className="text-sm">
              Add a new pet to start tracking their info!
            </p>
          </div>
        ) : (
          // Pets
          pets.map((pet) => (
            <Card
              key={pet.id}
              className="group shadow-xl border-0 bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Pet Image Header */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Edit Button */}
                <Button
                  onClick={() => handleEditPet(pet)}
                  size="sm"
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>

                {/* Health Status Badge */}
                <div className="absolute bottom-4 left-4">
                  <Badge
                    className={`${getHealthStatusColor(
                      pet.healthStatus
                    )} font-semibold`}
                  >
                    {pet.healthStatus}
                  </Badge>
                </div>

                {/* Microchip Indicator */}
                {pet.microchipId && (
                  <div className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                {/* Pet Basic Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {pet.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{pet.breed}</p>
                  <p className="text-sm text-gray-500">
                    {formatAge(pet.dateOfBirth)} old
                  </p>
                </div>

                {/* Pet Details Grid */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoItem
                      icon={<User className="w-4 h-4 text-blue-600" />}
                      label="Gender"
                      value={
                        pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)
                      }
                    />
                    <InfoItem
                      icon={<Weight className="w-4 h-4 text-green-600" />}
                      label="Weight"
                      value={`${pet.weight} ${pet.weightUnit}`}
                    />
                    <InfoItem
                      icon={<Palette className="w-4 h-4 text-purple-600" />}
                      label="Color"
                      value={pet.primaryColor}
                    />
                    <InfoItem
                      icon={<Heart className="w-4 h-4 text-pink-600" />}
                      label="Status"
                      value={
                        pet.spayedNeutered.charAt(0).toUpperCase() +
                        pet.spayedNeutered.slice(1)
                      }
                    />
                  </div>

                  {/* Microchip Info */}
                  {pet.microchipId && (
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Microchip ID
                          </p>
                          <p className="text-xs text-blue-700 font-mono">
                            {pet.microchipId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {pet?.allergies && pet?.allergies?.length > 0 && (
                    <div className="hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <p className="text-sm font-medium text-gray-900">
                          Allergies
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(pet.allergies).map(
                          (allergy: any, index: any) => (
                            <Badge
                              key={index}
                              className="bg-red-100 text-red-700 border-red-300 text-xs"
                            >
                              {allergy}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Current Medications */}
                  {pet?.currentMedications &&
                    pet?.currentMedications?.length > 0 && (
                      <div className="hidden">
                        <div className="flex items-center gap-2 mb-2">
                          <Pill className="w-4 h-4 text-orange-600" />
                          <p className="text-sm font-medium text-gray-900">
                            Current Medications
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(pet.currentMedications).map(
                            (medication: any, index: any) => (
                              <Badge
                                key={index}
                                className="bg-orange-100 text-orange-700 border-orange-300 text-xs"
                              >
                                {medication}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Medical Dates */}
                  <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-200 hidden">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Last Visit</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatDate(pet.lastVisit)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Syringe className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Next Vaccination</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        {formatDate(pet.nextVaccination)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}

        {/* Add New Pet Card */}
        {/* {!loading && (
          <Card
            className="group cursor-pointer shadow-xl border-2 border-dashed border-gray-300 hover:border-pink-400 bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            onClick={handleAddPet}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors mb-2">
                Add New Pet
              </h3>
              <p className="text-gray-600">
                Register a new companion to your family
              </p>
            </CardContent>
          </Card>
        )} */}
      </div>

      {/* Add/Edit Pet Modal */}
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={handleCloseModal}
        // onSuccess={handlePetSuccess}
        editingPet={editingPet}
      />
    </div>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-center gap-1 mb-1">
        {icon}
        <p className="text-xs font-medium text-gray-600">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
