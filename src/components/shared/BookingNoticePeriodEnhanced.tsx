"use client";

import { CheckCircle, Clock, Info, Loader2 } from "lucide-react";
import React from "react";
import useNoticePeriod from "./hooks/useNoticePeriod";

interface BookingNoticePeriodEnhancedProps {
  value?: number; // in minutes
  onChange?: (value: number) => void;
  className?: string;
  vetId?: string;
  autoSave?: boolean; // Whether to automatically save changes to API
  autoLoad?: boolean; // Whether to automatically load from API
}

const BookingNoticePeriodEnhanced: React.FC<BookingNoticePeriodEnhancedProps> = ({
  value = 30,
  onChange,
  className = "",
  vetId,
  autoSave = false,
  autoLoad = false,
}) => {
  const {
    noticePeriod,
    isLoading,
    isSaving,
    error,
    successMessage,
    loadNoticePeriod,
    updateNoticePeriod,
    validatePeriod,
    formatPeriod,
  } = useNoticePeriod({
    autoLoad,
    onSuccess: (data) => {
      onChange?.(data.noticePeriod);
    },
    onError: (error) => {
      console.error("Notice period operation failed:", error);
    },
  });

  const currentPeriod = autoLoad ? noticePeriod : value;

  const handlePeriodChange = async (period: number) => {
    onChange?.(period);
    
    if (autoSave) {
      await updateNoticePeriod(period);
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
          <span className="ml-2 text-gray-600">Loading notice period settings...</span>
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
        {successMessage && <CheckCircle className="w-4 h-4 text-green-500" />}
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
              currentPeriod === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            } ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isSaving && handlePeriodChange(option.value)}
          >
            <div className="flex items-start gap-3">
              {/* Radio Button */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentPeriod === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {currentPeriod === option.value && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h4 className="font-medium text-gray-900">{option.label}</h4>
                  {currentPeriod === option.value && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
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
              {getExampleText(currentPeriod)}
            </p>
          </div>
        </div>
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
          <p><strong>Debug Info:</strong></p>
          <p>Current Period: {currentPeriod} minutes ({formatPeriod(currentPeriod)})</p>
          <p>Auto Load: {autoLoad ? 'Yes' : 'No'}</p>
          <p>Auto Save: {autoSave ? 'Yes' : 'No'}</p>
          <p>Valid: {validatePeriod(currentPeriod) ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default BookingNoticePeriodEnhanced;


