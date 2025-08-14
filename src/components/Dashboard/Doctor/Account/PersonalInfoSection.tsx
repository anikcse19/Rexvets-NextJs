"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Edit3,
  Save,
  X,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import {
  PersonalInfoFormData,
  personalInfoSchema,
} from "@/lib/validation/account";
import { mockDoctorData } from "@/lib";

export default function PersonalInfoSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: mockDoctorData.personalInfo,
  });

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    try {
      // API call would go here
      console.log("Updating personal info:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating personal info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(mockDoctorData.personalInfo);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card className="shadow-lg border-0 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <User className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-white">
                  Personal Information
                </CardTitle>
                <p className="text-blue-100 mt-1">
                  Your basic personal details and contact information
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Image Section */}
            <div className="flex-shrink-0">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-blue-100 shadow-lg">
                  <AvatarImage
                    src={mockDoctorData.personalInfo.profileImage}
                    alt={`${mockDoctorData.personalInfo.firstName} ${mockDoctorData.personalInfo.lastName}`}
                  />
                  <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-purple-100">
                    {mockDoctorData.personalInfo.firstName.charAt(0)}
                    {mockDoctorData.personalInfo.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Dr. {mockDoctorData.personalInfo.firstName}{" "}
                  {mockDoctorData.personalInfo.lastName}
                </h3>
                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                  Verified Profile
                </Badge>
              </div>
            </div>

            {/* Information Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={<Mail className="w-5 h-5 text-blue-600" />}
                  label="Email Address"
                  value={mockDoctorData.personalInfo.email}
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5 text-green-600" />}
                  label="Phone Number"
                  value={mockDoctorData.personalInfo.phone}
                />
                <InfoItem
                  icon={<Calendar className="w-5 h-5 text-purple-600" />}
                  label="Date of Birth"
                  value={new Date(
                    mockDoctorData.personalInfo.dateOfBirth
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
                <InfoItem
                  icon={<User className="w-5 h-5 text-pink-600" />}
                  label="Gender"
                  value={
                    mockDoctorData.personalInfo.gender.charAt(0).toUpperCase() +
                    mockDoctorData.personalInfo.gender.slice(1)
                  }
                />
              </div>

              <div className="mt-6">
                <InfoItem
                  icon={<MapPin className="w-5 h-5 text-red-600" />}
                  label="Address"
                  value={`${mockDoctorData.personalInfo.address}, ${mockDoctorData.personalInfo.city}, ${mockDoctorData.personalInfo.state} ${mockDoctorData.personalInfo.zipCode}, ${mockDoctorData.personalInfo.country}`}
                  fullWidth
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Edit3 className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Edit Personal Information
              </CardTitle>
              <p className="text-emerald-100 mt-1">
                Update your personal details and contact information
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
              className="bg-white text-emerald-600 hover:bg-gray-100"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 border-4 border-emerald-100 shadow-lg">
              <AvatarImage
                src={mockDoctorData.personalInfo.profileImage}
                alt="Profile"
              />
              <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-emerald-100 to-teal-100">
                {mockDoctorData.personalInfo.firstName.charAt(0)}
                {mockDoctorData.personalInfo.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register("phone")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dateOfBirth")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                onValueChange={(value) =>
                  setValue("gender", value as "male" | "female" | "other")
                }
              >
                <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Address Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Textarea
                id="address"
                {...register("address")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                rows={3}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register("city")}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  {...register("state")}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-600">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register("country")}
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                {errors.country && (
                  <p className="text-sm text-red-600">
                    {errors.country.message}
                  </p>
                )}
              </div>
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
