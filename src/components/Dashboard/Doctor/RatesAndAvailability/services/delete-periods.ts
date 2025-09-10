import { DateRange } from "@/lib/types";

interface PeriodToDelete {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  timezone: string;
}

interface DeletePeriodRequest {
  vetId: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

interface DeletePeriodsBulkRequest {
  vetId: string;
  periods: PeriodToDelete[];
}

interface DeletePeriodResponse {
  success: boolean;
  message: string;
  deletedCount: number;
  period?: {
    date: string;
    startTime: string;
    endTime: string;
    timezone: string;
  };
}

interface DeletePeriodsBulkResponse {
  success: boolean;
  message: string;
  totalDeletedCount: number;
  successfulDeletions: Array<{
    periodIndex: number;
    period: PeriodToDelete;
    deletedCount: number;
  }>;
  errors?: Array<{
    periodIndex: number;
    period: PeriodToDelete;
    error: string;
    bookedSlotsCount?: number;
  }>;
  summary: {
    totalPeriods: number;
    successfulPeriods: number;
    failedPeriods: number;
    totalSlotsDeleted: number;
  };
}

interface DeleteSlotsByIdsRequest {
  slotIds: string[];
}

interface DeleteSlotsByIdsResponse {
  success: boolean;
  message: string;
  deletedCount: number;
  requestedCount: number;
  foundCount: number;
}

interface AddPeriodRequest {
  vetId: string;
  slotPeriods: Array<{
    start: Date;
    end: Date;
  }>;
  dateRange: {
    start: Date;
    end: Date;
  };
  slotDuration?: number;
  bufferBetweenSlots?: number;
}

interface AddPeriodResponse {
  success: boolean;
  message: string;
  data: {
    createdSlotsCount: number;
    totalSlots: number;
    dateRange: {
      start: string;
      end: string;
    };
    timezone: string;
  };
}

/**
 * Delete a single period (all slots within a specific time range on a specific date)
 */
export const deleteSinglePeriod = async (
  request: DeletePeriodRequest
): Promise<DeletePeriodResponse> => {
  try {
    const response = await fetch("/api/appointments/delete-period", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete period");
    }

    return data;
  } catch (error: any) {
    console.error("Error deleting single period:", error);
    throw new Error(error.message || "Failed to delete period");
  }
};

/**
 * Delete multiple periods in bulk (all slots within multiple time ranges)
 */
export const deletePeriodsBulk = async (
  request: DeletePeriodsBulkRequest
): Promise<DeletePeriodsBulkResponse> => {
  try {
    const response = await fetch("/api/appointments/delete-periods-bulk", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete periods");
    }

    return data;
  } catch (error: any) {
    console.error("Error deleting periods in bulk:", error);
    throw new Error(error.message || "Failed to delete periods");
  }
};

/**
 * Delete slots by their specific IDs
 */
export const deleteSlotsByIds = async (
  request: DeleteSlotsByIdsRequest
): Promise<DeleteSlotsByIdsResponse> => {
  try {
    const response = await fetch("/api/appointments/delete-slots-by-ids", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete slots");
    }

    return data;
  } catch (error: any) {
    console.error("Error deleting slots by IDs:", error);
    throw new Error(error.message || "Failed to delete slots");
  }
};

/**
 * Add new period and generate slots for it
 */
export const addNewPeriod = async (
  request: AddPeriodRequest
): Promise<AddPeriodResponse> => {
  try {
    const response = await fetch("/api/appointments/add-period", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add new period");
    }

    return data;
  } catch (error: any) {
    console.error("Error adding new period:", error);
    throw new Error(error.message || "Failed to add new period");
  }
};

// Create slots for a single day/period (more granular than add-period)
export interface AddSinglePeriodRequest {
  vetId: string;
  dateRange: DateRange;
  period: { start: string; end: string };
  slotDuration?: number;
  bufferBetweenSlots?: number;
}

export interface AddSinglePeriodResponse {
  success: boolean;
  data: { createdSlotsCount: number; message?: string };
  message: string;
}

export const addSinglePeriod = async (
  request: AddSinglePeriodRequest
): Promise<AddSinglePeriodResponse> => {
  try {
    const response = await fetch("/api/appointments/add-single-period", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add single period");
    }

    return data;
  } catch (error: any) {
    console.error("Error adding single period:", error);
    throw new Error(error.message || "Failed to add single period");
  }
};

export type {
  AddPeriodRequest,
  AddPeriodResponse,
  DeletePeriodRequest,
  DeletePeriodResponse,
  DeletePeriodsBulkRequest,
  DeletePeriodsBulkResponse,
  DeleteSlotsByIdsRequest,
  DeleteSlotsByIdsResponse,
  PeriodToDelete,
};
