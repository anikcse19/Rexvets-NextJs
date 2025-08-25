import { AppointmentStatus } from "@/lib/types";

export interface DatabaseAppointment {
  _id: string;
  veterinarian: {
    _id: string;
    name: string;
    email: string;
  };
  petParent: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
  pet: {
    _id: string;
    name: string;
    species: string;
    breed?: string;
    image?: string;
  };
  appointmentDate: string;
  appointmentTime?: string;
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
  reasonForVisit: string;
  feeUSD: number;
  status: AppointmentStatus;
  appointmentType: string;
  paymentStatus: string;
  isFollowUp: boolean;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransformedAppointment {
  id: string;
  petName: string;
  petImage: string;
  petType: string;
  parentName: string;
  parentImage: string;
  appointmentDate: string;
  appointmentTime: string;
  timezone: string;
  status: "confirmed" | "completed" | "cancelled" | "pending" | "in-progress" | "no-show" | "rescheduled";
  bookingTime: string;
  seenBefore: boolean;
  service: string;
  notes?: string;
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: DatabaseAppointment[];
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class AppointmentsService {
  private baseUrl = '/api/appointments';

  /**
   * Fetch appointments for a specific veterinarian
   */
  async getVeterinarianAppointments(
    veterinarianId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: AppointmentStatus;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<AppointmentsResponse> {
    try {
      const params = new URLSearchParams({
        veterinarian: veterinarianId,
        page: options?.page?.toString() || '1',
        limit: options?.limit?.toString() || '50', // Get more records to categorize them
      });

      if (options?.status) {
        params.append('status', options.status);
      }

      if (options?.startDate) {
        params.append('startDate', options.startDate);
      }

      if (options?.endDate) {
        params.append('endDate', options.endDate);
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AppointmentsResponse = await response.json();
      console.log("appointments data---------------", data.data);
      return data;
    } catch (error) {
      console.error('Error fetching veterinarian appointments:', error);
      throw error;
    }
  }

  /**
   * Transform database appointment to component format
   */
  transformAppointment(dbAppointment: DatabaseAppointment): TransformedAppointment {
    // Add safety checks
    if (!dbAppointment) {
      throw new Error('Appointment data is undefined');
    }

    if (!dbAppointment._id) {
      throw new Error('Appointment ID is missing');
    }

    if (!dbAppointment.pet) {
      throw new Error('Pet data is missing from appointment');
    }

    // Validate required data
    if (!dbAppointment.veterinarian) {
      throw new Error('Veterinarian data is missing from appointment');
    }

    if (!dbAppointment.petParent) {
      throw new Error('Pet parent data is missing from appointment');
    }

    // Extract time from appointmentDate
    const appointmentDate = new Date(dbAppointment.appointmentDate);
    const appointmentTime = dbAppointment.appointmentTime || 
      appointmentDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });

    // Map database status to component status
    const statusMap: Record<AppointmentStatus, TransformedAppointment['status']> = {
      [AppointmentStatus.SCHEDULED]: 'confirmed',
      [AppointmentStatus.COMPLETED]: 'completed',
      [AppointmentStatus.CANCELLED]: 'cancelled',
      [AppointmentStatus.RESCHEDULED]: 'rescheduled',
    };

    // Determine if patient has been seen before (if there are previous completed appointments)
    // For now, we'll set this based on the current appointment being a follow-up
    const seenBefore = dbAppointment.isFollowUp;

    return {
      id: dbAppointment._id,
      petName: dbAppointment.pet.name,
      petImage: dbAppointment.pet.image || 
        `https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
      petType: dbAppointment.pet.breed || dbAppointment.pet.species || 'Unknown',
      parentName: dbAppointment.petParent.name,
      parentImage: dbAppointment.petParent.profileImage || 
        `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face`,
      appointmentDate: appointmentDate.toISOString().split('T')[0], // YYYY-MM-DD format
      appointmentTime: appointmentTime,
      timezone: 'GMT+6', // You might want to get this from user preferences or system settings
      status: statusMap[dbAppointment.status] || 'pending',
      bookingTime: new Date(dbAppointment.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      seenBefore,
      service: dbAppointment.reasonForVisit || 'General Consultation',
      notes: dbAppointment.notes,
    };
  }

  /**
   * Categorize appointments by status and date
   */
  categorizeAppointments(appointments: TransformedAppointment[]): {
    upcoming: TransformedAppointment[];
    past: TransformedAppointment[];
    actionNeeded: TransformedAppointment[];
  } {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const upcoming: TransformedAppointment[] = [];
    const past: TransformedAppointment[] = [];
    const actionNeeded: TransformedAppointment[] = [];

    appointments.forEach(appointment => {
      const appointmentDate = appointment.appointmentDate;
      const isPastDate = appointmentDate < today;
      const isTodayOrFuture = appointmentDate >= today;

      // Action needed: cancelled appointments, no-shows, or confirmed appointments that are past due
      if (
        appointment.status === 'cancelled' ||
        (appointment.status === 'confirmed' && isPastDate) // Confirmed but past date might need attention
      ) {
        actionNeeded.push(appointment);
      }
      // Past: completed appointments or past dates
      else if (
        appointment.status === 'completed' ||
        isPastDate
      ) {
        past.push(appointment);
      }
      // Upcoming: confirmed appointments in the future
      else if (isTodayOrFuture && appointment.status === 'confirmed') {
        upcoming.push(appointment);
      }
      // Default fallback
      else {
        if (isTodayOrFuture) {
          upcoming.push(appointment);
        } else {
          past.push(appointment);
        }
      }
    });

    // Sort appointments by date
    const sortByDate = (a: TransformedAppointment, b: TransformedAppointment) => {
      const dateA = new Date(a.appointmentDate + ' ' + a.appointmentTime);
      const dateB = new Date(b.appointmentDate + ' ' + b.appointmentTime);
      return dateA.getTime() - dateB.getTime();
    };

    return {
      upcoming: upcoming.sort(sortByDate),
      past: past.sort((a, b) => -sortByDate(a, b)), // Reverse sort for past (most recent first)
      actionNeeded: actionNeeded.sort(sortByDate),
    };
  }

  /**
   * Get all appointments for veterinarian and categorize them
   */
  async getVeterinarianAppointmentsByCategory(veterinarianId: string) {
    try {
      const response = await this.getVeterinarianAppointments(veterinarianId, {
        limit: 100, // Get a larger set to properly categorize
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch appointments');
      }

      if (!response.data || !Array.isArray(response.data)) {
        return {
          upcoming: [],
          past: [],
          actionNeeded: [],
        };
      }

      const transformedAppointments = response.data.map((appointment) => {
        return this.transformAppointment(appointment);
      });

      return this.categorizeAppointments(transformedAppointments);
    } catch (error) {
      console.error('Error getting categorized appointments:', error);
      throw error;
    }
  }
}

export const appointmentsService = new AppointmentsService();
