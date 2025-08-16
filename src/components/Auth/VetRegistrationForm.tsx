"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Schedule, VeterinarianProfile } from "@/lib/types";
import StepIndicator from "./VetRegistration/StepIndicator";
import BasicInfoStep from "./VetRegistration/BasicInfoStep";
import ScheduleStep from "./VetRegistration/ScheduleStep";
import ProfileStep from "./VetRegistration/ProfileStep";

const REGISTRATION_STEPS = [
  { title: "Basic Info", description: "Personal and contact information" },
  { title: "Schedule", description: "Set your availability" },
  { title: "Profile", description: "Upload documents and signature" },
];

export default function VetRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<VeterinarianProfile>>({});

  const handleBasicInfoNext = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleScheduleNext = (schedule: Schedule) => {
    setFormData((prev) => ({ ...prev, schedule }));
    setCurrentStep(3);
  };

  const handleProfileNext = (profileData: any) => {
    const completedData = { ...formData, ...profileData };
    console.log("Veterinarian registration completed:", completedData);
    // Here you would typically submit to your API
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={REGISTRATION_STEPS.length}
          steps={REGISTRATION_STEPS}
        />

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <BasicInfoStep
              key="basic-info"
              onNext={handleBasicInfoNext}
              initialData={formData}
            />
          )}

          {currentStep === 2 && (
            <ScheduleStep
              key="schedule"
              onNext={handleScheduleNext}
              onBack={handleBack}
              initialData={formData.schedule}
            />
          )}

          {currentStep === 3 && (
            <ProfileStep
              key="profile"
              onNext={handleProfileNext}
              onBack={handleBack}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
