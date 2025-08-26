"use client";
import { Slot, SlotStatus } from "@/lib";
import { DateRange } from "@/lib/types";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";

interface IAvailableApiResponseState {
  data: any[] | null;
  error: string | null;
  loading: boolean;
}

const initialApiResponseState: IAvailableApiResponseState = {
  data: null,
  error: null,
  loading: false,
};

const todayDateRange: DateRange = {
  start: new Date(),
  end: new Date(),
};

interface SessionUserWithRefId {
  refId: string;
  // other user properties can be added here
}

type DashboardContextType = {
  slotStatus: SlotStatus;
  setSlotStatus: React.Dispatch<React.SetStateAction<SlotStatus>>;
  selectedSlot: Slot[] | null;
  setSelectedSlot: React.Dispatch<React.SetStateAction<Slot[] | null>>;
  selectedSlotIds: string[];
  setSelectedSlotIds: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdateSelectedSlotStatus: (
    status: SlotStatus,
    refId: string,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  availableSlotsApiResponse: IAvailableApiResponseState;
  setAvailableSlotsApiResponse: React.Dispatch<
    React.SetStateAction<IAvailableApiResponseState>
  >;
  getAvailableSlots: (startDate: string, endDate: string, refId: string) => Promise<void>;
  selectedRange: DateRange | null;
  setSelectedRange: React.Dispatch<React.SetStateAction<DateRange | null>>;
};

// 2. Create context with default values
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// 3. Create provider
type DashboardProviderProps = {
  children: ReactNode;
};

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const [slotStatus, setSlotStatus] = useState<SlotStatus>(
    SlotStatus.AVAILABLE
  );
  const [enabled, setEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot[] | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [availableSlotsApiResponse, setAvailableSlotsApiResponse] =
    useState<IAvailableApiResponseState>(initialApiResponseState);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(
    todayDateRange
  );

  const getAvailableSlots = useCallback(
    async (startDate: string, endDate: string, refId: string) => {
      setAvailableSlotsApiResponse((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));
      if (!refId) {
        setAvailableSlotsApiResponse((prev) => ({
          ...prev,
          loading: false,
          data: null,
          error: "User refId is missing",
        }));
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/slots/slot-summary/${refId}?startDate=${startDate}&endDate=${endDate}&status=${SlotStatus.AVAILABLE}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const responseData = await res.json();
        console.log("responseData", responseData);
        setAvailableSlotsApiResponse((prev) => ({
          ...prev,
          loading: false,
          data: responseData.data,
          error: null,
        }));
      } catch (error: any) {
        setAvailableSlotsApiResponse((prev) => ({
          ...prev,
          loading: false,
          data: null,
          error: error.message,
        }));
      } finally {
        setAvailableSlotsApiResponse((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    },
    []
  );

  const onUpdateSelectedSlotStatus = async (
    status: SlotStatus,
    refId: string,
    startDate?: string,
    endDate?: string
  ) => {
    if (selectedSlotIds.length === 0) {
      console.error("No slots selected");
      return;
    }
    if (!refId) {
      toast.error("User refId is missing");
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/slots/slot-summary/${refId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slotIds: selectedSlotIds,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(errorData.message || "Failed to update slot status");
        toast.error(errorData.message || "Failed to update slot status");
        return;
      }

      const result = await response.json();
      toast.success(
        result?.data?.message || "Successfully updated slot status"
      );
      setOpen(false);
      // Clear selection after successful update
      setSelectedSlotIds([]);

      console.log("Successfully updated slots:", result);

      // Re-fetch available slots after successful update
      if (startDate && endDate) {
        await getAvailableSlots(startDate, endDate, refId);
      } else {
        // Fallback to current date if no date range provided
        const currentDate = new Date();
        const formattedCurrentDate = currentDate.toISOString().split("T")[0];
        await getAvailableSlots(formattedCurrentDate, formattedCurrentDate, refId);
      }
    } catch (error: any) {
      console.error("Error updating slot status:", error);
      toast.error(error.message || "Error updating slot status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        slotStatus,
        setSlotStatus,
        selectedSlot,
        setSelectedSlot,
        selectedSlotIds,
        setSelectedSlotIds,
        onUpdateSelectedSlotStatus,
        isUpdating,
        setIsUpdating,
        enabled,
        setEnabled,
        open,
        setOpen,
        availableSlotsApiResponse,
        setAvailableSlotsApiResponse,
        getAvailableSlots,
        selectedRange,
        setSelectedRange,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// 4. Custom hook to use the context
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
