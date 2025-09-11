"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Save,
  Camera,
  Plus,
  X,
  Calendar,
  Weight,
  Palette,
  Shield,
  Pill,
  AlertTriangle,
  Phone,
  HeartPlus,
} from "lucide-react";
import {
  PetRegistrationData,
  petRegistrationSchema,
} from "@/lib/validation/pet";
import { calculatePetAge } from "@/lib/utils";
import { colorOptions, speciesWithBreeds } from "@/lib";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (petData: PetRegistrationData) => void;
  editingPet?: any;
}

export default function AddPetModal({
  isOpen,
  onClose,
  editingPet,
}: AddPetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [petImage, setPetImage] = useState<File | null>(null);
  const [petImagePreview, setPetImagePreview] = useState<string | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PetRegistrationData>({
    resolver: zodResolver(petRegistrationSchema),
    defaultValues: {
      weightUnit: "kg",
      spayedNeutered: "intact",
    },
  });

  // Initialize form with editing pet data
  React.useEffect(() => {
    if (editingPet && isOpen) {
      // Set form values
      console.log("editing pet", editingPet);
      reset({
        name: editingPet.name,
        species: editingPet.species,
        breed: editingPet.breed,
        gender: editingPet.gender,
        primaryColor: editingPet.primaryColor,
        spayedNeutered: editingPet.spayedNeutered,
        weight: editingPet.weight,
        weightUnit: editingPet.weightUnit,
        dateOfBirth: editingPet.dateOfBirth,
        emergencyContact: editingPet.emergencyContact || "",
        veterinarianNotes: editingPet.veterinarianNotes || "",
      });

      // Set other state
      setSelectedSpecies(editingPet.species);

      if (editingPet.image) {
        // 👇 use existing URL for preview
        setPetImagePreview(editingPet.image);

        // keep petImage as string (URL) for later check
        setPetImage(editingPet.image);
      } else {
        setPetImage(null);
        setPetImagePreview(null);
      }

      setAllergies(editingPet.allergies || []);
      setMedicalConditions(editingPet.medicalConditions || []);
      setCurrentMedications(editingPet.currentMedications || []);
    }
  }, [editingPet, isOpen, reset]);

  const watchedDOB = watch("dateOfBirth");
  const calculatedAge = watchedDOB ? calculatePetAge(watchedDOB) : null;

  const watchedSpecies = watch("species");
  const watchedBreed = watch("breed");
  const watchedGender = watch("gender");
  const watchedColor = watch("primaryColor");
  const watchedSpay = watch("spayedNeutered");
  const watchedWeightUnit = watch("weightUnit");
  const watchedHealthStatus = watch("healthStatus");

  const today = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: PetRegistrationData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Append normal fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as any);
        }
      });

      // ✅ Append arrays properly
      allergies.forEach((item) => formData.append("allergies", item));
      medicalConditions.forEach((item) =>
        formData.append("medicalConditions", item)
      );
      currentMedications.forEach((item) =>
        formData.append("currentMedications", item)
      );

      if (session?.user) {
        formData.append(
          "parentId",
          (session.user as typeof session.user & { refId?: string })?.refId ||
            ""
        );
      }

      // ✅ Only append if new image selected
      if (petImage instanceof File) {
        formData.append("image", petImage);
      }

      // Decide API method and URL
      const method = editingPet ? "PATCH" : "POST";
      const url = editingPet ? `/api/pet/${editingPet._id}` : "/api/pet";

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success(
          result.message ||
            (editingPet ? "Updated Pet Successfully" : "Added Pet Successfully")
        );
        router.refresh();
        handleClose();
      } else {
        toast.error(
          result.message ||
            (editingPet ? "Update Pet Failed" : "Add Pet Failed")
        );
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      console.error("Error registering/updating pet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedSpecies("");
    setPetImage(null);
    setAllergies([]);
    setMedicalConditions([]);
    setCurrentMedications([]);
    setNewAllergy("");
    setNewCondition("");
    setNewMedication("");
    setPetImagePreview(null);
    onClose();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPetImage(file); // store file for FormData

      // generate preview for UI
      const reader = new FileReader();
      reader.onload = (e) => {
        setPetImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const addCondition = () => {
    if (
      newCondition.trim() &&
      !medicalConditions.includes(newCondition.trim())
    ) {
      setMedicalConditions([...medicalConditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (condition: string) => {
    setMedicalConditions(medicalConditions.filter((c) => c !== condition));
  };

  const addMedication = () => {
    if (
      newMedication.trim() &&
      !currentMedications.includes(newMedication.trim())
    ) {
      setCurrentMedications([...currentMedications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const removeMedication = (medication: string) => {
    setCurrentMedications(currentMedications.filter((m) => m !== medication));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-3 rounded-xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {editingPet ? "Edit Pet Information" : "Register New Pet"}
              </DialogTitle>
              <p className="text-gray-600">
                {editingPet
                  ? "Update your pet's information"
                  : "Add your beloved companion to your family"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
          {/* Pet Photo Section */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-32 h-32 border-4 border-pink-100 shadow-lg">
                <AvatarImage
                  src={petImagePreview || ""}
                  alt="Pet"
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-pink-100 to-rose-100 text-pink-700 text-2xl">
                  <Heart className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Upload your pet's photo
            </p>
          </div>

          {/* Basic Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Pet Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter your pet's name"
                  className="border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select
                  value={watchedSpecies}
                  onValueChange={(value) => {
                    setValue("species", value as any);
                    setSelectedSpecies(value);
                    setValue("breed", ""); // Reset breed when species changes
                  }}
                >
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Dog</SelectItem>
                    <SelectItem value="cat">Cat</SelectItem>
                    <SelectItem value="bird">Bird</SelectItem>
                    <SelectItem value="rabbit">Rabbit</SelectItem>
                    <SelectItem value="hamster">Hamster</SelectItem>
                    <SelectItem value="guinea-pig">Guinea Pig</SelectItem>
                    <SelectItem value="ferret">Ferret</SelectItem>
                    <SelectItem value="reptile">Reptile</SelectItem>
                    <SelectItem value="fish">Fish</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.species && (
                  <p className="text-sm text-red-600">
                    {errors.species.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Select
                  value={watchedBreed}
                  onValueChange={(value) => setValue("breed", value)}
                  disabled={!selectedSpecies}
                >
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Select breed" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSpecies &&
                      speciesWithBreeds[
                        selectedSpecies as keyof typeof speciesWithBreeds
                      ]?.map((breed) => (
                        <SelectItem key={breed} value={breed}>
                          {breed}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.breed && (
                  <p className="text-sm text-red-600">{errors.breed.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={watchedGender}
                  onValueChange={(value) =>
                    setValue("gender", value as "male" | "female")
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-600">
                    {errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="primaryColor"
                  className="flex items-center gap-2"
                >
                  <Palette className="w-4 h-4 text-purple-600" />
                  Primary Color *
                </Label>
                <Select
                  value={watchedColor}
                  onValueChange={(value) => setValue("primaryColor", value)}
                >
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Select primary color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.primaryColor && (
                  <p className="text-sm text-red-600">
                    {errors.primaryColor.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="spayedNeutered">Spay/Neuter Status *</Label>
                <Select
                  value={watchedSpay}
                  onValueChange={(value) =>
                    setValue("spayedNeutered", value as any)
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-pink-500 focus:ring-pink-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spayed">Spayed</SelectItem>
                    <SelectItem value="neutered">Neutered</SelectItem>
                    <SelectItem value="intact">Intact</SelectItem>
                  </SelectContent>
                </Select>
                {errors.spayedNeutered && (
                  <p className="text-sm text-red-600">
                    {errors.spayedNeutered.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Physical Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Weight className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Physical Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register("weight", { valueAsNumber: true })}
                  placeholder="Enter weight"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.weight && (
                  <p className="text-sm text-red-600">
                    {errors.weight.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weightUnit">Weight Unit *</Label>
                <Select
                  value={watchedWeightUnit}
                  onValueChange={(value) =>
                    setValue("weightUnit", value as "kg" | "lbs")
                  }
                >
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.weightUnit && (
                  <p className="text-sm text-red-600">
                    {errors.weightUnit.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="dateOfBirth"
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-green-600" />
                  Date of Birth *
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  max={today}
                  {...register("dateOfBirth")}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                />
                {errors.dateOfBirth && (
                  <p className="text-sm text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
            </div>

            {/* Age Display */}
            {calculatedAge && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 text-white p-2 rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">
                      Calculated Age
                    </p>
                    <p className="text-green-700">
                      {calculatedAge.years > 0 &&
                        `${calculatedAge.years} year${
                          calculatedAge.years !== 1 ? "s" : ""
                        } `}
                      {calculatedAge.months > 0 &&
                        `${calculatedAge.months} month${
                          calculatedAge.months !== 1 ? "s" : ""
                        } `}
                      {calculatedAge.days > 0 &&
                        `${calculatedAge.days} day${
                          calculatedAge.days !== 1 ? "s" : ""
                        }`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Information */}
          <div className="space-y-6 hidden">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Shield className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Medical Information
              </h3>
            </div>

            {/* Health Status */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <HeartPlus className="w-4 h-4 text-red-600" />
                Health Status
              </Label>
              <Select
                value={watchedHealthStatus}
                onValueChange={(value) =>
                  setValue(
                    "healthStatus",
                    value as
                      | "Healthy"
                      | "Under Treatment"
                      | "Critical"
                      | "Unknown"
                  )
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Under Treatment">
                    Under Treatment
                  </SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              {/* {errors.healthStatus && (
                <p className="text-sm text-red-600">
                  {errors.healthStatus.message}
                </p>
              )} */}
            </div>

            {/* Allergies */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Allergies
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="Add an allergy..."
                  className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addAllergy())
                  }
                />
                <Button
                  type="button"
                  onClick={addAllergy}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map((allergy, index) => (
                  <Badge
                    key={index}
                    className="bg-red-100 text-red-700 border-red-300 flex items-center gap-2 px-3 py-1"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-orange-600" />
                Medical Conditions
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  placeholder="Add a medical condition..."
                  className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addCondition())
                  }
                />
                <Button
                  type="button"
                  onClick={addCondition}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {medicalConditions.map((condition, index) => (
                  <Badge
                    key={index}
                    className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-2 px-3 py-1"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeCondition(condition)}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Current Medications */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-blue-600" />
                Current Medications
              </Label>
              <div className="flex gap-2">
                <Input
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="Add a current medication..."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addMedication())
                  }
                />
                <Button
                  type="button"
                  onClick={addMedication}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentMedications.map((medication, index) => (
                  <Badge
                    key={index}
                    className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-2 px-3 py-1"
                  >
                    {medication}
                    <button
                      type="button"
                      onClick={() => removeMedication(medication)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6 hidden">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Phone className="w-5 h-5 text-teal-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">
                  Emergency Contact (Optional)
                </Label>
                <Input
                  id="emergencyContact"
                  {...register("emergencyContact")}
                  placeholder="Emergency contact person and phone number"
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="veterinarianNotes">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="veterinarianNotes"
                  {...register("veterinarianNotes")}
                  placeholder="Any additional information about your pet..."
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingPet ? "Update Pet" : "Add Pet"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
