"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useState } from "react";
import { COUNTRY_CODES, US_STATES } from "@/lib";

const basicInfoSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    postNominalLetters: z.string().optional(),
    gender: z.enum(["male", "female", "other"]),
    email: z.string().email("Invalid email address"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(1, "Please select a state"),
    countryCode: z.string().min(1, "Please select country code"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type BasicInfoFormData = z.infer<typeof basicInfoSchema>;

interface BasicInfoStepProps {
  onNext: (data: BasicInfoFormData) => void;
  initialData?: Partial<BasicInfoFormData>;
}

export default function BasicInfoStep({
  onNext,
  initialData,
}: BasicInfoStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: initialData,
  });

  const onSubmit = (data: BasicInfoFormData) => {
    onNext(data);
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
          <p className="text-muted-foreground">
            Let&apos;s start with your professional details
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2" htmlFor="firstName">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  className="h-12 placeholder:text-white/50 text-white"
                  placeholder="Dr. John"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white mb-2" htmlFor="lastName">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  className="h-12 placeholder:text-white/50 text-white"
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white mb-2" htmlFor="postNominalLetters">
                  Post Nominal Letters
                </Label>
                <Input
                  id="postNominalLetters"
                  {...register("postNominalLetters")}
                  className="h-12 placeholder:text-white/50 text-white"
                  placeholder="DVM, PhD"
                />
              </div>

              <div>
                <Label className="text-white mb-2" htmlFor="gender">
                  Gender *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("gender", value as "male" | "female" | "other")
                  }
                >
                  <SelectTrigger className="h-12  placeholder:text-white/50 text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                className="text-white mb-2 flex items-center gap-2"
                htmlFor="email"
              >
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className="h-12 placeholder:text-white/50 text-white"
                placeholder="dr.john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-white mb-2 flex items-center gap-2"
                  htmlFor="city"
                >
                  <MapPin className="w-4 h-4" />
                  City *
                </Label>
                <Input
                  id="city"
                  {...register("city")}
                  className="h-12 placeholder:text-white/50 text-white"
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white mb-2" htmlFor="state">
                  State *
                </Label>
                <Select onValueChange={(value) => setValue("state", value)}>
                  <SelectTrigger className="h-12 placeholder:text-white/50 text-white">
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label
                className="text-white mb-2 flex items-center gap-2"
                htmlFor="phone"
              >
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <div className="flex gap-2">
                <Select
                  onValueChange={(value) => setValue("countryCode", value)}
                >
                  <SelectTrigger className="w-32 h-12 placeholder:text-white/50 text-white">
                    <SelectValue placeholder="+1" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="flex-1 h-12 placeholder:text-white/50 text-white"
                  placeholder="(555) 123-4567"
                />
              </div>
              {(errors.countryCode || errors.phone) && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.countryCode?.message || errors.phone?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  className="text-white mb-2 flex items-center gap-2"
                  htmlFor="password"
                >
                  <Lock className="w-4 h-4" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="h-12 pr-12 placeholder:text-white/50 text-white"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
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
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white mb-2" htmlFor="confirmPassword">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="h-12 pr-12 placeholder:text-white/50 text-white"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
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
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
            >
              Continue to Schedule Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
