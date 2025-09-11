"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { VeterinarianProfile } from "@/lib/types";
import {
  basicInfoSchema,
  scheduleSchema,
  profileSchema,
} from "@/lib/validation/veterinarian";
// import StepIndicator from "./VetRegistration/StepIndicator";
import BasicInfoStep from "./VetRegistration/BasicInfoStep";
// import ScheduleStep from "./VetRegistration/ScheduleStep";
import ProfileStep from "./VetRegistration/ProfileStep";

const REGISTRATION_STEPS = [
  { title: "Basic Info", description: "Personal and contact information" },
  { title: "Schedule", description: "Set your availability" },
  { title: "Profile", description: "Upload documents and signature" },
];

// Removed localStorage - using state-based approach instead

export default function VetRegistrationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<VeterinarianProfile>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null
  );
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Initialize form - always start with step 1 and empty data
  useEffect(() => {
    // Clear any existing localStorage data
    localStorage.removeItem("vetRegistrationProgress");
    setCurrentStep(1);
    setFormData({});
    setErrors({});
    setGeneralError(null);
  }, []);

  // Removed localStorage saving - using state-based approach

  // Clear form data (for successful submission)
  const clearFormData = useCallback(() => {
    setFormData({});
    setCurrentStep(1);
    setErrors({});
    setGeneralError(null);
  }, []);

  // Real-time email availability check
  const checkEmailAvailability = useCallback(async (email: string) => {
    if (!email || !email.includes("@")) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/check-email?email=${encodeURIComponent(email)}`
      );
      const data = await response.json().catch(() => ({ available: false }));
      const isAvailable = !!data?.available;
      setEmailAvailability(isAvailable);

      if (!isAvailable) {
        setErrors((prev) => ({
          ...prev,
          email: "Email is already registered",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate current step
  const validateStep = useCallback((stepData: any, step: number) => {
    let schema;
    switch (step) {
      case 1:
        schema = basicInfoSchema;
        break;
      case 2:
        schema = scheduleSchema;
        break;
      case 3:
        schema = profileSchema;

      default:
        return true;
    }

    const result = schema.safeParse(stepData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  }, []);

  // Extract a meaningful error message from API responses
  const extractApiErrorMessage = useCallback(
    (result: any, response?: Response): string => {
      // Prefer explicit message fields from the API
      const apiMessage =
        result?.message ||
        result?.error ||
        result?.msg ||
        result?.title ||
        (Array.isArray(result?.errors) && result.errors[0]?.message) ||
        (Array.isArray(result?.details) && result.details[0]?.message);

      if (apiMessage) return apiMessage;

      // Fallbacks by status code
      switch (response?.status) {
        case 400:
          return "Invalid request. Please check your inputs and try again.";
        case 401:
          return "You are not authorized. Please sign in and try again.";
        case 403:
          return "You do not have permission to perform this action.";
        case 404:
          return "Requested resource was not found.";
        case 409:
          return "A record with the same unique field already exists.";
        case 413:
          return "Uploaded file is too large.";
        case 415:
          return "Unsupported file type. Please upload a valid format.";
        case 422:
          return "Validation failed. Please correct the highlighted fields.";
        case 429:
          return "Too many requests. Please wait a moment and try again.";
        case 500:
          return "Server error. Please try again later.";
        case 503:
          return "Service temporarily unavailable. Please try again shortly.";
        default:
          return "Registration failed. Please try again.";
      }
    },
    []
  );

  // Handle basic info step
  const handleBasicInfoNext = useCallback(
    async (data: any) => {
      if (!validateStep(data, 1)) {
        toast.error("Please fix the errors before continuing");
        return;
      }

      // Check email availability - always check before proceeding
      if (data.email) {
        try {
          setIsLoading(true);
          const response = await fetch(
            `/api/check-email?email=${encodeURIComponent(data.email)}`
          );
          const resp = await response.json().catch(() => ({ available: false }));
          const isAvailable = !!resp?.available;
          
          if (!isAvailable) {
            setErrors((prev) => ({
              ...prev,
              email: "Email is already registered",
            }));
            setEmailAvailability(false);
            toast.error("Email is already registered. Please use a different email or try signing in.");
            return;
          } else {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.email;
              return newErrors;
            });
            setEmailAvailability(true);
          }
        } catch (error) {
          console.error("Email check failed:", error);
          toast.error("Failed to verify email. Please try again.");
          return;
        } finally {
          setIsLoading(false);
        }
      }

      setFormData((prev) => ({ ...prev, ...data }));
      setCurrentStep(3);
      toast.success("Basic information saved");
    },
    [validateStep]
  );

  // Handle schedule step
  const handleScheduleNext = useCallback(
    (schedule: any) => {
      if (!validateStep({ schedule }, 2)) {
        toast.error("Please fix the errors before continuing");
        return;
      }

      setFormData((prev) => ({ ...prev, schedule }));
      setCurrentStep(3);
      toast.success("Schedule saved");
    },
    [validateStep]
  );

  // Handle profile step and final submission
  const handleProfileNext = useCallback(
    async (profileData: any) => {
      if (!validateStep(profileData, 3)) {
        toast.error("Please fix the errors before continuing");
        return;
      }

      const completedData = { ...formData, ...profileData };

      // Clear any previous general errors
      setGeneralError(null);

      // Debug: Log the completed data

      try {
        setIsSubmitting(true);

        // Create FormData for file uploads
        const formDataToSend = new FormData();

        // Add basic info
        Object.entries(completedData).forEach(([key, value]) => {
          if (key === "schedule") {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (key === "licenses") {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (value instanceof File) {
            formDataToSend.append(key, value);
          } else if (value !== undefined && value !== null) {
            formDataToSend.append(key, String(value));
          }
        });

        // Debug: Log FormData contents
        console.log("FormData entries:");
        for (const [key, value] of formDataToSend.entries()) {
          console.log(
            `${key}:`,
            value instanceof File
              ? `File: ${value.name} (${value.size} bytes)`
              : value
          );
        }

        // Add license files
        if (completedData.licenses) {
          console.log("License data:", completedData.licenses);
          completedData.licenses.forEach((license: any, index: number) => {
            if (license.licenseFile instanceof File) {
              formDataToSend.append(`licenseFiles`, license.licenseFile);
              console.log(
                `Added license file ${index}:`,
                license.licenseFile.name
              );
            } else {
              console.log(`License ${index} has no file:`, license);
            }
          });
        }

        const response = await fetch("/api/auth/register/veterinarian", {
          method: "POST",
          body: formDataToSend,
        });

        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        const result = await response.json().catch(() => ({}));
        console.log("Response body:", result);

        if (!response.ok) {
          // Handle specific error types
          if (response.status === 409) {
            // Duplicate email or other unique field
            if (result.field === "email") {
              setErrors((prev) => ({ ...prev, email: result.error }));
              setCurrentStep(1); // Go back to basic info step
              toast.error(result.error);
              return;
            } else if (result.field === "licenseNumber") {
              setErrors((prev) => ({
                ...prev,
                "licenses.0.licenseNumber": result.error,
              }));
              toast.error(result.error);
              return;
            } else if (result.field === "phoneNumber") {
              setErrors((prev) => ({ ...prev, phone: result.error }));
              setCurrentStep(1); // Go back to basic info step
              toast.error(result.error);
              return;
            }
          }

          // Handle validation errors
          if (response.status === 400 && result.details) {
            const newErrors: Record<string, string> = {};
            if (Array.isArray(result.details)) {
              result.details.forEach((detail: any) => {
                if (detail.path) {
                  newErrors[detail.path.join(".")] = detail.message;
                }
              });
            }
            setErrors(newErrors);
            toast.error(
              extractApiErrorMessage(result, response) ||
                "Please fix the validation errors and try again."
            );
            return;
          }

          // Map generic API error into a user-friendly message
          const message = extractApiErrorMessage(result, response);
          throw new Error(message);
        }

        // Clear form data and show success
        clearFormData();
        toast.success(
          "Registration successful! Please check your email for verification."
        );

        // Redirect to check email page
        router.push(
          `/auth/check-email?email=${encodeURIComponent(completedData.email)}`
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Registration failed. Please try again.";
        setGeneralError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateStep, clearFormData, router]
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    // Since we skip step 2 (Schedule), go directly from step 3 to step 1
    setCurrentStep((prev) => {
      if (prev === 3) return 1; // Go from Profile back to Basic Info
      return Math.max(1, prev - 1);
    });
    setErrors({});
    setGeneralError(null);
  }, []);

  // Handle step change
  const handleStepChange = useCallback((step: number) => {
    if (step >= 1 && step <= REGISTRATION_STEPS.length) {
      setCurrentStep(step);
      setErrors({});
      setGeneralError(null);
    }
  }, []);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Veterinarian Registration
          </h1>
          <p className="text-white/80">
            Join our platform and start helping pets and their owners
          </p>
        </div>

        {/* Progress Indicator */}
        {/* <StepIndicator
          currentStep={currentStep}
          totalSteps={REGISTRATION_STEPS.length}
          steps={REGISTRATION_STEPS}
          onStepClick={handleStepChange}
        /> */}

        {/* Form Steps */}
        <div className="mt-8">
          
          {/* General Error Display */}
          {generalError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">Registration Error</p>
              </div>
              <p className="text-red-600 mt-1">{generalError}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="basic-info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <BasicInfoStep
                  onNext={handleBasicInfoNext}
                  initialData={formData}
                  errors={errors}
                  isLoading={isLoading}
                  emailAvailability={emailAvailability}
                  onEmailChange={checkEmailAvailability}
                />
              </motion.div>
            )}

            {/* {currentStep === 2 && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ScheduleStep
                  onNext={handleScheduleNext}
                  onBack={handleBack}
                  initialData={formData.schedule}
                  errors={errors}
                />
              </motion.div>
            )} */}

            {currentStep === 3 && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileStep
                  onNext={handleProfileNext}
                  onBack={handleBack}
                  isSubmitting={isSubmitting}
                  errors={errors}
                  initialData={formData}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
