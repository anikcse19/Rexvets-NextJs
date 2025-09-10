"use client";
import { getUserTimezone } from "@/lib/timezone";
import { convertTimesToUserTimezone } from "@/lib/timezone/index";
import { DateRange, SlotPeriod } from "@/lib/types";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addNewPeriod, addSinglePeriod, deleteSlotsByIds } from "../services/delete-periods";
import { TimeSlot, TimeSlotCreatorProps } from "./types";
import { generateAvailableTimeBlocks as genBlocks, isValidSlot as isValid } from "./utils";

export function useTimeSlotCreator(props: TimeSlotCreatorProps) {
  const { selectedRange, hasExistingSlots = false, existingPeriods = [], onClose, vetId, refetch } = props;

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
  const [selectAll, setSelectAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [customTimeInputs, setCustomTimeInputs] = useState<Record<string, { startTime: string; endTime: string }>>({});
  const [openCustomTimeDialog, setOpenCustomTimeDialog] = useState<Record<string, boolean>>({});

  const processedExistingPeriods = useMemo(() => {
    if (!hasExistingSlots || !existingPeriods.length) return [] as TimeSlot[];
    return existingPeriods.map((period, index) => ({
      id: `existing-${index + 1}`,
      startTime: period.startTime,
      endTime: period.endTime,
      isExisting: true,
      isSelected: false,
      date: period?.slots[0]?.formattedDate,
      slotIDs: period.slots.map((slot: any) => slot._id),
    }));
  }, [hasExistingSlots, existingPeriods]);

  useEffect(() => {
    if (hasExistingSlots && processedExistingPeriods.length > 0) {
      setSlots(processedExistingPeriods);
    } else {
      const getInitialTimeBlock = () => ({ startTime: "06:00", endTime: "08:00" });
      const initialTime = getInitialTimeBlock();
      setSlots([
        { id: "1", startTime: initialTime.startTime, endTime: initialTime.endTime, isExisting: false, isSelected: false, date: selectedRange?.start },
      ]);
    }
  }, [hasExistingSlots, processedExistingPeriods, selectedRange]);

  const generateAvailableTimeBlocks = (currentSlotId: string) => genBlocks(slots, currentSlotId);
  const isValidSlot = (slot: TimeSlot) => isValid(slot);

  const selectedCount = slots.filter((slot) => slot.isSelected).length;

  useEffect(() => {
    if (slots.length === 0) {
      setSelectAll(false);
    } else {
      const allSelected = slots.every((slot) => slot.isSelected);
      const noneSelected = slots.every((slot) => !slot.isSelected);
      if (allSelected) setSelectAll(true);
      else if (noneSelected) setSelectAll(false);
    }
  }, [slots]);

  const addSlot = () => {
    setErrorMessage("");
    const availableBlocks = generateAvailableTimeBlocks("new-slot");
    const defaultTime = availableBlocks.length > 0 ? { startTime: availableBlocks[0].start, endTime: availableBlocks[0].end } : { startTime: "06:00", endTime: "08:00" };
    const newSlot: TimeSlot = { id: Date.now().toString(), startTime: defaultTime.startTime, endTime: defaultTime.endTime, isExisting: false, isSelected: false, date: selectedRange?.start };
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

  const updateSlotWithTimeBlock = (id: string, timeBlock: { start: string; end: string }) => {
    setErrorMessage("");
    if (timeBlock.start === "custom") {
      if (!customTimeInputs[id]) {
        setCustomTimeInputs((prev) => ({ ...prev, [id]: { startTime: "09:00", endTime: "17:00" } }));
      }
      setOpenCustomTimeDialog((prev) => ({ ...prev, [id]: true }));
      return;
    }
    setSlots(slots.map((slot) => (slot.id === id ? { ...slot, startTime: timeBlock.start, endTime: timeBlock.end } : slot)));
  };

  const handleCustomTimeChange = (slotId: string, field: "startTime" | "endTime", value: string) => {
    setCustomTimeInputs((prev) => ({ ...prev, [slotId]: { ...prev[slotId], [field]: value } }));
    setSlots((prevSlots) => prevSlots.map((slot) => (slot.id === slotId ? { ...slot, startTime: field === "startTime" ? value : slot.startTime, endTime: field === "endTime" ? value : slot.endTime } : slot)));
  };

  const validateSlots = () => {
    if (slots.length === 0) return false;
    for (const slot of slots) {
      if (!slot.startTime || !slot.endTime) return false;
      if (slot.startTime >= slot.endTime) return false;
    }
    return true;
  };

  const hasNewPeriods = () => slots.some((slot) => !slot.isExisting);

  const saveIndividualPeriod = async (slotId: string) => {
    setErrorMessage("");
    const slot = slots.find((s) => s.id === slotId);
    if (!slot || slot.isExisting) return;
    if (!selectedRange || !vetId) { toast.error("Missing required information"); return; }
    if (!isValidSlot(slot)) { toast.error("Invalid time slot configuration"); return; }
    try {
      const result = await addSinglePeriod({ vetId, date: new Date(selectedRange.start), period: { start: slot.startTime, end: slot.endTime }, slotDuration: 30, bufferBetweenSlots: 0 });
      toast.success(`Period saved successfully (${result.data.createdSlotsCount} slots created)`);
      setSlots(slots.map((s) => (s.id === slotId ? { ...s, isExisting: true } : s)));
    } catch (error: any) {
      console.error("Error saving individual period:", error);
      setErrorMessage(error.message || "Please try again.");
      toast.error("Failed to save period", { description: error.message || "Please try again." });
    }
  };

  const updateIndividualPeriod = async (slotIds: string[] | undefined, startTime: string, endTime: string) => {
    try {
      if (!vetId) throw new Error("Missing vetId");
      if (!slotIds || slotIds.length === 0) throw new Error("No slotIds provided");
      const payload = { vetId, slotIds, startTime, endTime, slotDuration: 30, bufferBetweenSlots: 0, selectedRange };
      const res = await fetch(`/api/appointments/slots/update-period`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const msg = await res.text(); throw new Error(msg || "Failed to update period"); }
      toast.success("Period updated successfully!");
      if (typeof refetch === "function") { try { refetch(); } catch {} }
    } catch (error: any) {
      console.error("Error updating existing period:", error);
      toast.error("Failed to update period", { description: error.message || "Please try again." });
    }
  };

  const handleSave = async () => {
    setErrorMessage("");
    if (!selectedRange || !validateSlots()) { const errorMsg = "Please select a date range and ensure all time slots are valid"; setErrorMessage(errorMsg); toast.error(errorMsg); return; }
    if (!hasNewPeriods()) { const errorMsg = "Please add at least one new period to save"; setErrorMessage(errorMsg); toast.error(errorMsg); return; }
    if (!vetId) { const errorMsg = "Veterinarian ID is required"; setErrorMessage(errorMsg); toast.error(errorMsg); return; }
    setIsLoading(true);
    try {
      const slotPeriods: SlotPeriod[] = slots.map((slot) => {
        const [startH, startM] = slot.startTime.split(":").map(Number);
        const [endH, endM] = slot.endTime.split(":").map(Number);
        const start = new Date(selectedRange.start); start.setHours(startH, startM, 0, 0);
        const end = new Date(selectedRange.start); end.setHours(endH, endM, 0, 0);
        return { start, end };
      });
      const result = await addNewPeriod({ vetId, slotPeriods, dateRange: selectedRange, slotDuration: 30, bufferBetweenSlots: 0 });
      toast.success(`Successfully added new period with ${result.data.createdSlotsCount} slots`);
      if (hasExistingSlots && processedExistingPeriods.length > 0) {
        setSlots(processedExistingPeriods);
      } else {
        setSlots([{ id: "1", startTime: "06:00", endTime: "08:00", isExisting: false, isSelected: false, date: selectedRange?.start }]);
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

  return {
    // state
    slots,
    isLoading,
    selectAll,
    errorMessage,
    customTimeInputs,
    openCustomTimeDialog,
    selectedCount,
    // derived/utils
    isValidSlot,
    generateAvailableTimeBlocks,
    // actions
    setOpenCustomTimeDialog,
    addSlot,
    removeSlot,
    toggleSlotSelection,
    handleSelectAll,
    handleBulkDelete,
    updateSlotWithTimeBlock,
    handleCustomTimeChange,
    saveIndividualPeriod,
    updateIndividualPeriod,
    handleSave,
  } as const;
}


