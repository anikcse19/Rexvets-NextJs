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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useSearchParams } from "next/navigation";
import { getPetsByParent } from "../Dashboard/PetParent/Service/pet";
import AddPetModal from "../Dashboard/PetParent/Pets/AddPetModal";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  image?: string;
  color?: string;
}

const mockDoctor: Doctor = {
  id: "1",
  name: "Dr. Sarah Johnson",
  specialty: "Veterinary Internal Medicine",
  image:
    "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400",
  location: "Pet Care Center, Downtown",
  experience: "12 years experience",
  rating: 4.9,
  certifications: ["Board Certified", "Emergency Care", "Surgery Specialist"],
};

const mockPets: Pet[] = [
  {
    id: "1",
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    age: "3 years",
    image:
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-amber-400 to-orange-500",
  },
  {
    id: "2",
    name: "Luna",
    type: "Cat",
    breed: "Persian",
    age: "2 years",
    image:
      "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400",
    color: "from-purple-400 to-pink-500",
  },
];

const predefinedConcerns = [
  { name: "General Checkup", icon: "🩺", color: "from-blue-500 to-cyan-500" },
  { name: "Vaccination", icon: "💉", color: "from-green-500 to-emerald-500" },
  { name: "Dental Care", icon: "🦷", color: "from-yellow-500 to-amber-500" },
  { name: "Skin Issues", icon: "🧴", color: "from-pink-500 to-rose-500" },
  {
    name: "Behavioral Problems",
    icon: "🧠",
    color: "from-purple-500 to-violet-500",
  },
  {
    name: "Weight Management",
    icon: "⚖️",
    color: "from-indigo-500 to-blue-500",
  },
  { name: "Digestive Issues", icon: "🍽️", color: "from-orange-500 to-red-500" },
  { name: "Eye/Ear Problems", icon: "👁️", color: "from-teal-500 to-cyan-500" },
  { name: "Injury Assessment", icon: "🩹", color: "from-red-500 to-pink-500" },
  {
    name: "Medication Review",
    icon: "💊",
    color: "from-emerald-500 to-green-500",
  },
];

