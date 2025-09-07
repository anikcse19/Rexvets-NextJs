"use client";

import { Clock, Info, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  formatNoticePeriod,
  getNoticePeriod,
  updateNoticePeriod,
  validateNoticePeriod,
} from "./services/noticePeriodService";

interface BookingNoticePeriodProps {
  value?: number; // in minutes
  onChange?: (value: number) => void;
  className?: string;
  vetId?: string;
  autoSave?: boolean; // Whether to automatically save changes to API
}

const BookingNoticePeriod: React.FC<BookingNoticePeriodProps> = ({
  value = 30,
  className = "",
  vetId,
  autoSave = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load current notice period from API on component mount
  useEffect(() => {
    loadCurrentNoticePeriod();
  }, [autoSave]);

  const loadCurrentNoticePeriod = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/veterinarian/notice-period`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load notice period: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setSelectedPeriod(result.data.noticePeriod);
        // onChange?.(result.data.noticePeriod);
      }
    } catch (error: any) {
      console.error("Failed to load notice period:", error);
      setError(error.message || "Failed to load notice period");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePeriodChange = async (period: number) => {
    setSelectedPeriod(period);

    await saveNoticePeriod(period);
  };

  const saveNoticePeriod = async (period: number) => {
    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Validate the notice period before saving
      if (!validateNoticePeriod(period)) {
        throw new Error(
          "Invalid notice period. Must be between 0 and 1440 minutes."
        );
      }

      const response = await fetch(`/api/veterinarian/notice-period`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noticePeriod: period }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update notice period: ${response.statusText}`
        );
      }

      const result = await response.json();
      if (result.success) {
        console.log("Notice period updated successfully:", result.data);
        setSuccessMessage(
          `Notice period updated to ${formatNoticePeriod(period)}`
        );
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error: any) {
      console.error("Failed to save notice period:", error);
      setError(error.message || "Failed to save notice period");
    } finally {
      setIsSaving(false);
    }
  };

  const options = [
    {
      value: 15,
      label: "15 Minutes",
      description: "Allow bookings up to 15 minutes before appointment time.",
    },
    {
      value: 30,
      label: "30 Minutes",
      description: "Allow bookings up to 30 minutes before appointment time.",
    },
  ];

  const getExampleText = (period: number) => {
    const exampleTime = "9:00 AM";
    const cutoffTime = period === 15 ? "8:45 AM" : "8:30 AM";
    return `Example: For a ${exampleTime} appointment, clients can book until ${cutoffTime}. After ${cutoffTime}, the ${exampleTime} slot will not be available.`;
  };

  if (isLoading) {
    return (
      <div className={`w-full max-w-2xl ${className}`}>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">
            Loading notice period settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Booking Notice Period
        </h3>
        <Info className="w-5 h-5 text-blue-500" />
        {isSaving && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-600 mb-6 leading-relaxed">
        Set the minimum notice period required for appointments. This helps
        ensure you have adequate preparation time.
      </p>

      {/* Options */}
      <div className="space-y-4 mb-6">
        {options.map((option) => (
          <div
            key={option.value}
            className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedPeriod === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handlePeriodChange(option.value)}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPeriod === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedPeriod === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Example */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-blue-900 mb-1">How it works:</h5>
            <p className="text-sm text-blue-800 leading-relaxed">
              {getExampleText(selectedPeriod)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingNoticePeriod;
