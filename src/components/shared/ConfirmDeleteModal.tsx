import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-react";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
};

// Default, accessible confirmation modal using shadcn UI patterns + Tailwind
export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm deletion",
  description = "This action cannot be undone. Are you sure you want to continue?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <div className="flex justify-between items-start">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-700">
                <Trash2 className="w-4 h-4" />
              </span>
              <span>{title}</span>
            </DialogTitle>
          </DialogHeader>

          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">{description}</div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            className="border border-gray-200 hover:bg-gray-50"
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            onClick={async () => {
              try {
                await onConfirm();
              } catch (err) {
                // swallow here — parent can handle errors and show toast
                console.error(err);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                {confirmText}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
