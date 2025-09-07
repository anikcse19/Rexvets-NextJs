"use client";

import { Clock, Info } from "lucide-react";
import React from "react";

interface BookingNoticePeriodFormProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

const BookingNoticePeriodForm: React.FC<BookingNoticePeriodFormProps> = ({
  value,
  onChange,
  className = "",
}) => {
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
    return `For a ${exampleTime} appointment, clients can book until ${cutoffTime}.`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <h3 className="text-base font-medium text-gray-900">
          Booking Notice Period
        </h3>
        <Info className="w-4 h-4 text-blue-500" />
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600">
        Set the minimum notice period required for appointments.
      </p>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`relative border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
              value === option.value
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Radio Input */}
              <input
                type="radio"
                name="noticePeriod"
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />

              {/* Custom Radio Button */}
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    value === option.value
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {value === option.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  <span className="font-medium text-gray-900 text-sm">
                    {option.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Example */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-blue-800 leading-relaxed">
              {getExampleText(value)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingNoticePeriodForm;


