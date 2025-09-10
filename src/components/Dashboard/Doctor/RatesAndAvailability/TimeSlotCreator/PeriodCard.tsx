"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getUserTimezone } from "@/lib/timezone";
import { AlertTriangle, Check, ChevronDown, Clock, Edit3, Save, Trash2 } from "lucide-react";
import moment from "moment";
import React from "react";
import { TimeSlot } from "./types";
import { formatDate, formatDuration, formatTime } from "./utils";

type Props = {
  slot: TimeSlot;
  index: number;
  isValidSlot: (slot: TimeSlot) => boolean;
  customTimeInputs: Record<string, { startTime: string; endTime: string }>;
  openCustomTimeDialog: Record<string, boolean>;
  setOpenCustomTimeDialog: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  generateAvailableTimeBlocks: (id: string) => { start: string; end: string; label: string }[];
  toggleSlotSelection: (id: string) => void;
  updateSlotWithTimeBlock: (id: string, block: { start: string; end: string }) => void;
  handleCustomTimeChange: (slotId: string, field: "startTime" | "endTime", value: string) => void;
  saveIndividualPeriod: (slotId: string) => void;
  updateIndividualPeriod: (slotIds: string[] | undefined, startTime: string, endTime: string) => void;
  removeSlot: (id: string) => void;
  slotsLength: number;
};

export default function PeriodCard(props: Props) {
  const { slot, index, isValidSlot, customTimeInputs, openCustomTimeDialog, setOpenCustomTimeDialog, generateAvailableTimeBlocks, toggleSlotSelection, updateSlotWithTimeBlock, handleCustomTimeChange, saveIndividualPeriod, updateIndividualPeriod, removeSlot, slotsLength } = props;
  const formattedDate = formatDate(slot.date as any, getUserTimezone());

  return (
    <div className={`group relative rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] ${
      slot.isSelected ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-500/20" : slot.isExisting ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md" : "border-blue-400 bg-blue-50 hover:border-blue-500 hover:shadow-md"
    } ${!isValidSlot(slot) ? "border-red-300 bg-red-50" : ""}`}>
      <div className="absolute top-3 right-3">
        <Checkbox checked={slot.isSelected} onCheckedChange={() => toggleSlotSelection(slot.id)} className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-4 h-4" />
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${slot.isExisting ? "bg-blue-400" : isValidSlot(slot) ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}></div>
        <h3 className="font-semibold text-sm text-gray-800 truncate">{slot.isExisting ? "Period/Slot" : "New-Period/Slot"} #{index + 1}</h3>
      </div>

      {formattedDate && (
        <div className="text-center mb-3">
          <p className="font-medium text-sm text-gray-700">{formattedDate}</p>
        </div>
      )}

      <div className="space-y-1 mb-3">
        <div className="text-center">
          <p className="font-medium text-sm text-gray-800">
            {formatTime(slot.startTime, (slot.date as any)?.toString() || "", getUserTimezone())} - {formatTime(slot.endTime, (slot.date as any)?.toString() || "", getUserTimezone())}
          </p>
        </div>
        <div className="text-center">
          <p className="font-medium text-sm text-gray-800">{isValidSlot(slot) ? formatDuration(((
            () => {
              const [sh, sm] = slot.startTime.split(":").map(Number);
              const [eh, em] = slot.endTime.split(":").map(Number);
              const start = new Date(`2000-01-01T${String(sh).padStart(2, "0")}:${String(sm).padStart(2, "0")}:00`);
              const end = new Date(`2000-01-01T${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}:00`);
              return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            }
          )())) : "Invalid"}</p>
        </div>
        {!slot.isExisting && (
          <div className="text-center">
            <p className="text-xs text-blue-600 font-medium">🕐 2hr professional block</p>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">{slot.isExisting ? "Modify Time Block:" : "Choose Available Time Block:"}</p>
          {generateAvailableTimeBlocks(slot.id).length > 0 ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={`w-full justify-between h-8 text-gray-800 hover:bg-gray-50 text-xs ${slot.isExisting ? "bg-blue-50 border-blue-300 hover:bg-blue-100" : "bg-white border-gray-300"}`}>
                    <span className={`${customTimeInputs[slot.id] ? (slot.isExisting ? "text-blue-700" : "text-emerald-700") : ""}`}>
                      {customTimeInputs[slot.id]
                        ? "Custom Time"
                        : slot.startTime && slot.endTime
                        ? `${moment(`2000-01-01 ${slot.startTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")} - ${moment(`2000-01-01 ${slot.endTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")}`
                        : "Select time block"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[200px] max-h-48 overflow-y-auto">
                  {generateAvailableTimeBlocks(slot.id).map((block, blockIndex) => {
                    const isCurrentSelection = block.start === "custom" ? customTimeInputs[slot.id] : slot.startTime === block.start && slot.endTime === block.end;
                    const isCustomItem = block.start === "custom";
                    return (
                      <DropdownMenuItem key={blockIndex} onClick={() => updateSlotWithTimeBlock(slot.id, block)} className={`text-xs cursor-pointer ${isCustomItem ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : isCurrentSelection ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-emerald-50 hover:text-emerald-700"}`}>
                        <Clock className="mr-2 h-3 w-3" />
                        {block.label}
                        {isCurrentSelection && <span className="ml-auto text-xs">✓</span>}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Dialog open={!!openCustomTimeDialog[slot.id]} onOpenChange={(open) => setOpenCustomTimeDialog((prev) => ({ ...prev, [slot.id]: open }))}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Custom Time</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">Start Time</label>
                      <input type="time" value={customTimeInputs[slot.id]?.startTime || "09:00"} onChange={(e) => handleCustomTimeChange(slot.id, "startTime", e.target.value)} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">End Time</label>
                      <input type="time" value={customTimeInputs[slot.id]?.endTime || "17:00"} onChange={(e) => handleCustomTimeChange(slot.id, "endTime", e.target.value)} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" size="sm">Cancel</Button>
                    </DialogClose>
                    <Button size="sm" onClick={() => {
                      const times = customTimeInputs[slot.id] || { startTime: "09:00", endTime: "17:00" };
                      // ensure slot values updated already via handleCustomTimeChange; just close dialog
                      setOpenCustomTimeDialog((prev) => ({ ...prev, [slot.id]: false }));
                    }}>Apply</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
              <p className="text-xs text-gray-500 font-medium">No available time blocks</p>
              <p className="text-xs text-gray-400 mt-1">All times blocked by other periods + 1hr buffer</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!isValidSlot(slot) && (
            <div className="flex items-center space-x-1 text-red-600">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-xs font-medium">Invalid time range</span>
            </div>
          )}
          {isValidSlot(slot) && (
            <Button variant="ghost" size="sm" onClick={() => {
              if (slot.isExisting) {
                updateIndividualPeriod(slot.slotIDs || [], slot.startTime, slot.endTime);
              } else {
                saveIndividualPeriod(slot.id);
              }
            }} className={`h-6 w-6 p-0 rounded-md transition-all duration-200 ${slot.isExisting ? "text-blue-600 hover:text-blue-700 hover:bg-blue-100" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"}`} title={slot.isExisting ? "Update existing period" : "Save new period"}>
              {slot.isExisting ? <Edit3 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {slotsLength > 1 && (
          <Button variant="ghost" size="sm" onClick={() => removeSlot(slot.id)} className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-all duration-200" title="Delete period">
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}


