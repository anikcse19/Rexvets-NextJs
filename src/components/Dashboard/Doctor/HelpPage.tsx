"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import {
  HelpCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  MessageSquare,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { HelpRequestData, helpRequestSchema } from "@/lib/validation/help";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const bangladeshStates = [
  "Barisal",
  "Chittagong",
  "Dhaka",
  "Khulna",
  "Mymensingh",
  "Rajshahi",
  "Rangpur",
  "Sylhet",
];

export default function HelpPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Determine user type based on the current route
  const userType = pathname.includes("/pet-parent/") ? "pet_parent" : "veterinarian";

  // Extract user data from session (memoized to avoid new object each render)
  const userData = useMemo(() => {
    if (!session?.user) return null;
    return {
      role: (session.user as any).role || userType,
      name: session.user.name || "",
      email: session.user.email || "",
      phone: (session.user as any).phoneNumber || "",
      state: (session.user as any).state || "",
    };
  }, [session?.user, (session?.user as any)?.role, (session?.user as any)?.phoneNumber, (session?.user as any)?.state, session?.user?.name, session?.user?.email, userType]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<HelpRequestData>({
    resolver: zodResolver(helpRequestSchema),
    defaultValues: {
      role: userType,
      name: "",
      email: "",
      phone: "",
      state: "",
      subject: "",
      details: "",
    },
  });

  // Update form values when user data is loaded (single reset to avoid loops)
  useEffect(() => {
    if (!userData) return;
    // Only reset when we actually have a state to avoid loops on empty
    const current = getValues();
    const next = {
      role: userData.role,
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      state: userData.state || "",
      subject: current.subject || "",
      details: current.details || "",
    } as const;
    // If values are already the same, skip reset
    if (
      current.role === next.role &&
      current.name === next.name &&
      current.email === next.email &&
      current.phone === next.phone &&
      current.state === next.state
    ) {
      return;
    }
    reset(next as any);
  }, [userData, reset, getValues]);

  // Fetch user profile from API to populate/override form values
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch("/api/user/profile", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (!json?.success || !json?.data) return;
        if (!isMounted) return;
        const d = json.data as any;
        const current = getValues();
        const next = {
          role: d.role || userType,
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
          state: d.state || "",
          subject: current.subject || "",
          details: current.details || "",
        } as const;
        if (
          current.role === next.role &&
          current.name === next.name &&
          current.email === next.email &&
          current.phone === next.phone &&
          current.state === next.state
        ) {
          return;
        }
        reset(next as any);
      } catch {}
    })();
    return () => {
      isMounted = false;
    };
  }, [reset, userType]);

  const onSubmit = async (data: HelpRequestData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch("/api/help", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit help request");
      }

      if (result.success) {
        setIsSubmitted(true);
        reset();
      } else {
        throw new Error(result.message || "Failed to submit help request");
      }
    } catch (error: any) {
      console.error("Error submitting help request:", error);
      setError(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Help & Support
          </h1>
          <p className="text-gray-600 mt-1">
            We're here to help you with any questions or issues.
          </p>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (status === "unauthenticated") {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Help & Support
          </h1>
          <p className="text-gray-600 mt-1">
            We're here to help you with any questions or issues.
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="bg-red-50 p-6 rounded-lg">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-red-800 mb-2">
                  Authentication Required
                </h2>
                <p className="text-red-700 mb-4">
                  Please sign in to submit a help request.
                </p>
                <Button
                  onClick={() => window.location.href = "/auth/signin"}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Help & Support
          </h1>
          <p className="text-gray-600 mt-1">
            We're here to help you with any questions or issues.
          </p>
        </div>

        {/* Success Message */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white text-center">
              <div className="bg-white/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Request Submitted Successfully!
              </h2>
              <p className="text-green-100">
                Thank you for contacting us. We've received your help request
                and will get back to you within 24 hours.
              </p>
            </div>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-6">
                You should receive a confirmation email shortly. Our support
                team will review your request and respond as soon as possible.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Help & Support
        </h1>
        <p className="text-gray-600 mt-1">
          We're here to help you with any questions or issues.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form - 2/3 width */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Contact Support
                  </CardTitle>
                  <p className="text-blue-100 mt-1">
                    Fill out the form below and we'll get back to you soon
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                 {/* Role (Hidden field since it's pre-filled based on user data) */}
                 <input type="hidden" {...register("role")} value={userData?.role || userType} />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-purple-600" />
                      Phone Number (Optional)
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your phone number (optional)"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-orange-600" />
                      State/Division
                    </Label>
                    <Input
                      id="state"
                      value={getValues("state")}
                      readOnly
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                      placeholder="State from profile"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    {...register("subject")}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-600">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <Label htmlFor="details" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-teal-600" />
                    Details
                  </Label>
                  <Textarea
                    id="details"
                    {...register("details")}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                    placeholder="Please provide detailed information about your issue or question..."
                    rows={6}
                  />
                  {errors.details && (
                    <p className="text-sm text-red-600">
                      {errors.details.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Help Request
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information - 1/3 width */}
        <div className="space-y-6">
          {/* Contact Info Card */}
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-xl">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-white">
                    Contact Information
                  </CardTitle>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@rexvet.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-green-500 text-white p-2 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+880 1800-REXVET</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="bg-purple-500 text-white p-2 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Support Hours</p>
                    <p className="text-sm text-gray-600">24/7 Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Card */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-500 text-white p-2 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900">Quick Help</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Response Time</p>
                  <p className="text-gray-600">
                    We typically respond within 2-4 hours during business hours.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Emergency Issues
                  </p>
                  <p className="text-gray-600">
                    For urgent technical issues, please call our support line
                    directly.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Account Issues</p>
                  <p className="text-gray-600">
                    Include your account email for faster resolution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
