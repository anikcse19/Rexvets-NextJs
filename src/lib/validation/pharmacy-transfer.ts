import { z } from "zod";

export const pharmacyFormSchema = z.object({
  pharmacyName: z
    .string()
    .min(1, "Pharmacy name is required")
    .max(100, "Pharmacy name must be less than 100 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address must be less than 200 characters"),
  city: z
    .string()
    .min(1, "City is required")
    .max(50, "City must be less than 50 characters"),
  state: z
    .string()
    .min(1, "State is required")
    .max(50, "State must be less than 50 characters"),
  appointmentId: z.string().min(1, "Please select an appointment"),
});
