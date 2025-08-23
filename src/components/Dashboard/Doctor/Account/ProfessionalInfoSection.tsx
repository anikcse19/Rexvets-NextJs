"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Stethoscope,
  Edit3,
  Save,
  X,
  Award,
  Building,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";
import {
  ProfessionalInfoFormData,
  professionalInfoSchema,
} from "@/lib/validation/account";
import { mockDoctorData } from "@/lib";
import { Doctor } from "@/lib/types";

export default function ProfessionalInfoSection({
  doctorData,
}: {
  doctorData: Doctor;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [certifications, setCertifications] = useState<string[]>(
    mockDoctorData.professionalInfo.certifications || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: {
      ...mockDoctorData.professionalInfo,
      certifications: mockDoctorData.professionalInfo.certifications || [],
    },
  });

  const onSubmit = async (data: ProfessionalInfoFormData) => {
    setIsLoading(true);
    try {
      const submitData = { ...data, certifications };
      console.log("Updating professional info:", submitData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating professional info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      ...mockDoctorData.professionalInfo,
      certifications: mockDoctorData.professionalInfo.certifications || [],
    });
    setCertifications(mockDoctorData.professionalInfo.certifications || []);
    setIsEditing(false);
  };

  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, value: string) => {
    const updated = [...certifications];
    updated[index] = value;
    setCertifications(updated);
  };

  if (!isEditing) {
    return (
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Professional Information
                </CardTitle>
                <p className="text-purple-100 mt-1">
                  Your medical credentials and professional details
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
            {/* Professional Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                icon={<Award className="w-5 h-5 text-purple-600" />}
                label="License Number"
                value={doctorData?.licenses[0]?.licenseNumber}
              />
              <InfoItem
                icon={<Stethoscope className="w-5 h-5 text-indigo-600" />}
                label="Years of Experience"
                value={`${doctorData?.yearsOfExperience} years`}
              />
              <InfoItem
                icon={<Building className="w-5 h-5 text-blue-600" />}
                label="Clinic Name"
                value={doctorData?.clinic?.name}
              />
            </div>

            {/* Education */}
            <div>
              <InfoItem
                icon={<GraduationCap className="w-5 h-5 text-orange-600" />}
                label="Education"
                value={doctorData?.education[0]?.institution}
                fullWidth
              />
            </div>

            {/* Clinic Address */}
            <div>
              <InfoItem
                icon={<Building className="w-5 h-5 text-teal-600" />}
                label="Clinic Address"
                value={doctorData?.clinic?.address}
                fullWidth
              />
            </div>

            {/* Certifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Certifications & Qualifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {doctorData?.certifications?.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                  >
                    <div className="bg-yellow-500 text-white rounded-full p-2 flex-shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Edit Professional Information
              </CardTitle>
              <p className="text-orange-100 mt-1">
                Update your medical credentials and professional details
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
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                {...register("licenseNumber")}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.licenseNumber && (
                <p className="text-sm text-red-600">
                  {errors.licenseNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                {...register("yearsOfExperience", { valueAsNumber: true })}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.yearsOfExperience && (
                <p className="text-sm text-red-600">
                  {errors.yearsOfExperience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                {...register("clinicName")}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.clinicName && (
                <p className="text-sm text-red-600">
                  {errors.clinicName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                {...register("emergencyContact")}
                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
              {errors.emergencyContact && (
                <p className="text-sm text-red-600">
                  {errors.emergencyContact.message}
                </p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <Label htmlFor="education">Education & Qualifications</Label>
            <Textarea
              id="education"
              {...register("education")}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              rows={4}
              placeholder="Enter your educational background, degrees, and qualifications..."
            />
            {errors.education && (
              <p className="text-sm text-red-600">{errors.education.message}</p>
            )}
          </div>

          {/* Clinic Address */}
          <div className="space-y-2">
            <Label htmlFor="clinicAddress">Clinic Address</Label>
            <Textarea
              id="clinicAddress"
              {...register("clinicAddress")}
              className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              rows={3}
              placeholder="Enter your clinic's full address..."
            />
            {errors.clinicAddress && (
              <p className="text-sm text-red-600">
                {errors.clinicAddress.message}
              </p>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Certifications & Additional Qualifications</Label>
              <Button
                type="button"
                onClick={addCertification}
                variant="outline"
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </div>

            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={cert}
                    onChange={(e) => updateCertification(index, e.target.value)}
                    placeholder="Enter certification name..."
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                  <Button
                    type="button"
                    onClick={() => removeCertification(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  fullWidth?: boolean;
}

function InfoItem({ icon, label, value, fullWidth = false }: InfoItemProps) {
  return (
    <div className={`${fullWidth ? "col-span-full" : ""}`}>
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-gray-900 font-semibold break-words">{value}</p>
        </div>
      </div>
    </div>
  );
}
