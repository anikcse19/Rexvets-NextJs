import { z } from "zod";

// Help form validation schema
export const helpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  state: z.string().min(2, "State is required"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  details: z
    .string()
    .min(20, "Please provide more details (minimum 20 characters)"),
});

// Type export
export type HelpFormData = z.infer<typeof helpFormSchema>;
