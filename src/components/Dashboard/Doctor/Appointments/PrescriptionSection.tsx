"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Download, Calendar, User, Clock } from "lucide-react";
import { Prescription } from "@/lib/types";
import { toast } from "sonner";

interface PrescriptionSectionProps {
  appointmentId: string;
  onOpenModal: () => void;
}

// Mock data for existing prescriptions
const mockPrescriptions = [
  {
    id: "1",
    date: "2025-01-15",
    time: "10:45 AM",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "250mg",
        frequency: "Twice daily",
        duration: "7 days",
        instructions: "Give with food",
      },
      {
        name: "Metacam",
        dosage: "1.5mg",
        frequency: "Once daily",
        duration: "5 days",
        instructions: "Give with food, monitor for side effects",
      },
    ],
    notes:
      "Monitor for any adverse reactions. Return if symptoms persist after 3 days.",
    doctorName: "Dr. Anik Rahman",
    doctorLicense: "VET-BD-2012-001234",
  },
  {
    id: "2",
    date: "2024-12-15",
    time: "2:30 PM",
    medications: [
      {
        name: "Heartgard Plus",
        dosage: "25mg",
        frequency: "Monthly",
        duration: "Ongoing",
        instructions: "Give on the same date each month",
      },
    ],
    notes:
      "Preventive medication for heartworm. Continue monthly administration.",
    doctorName: "Dr. Anik Rahman",
    doctorLicense: "VET-BD-2012-001234",
  },
];

export default function PrescriptionSection({
  appointmentId,
  onOpenModal,
}: PrescriptionSectionProps) {
  const [prescriptionsData, setPrescriptionsData] = useState<Prescription[]>(
    []
  );

  // console.log("iddd", appointmentId);
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

  const handleDownloadPrescription = (prescriptionId: string) => {
    // This would generate and download a PDF prescription
    // console.log(`Downloading prescription ${prescriptionId}`);
    // Implementation would involve PDF generation
  };

  const fetchPrescription = async () => {
    try {
      const res = await fetch(
        `/api/prescriptions/appointment/${appointmentId}`
      );
      // console.log("respone", res);
      if (!res.ok) {
        throw new Error();
      }
      const data = await res.json();
      // console.log("prescription data by appointment id", data.data);
      // Ensure prescriptionsData is always an array
      setPrescriptionsData(data?.data || []);
    } catch (error) {
      setPrescriptionsData([]);
    }
  };

  useEffect(() => {
    fetchPrescription();
  }, [appointmentId, onOpenModal]);

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Prescriptions
              </CardTitle>
              <p className="text-green-100">
                Medication history and prescriptions
              </p>
            </div>
          </div>
          <Button
            onClick={onOpenModal}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Write Prescription
          </Button>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-6">
          {(!prescriptionsData || prescriptionsData.length === 0) ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Pill className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Prescriptions Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Write the first prescription for this patient.
              </p>
              <Button
                onClick={onOpenModal}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Write Prescription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {(prescriptionsData || [])
                .slice()
                .reverse()
                .map((prescription, index) => (
                  <div key={prescription._id} className="group">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gray-50 to-green-50/30 border border-gray-200/60 hover:border-green-300/60 transition-all duration-300 hover:shadow-xl">
                      {/* Header */}
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-2 rounded-lg">
                              <Pill className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                Prescription #{(prescriptionsData?.length || 0) - index}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    {formatDate(prescription.createdAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {formatTime(prescription.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() =>
                                window.open(prescription?.pdfLink, "_blank")
                              }
                              variant="outline"
                              size="sm"
                              className="border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-4">
                        {/* Medications */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Medications
                          </h4>
                          <div className="space-y-3">
                            {prescription?.medication_details.map(
                              (medication, medIndex) => (
                                <div
                                  key={medIndex}
                                  className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-bold text-blue-900 text-lg">
                                      {medication.name}
                                    </h5>
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                      {medication.form}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <p className="text-blue-700 font-medium">
                                        Medication:
                                      </p>
                                      <p className="text-blue-900">
                                        {medication.medicationQuantity}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-blue-700 font-medium">
                                        Unit:
                                      </p>
                                      <p className="text-blue-900">
                                        {medication.quantityUnit}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div>
                                      <p className="text-blue-700 font-medium">
                                        Strength:
                                      </p>
                                      <p className="text-blue-900">
                                        {medication.strength}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-blue-700 font-medium">
                                        Unit:
                                      </p>
                                      <p className="text-blue-900">
                                        {medication.strengthUnit}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* Usage */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Usage Instruction
                          </h4>
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-blue-700 font-medium">
                                  Refills:
                                </p>
                                <p className="text-blue-900">
                                  {prescription?.usage_instruction?.refills}
                                </p>
                              </div>
                              <div>
                                <p className="text-blue-700 font-medium">
                                  Refills Gap:
                                </p>
                                <p className="text-blue-900">
                                  {prescription?.usage_instruction?.refillsGap}
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-blue-700 font-medium">
                                  Direction For Use:
                                </p>
                                <p className="text-blue-900">
                                  {
                                    prescription?.usage_instruction
                                      ?.directionForUse
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Doctor Info */}
                        <div className="pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-3 h-3" />
                            <span>{prescription?.veterinarian?.name}</span>
                            <span>•</span>
                            <span>
                              License:{" "}
                              {
                                prescription?.veterinarian?.licenses[0]
                                  ?.licenseNumber
                              }
                            </span>
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
