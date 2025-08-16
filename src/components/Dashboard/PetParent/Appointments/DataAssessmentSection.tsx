"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, User, Stethoscope, Eye } from "lucide-react";

interface DataAssessmentSectionProps {
  appointmentId: string;
}

// Mock data for existing assessments (read-only for pet parents)
const mockAssessments = [
  {
    id: "1",
    date: "2025-01-15",
    time: "10:30 AM",
    data: "Temperature: 101.5°F, Heart Rate: 120 bpm, Respiratory Rate: 24 breaths/min, Weight: 28 kg",
    assessment:
      "Patient appears alert and responsive. Slight elevation in temperature. Heart and lung sounds normal. No obvious signs of distress.",
    plan: "Monitor temperature. Prescribe antibiotics for mild infection. Follow-up in 3 days. Owner to watch for any changes in appetite or behavior.",
    doctorName: "Dr. Anik Rahman",
  },
  {
    id: "2",
    date: "2024-12-15",
    time: "2:15 PM",
    data: "Temperature: 100.8°F, Heart Rate: 110 bpm, Respiratory Rate: 22 breaths/min, Weight: 27.5 kg",
    assessment:
      "Routine checkup. All vital signs within normal range. Patient is healthy and active. Vaccinations up to date.",
    plan: "Continue current diet and exercise routine. Next routine checkup in 6 months. Owner satisfied with pet's progress.",
    doctorName: "Dr. Anik Rahman",
  },
];

export default function DataAssessmentSection({
  appointmentId,
}: DataAssessmentSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-white">
              Medical Assessment
            </CardTitle>
            <p className="text-purple-100">
              Clinical records and doctor's assessments
            </p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {mockAssessments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Assessments Yet
              </h3>
              <p className="text-gray-600">
                Medical assessments will appear here after your appointment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockAssessments.map((assessment, index) => (
                <div key={assessment.id} className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-purple-50/30 border border-gray-200/60 hover:border-purple-300/60 transition-all duration-300 hover:shadow-xl">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-2 rounded-lg">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Assessment #{mockAssessments.length - index}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(assessment.date)} at{" "}
                                {assessment.time}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {assessment.doctorName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-4">
                      {/* Data Section */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Clinical Data
                        </h4>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-900 text-sm leading-relaxed">
                            {assessment.data}
                          </p>
                        </div>
                      </div>

                      {/* Assessment Section */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Doctor's Assessment
                        </h4>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-green-900 text-sm leading-relaxed">
                            {assessment.assessment}
                          </p>
                        </div>
                      </div>

                      {/* Plan Section */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Treatment Plan
                        </h4>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-orange-900 text-sm leading-relaxed">
                            {assessment.plan}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Read-only indicator */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                        <Eye className="w-3 h-3" />
                        <span>
                          This assessment is provided by your veterinarian
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
