"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Stethoscope,
  Pill,
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Appointment, Doctor, Pet, PetParent } from "@/lib/types";

interface PetHistoryRecord {
  _id: string;
  petParent: PetParent;
  pet: Pet;
  veterinarian: Doctor;
  appointment: Appointment;
  visitDate: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  notes?: string;
  followUpNeeded: boolean;
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface PetHistoryTimelineProps {
  history: PetHistoryRecord[];
}

export default function PetHistoryTimeline({
  history,
}: PetHistoryTimelineProps) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityLevel = (diagnosis?: string) => {
    if (!diagnosis) return "routine";
    const lowerDiagnosis = diagnosis.toLowerCase();
    if (
      lowerDiagnosis.includes("critical") ||
      lowerDiagnosis.includes("emergency")
    )
      return "critical";
    if (
      lowerDiagnosis.includes("infection") ||
      lowerDiagnosis.includes("injury")
    )
      return "moderate";
    return "routine";
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "critical":
        return "border-red-500 bg-red-500";
      case "moderate":
        return "border-yellow-500 bg-yellow-500";
      default:
        return "border-green-500 bg-green-500";
    }
  };

  console.log("history", history);

  if (history.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No medical records found
        </h3>
        <p className="text-gray-600">
          No records match your current search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 to-indigo-200"></div>

      <div className="space-y-8">
        {history.map((record, index) => {
          const severityLevel = getSeverityLevel(record.diagnosis);
          const isLatest = index === 0;

          return (
            <div key={record._id} className="relative group">
              {/* Timeline dot */}
              <div
                className={`absolute left-6 w-4 h-4 rounded-full border-4 ${getSeverityColor(
                  severityLevel
                )} shadow-lg z-10 ${isLatest ? "animate-pulse" : ""}`}
              >
                {isLatest && (
                  <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-75"></div>
                )}
              </div>

              {/* Content card */}
              <div className="ml-16">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50/30 border border-gray-200/60 hover:border-blue-300/60 transition-all duration-300 hover:shadow-xl group-hover:shadow-2xl">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-3 rounded-xl">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Visit #{history.length - index}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(record.visitDate)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(record.visitDate)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* {record.followUpNeeded ? (
                          <Badge className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Follow-up
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Complete
                          </Badge>
                        )}
                        {isLatest && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                            Latest
                          </Badge>
                        )} */}
                        <Button
                          onClick={() => {
                            router.push(
                              `/dashboard/doctor/appointments/${record?.appointment?._id}`
                            );
                          }}
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Diagnosis */}
                    {record.diagnosis && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Diagnosis
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <p className="text-blue-900 leading-relaxed">
                            {record.diagnosis}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Treatment */}
                    {record.treatment && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          Treatment
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <p className="text-green-900 leading-relaxed">
                            {record.treatment}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Medications */}
                    {record.medications && record.medications.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Pill className="w-4 h-4 text-purple-600" />
                          Medications
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {record.medications.map((medication, medIndex) => (
                            <div
                              key={medIndex}
                              className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200"
                            >
                              <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-purple-900">
                                  {medication}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {record.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          Notes
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                          <p className="text-orange-900 leading-relaxed">
                            {record.notes}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Follow-up */}
                    {record.followUpNeeded && record.followUpDate && (
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-500 text-white p-2 rounded-lg">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-amber-900">
                              Follow-up Scheduled
                            </p>
                            <p className="text-amber-800">
                              {/* {formatDate(record.followUpDate)} at{" "}
                              {formatTime(record.followUpDate)} */}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