export default function AppointmentConfirmation() {
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [customConcern, setCustomConcern] = useState("");
  const [customConcerns, setCustomConcerns] = useState<string[]>([]);
  const [moreDetails, setMoreDetails] = useState("");
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
  });
  const [veterinarian, setVeterinarian] = useState<Doctor | null>(null);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const time = searchParams.get("time");

  const fetchPets = async () => {
    const data = await getPetsByParent("68a95dead652a98b123bf4b3");
    setPets(data || []);
  };

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctorData");
    if (storedDoctor) {
      setVeterinarian(JSON.parse(storedDoctor));
    }
    fetchPets();
  }, []);

  console.log("pets", pets);

  const handlePetSelection = (petId: string) => {
    setSelectedPets((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  const handleConcernSelection = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  };

  const addCustomConcern = () => {
    if (
      customConcern.trim() &&
      !customConcerns.includes(customConcern.trim())
    ) {
      setCustomConcerns([...customConcerns, customConcern.trim()]);
      setCustomConcern("");
    }
  };

  const removeCustomConcern = (concern: string) => {
    setCustomConcerns(customConcerns.filter((c) => c !== concern));
  };

  const handleCloseModal = () => {
    setIsAddPetModalOpen(false);
    // setEditingPet(null);
  };

  const completeAppointment = () => {
    if (selectedPets.length === 0) {
      alert("Please select at least one pet for the appointment.");
      return;
    }

    const allConcerns = [...selectedConcerns, ...customConcerns];
    if (allConcerns.length === 0) {
      alert("Please select or add at least one concern.");
      return;
    }

    console.log({
      doctor: mockDoctor,
      selectedPets: selectedPets,
      concerns: allConcerns,
      details: moreDetails,
    });

    alert("Appointment confirmed successfully!");
  };

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
        <Card className="mb-8 border border-gray-200 bg-white backdrop-blur-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              Your Veterinarian
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col lg:flex-row items-start gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                  <AvatarImage
                    src={veterinarian?.profileImage}
                    alt={mockDoctor.name}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                    {veterinarian?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1">
                  <Award className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {veterinarian?.name}
                  </h3>
                  <p className="text-xl text-blue-600 font-semibold mb-3">
                    {veterinarian?.specialization}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-4 h-4",
                            i < Math.floor(veterinarian?.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">
                      {veterinarian?.rating}/5.0
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {veterinarian?.certifications.map((cert, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">
                        {veterinarian?.state}, {veterinarian?.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-900">
                        {veterinarian?.yearsOfExperience}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="font-semibold text-gray-900">
                        {date}, {time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">30 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pet Selection */}
        <Card className="mb-8 border border-gray-200 bg-white backdrop-blur-xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-green-600 rounded-xl">
                  <PawPrint className="w-6 h-6 text-white" />
                </div>
                Choose Your Pets
                <Badge className="bg-blue-600 text-white">
                  {selectedPets.length} selected
                </Badge>
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => setIsAddPetModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Pet
              </Button>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(Array.isArray(pets) ? pets : [])?.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => handlePetSelection(pet.id)}
                  className={cn(
                    "relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group",
                    selectedPets.includes(pet.id)
                      ? "bg-blue-600 text-white shadow-2xl scale-105"
                      : "bg-white hover:bg-gray-50 shadow-lg border border-gray-100"
                  )}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <Avatar className="w-16 h-16 ring-4 ring-white/50 shadow-lg">
                        <AvatarImage src={pet.image} alt={pet.name} />
                        <AvatarFallback
                          className={cn(
                            "text-white text-lg font-bold bg-gradient-to-r",
                            pet.color || "from-gray-400 to-gray-500"
                          )}
                        >
                          {pet.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {selectedPets.includes(pet.id) && (
                        <div className="p-2 bg-white/20 rounded-full">
                          <CheckCircle className="w-6 h-6 text-white animate-pulse" />
                        </div>
                      )}
                    </div>
                    <h4
                      className={cn(
                        "text-xl font-bold mb-2",
                        selectedPets.includes(pet.id)
                          ? "text-white"
                          : "text-gray-900"
                      )}
                    >
                      {pet.name}
                    </h4>
                    <div className="space-y-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          selectedPets.includes(pet.id)
                            ? "text-white/90"
                            : "text-gray-600"
                        )}
                      >
                        {pet.type} • {pet.breed}
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          selectedPets.includes(pet.id)
                            ? "text-white/80"
                            : "text-gray-500"
                        )}
                      >
                        {pet.age} old
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Concerns Selection */}
        <Card className="mb-8 border border-gray-200 bg-white backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-red-600 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              Health Concerns
              <Badge className="bg-red-600 text-white">
                {selectedConcerns.length + customConcerns.length} selected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedConcerns.map((concern) => (
                <div
                  key={concern.name}
                  onClick={() => handleConcernSelection(concern.name)}
                  className={cn(
                    "relative p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 group border-2",
                    selectedConcerns.includes(concern.name)
                      ? `bg-gradient-to-r ${concern.color} text-white border-transparent shadow-lg scale-105`
                      : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "text-2xl p-2 rounded-lg transition-all duration-300",
                        selectedConcerns.includes(concern.name)
                          ? "bg-white/20"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      )}
                    >
                      {concern.icon}
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "font-semibold transition-colors duration-300",
                          selectedConcerns.includes(concern.name)
                            ? "text-white"
                            : "text-gray-900"
                        )}
                      >
                        {concern.name}
                      </p>
                    </div>
                    {selectedConcerns.includes(concern.name) && (
                      <CheckCircle className="w-5 h-5 text-white animate-pulse" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <Label className="text-lg font-semibold mb-4 block text-gray-900">
                Add Custom Concern
              </Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Describe your specific concern..."
                  value={customConcern}
                  onChange={(e) => setCustomConcern(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomConcern()}
                  className="flex-1 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-300"
                />
                <Button
                  onClick={addCustomConcern}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>

            {customConcerns.length > 0 && (
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-900">
                  Your Custom Concerns
                </Label>
                <div className="flex flex-wrap gap-3">
                  {customConcerns.map((concern) => (
                    <Badge
                      key={concern}
                      variant="secondary"
                      className="cursor-pointer bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200 transition-all duration-300 transform hover:scale-105 px-4 py-2 text-sm"
                      onClick={() => removeCustomConcern(concern)}
                    >
                      {concern} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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

        {/* Complete Appointment Button */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
            <Button
              onClick={completeAppointment}
              size="lg"
              className="relative px-12 py-6 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-3xl border-0"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                Complete Appointment
                <Sparkles className="w-6 h-6" />
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

      <AddPetModal isOpen={isAddPetModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
