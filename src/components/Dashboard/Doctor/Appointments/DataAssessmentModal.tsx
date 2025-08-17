"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Save,
  Send,
  Thermometer,
  Heart,
  Activity,
  Weight,
} from "lucide-react";

const assessmentSchema = z.object({
  temperature: z.string().min(1, "Temperature is required"),
  heartRate: z.string().min(1, "Heart rate is required"),
  respiratoryRate: z.string().min(1, "Respiratory rate is required"),
  weight: z.string().min(1, "Weight is required"),
  additionalData: z.string().optional(),
  assessment: z.string().min(10, "Assessment must be at least 10 characters"),
  plan: z.string().min(10, "Treatment plan must be at least 10 characters"),
  sendToChat: z.boolean(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface DataAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  petName: string;
}

export default function DataAssessmentModal({
  isOpen,
  onClose,
  appointmentId,
  petName,
}: DataAssessmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [sendToChat, setSendToChat] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      sendToChat: true,
    },
  });

  const onSubmit = async (data: AssessmentFormData) => {
    setIsSubmitting(true);
    try {
      // API call to save assessment
      console.log("Saving assessment:", data);

      // If sendToChat is true, also send to chat
      if (data.sendToChat) {
        const chatMessage = `📋 **Assessment Added**\n\nTemperature: ${data.temperature}\nHeart Rate: ${data.heartRate}\nRespiratory Rate: ${data.respiratoryRate}\nWeight: ${data.weight}\n\n**Assessment:** ${data.assessment}\n\n**Plan:** ${data.plan}`;
        console.log("Sending to chat:", chatMessage);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving assessment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-3 rounded-xl">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Add Data & Assessment
              </DialogTitle>
              <p className="text-gray-600">
                Record clinical data and assessment for {petName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Clinical Data Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Clinical Data
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="temperature"
                  className="flex items-center gap-2"
                >
                  <Thermometer className="w-4 h-4 text-red-500" />
                  Temperature (°F)
                </Label>
                <Input
                  id="temperature"
                  {...register("temperature")}
                  placeholder="e.g., 101.5"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.temperature && (
                  <p className="text-sm text-red-600">
                    {errors.temperature.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate" className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Heart Rate (bpm)
                </Label>
                <Input
                  id="heartRate"
                  {...register("heartRate")}
                  placeholder="e.g., 120"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.heartRate && (
                  <p className="text-sm text-red-600">
                    {errors.heartRate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="respiratoryRate"
                  className="flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-blue-500" />
                  Respiratory Rate (breaths/min)
                </Label>
                <Input
                  id="respiratoryRate"
                  {...register("respiratoryRate")}
                  placeholder="e.g., 24"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.respiratoryRate && (
                  <p className="text-sm text-red-600">
                    {errors.respiratoryRate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2">
                  <Weight className="w-4 h-4 text-green-500" />
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  {...register("weight")}
                  placeholder="e.g., 28"
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                />
                {errors.weight && (
                  <p className="text-sm text-red-600">
                    {errors.weight.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalData">Additional Clinical Data</Label>
              <Textarea
                id="additionalData"
                {...register("additionalData")}
                placeholder="Any additional observations, measurements, or clinical data..."
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                rows={3}
              />
            </div>
          </div>

          {/* Assessment Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <FileText className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Assessment
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment">Clinical Assessment</Label>
              <Textarea
                id="assessment"
                {...register("assessment")}
                placeholder="Describe your clinical findings, observations, and diagnostic impressions..."
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                rows={4}
              />
              {errors.assessment && (
                <p className="text-sm text-red-600">
                  {errors.assessment.message}
                </p>
              )}
            </div>
          </div>

          {/* Treatment Plan Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Save className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Treatment Plan
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan">Treatment Plan & Recommendations</Label>
              <Textarea
                id="plan"
                {...register("plan")}
                placeholder="Outline the treatment plan, medications, follow-up instructions, and recommendations..."
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                rows={4}
              />
              {errors.plan && (
                <p className="text-sm text-red-600">{errors.plan.message}</p>
              )}
            </div>
          </div>

          {/* Send to Chat Option */}
          {/* Send to Chat Option */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendToChat"
                {...register("sendToChat")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label
                htmlFor="sendToChat"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-blue-600" />
                Send assessment summary to chat with pet parent
              </Label>
            </div>
            <p className="text-sm text-blue-700 mt-2 ml-7">
              This will automatically share a summary of the assessment with the
              pet parent in the chat.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Assessment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
