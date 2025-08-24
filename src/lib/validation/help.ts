import { z } from "zod";

// Help request validation schema
export const helpRequestSchema = z.object({
  role: z.enum(['pet_parent', 'veterinarian', 'technician', 'admin']),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  state: z.string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters"),
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject cannot exceed 200 characters"),
  details: z.string()
    .min(10, "Details must be at least 10 characters")
    .max(2000, "Details cannot exceed 2000 characters"),
});

// Help update validation schema (partial updates)
export const helpUpdateSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .optional(),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional(),
  state: z.string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State cannot exceed 100 characters")
    .optional(),
  subject: z.string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject cannot exceed 200 characters")
    .optional(),
  details: z.string()
    .min(10, "Details must be at least 10 characters")
    .max(2000, "Details cannot exceed 2000 characters")
    .optional(),
}).refine((data) => {
  // Ensure at least one field is provided for update
  return Object.keys(data).some(key => data[key as keyof typeof data] !== undefined);
}, {
  message: "At least one field must be provided for update"
});

// Help filter validation schema
export const helpFilterSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  role: z.enum(['pet_parent', 'veterinarian', 'technician', 'admin']).optional().nullable(),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address").optional().nullable(),
  q: z.string().optional().nullable(), // Text search
});

// Type exports
export type HelpRequestData = z.infer<typeof helpRequestSchema>;
export type HelpUpdateData = z.infer<typeof helpUpdateSchema>;
export type HelpFilterData = z.infer<typeof helpFilterSchema>;
