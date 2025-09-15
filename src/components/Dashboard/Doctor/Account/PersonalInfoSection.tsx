"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
  Mail,
  Calendar,
  BookImageIcon,
  Phone,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import {
  PersonalInfoFormData,
  personalInfoSchema,
} from "@/lib/validation/account";
import { mockDoctorData } from "@/lib";
import { Doctor } from "@/lib/types";
import { updateVet } from "../Service/update-vet";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import FileUpload from "@/components/shared/FileUpload";
import { US_STATES } from "@/lib";

interface LicenseData {
  licenseNumber: string;
  deaNumber?: string;
  state: string;
  licenseFile: File | null;
  licenseFileUrl?: string; // For existing license files
}

export default function PersonalInfoSection({
  doctorData,
}: {
  doctorData: Doctor;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [licenses, setLicenses] = useState<LicenseData[]>([]);

  // Initialize licenses from doctorData
  React.useEffect(() => {
    if (doctorData?.licenses && doctorData.licenses.length > 0) {
      const existingLicenses = doctorData.licenses.map((license: any) => ({
        licenseNumber: license.licenseNumber || "",
        deaNumber: license.deaNumber || "",
        state: license.state || "",
        licenseFile: null, // We don't store File objects, only URLs
        licenseFileUrl: license.licenseFile || null, // Store existing file URL
      }));
      setLicenses(existingLicenses);
    }
  }, [doctorData]);

  const router = useRouter();

  function extractPersonalInfo(doctorData: any) {
    return {
      firstName: doctorData?.firstName || "",
      lastName: doctorData?.lastName || "",
      email: doctorData?.email || "",
      phoneNumber: doctorData?.phoneNumber || "",
      dob: doctorData.dob
        ? new Date(doctorData.dob).toISOString().split("T")[0]
        : "",
      gender: doctorData?.gender || "",
      address: doctorData?.address || "",
      city: doctorData?.city || "",
      state: doctorData?.state || "",
      zipCode: doctorData?.zipCode || "",
      country: doctorData?.country || "",
      profileImage: doctorData?.profileImage || "",
      name: doctorData?.name || "",
      bio: doctorData?.bio,
    };
  }

  const personalInfoData = extractPersonalInfo(doctorData);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfoData,
  });

  const bioValue = watch("bio") || "";
  const bioCharCount = bioValue.length;

  console.log(errors);

  // File upload handlers
  const handleProfileImageChange = (files: File[]) => {
    setProfileImageFile(files[0] || null);
  };

  const addLicense = () => {
    setLicenses((prev) => [
      ...prev,
      {
        licenseNumber: "",
        deaNumber: "",
        state: "",
        licenseFile: null,
      },
    ]);
  };

  const removeLicense = (index: number) => {
    setLicenses((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLicense = (
    index: number,
    field: keyof LicenseData,
    value: string | File | null
  ) => {
    setLicenses((prev) =>
      prev.map((license, i) =>
        i === index ? { ...license, [field]: value } : license
      )
    );
  };

  const handleLicenseFileChange = (files: File[], licenseIndex: number) => {
    updateLicense(licenseIndex, "licenseFile", files[0] || null);
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

      // Add profile image file
      if (profileImageFile) {
        formData.append("profileImage", profileImageFile);
      }

      // Add licenses data
      if (licenses.length > 0) {
        // Prepare license data for submission (exclude File objects)
        const licenseDataForSubmission = licenses.map(license => ({
          licenseNumber: license.licenseNumber,
          deaNumber: license.deaNumber,
          state: license.state,
          licenseFile: license.licenseFileUrl || null, // Use existing URL if no new file
          hasNewFile: !!license.licenseFile, // Track if this license has a new file
        }));
        
        formData.append("licenses", JSON.stringify(licenseDataForSubmission));
        
        // Add new license files with proper indexing
        licenses.forEach((license, index) => {
          if (license.licenseFile) {
            formData.append(`licenseFile_${index}`, license.licenseFile);
          }
        });
      }

      // Call the new file upload API
      const response = await fetch("/api/veterinarian/update-with-files", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      setIsEditing(false);
      toast.success("Personal information updated successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error updating personal info:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(personalInfoData);
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
                    src={doctorData?.profileImage}
                    alt={`${doctorData?.name}`}
                  />
                  <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-blue-100 to-purple-100">
                    {doctorData?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Dr. {doctorData?.name}
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
                  value={doctorData?.email}
                />
                <InfoItem
                  icon={<Calendar className="w-5 h-5 text-purple-600" />}
                  label="Date of Birth"
                  value={new Date(doctorData?.dob || "").toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                />
                <InfoItem
                  icon={<User className="w-5 h-5 text-pink-600" />}
                  label="Gender"
                  value={
                    mockDoctorData.personalInfo.gender.charAt(0).toUpperCase() +
                    mockDoctorData.personalInfo.gender.slice(1)
                  }
                />
                <InfoItem
                  icon={<Phone className="w-5 h-5 text-green-600" />}
                  label="Phone Number"
                  value={doctorData?.phoneNumber}
                />
              </div>

              <div className="mt-6">
                <InfoItem
                  icon={<MapPin className="w-5 h-5 text-red-600" />}
                  label="Address"
                  value={`${doctorData?.address}, ${doctorData?.city}, ${doctorData?.state} ${doctorData?.zipCode}, ${doctorData?.country}`}
                  fullWidth
                />
              </div>
              <div className="mt-6">
                <InfoItem
                  icon={<BookImageIcon className="w-5 h-5 text-red-600" />}
                  label="Bio"
                  value={`${doctorData?.bio}`}
                  fullWidth
                />
              </div>

              {/* License Information */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  License Information
                </h3>
                {doctorData?.licenses && doctorData.licenses.length > 0 ? (
                  <div className="space-y-4">
                    {doctorData.licenses.map((license: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h4 className="text-md font-medium text-gray-900">
                            License #{index + 1}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">License Number</p>
                            <p className="text-gray-900 font-semibold">{license.licenseNumber}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">State</p>
                            <p className="text-gray-900 font-semibold">{license.state}</p>
                          </div>
                          {license.deaNumber && (
                            <div>
                              <p className="text-sm font-medium text-gray-600">DEA Number</p>
                              <p className="text-gray-900 font-semibold">{license.deaNumber}</p>
                            </div>
                          )}
                          {license.licenseFile && (
                            <div>
                              <p className="text-sm font-medium text-gray-600">License File</p>
                              <a 
                                href={license.licenseFile} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                              >
                                View License Document
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">No licenses added yet</p>
                    <p className="text-xs text-gray-500">
                      Click "Edit" to add your veterinary license information
                    </p>
                  </div>
                )}
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
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Profile Image
            </h3>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32 border-4 border-emerald-100 shadow-lg">
                <AvatarImage 
                  src={profileImageFile ? URL.createObjectURL(profileImageFile) : doctorData?.profileImage} 
                  alt="Profile" 
                />
                <AvatarFallback className="text-2xl font-bold text-gray-800 bg-gradient-to-br from-emerald-100 to-teal-100">
                  {doctorData?.name.charAt(0)}
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
                <p className="text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
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
                  type="number"
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

          {/* Bio */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              About Me
            </h3>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (Optional)</Label>

              <Textarea
                id="bio"
                {...register("bio")}
                className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                rows={4}
                placeholder="Tell us about yourself, your experience, and what makes you passionate about veterinary care..."
              />
              <div className="text-right text-xs text-gray-500">
                {bioCharCount}/1000 characters
              </div>
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>
          </div>

          {/* License Information */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                License Information
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLicense}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add License
              </Button>
            </div>

            {licenses.length === 0 ? (
              <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  No licenses added yet
                </p>
                <p className="text-xs text-gray-500">
                  Click "Add License" to add your veterinary license information
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {licenses.map((license, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          License #{index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLicense(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label htmlFor={`licenseNumber-${index}`}>
                            License Number *
                          </Label>
                          <Input
                            id={`licenseNumber-${index}`}
                            value={license.licenseNumber}
                            onChange={(e) =>
                              updateLicense(index, "licenseNumber", e.target.value)
                            }
                            placeholder="Enter license number"
                            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`state-${index}`}>State *</Label>
                          <Select
                            value={license.state}
                            onValueChange={(value) =>
                              updateLicense(index, "state", value)
                            }
                          >
                            <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {US_STATES.map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <Label htmlFor={`deaNumber-${index}`}>
                          DEA Number (Optional)
                        </Label>
                        <Input
                          id={`deaNumber-${index}`}
                          value={license.deaNumber || ""}
                          onChange={(e) =>
                            updateLicense(index, "deaNumber", e.target.value)
                          }
                          placeholder="Enter DEA number if applicable"
                          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>License File *</Label>
                        {license.licenseFileUrl && !license.licenseFile && (
                          <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm text-blue-700">Current file:</p>
                            <a 
                              href={license.licenseFileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline text-sm"
                            >
                              View Current License Document
                            </a>
                          </div>
                        )}
                        <FileUpload
                          label=""
                          name={`licenseFile-${index}`}
                          accept=".pdf,.jpg,.jpeg,.png"
                          maxSize={5 * 1024 * 1024} // 5MB
                          onFileChange={(files) =>
                            handleLicenseFileChange(files, index)
                          }
                          onError={(error) =>
                            console.error(`License ${index + 1} file error:`, error)
                          }
                          preview={true}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
