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

export type {
    DeletePeriodRequest, DeletePeriodResponse, DeletePeriodsBulkRequest, DeletePeriodsBulkResponse, DeleteSlotsByIdsRequest, DeleteSlotsByIdsResponse, PeriodToDelete
};

