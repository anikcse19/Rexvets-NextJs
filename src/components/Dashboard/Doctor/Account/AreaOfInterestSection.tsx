"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Edit3,
  Save,
  X,
  Lightbulb,
  Search,
  Plus,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { availableSpecialties, mockDoctorData } from "@/lib";
import {
  AreasOfInterestFormData,
  areasOfInterestSchema,
} from "@/lib/validation/account";

export default function AreasOfInterestSection({
  doctorData,
}: {
  doctorData: any;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
    mockDoctorData.areasOfInterest.specialties
  );
  const [interests, setInterests] = useState<string[]>(
    mockDoctorData.areasOfInterest.interests || []
  );
  const [researchAreas, setResearchAreas] = useState<string[]>(
    mockDoctorData.areasOfInterest.researchAreas || []
  );
  const [newInterest, setNewInterest] = useState("");
  const [newResearchArea, setNewResearchArea] = useState("");

  const {
    handleSubmit,
  } = useForm<AreasOfInterestFormData>({
    resolver: zodResolver(areasOfInterestSchema),
    defaultValues: mockDoctorData.areasOfInterest,
  });

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const data = {
        specialties: selectedSpecialties,
        interests,
        researchAreas,
      };
      console.log("Updating areas of interest:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating areas of interest:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedSpecialties(mockDoctorData.areasOfInterest.specialties);
    setInterests(mockDoctorData.areasOfInterest.interests || []);
    setResearchAreas(mockDoctorData.areasOfInterest.researchAreas || []);
    setNewInterest("");
    setNewResearchArea("");
    setIsEditing(false);
  };

  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const addResearchArea = () => {
    if (
      newResearchArea.trim() &&
      !researchAreas.includes(newResearchArea.trim())
    ) {
      setResearchAreas([...researchAreas, newResearchArea.trim()]);
      setNewResearchArea("");
    }
  };

  const removeResearchArea = (area: string) => {
    setResearchAreas(researchAreas.filter((a) => a !== area));
  };

  console.log("Doctor Data from area of interest:", doctorData);

  if (!isEditing) {
    return (
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Areas of Interest
                </CardTitle>
                <p className="text-pink-100 mt-1">
                  Your specialties, interests, and research areas
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Specialties */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                Medical Specialties
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {doctorData?.specialties?.map((specialty: any, index: any) => (
                  <Badge
                    key={index}
                    className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 border-pink-300 justify-center py-2 px-4 text-sm font-medium"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Interests */}
            {doctorData?.interests && doctorData?.interests?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Professional Interests
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctorData?.interests?.map((interest: any, index: any) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200"
                    >
                      <div className="bg-yellow-500 text-white rounded-full p-2 flex-shrink-0">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {interest}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research Areas */}
            {doctorData?.researchAreas &&
              doctorData?.researchAreas?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-blue-600" />
                    Research Areas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {doctorData?.researchAreas?.map((area: any, index: any) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                      >
                        <div className="bg-blue-500 text-white rounded-full p-2 flex-shrink-0">
                          <Search className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Edit Areas of Interest
              </CardTitle>
              <p className="text-indigo-100 mt-1">
                Update your specialties, interests, and research areas
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-white text-indigo-600 hover:bg-gray-100"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Specialties Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">
              Medical Specialties
            </Label>
            <p className="text-sm text-gray-600">
              Select your areas of medical expertise (minimum 1 required)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableSpecialties.map((specialty) => (
                <div
                  key={specialty}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                >
                  <Checkbox
                    id={specialty}
                    checked={selectedSpecialties.includes(specialty)}
                    onCheckedChange={() => toggleSpecialty(specialty)}
                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                  <Label
                    htmlFor={specialty}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {specialty}
                  </Label>
                </div>
              ))}
            </div>
            {selectedSpecialties.length === 0 && (
              <p className="text-sm text-red-600">
                Please select at least one specialty
              </p>
            )}
          </div>

          {/* Professional Interests */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">
              Professional Interests
            </Label>
            <p className="text-sm text-gray-600">
              Add areas that interest you professionally
            </p>

            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add a professional interest..."
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addInterest())
                }
              />
              <Button
                type="button"
                onClick={addInterest}
                variant="outline"
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge
                  key={index}
                  className="bg-yellow-100 text-yellow-700 border-yellow-300 flex items-center gap-2 px-3 py-1"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Research Areas */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold text-gray-900">
              Research Areas
            </Label>
            <p className="text-sm text-gray-600">
              Add your current or planned research areas
            </p>

            <div className="flex gap-2">
              <Input
                value={newResearchArea}
                onChange={(e) => setNewResearchArea(e.target.value)}
                placeholder="Add a research area..."
                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addResearchArea())
                }
              />
              <Button
                type="button"
                onClick={addResearchArea}
                variant="outline"
                className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {researchAreas.map((area, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-2 px-3 py-1"
                >
                  {area}
                  <button
                    type="button"
                    onClick={() => removeResearchArea(area)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
