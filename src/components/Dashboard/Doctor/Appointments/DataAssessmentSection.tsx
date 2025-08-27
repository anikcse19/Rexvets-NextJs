"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Calendar,
  User,
  Stethoscope,
  Edit,
  Delete,
  DeleteIcon,
  Trash2,
} from "lucide-react";
import { DataAssessmentPlan } from "@/lib/types/dataAssessmentPlan";
import { format } from "path";
import { Dialog } from "@/components/ui/dialog";
import ConfirmDeleteModal from "@/components/shared/ConfirmDeleteModal";

interface DataAssessmentSectionProps {
  appointmentId: string;
  onOpenModal: () => void;
  setCurrentAssessment: React.Dispatch<React.SetStateAction<any>>;
}

// Mock data for existing assessments
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
  onOpenModal,
  setCurrentAssessment,
}: DataAssessmentSectionProps) {
  const [assessments, setAssessments] = useState<DataAssessmentPlan[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchAssessments = async () => {
    try {
      const res = await fetch(
        `/api/data-assessment-plans/appointment/${appointmentId}`
      );
      const data = await res.json();
      console.log("Fetched assessments:", data);
      setAssessments(data?.data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [onOpenModal]);

  const handleDeleteAssessment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    try {
      const res = await fetch(`/api/data-assessment-plans/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setAssessments((prev) => prev.filter((item) => item._id !== id));
        alert("Assessment deleted successfully");
      } else {
        alert(result.message || "Failed to delete assessment");
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
      alert("An error occurred while deleting the assessment");
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Data & Assessment
              </CardTitle>
              <p className="text-purple-100">
                Medical records and clinical assessments
              </p>
            </div>
          </div>
          <Button
            onClick={onOpenModal}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Assessments Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by adding the first data and assessment for this
                appointment.
              </p>
              <Button
                onClick={onOpenModal}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Assessment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment, index) => (
                <div key={assessment._id} className="group">
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
                              Assessment #{assessments.length - index}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(assessment.createdAt)} at{" "}
                                {formatTime(assessment.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4  transition-opacity">
                          {assessment.status === "DRAFT" ? (
                            <div>
                              <Button
                                onClick={() => {
                                  setCurrentAssessment(assessment);
                                  onOpenModal();
                                  console.log("Edit", assessment);
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-gray-900 hover:text-purple-600 cursor-pointer"
                              >
                                <Edit />
                                Edit
                              </Button>
                              <Button
                                onClick={() =>
                                  handleDeleteAssessment(assessment?._id)
                                }
                                variant="destructive"
                                size="sm"
                                className=" cursor-pointer"
                              >
                                <Trash2 />
                                Delete
                              </Button>
                            </div>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
                              Finalized
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-5">
                        <User className="w-3 h-3 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          Dr. {assessment.veterinarian.name}
                        </span>
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
                          Assessment
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
