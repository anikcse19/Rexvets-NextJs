"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  Pill,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  Stethoscope,
  Activity,
} from "lucide-react";

interface PetHistoryRecord {
  id: string;
  visitDate: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  notes?: string;
  followUpNeeded: boolean;
  followUpDate?: string | null;
  createdAt: string;
}

interface PetHistoryCardProps {
  record: PetHistoryRecord;
}

export default function PetHistoryCard({ record }: PetHistoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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
        return "from-red-500 to-red-600";
      case "moderate":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-green-500 to-emerald-500";
    }
  };

  const getSeverityBg = (level: string) => {
    switch (level) {
      case "critical":
        return "from-red-50 to-red-100";
      case "moderate":
        return "from-yellow-50 to-orange-50";
      default:
        return "from-green-50 to-emerald-50";
    }
  };

  const severityLevel = getSeverityLevel(record.diagnosis);

  return (
    <div className="group">
      <Card className="shadow-lg border-0 bg-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        {/* Status indicator line */}
        <div
          className={`h-1 bg-gradient-to-r ${getSeverityColor(severityLevel)}`}
        />

        <CardContent className="p-0">
          {/* Header */}
          <div
            className={`p-6 bg-gradient-to-r ${getSeverityBg(
              severityLevel
            )} border-b border-gray-100`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`bg-gradient-to-r ${getSeverityColor(
                    severityLevel
                  )} text-white p-3 rounded-xl`}
                >
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Medical Visit
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
                {record.followUpNeeded ? (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Follow-up Needed
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Complete
                  </Badge>
                )}
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
                  Medications Prescribed
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {record.medications.map((medication, index) => (
                    <div
                      key={index}
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
                  Veterinarian Notes
                </h4>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                  <p className="text-orange-900 leading-relaxed">
                    {record.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Follow-up Information */}
            {record.followUpNeeded && record.followUpDate && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500 text-white p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900">
                      Follow-up Required
                    </p>
                    <p className="text-amber-800">
                      Scheduled for {formatDate(record.followUpDate)} at{" "}
                      {formatTime(record.followUpDate)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
