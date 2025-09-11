"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit3,
  Save,
  X,
  Camera,
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";
import {
  PersonalInfoFormData,
  personalInfoSchema,
} from "@/lib/validation/account";
import { mockDoctorData } from "@/lib";
import { PetParent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/shared/FileUpload";
import { toast } from "sonner";

export default function PersonalInfoSection({
  petParentData,
}: {
  petParentData: PetParent;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [localPetParentData, setLocalPetParentData] = useState(petParentData);

  const router = useRouter();
  console.log(petParentData, "pet parent in professional component");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: petParentData?.firstName || "",
      lastName: petParentData?.lastName || "",
      email: petParentData?.email || "",
      phoneNumber: petParentData?.phoneNumber || "",
      dob: petParentData?.dob || "",
      gender: petParentData?.gender || "",
      address: petParentData?.address || "",
      city: petParentData?.city || "",
      state: petParentData?.state || "",
      zipCode: petParentData?.zipCode || "",
      country: petParentData?.country || "",
    },
  });

  // inside your component
  React.useEffect(() => {
    if (petParentData) {
      setLocalPetParentData(petParentData);
      reset({
        firstName: petParentData.firstName || "",
        lastName: petParentData.lastName || "",
        email: petParentData.email || "",
        phoneNumber: petParentData.phoneNumber || "",
        dob: petParentData.dob
          ? new Date(petParentData.dob).toISOString().split("T")[0]
          : "",
        gender: petParentData.gender || "",
        address: petParentData.address || "",
        city: petParentData.city || "",
        state: petParentData.state || "",
        zipCode: petParentData.zipCode || "",
        country: petParentData.country || "",
      });
    }
  }, [petParentData, reset]);

  // Force re-render when localPetParentData changes
  React.useEffect(() => {
    console.log("Local pet parent data updated:", localPetParentData);
  }, [localPetParentData]);

  // File upload handler
  const handleProfileImageChange = (files: File[]) => {
    setProfileImageFile(files[0] || null);
  };

  const onSubmit = async (data: PersonalInfoFormData) => {
    setIsLoading(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add basic form data (excluding profileImage to avoid conflicts)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "profileImage" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add profile image file (include filename to preserve extension)
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile, profileImageFile.name);
      }

      // Call the file upload API
      const response = await fetch(`/api/pet-parent/${petParentData?._id}/update-with-files`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      const result = await response.json();
      
      // Update local state immediately if the update was successful
      if (result.data?.petParent) {
        setLocalPetParentData(result.data.petParent);
        // Also update the form with the new data
        reset({
          firstName: result.data.petParent.firstName || "",
          lastName: result.data.petParent.lastName || "",
          email: result.data.petParent.email || "",
          phoneNumber: result.data.petParent.phoneNumber || "",
          dob: result.data.petParent.dob
            ? new Date(result.data.petParent.dob).toISOString().split("T")[0]
            : "",
          gender: result.data.petParent.gender || "",
          address: result.data.petParent.address || "",
          city: result.data.petParent.city || "",
          state: result.data.petParent.state || "",
          zipCode: result.data.petParent.zipCode || "",
          country: result.data.petParent.country || "",
        });
        // Reset the profile image file state
        setProfileImageFile(null);
      }
      
      setIsEditing(false);
      toast.success("Personal information updated successfully!");
      
      // Ensure the latest server data is reflected immediately
      router.refresh();
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // reset(mockDoctorData.personalInfo);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card key={`view-${localPetParentData?._id}-${localPetParentData?.updatedAt}`} className="shadow-lg border-0 bg-white overflow-hidden">
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
                    src={localPetParentData?.profileImage}
                    alt={`${localPetParentData?.name}`}
                  />
                  <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-purple-100">
                    {localPetParentData?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {localPetParentData?.name}
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
                  value={localPetParentData?.email || "Not provided"}
                />
                <InfoItem
                  icon={<Calendar className="w-5 h-5 text-purple-600" />}
                  label="Date of Birth"
                  value={localPetParentData?.dob ? 
                    new Date(localPetParentData.dob).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    ) : "Not provided"
                  }
                />
                <InfoItem
                  icon={<User className="w-5 h-5 text-pink-600" />}
                  label="Gender"
                  value={
                    localPetParentData?.gender ? 
                      localPetParentData.gender.charAt(0).toUpperCase() + localPetParentData.gender.slice(1) :
                      "Not provided"
                  }
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5 text-green-600" />}
                  label="Phone Number"
                  value={localPetParentData?.phoneNumber || "Not provided"}
                />
              </div>

              <div className="mt-6">
                <InfoItem
                  icon={<MapPin className="w-5 h-5 text-red-600" />}
                  label="Address"
                  value={localPetParentData?.address ? 
                    `${localPetParentData.address}, ${localPetParentData.city || ""}, ${localPetParentData.state || ""} ${localPetParentData.zipCode || ""}${localPetParentData.country ? `, ${localPetParentData.country}` : ""}`.replace(/,\s*,/g, ',').replace(/,\s*$/, '') :
                    "Not provided"
                  }
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
    <Card key={`edit-${localPetParentData?._id}-${localPetParentData?.updatedAt}`} className="shadow-lg border-0 bg-white overflow-hidden">
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Profile Image
            </h3>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-4 border-emerald-100 shadow-lg">
                <AvatarImage 
                  src={profileImageFile ? URL.createObjectURL(profileImageFile) : localPetParentData?.profileImage} 
                  alt="Profile" 
                />
                <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-emerald-100 to-teal-100">
                  {localPetParentData?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <FileUpload
                label="Upload Profile Image"
                name="profileImage"
                accept="image/*"
                maxSize={5 * 1024 * 1024} // 5MB
                onFileChange={handleProfileImageChange}
                onError={(error) => console.error("Profile image error:", error)}
                className="w-full max-w-md"
              />
            </div>
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
                {...register("phoneNumber")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                {...register("dob")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {errors.dob && (
                <p className="text-sm text-red-600">{errors.dob.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={watch("gender")}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
