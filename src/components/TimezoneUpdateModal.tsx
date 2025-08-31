"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Globe } from "lucide-react";
import React from "react";

interface TimezoneUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDismiss: () => void;
  currentTimezone: string;
  detectedTimezone: string;
  isUpdating: boolean;
}

export default function TimezoneUpdateModal({
  isOpen,
  onClose,
  onUpdate,
  onDismiss,
  currentTimezone,
  detectedTimezone,
  isUpdating,
}: TimezoneUpdateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700">
              <Clock className="w-4 h-4" />
            </span>
            <span>Update Your Timezone</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            We detected a different timezone than what's currently set in your
            profile.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Globe className="w-4 h-4 text-gray-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">
                Current timezone
              </p>
              <p className="text-sm text-gray-600">
                {currentTimezone || "Not set"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Clock className="w-4 h-4 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-700">
                Detected timezone
              </p>
              <p className="text-sm text-blue-600">{detectedTimezone}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={onUpdate}
            disabled={isUpdating}
            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUpdating ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Updating...
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Yes, update my timezone
              </>
            )}
          </Button>

          <Button
            onClick={onDismiss}
            disabled={isUpdating}
            variant="outline"
            className="w-full cursor-pointer border-gray-200 hover:bg-gray-50"
          >
            No, keep current timezone
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}










