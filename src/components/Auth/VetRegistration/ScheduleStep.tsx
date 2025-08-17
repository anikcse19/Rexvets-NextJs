"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ScheduleStepProps {
  onNext: (schedule: any) => void;
  onBack: () => void;
  initialData?: any;
  errors?: Record<string, string>;
}

export default function ScheduleStep({
  onNext,
  onBack,
  initialData = {},
  errors = {},
}: ScheduleStepProps) {
  const [schedule, setSchedule] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(schedule);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Schedule Setup</h2>
        <p className="text-gray-600 mb-4">Configure your working hours and availability</p>
        
        {/* Placeholder for schedule configuration */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Schedule configuration will be implemented here</p>
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
}
