"use client";

import { useEffect, useState } from "react";
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
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  Heart,
} from "lucide-react";
import { signIn } from "next-auth/react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { US_STATES } from "@/lib";

const petParentSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
    state: z.string().min(1, "Please select a state"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PetParentFormData = z.infer<typeof petParentSchema>;

export default function PetParentForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PetParentFormData>({
    resolver: zodResolver(petParentSchema),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timezone, setTimezone] = useState<string>("");

  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("tzzz", tz);
    setTimezone(tz);
  }, []);

  useEffect(() => {
    console.log("form errors", errors);
  }, [errors]);

  console.log("timezone check", timezone);

  const onSubmit = async (data: PetParentFormData) => {
    console.log("function click");
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const createParentData = {
        name: data.name,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        state: data.state,
        preferences: {
          timezone: timezone,
        },
      };

      console.log("createParentData", createParentData);
      const response = await fetch("/api/auth/register/pet-parent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createParentData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle different types of errors
        if (result.details && Array.isArray(result.details)) {
          // Handle validation errors with details
          const errorMessages = result.details
            .map((detail: any) => detail.message)
            .join(", ");
          setError(errorMessages);
        } else if (result.error) {
          // Handle specific error messages from API
          setError(result.error);
        } else {
          // Handle generic errors based on status code
          switch (response.status) {
            case 400:
              setError(
                "Invalid information provided. Please check your details and try again."
              );
              break;
            case 409:
              setError(
                "An account with this email already exists. Please use a different email or try signing in."
              );
              break;
            case 503:
              setError(
                "Service temporarily unavailable. Please try again in a few moments."
              );
              break;
            case 500:
              setError("Server error. Please try again later.");
              break;
            default:
              setError("Registration failed. Please try again.");
          }
        }
        return;
      }

      setSuccess(result.message || "Registration successful!");

      // Redirect to sign in page after 3 seconds
      setTimeout(() => {
        window.location.href = "/auth/signin";
      }, 3000);
    } catch (error) {
      console.error("Registration error:", error);

      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Google sign in error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-white mb-2">
            Pet Parent Registration
          </CardTitle>
          <p className="text-white/70 text-lg">
            Join RexVet to care for your beloved pets
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          {/* Google Sign In for existing users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              className="w-full h-14 text-base bg-white hover:bg-gray-50 text-gray-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <LoadingSpinner size="sm" className="mr-3" />
              ) : (
                <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>
          </motion.div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/70">
                or continue with email
              </span>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-red-400 text-sm text-center">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-400 text-sm text-center">{success}</p>
            </motion.div>
          )}

          {/* Manual Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label
                  htmlFor="name"
                  className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2"
                >
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Label
                  htmlFor="email"
                  className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Label
                  htmlFor="phone"
                  className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2"
                >
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm"
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-sm text-red-400 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label
                  htmlFor="state"
                  className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2"
                >
                  <MapPin className="w-4 h-4" />
                  State
                </Label>
                <Select onValueChange={(value) => setValue("state", value)}>
                  <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white data-[placeholder]:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm">
                    <SelectValue placeholder="Select a state" />
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
                  <p className="text-sm text-red-400 mt-1">
                    {errors.state.message}
                  </p>
                )}
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Label
                  htmlFor="password"
                  className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2"
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm pr-12"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
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
                  <p className="text-sm text-red-400 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Label
                  htmlFor="confirmPassword"
                  className="text-white/90 text-sm font-medium mb-2 block"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400 focus:ring-cyan-400/20 backdrop-blur-sm pr-12"
                    placeholder="••••••••"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
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
                  <p className="text-sm text-red-400 mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full h-14 text-base bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Pet Parent Account"
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
