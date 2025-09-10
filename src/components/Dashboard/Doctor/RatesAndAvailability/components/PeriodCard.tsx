"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar, Clock, Edit3, Save, Trash2 } from "lucide-react";
import moment from "moment";

interface PeriodCardProps {
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    isExisting?: boolean;
    isSelected?: boolean;
    date?: Date | string;
  };
  formattedDate: string;
  isValidSlot: (slot: any) => boolean;
  generateAvailableTimeBlocks: (slotId: string) => Array<{ start: string; end: string; label: string }>;
  customTimeInputs: { [key: string]: { startTime: string; endTime: string } };
  openCustomTimeDialog: { [key: string]: boolean };
  setOpenCustomTimeDialog: (updater: (prev: any) => any) => void;
  toggleSlotSelection: (id: string) => void;
  updateSlotWithTimeBlock: (id: string, timeBlock: { start: string; end: string }) => void;
  handleCustomTimeChange: (slotId: string, field: "startTime" | "endTime", value: string) => void;
  saveIndividualPeriod: (slotId: string) => Promise<void>;
  updateIndividualPeriod: (slotId: string) => Promise<void>;
  removeSlot: (slotId: string) => Promise<void>;
}

export const PeriodCard: React.FC<PeriodCardProps> = ({
  slot,
  formattedDate,
  isValidSlot,
  generateAvailableTimeBlocks,
  customTimeInputs,
  openCustomTimeDialog,
  setOpenCustomTimeDialog,
  toggleSlotSelection,
  updateSlotWithTimeBlock,
  handleCustomTimeChange,
  saveIndividualPeriod,
  updateIndividualPeriod,
  removeSlot,
}) => {
  return (
    <div
      className={`group relative rounded-2xl p-4 border-2 transition-all duration-300 hover:scale-[1.02] ${
        slot.isSelected
          ? "border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-500/20"
          : slot.isExisting
          ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
          : "border-blue-400 bg-blue-50 hover:border-blue-500 hover:shadow-md"
      } ${!isValidSlot(slot) ? "border-red-300 bg-red-50" : ""}`}
    >
      <div className="absolute top-3 right-3">
        <Checkbox
          checked={!!slot.isSelected}
          onCheckedChange={() => toggleSlotSelection(slot.id)}
          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 w-4 h-4"
        />
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <div
          className={`w-2 h-2 rounded-full ${
            slot.isExisting ? "bg-blue-400" : isValidSlot(slot) ? "bg-emerald-400 animate-pulse" : "bg-red-400"
          }`}
        ></div>
        <h3 className="font-semibold text-sm text-gray-800 truncate">
          {slot.isExisting ? "Period/Slot" : "New-Period/Slot"}
        </h3>
      </div>

      {formattedDate && (
        <div className="text-center mb-3">
          <p className="font-medium text-sm text-gray-700">{formattedDate}</p>
        </div>
      )}

      <div className="space-y-1 mb-3">
        <div className="text-center">
          <p className="font-medium text-sm text-gray-800">
            {moment(`2000-01-01 ${slot.startTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")} - {moment(`2000-01-01 ${slot.endTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            {slot.isExisting ? "Modify Time Block:" : "Choose Available Time Block:"}
          </p>
          {generateAvailableTimeBlocks(slot.id).length > 0 ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-between h-8 text-gray-800 hover:bg-gray-50 text-xs ${
                      slot.isExisting ? "bg-blue-50 border-blue-300 hover:bg-blue-100" : "bg-white border-gray-300"
                    }`}
                  >
                    <span className={`${customTimeInputs[slot.id] ? (slot.isExisting ? "text-blue-700" : "text-emerald-700") : ""}`}>
                      {customTimeInputs[slot.id]
                        ? "Custom Time"
                        : slot.startTime && slot.endTime
                        ? `${moment(`2000-01-01 ${slot.startTime}`, "YYYY-MM-DD HH:mm").format("h:mm A")} - ${moment(
                            `2000-01-01 ${slot.endTime}`,
                            "YYYY-MM-DD HH:mm"
                          ).format("h:mm A")}`
                        : "Select time block"}
                    </span>
                    <Calendar className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-[200px] max-h-48 overflow-y-auto">
                  {generateAvailableTimeBlocks(slot.id).map((block, blockIndex) => {
                    const isCurrentSelection = block.start === "custom" ? customTimeInputs[slot.id] : slot.startTime === block.start && slot.endTime === block.end;
                    const isCustomItem = block.start === "custom";
                    return (
                      <DropdownMenuItem
                        key={blockIndex}
                        onClick={() => updateSlotWithTimeBlock(slot.id, block)}
                        className={`text-xs cursor-pointer ${
                          isCustomItem ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : isCurrentSelection ? "bg-blue-100 text-blue-700 font-medium" : "hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        <Clock className="mr-2 h-3 w-3" />
                        {block.label}
                        {isCurrentSelection && <span className="ml-auto text-xs">✓</span>}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium">Invalid time range</span>
            </div>
          )}
          {isValidSlot(slot) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (slot.isExisting) {
                  updateIndividualPeriod(slot.id);
                } else {
                  saveIndividualPeriod(slot.id);
                }
              }}
              className={`h-6 w-6 p-0 rounded-md transition-all duration-200 ${slot.isExisting ? "text-blue-600 hover:text-blue-700 hover:bg-blue-100" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"}`}
              title={slot.isExisting ? "Update existing period" : "Save new period"}
            >
              {slot.isExisting ? <Edit3 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeSlot(slot.id)}
          className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-md transition-all duration-200"
          title="Delete period"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};


