"use client";

import { getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { DateRange, SlotPeriod } from "@/lib/types";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addNewPeriod, addSinglePeriod, deleteSlotsByIds } from "../services/delete-periods";

export interface TimeSlotCreatorHookProps {
  selectedRange: DateRange | null;
  hasExistingSlots?: boolean;
  existingPeriods?: Array<{
    startTime: string;
    endTime: string;
    totalHours: number;
    slots: any[];
    timezone?: string;
  }>;
  onClose?: () => void;
  vetId?: string;
  refetch: () => void;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isExisting?: boolean;
  isSelected?: boolean;
  date?: Date | string;
  slotIDs?: string[];
}

export function useTimeSlotCreator({
  selectedRange,
  hasExistingSlots = false,
  existingPeriods = [],
  onClose,
  vetId,
  refetch,
}: TimeSlotCreatorHookProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      id: "1",
      startTime: "09:00",
      endTime: "17:00",
      isExisting: false,
      isSelected: false,
      date: selectedRange?.start,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openPopover, setOpenPopover] = useState<{ [key: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customTimeInputs, setCustomTimeInputs] = useState<{
    [key: string]: { startTime: string; endTime: string };
  }>({});
  const [openCustomTimeDialog, setOpenCustomTimeDialog] = useState<{
    [key: string]: boolean;
  }>({});

  const processedExistingPeriods = useMemo(() => {
    if (!hasExistingSlots || !existingPeriods.length) return [] as TimeSlot[];
    return existingPeriods.map((period, index) => ({
      id: `existing-${index + 1}`,
      startTime: period.startTime,
      endTime: period.endTime,
      isExisting: true,
      isSelected: false,
      date: period?.slots[0]?.formattedDate,
      slotIDs: period.slots.map((slot) => slot._id),
    }));
  }, [hasExistingSlots, existingPeriods]);

  useEffect(() => {
    if (hasExistingSlots && processedExistingPeriods.length > 0) {
      setSlots(processedExistingPeriods);
    } else {
      const getInitialTimeBlock = () => {
        return { startTime: "06:00", endTime: "08:00" };
      };
      const initialTime = getInitialTimeBlock();
      setSlots([
        {
          id: "1",
          startTime: initialTime.startTime,
          endTime: initialTime.endTime,
          isExisting: false,
          isSelected: false,
          date: selectedRange?.start,
        },
      ]);
    }
  }, [hasExistingSlots, processedExistingPeriods, selectedRange]);

  const isValidSlot = (slot: TimeSlot): boolean => {
    return (
      typeof slot.startTime === "string" &&
      slot.startTime !== "" &&
      typeof slot.endTime === "string" &&
      slot.endTime !== "" &&
      slot.startTime < slot.endTime
    );
  };

  const generateAvailableTimeBlocks = (currentSlotId: string) => {
    const currentSlot = slots.find((slot) => slot.id === currentSlotId);
    if (!currentSlot) return [] as Array<{ start: string; end: string; label: string }>;

    const otherSlots = slots.filter((slot) => slot.id !== currentSlotId && isValidSlot(slot));

    const blockedRanges: Array<{ start: moment.Moment; end: moment.Moment; type: string }> = [];

    otherSlots.forEach((slot) => {
      const startMoment = moment(`2000-01-01 ${slot.startTime}`, "YYYY-MM-DD HH:mm");
      const endMoment = moment(`2000-01-01 ${slot.endTime}`, "YYYY-MM-DD HH:mm");
      const bufferStart = startMoment.clone().subtract(1, "hour");
      const bufferEnd = endMoment.clone().add(1, "hour");
      blockedRanges.push({ start: bufferStart, end: bufferEnd, type: slot.isExisting ? "existing" : "new" });
    });

    const availableBlocks: Array<{ start: string; end: string; label: string }> = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const endTime = moment(`2000-01-01 ${startTime}`, "YYYY-MM-DD HH:mm").add(2, "hours").format("HH:mm");
        if (endTime === "00:00") continue;
        const blockStartMoment = moment(`2000-01-01 ${startTime}`, "YYYY-MM-DD HH:mm");
        const blockEndMoment = moment(`2000-01-01 ${endTime}`, "YYYY-MM-DD HH:mm");
        const hasConflict = blockedRanges.some((blockedRange) => {
          return blockStartMoment.isBefore(blockedRange.end) && blockEndMoment.isAfter(blockedRange.start);
        });
        if (!hasConflict) {
          const startFormatted = blockStartMoment.format("h:mm A");
          const endFormatted = blockEndMoment.format("h:mm A");
          availableBlocks.push({ start: startTime, end: endTime, label: `${startFormatted} - ${endFormatted}` });
        }
      }
    }
    availableBlocks.push({ start: "custom", end: "custom", label: "Custom Time" });
    return availableBlocks.sort((a, b) => {
      if (a.start === "custom") return 1;
      if (b.start === "custom") return -1;
      const aMoment = moment(`2000-01-01 ${a.start}`, "YYYY-MM-DD HH:mm");
      const bMoment = moment(`2000-01-01 ${b.start}`, "YYYY-MM-DD HH:mm");
      return aMoment.diff(bMoment);
    });
  };

  const addSlot = () => {
    setErrorMessage("");
    const availableBlocks = generateAvailableTimeBlocks("new-slot");
    const defaultTime =
      availableBlocks.length > 0
        ? { startTime: availableBlocks[0].start, endTime: availableBlocks[0].end }
        : { startTime: "06:00", endTime: "08:00" };
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      startTime: defaultTime.startTime,
      endTime: defaultTime.endTime,
      isExisting: false,
      isSelected: false,
      date: selectedRange?.start as Date,
    };
    setSlots([...slots, newSlot]);
  };

  const removeSlot = async (id: string) => {
    if (slots.length > 1) {
      const slotToRemove = slots.find((slot) => slot.id === id);
      if (slotToRemove?.isExisting && slotToRemove.slotIDs && slotToRemove.slotIDs.length > 0) {
        try {
          await deleteSlotsByIds({ slotIds: slotToRemove.slotIDs });
          toast.success(`Period deleted successfully (${slotToRemove.slotIDs.length} slots removed)`);
        } catch (error: any) {
          console.error("Error deleting period:", error);
          const errorMsg = `Failed to delete period: ${error.message || "Please try again."}`;
          setErrorMessage(errorMsg);
          toast.error("Failed to delete period", { description: error.message || "Please try again." });
          return;
        }
      }
      setSlots(slots.filter((slot) => slot.id !== id));
    }
  };

  const toggleSlotSelection = (id: string) => {
    setSlots(slots.map((slot) => (slot.id === id ? { ...slot, isSelected: !slot.isSelected } : slot)));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSlots(slots.map((slot) => ({ ...slot, isSelected: newSelectAll })));
  };

  const handleBulkDelete = async () => {
    const selectedSlots = slots.filter((slot) => slot.isSelected);
    if (selectedSlots.length === 0) {
      toast.error("No slots selected for deletion");
      return;
    }
    if (selectedSlots.length === slots.length) {
      toast.error("Cannot delete all slots. At least one slot must remain.");
      return;
    }
    const existingSelectedSlots = selectedSlots.filter((slot) => slot.isExisting && slot.slotIDs && slot.slotIDs.length > 0);
    if (existingSelectedSlots.length > 0) {
      try {
        const allSlotIds = existingSelectedSlots.flatMap((slot) => slot.slotIDs || []);
        const result = await deleteSlotsByIds({ slotIds: allSlotIds });
        toast.success(`Successfully deleted ${result.deletedCount} slots from ${existingSelectedSlots.length} periods`);
      } catch (error: any) {
        console.error("Error deleting periods in bulk:", error);
        const errorMsg = `Failed to delete periods: ${error.message || "Please try again."}`;
        setErrorMessage(errorMsg);
        toast.error("Failed to delete periods", { description: error.message || "Please try again." });
        return;
      }
    }
    setSlots(slots.filter((slot) => !slot.isSelected));
    setSelectAll(false);
    toast.success(`${selectedSlots.length} slot(s) deleted successfully`);
  };

  const selectedCount = slots.filter((slot) => slot.isSelected).length;

  useEffect(() => {
    if (slots.length === 0) {
      setSelectAll(false);
    } else {
      const allSelected = slots.every((slot) => slot.isSelected);
      const noneSelected = slots.every((slot) => !slot.isSelected);
      if (allSelected) {
        setSelectAll(true);
      } else if (noneSelected) {
        setSelectAll(false);
      }
    }
  }, [slots]);

  const updateSlotWithTimeBlock = (id: string, timeBlock: { start: string; end: string }) => {
    setErrorMessage("");
    if (timeBlock.start === "custom") {
      if (!customTimeInputs[id]) {
        setCustomTimeInputs((prev) => ({ ...prev, [id]: { startTime: "09:00", endTime: "17:00" } }));
      }
      setOpenCustomTimeDialog((prev) => ({ ...prev, [id]: true }));
      return;
    }
    setSlots(
      slots.map((slot) => (slot.id === id ? { ...slot, startTime: timeBlock.start, endTime: timeBlock.end } : slot))
    );
  };

  const handleCustomTimeChange = (slotId: string, field: "startTime" | "endTime", value: string) => {
    setCustomTimeInputs((prev) => ({ ...prev, [slotId]: { ...prev[slotId], [field]: value } }));
    setSlots((prevSlots) =>
      prevSlots.map((slot) =>
        slot.id === slotId
          ? { ...slot, startTime: field === "startTime" ? value : slot.startTime, endTime: field === "endTime" ? value : slot.endTime }
          : slot
      )
    );
  };

  const saveIndividualPeriod = async (slotId: string) => {
    setErrorMessage("");
    const slot = slots.find((s) => s.id === slotId);
    if (!slot || slot.isExisting) return;
    if (!selectedRange || !vetId) {
      toast.error("Missing required information");
      return;
    }
    if (!isValidSlot(slot)) {
      toast.error("Invalid time slot configuration");
      return;
    }
    try {
      const result = await addSinglePeriod({
        vetId,
        date: new Date(selectedRange.start),
        period: { start: slot.startTime, end: slot.endTime },
        slotDuration: 30,
        bufferBetweenSlots: 0,
      });
      toast.success(`Period saved successfully (${result.data.createdSlotsCount} slots created)`);
      setSlots(slots.map((s) => (s.id === slotId ? { ...s, isExisting: true } : s)));
    } catch (error: any) {
      console.error("Error saving individual period:", error);
      setErrorMessage(error.message || "Please try again.");
      toast.error("Failed to save period", { description: error.message || "Please try again." });
    }
  };

  const updateIndividualPeriod = async (
    slotIds: string[] | undefined,
    startTime: string,
    endTime: string
  ) => {
    console.log("SLOT ID", slotIds);
    console.log("slot start time", startTime);
    console.log("slot end time", endTime);

    try {
      if (!vetId) throw new Error("Missing vetId");
      if (!slotIds || slotIds.length === 0)
        throw new Error("No slotIds provided");
      const payload = {
        vetId,
        slotIds,
        startTime,
        endTime,
        slotDuration: 30,
        bufferBetweenSlots: 0,
        selectedRange,
      };
      console.log("payload", payload);
      const res = await fetch(`/api/appointments/slots/update-period`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to update period");
      }
      toast.success("Period updated successfully!");
      if (typeof refetch === "function") {
        try {
          refetch();
        } catch {}
      }
    } catch (error: any) {
      console.error("Error updating existing period:", error);
      toast.error("Failed to update period", {
        description: error.message || "Please try again.",
      });
    }
  };

  const validateSlots = (): boolean => {
    if (slots.length === 0) return false;
    for (const slot of slots) {
      if (!slot.startTime || !slot.endTime) return false;
      if (slot.startTime >= slot.endTime) return false;
    }
    return true;
  };

  const hasNewPeriods = (): boolean => {
    return slots.some((slot) => !slot.isExisting);
  };

  const handleSave = async () => {
    setErrorMessage("");
    if (!selectedRange || !validateSlots()) {
      const errorMsg = "Please select a date range and ensure all time slots are valid";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (!hasNewPeriods()) {
      const errorMsg = "Please add at least one new period to save";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (!vetId) {
      const errorMsg = "Veterinarian ID is required";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setIsLoading(true);
    try {
      const slotPeriods: SlotPeriod[] = slots.map((slot) => {
        const [startH, startM] = slot.startTime.split(":").map(Number);
        const [endH, endM] = slot.endTime.split(":").map(Number);
        const start = new Date(selectedRange.start);
        start.setHours(startH, startM, 0, 0);
        const end = new Date(selectedRange.start);
        end.setHours(endH, endM, 0, 0);
        return { start, end };
      });
      const result = await addNewPeriod({
        vetId,
        slotPeriods,
        dateRange: selectedRange,
        slotDuration: 30,
        bufferBetweenSlots: 0,
      });
      toast.success(`Successfully added new period with ${result.data.createdSlotsCount} slots`);
      if (hasExistingSlots && processedExistingPeriods.length > 0) {
        setSlots(processedExistingPeriods);
      } else {
        setSlots([
          {
            id: "1",
            startTime: "06:00",
            endTime: "08:00",
            isExisting: false,
            isSelected: false,
            date: selectedRange?.start as Date,
          },
        ]);
      }
      setSelectAll(false);
      if (onClose) onClose();
    } catch (error: any) {
      console.error("Error saving slots:", error);
      const errorMsg = `${error.message || "Please try again."}`;
      setErrorMessage(errorMsg);
      toast.error("Failed to save availability slots", { description: error.message || "Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalHours = (): number => {
    return slots.reduce((total, slot) => {
      if (!isValidSlot(slot)) return total;
      const [sh, sm] = slot.startTime.split(":").map(Number);
      const [eh, em] = slot.endTime.split(":").map(Number);
      const start = new Date(`2000-01-01T${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}:00`);
      const end = new Date(`2000-01-01T${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}:00`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  const formatDuration = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const formatDate = (date: Date | string | undefined, timezone?: string) => {
    if (!date) return "";
    if (timezone && typeof date === "string") {
      const { formattedDate } = convertTimesToUserTimezone("00:00", "00:00", date, timezone);
      return moment(formattedDate).format("dddd, MMM DD, YYYY");
    }
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return moment(dateObj).format("dddd, MMM DD, YYYY");
  };

  const formatTime = (timeStr: string, dateStr: string, timezone?: string) => {
    if (timezone) {
      const { formattedStartTime } = convertTimesToUserTimezone(timeStr, timeStr, dateStr, timezone);
      return formattedStartTime;
    }
    return moment(`2000-01-01 ${timeStr}`).format("h:mm A");
  };

  const formatDateRange = (startDate: Date, endDate: Date, timezone?: string) => {
    const userTz = timezone || getUserTimezone();
    if (timezone) {
      const startMoment = moment.tz(startDate, userTz);
      const endMoment = moment.tz(endDate, userTz);
      if (startMoment.format("YYYY-MM-DD") === endMoment.format("YYYY-MM-DD")) {
        return startMoment.format("dddd, MMMM DD, YYYY");
      } else {
        return `${startMoment.format("MMM DD")} - ${endMoment.format("MMM DD, YYYY")}`;
      }
    }
    const startMoment = moment(startDate);
    const endMoment = moment(endDate);
    if (startMoment.format("YYYY-MM-DD") === endMoment.format("YYYY-MM-DD")) {
      return startMoment.format("dddd, MMMM DD, YYYY");
    } else {
      return `${startMoment.format("MMM DD")} - ${endMoment.format("MMM DD, YYYY")}`;
    }
  };

  return {
    // state
    slots,
    isLoading,
    errors,
    openPopover,
    selectAll,
    errorMessage,
    customTimeInputs,
    openCustomTimeDialog,
    selectedCount,
    // setters needed externally
    setOpenCustomTimeDialog,
    setCustomTimeInputs,
    setErrorMessage,
    // validators/helpers
    isValidSlot,
    generateAvailableTimeBlocks,
    getTotalHours,
    formatDuration,
    formatDate,
    formatTime,
    formatDateRange,
    // actions
    addSlot,
    removeSlot,
    toggleSlotSelection,
    handleSelectAll,
    handleBulkDelete,
    updateSlotWithTimeBlock,
    handleCustomTimeChange,
    saveIndividualPeriod,
    updateIndividualPeriod,
    validateSlots,
    hasNewPeriods,
    handleSave,
  };
}


