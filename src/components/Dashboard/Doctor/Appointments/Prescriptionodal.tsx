"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill, Save, Send, Plus, Trash2, User, Calendar } from "lucide-react";

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional(),
});

const prescriptionSchema = z.object({
  medications: z
    .array(medicationSchema)
    .min(1, "At least one medication is required"),
  notes: z.string().optional(),
  sendToChat: z.boolean(), // strict boolean, no .default()
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  petName: string;
  petDetails: {
    breed: string;
    age: string;
    weight: string;
  };
}

const frequencyOptions = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "Every 8 hours",
  "Every 12 hours",
  "As needed",
  "Weekly",
  "Monthly",
];

const durationOptions = [
  "3 days",
  "5 days",
  "7 days",
  "10 days",
  "14 days",
  "21 days",
  "30 days",
  "Ongoing",
  "As directed",
];

export default function PrescriptionModal({
  isOpen,
  onClose,
  appointmentId,
  petName,
  petDetails,
}: PrescriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
      sendToChat: true, // initialize here
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Saving prescription:", data);

      if (data.sendToChat) {
        const medicationList = data.medications
          .map(
            (med) =>
              `• ${med.name} ${med.dosage} - ${med.frequency} for ${med.duration}`
          )
          .join("\n");

        const chatMessage = `💊 **Prescription Written**\n\n**Medications:**\n${medicationList}\n\n${
          data.notes ? `**Notes:** ${data.notes}` : ""
        }`;
        console.log("Sending to chat:", chatMessage);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset();
      onClose();
    } catch (error) {
      console.error("Error saving prescription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const addMedication = () => {
    append({
      name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    });
  };

  const removeMedication = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-3 rounded-xl">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Write Prescription
              </DialogTitle>
              <p className="text-gray-600">
                Create a new prescription for {petName}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Pet Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 mt-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 text-white p-2 rounded-lg">
              <User className="w-5 h-5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
              <div>
                <p className="text-sm font-medium text-blue-700">Patient</p>
                <p className="font-semibold text-blue-900">{petName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Breed</p>
                <p className="font-semibold text-blue-900">
                  {petDetails.breed}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Age</p>
                <p className="font-semibold text-blue-900">{petDetails.age}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Weight</p>
                <p className="font-semibold text-blue-900">
                  {petDetails.weight}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-700">Date</p>
              <p className="font-semibold text-blue-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Medications Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Medications
                </h3>
              </div>
              <Button
                type="button"
                onClick={addMedication}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">
                      Medication {index + 1}
                    </h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeMedication(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Medication Name *</Label>
                      <Input
                        {...register(`medications.${index}.name`)}
                        placeholder="e.g., Amoxicillin"
                      />
                      {errors.medications?.[index]?.name && (
                        <p className="text-sm text-red-600">
                          {errors.medications[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Dosage *</Label>
                      <Input
                        {...register(`medications.${index}.dosage`)}
                        placeholder="e.g., 250mg"
                      />
                      {errors.medications?.[index]?.dosage && (
                        <p className="text-sm text-red-600">
                          {errors.medications[index]?.dosage?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Frequency *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(`medications.${index}.frequency`, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.medications?.[index]?.frequency && (
                        <p className="text-sm text-red-600">
                          {errors.medications[index]?.frequency?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Duration *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(`medications.${index}.duration`, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.medications?.[index]?.duration && (
                        <p className="text-sm text-red-600">
                          {errors.medications[index]?.duration?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>Special Instructions</Label>
                    <Textarea
                      {...register(`medications.${index}.instructions`)}
                      placeholder="e.g., Give with food, monitor for side effects..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <Calendar className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Notes
              </h3>
            </div>

            <div className="space-y-2">
              <Label>Prescription Notes</Label>
              <Textarea
                {...register("notes")}
                placeholder="Any additional instructions, warnings, or follow-up recommendations..."
                rows={3}
              />
            </div>
          </div>

          {/* Send to Chat */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("sendToChat")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <Label className="flex items-center gap-2 cursor-pointer">
                <Send className="w-4 h-4 text-blue-600" />
                Send prescription summary to chat with pet parent
              </Label>
            </div>
            <p className="text-sm text-blue-700 mt-2 ml-7">
              This will automatically share the prescription details with the
              pet parent in the chat.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Prescription
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
