import { DateRange, SlotPeriod } from "@/lib/types";

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isExisting?: boolean;
  isSelected?: boolean;
  date?: Date | string;
  slotIDs?: string[];
}

export interface TimeBlock {
  start: string;
  end: string;
  label: string;
}

export interface TimeSlotCreatorProps {
  selectedRange: DateRange | null;
  hasExistingSlots?: boolean;
  existingPeriods?: Array<{
    startTime: string;
    endTime: string;
    totalHours: number;
    slots: any[];
    timezone?: string;
  }>;
  refetch: () => void;
  onClose?: () => void;
  vetId?: string;
}

export type AddNewPeriodArgs = {
  vetId: string;
  slotPeriods: SlotPeriod[];
  dateRange: DateRange;
  slotDuration: number;
  bufferBetweenSlots: number;
};


