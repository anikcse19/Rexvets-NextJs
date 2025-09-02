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
import { Appointment, Doctor, Pet, PetParent } from "@/lib/types";
import {
  PrescriptionFormData,
  prescriptionSchema,
} from "@/lib/validation/prescription";
import { useRouter } from "next/navigation";
import PrescriptionPDF from "./PrescriptionPDF";
import { pdf } from "@react-pdf/renderer";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  appointment: Appointment;
  pet: Pet;
  petParent: PetParent;
  veterinarian: Doctor;
}

export default function PrescriptionModal({
  isOpen,
  onClose,
  appointmentId,
  appointment,
  pet,
  petParent,
  veterinarian,
}: PrescriptionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log(pet, petParent, veterinarian, "check ids");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [
        {
          name: "",
          form: "",
          medicationQuantity: 0,
          quantityUnit: "",
          strength: 0,
          strengthUnit: "",
        },
      ],
      usageInstructions: {
        refills: 0,
        refillsGap: 0,
        directionForUse: "",
      },
      pharmacy: {
        canUseGenericSubs: true,
        canFilledHumanPharmacy: false,
        noteToPharmacist: "",
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medications",
  });

  const onSubmit = async (data: PrescriptionFormData) => {
    setIsSubmitting(true);
    try {
      // console.log("Saving prescription:", data);

      const pdfBlob = await pdf(
        <PrescriptionPDF
          appointment={appointment}
          veterinarian={veterinarian}
          petParent={petParent}
          pet={pet}
          values={data}
        />
      ).toBlob();

      console.log("pdfblob", pdfBlob);

      const formData = new FormData();

      formData.append("veterinarian", veterinarian?._id || "");
      formData.append("pet", pet?._id || "");
      formData.append("petParent", petParent?._id || "");
      formData.append("appointment", appointmentId || "");

      // medications (array) → stringify as JSON
      formData.append("medication_details", JSON.stringify(data.medications));

      // usage instructions
      formData.append(
        "usage_instruction",
        JSON.stringify(data.usageInstructions)
      );

      // pharmacy
      formData.append("pharmacy", JSON.stringify(data.pharmacy));

      // PDF link (string)
      formData.append("pdf", pdfBlob, "prescription.pdf");

      // console.log("payload", formData);
      // for (const [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }

      const res = await fetch("/api/prescriptions", {
        method: "POST",
        body: formData,
      });

      console.log("response", res);

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

  // const addMedication = () => {
  //   append({
  //     name: "",

  //   });
  // };

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
                {/* Create a new prescription for {petName} */}
              </p>
            </div>
          </div>
        </DialogHeader>

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
              {/* <Button
                type="button"
                // onClick={addMedication}
                variant="outline"
                className="border-green-300 text-green-600 hover:bg-green-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button> */}
            </div>
            {/* medications */}
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
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <Label>Medication Name *</Label>
                      <Input
                        {...register(`medications.${index}.name`)}
                        placeholder="e.g., Amoxicillin"
                      />
                    </div>

                    {/* Form */}
                    <div className="flex flex-col gap-1.5">
                      <Label>Form *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(`medications.${index}.form`, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select form" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="syrup">Syrup</SelectItem>
                          <SelectItem value="capsule">Capsule</SelectItem>
                          <SelectItem value="injection">Injection</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col gap-1.5">
                      <Label>Quantity *</Label>
                      <Input
                        type="number"
                        {...register(
                          `medications.${index}.medicationQuantity`,
                          { valueAsNumber: true }
                        )}
                      />
                    </div>

                    {/* Quantity Unit */}
                    <div className="flex flex-col gap-1.5">
                      <Label>Quantity Unit *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(`medications.${index}.quantityUnit`, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="capsule">Capsule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Strength */}
                    <div className="flex flex-col gap-1.5">
                      <Label>Strength *</Label>
                      <Input
                        type="number"
                        {...register(`medications.${index}.strength`, {
                          valueAsNumber: true,
                        })}
                      />
                    </div>

                    {/* Strength Unit */}
                    <div className="flex flex-col gap-1.5">
                      <Label>Strength Unit *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(`medications.${index}.strengthUnit`, value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="mg/ml/etc" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mg">mg</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                          <SelectItem value="g">g</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* usage instruction */}
            <div className="mt-6 p-4 border rounded-xl space-y-4">
              <h3 className="font-semibold">Usage Instructions</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Refills</Label>
                  <Input
                    type="number"
                    {...register("usageInstructions.refills", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Refills Gap (days)</Label>
                  <Input
                    type="number"
                    {...register("usageInstructions.refillsGap", {
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Direction For Use</Label>
                <Textarea {...register("usageInstructions.directionForUse")} />
              </div>
            </div>
            {/* pharmacy instruction */}
            <div className="mt-6 p-4 border rounded-xl space-y-4">
              <h3 className="font-semibold">Pharmacy Instructions</h3>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("pharmacy.canUseGenericSubs")}
                />
                <Label>Allow Generic Substitutes</Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("pharmacy.canFilledHumanPharmacy")}
                />
                <Label>Can be filled at human pharmacy</Label>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Note to Pharmacist</Label>
                <Textarea {...register("pharmacy.noteToPharmacist")} />
              </div>
            </div>
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
