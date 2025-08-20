import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](\s?(AM|PM|am|pm))?$/;
const durationRegex = /^(\d+h\s*)?(\d+m\s*)?(\d+s\s*)?$/;

export const createAppointmentSchema = z.object({
  appointmentDate: z.string().regex(dateRegex, 'Invalid date format (YYYY-MM-DD)'),
  appointmentTime: z.string().regex(timeRegex, 'Invalid time format'),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).optional(),

  petName: z.string().min(1).max(100),
  moreDetails: z.string().max(1000).optional(),

  meetingLink: z.string().url().optional(),
  monitorLink: z.string().url().optional(),
  roomId: z.string().min(1),
  callStatus: z.enum(['not-started', 'in-progress', 'completed', 'failed', 'cancelled', '']).optional(),
  callDuration: z.string().regex(durationRegex).optional(),
  videoCallCompleted: z.boolean().optional(),

  veterinarianId: z.string().regex(objectIdRegex).optional(),
  parentId: z.string().regex(objectIdRegex).optional(),

  prescription: z.array(z.string().max(5000)).optional(),
  dataAssementPlan: z.array(z.string().max(5000)).optional(),
  followUpDate: z.coerce.date().optional(),
  followUpRequired: z.boolean().optional(),

  isDeleted: z.boolean().optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export const listAppointmentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['appointmentDate', 'createdAt', 'status']).default('appointmentDate'),
  order: z.enum(['asc', 'desc']).default('asc'),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'rescheduled']).optional(),
  veterinarianId: z.string().regex(objectIdRegex).optional(),
  parentId: z.string().regex(objectIdRegex).optional(),
  date: z.string().regex(dateRegex).optional(),
  startDate: z.string().regex(dateRegex).optional(),
  endDate: z.string().regex(dateRegex).optional(),
  includeDeleted: z.coerce.boolean().optional(),
});

export const bulkDeleteAppointmentsSchema = z.object({
  ids: z.array(z.string().regex(objectIdRegex, 'Invalid id')).min(1, 'ids cannot be empty'),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsQuerySchema>;
export type BulkDeleteAppointmentsInput = z.infer<typeof bulkDeleteAppointmentsSchema>;
