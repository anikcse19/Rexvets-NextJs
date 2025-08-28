"use client";

import React, { useEffect, useState } from "react";
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

import {
  FileText,
  Save,
  Send,
  Thermometer,
  Heart,
  Activity,
  Weight,
} from "lucide-react";
import { toast } from "sonner";
import { DataAssessmentPlan } from "@/lib/types/dataAssessmentPlan";
import { useRouter } from "next/navigation";

const assessmentSchema = z.object({
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
  vetId: string;
  assessment?: DataAssessmentPlan | null; // 👈 optional for edit
}

export default function DataAssessmentModal({
  isOpen,
  onClose,
  appointmentId,
  petName,
  vetId,
  assessment,
}: DataAssessmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  // const [sendToChat, setSendToChat] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      additionalData: assessment?.data || "",
      assessment: assessment?.assessment || "",
      plan: assessment?.plan || "",
      sendToChat: true,
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (assessment) {
      reset({
        additionalData: assessment.data || "",
        assessment: assessment.assessment || "",
        plan: assessment.plan || "",
        sendToChat: true,
      });
    } else {
      reset({
        additionalData: "",
        assessment: "",
        plan: "",
        sendToChat: true,
      });
    }
  }, [assessment, reset]);

  const onSubmit = async (data: AssessmentFormData, event?: any) => {
    try {
      const action = event?.nativeEvent?.submitter?.value;
      const status = action === "draft" ? "DRAFT" : "FINALIZED";
      if (status === "DRAFT") {
        setIsDrafting(true);
      } else {
        setIsSubmitting(true);
      }
      if (assessment?._id) {
        const res = await fetch(
          "/api/data-assessment-plans/" + assessment._id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: data.additionalData,
              assessment: data.assessment,
              plan: data.plan,
              veterinarian: vetId,
              appointment: appointmentId,
              status,
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Failed to save assessment");
        }

        const result = await res.json();

        if (result.success) {
          toast.success("Assessment saved successfully");
        } else {
          toast.error(result.message || "Failed to save assessment");
        }
      } else {
        const res = await fetch("/api/data-assessment-plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: data.additionalData,
            assessment: data.assessment,
            plan: data.plan,
            veterinarian: vetId,
            appointment: appointmentId,
            status,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save assessment");
        }

        const result = await res.json();

        if (result.success) {
          toast.success("Assessment saved successfully");
        } else {
          toast.error(result.message || "Failed to save assessment");
        }
      }

      reset();
      onClose();
    } catch (error: any) {
      toast.error(
        error.data.message || "An error occurred while saving the assessment"
      );
      console.error("Error saving assessment:", error);
    } finally {
      setIsSubmitting(false);
      setIsDrafting(false);
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
            <div className="space-y-2">
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
              className="border-gray-300 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              name="action"
              value="draft"
              disabled={isDrafting}
              className="bg-gray-500 hover:bg-gray-600 text-gray-100 cursor-pointer"
            >
              {isDrafting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Drafting...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Draft Assessment
                </>
              )}
            </Button>

            <Button
              type="submit"
              name="action"
              value="save"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Finalize Assessment
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
