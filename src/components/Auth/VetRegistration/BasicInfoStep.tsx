"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MapPin, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { COUNTRY_CODES, US_STATES } from "@/lib";

interface BasicInfoStepProps {
  onNext: (data: any) => void;
  initialData?: any;
  errors?: Record<string, string>;
  isLoading?: boolean;
  emailAvailability?: boolean | null;
}

export default function BasicInfoStep({
  onNext,
  initialData = {},
  errors = {},
  isLoading = false,
  emailAvailability = null,
}: BasicInfoStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    postNominalLetters: initialData.postNominalLetters || "",
    gender: initialData.gender || "",
    email: initialData.email || "",
    city: initialData.city || "",
    state: initialData.state || "",
    phone: initialData.phone || "",
    password: initialData.password || "",
    confirmPassword: initialData.confirmPassword || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    console.log("basic info data", formData);
    e.preventDefault();
    onNext(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Basic Information
          </CardTitle>
          <p className="text-gray-300">
            Let&apos;s start with your professional details
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-white font-medium mb-2"
                  htmlFor="firstName"
                >
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  className="h-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                  placeholder="Dr. John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <Label
                  className="text-white font-medium mb-2"
                  htmlFor="lastName"
                >
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  className="h-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-white font-medium mb-2"
                  htmlFor="postNominalLetters"
                >
                  Post Nominal Letters
                </Label>
                <Input
                  id="postNominalLetters"
                  value={formData.postNominalLetters}
                  onChange={(e) =>
                    handleInputChange("postNominalLetters", e.target.value)
                  }
                  className="h-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                  placeholder="DVM, PhD"
                />
              </div>
              <div>
                <Label
                  className="text-white font-medium mb-2 flex items-center gap-2"
                  htmlFor="city"
                >
                  <MapPin className="w-4 h-4 text-blue-600" />
                  City *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="h-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <Label
                className="text-white font-medium mb-2 flex items-center gap-2"
                htmlFor="email"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                placeholder="dr.john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
              {emailAvailability === false && (
                <p className="text-sm text-red-500 mt-1">
                  This email is already registered
                </p>
              )}
              {emailAvailability === true && (
                <p className="text-sm text-green-500 mt-1">
                  Email is available
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white font-medium mb-2" htmlFor="gender">
                  Gender *
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
                >
                  <SelectTrigger className="h-12 py-2 placeholder:text-gray-500 text-gray-900 w-full bg-white/80 border-gray-300">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                )}
              </div>
              <div>
                <Label className="text-white font-medium mb-2" htmlFor="state">
                  State *
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => handleInputChange("state", value)}
                >
                  <SelectTrigger className="h-12 w-full placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300">
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
                {errors.state && (
                  <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                )}
              </div>
            </div>

            <div>
              <Label
                className="text-white font-medium mb-2 flex items-center gap-2"
                htmlFor="phone"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                Phone Number *
              </Label>
              <div className="flex gap-2">
                {/* <Select
                  value={formData.countryCode}
                  onValueChange={(value) =>
                    handleInputChange("countryCode", value)
                  }
                >
                  <SelectTrigger className="w-52 h-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300">
                    <SelectValue placeholder="+1" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={`${country.value}-${country.country}`} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> */}
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="flex-1 h-12 !py-0 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                  placeholder="(555) 123-4567"
                />
              </div>
              {(errors.countryCode || errors.phone) && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.countryCode || errors.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-white font-medium mb-2 flex items-center gap-2"
                  htmlFor="password"
                >
                  <Lock className="w-4 h-4 text-blue-600" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="h-12 pr-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label
                  className="text-white font-medium mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="h-12 pr-12 placeholder:text-gray-500 text-gray-900 bg-white/80 border-gray-300"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 text-white"
            >
              {isLoading ? "Processing..." : "Continue to Schedule Setup"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
