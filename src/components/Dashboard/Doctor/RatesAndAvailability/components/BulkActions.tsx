"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Trash2 } from "lucide-react";

interface BulkActionsProps {
  totalCount: number;
  selectedCount: number;
  selectAll: boolean;
  onToggleSelectAll: () => void;
  onBulkDelete: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  totalCount,
  selectedCount,
  selectAll,
  onToggleSelectAll,
  onBulkDelete,
}) => {
  if (totalCount <= 1) return null;
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={selectAll}
            onCheckedChange={onToggleSelectAll}
            className="data-[state=checked]:bg-emerald-500 cursor-pointer data-[state=checked]:border-emerald-500"
          />
          <label htmlFor="select-all" className="text-sm font-medium text-gray-700 cursor-pointer">
            Select All ({totalCount})
          </label>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2 text-emerald-600">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{selectedCount} selected</span>
          </span>
          </div>
        )}
      </div>
      {selectedCount > 0 && (
        <Button onClick={onBulkDelete} variant="destructive" className="bg-red-500 hover:bg-red-600 text-white border border-red-500 px-4 py-2 rounded-lg transition-all duration-200">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected
        </Button>
      )}
    </div>
  );
};


