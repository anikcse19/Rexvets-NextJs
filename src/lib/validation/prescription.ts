import z from "zod";

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  form: z.string().min(1, "Form is required"), // e.g., tablet, syrup
  medicationQuantity: z.number().min(1, "Quantity is required"),
  quantityUnit: z.string().min(1, "Unit is required"), // enum values
  strength: z.number().min(0, "Strength is required"),
  strengthUnit: z.string().min(1, "Strength unit is required"),
});

const usageInstructionSchema = z.object({
  refills: z.number().min(0).default(0),
  refillsGap: z.number().min(0).default(0),
  directionForUse: z.string().optional(),
});

const pharmacySchema = z.object({
  canUseGenericSubs: z.boolean().default(true),
  canFilledHumanPharmacy: z.boolean().default(false),
  noteToPharmacist: z.string().optional(),
});

export const prescriptionSchema = z.object({
  medications: z.array(medicationSchema).min(1),
  usageInstructions: usageInstructionSchema,
  pharmacy: pharmacySchema,
});

export type PrescriptionFormData = z.infer<typeof prescriptionSchema>;
