"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface VetScheduleModalProps {
  open: boolean;
}

export default function VetScheduleSetupAlertModal({
  open,
}: VetScheduleModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md rounded-2xl shadow-xl bg-white"
        // prevent closing on outside click or ESC
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-gray-800">
            Setup Your Schedule
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-600 text-center mt-2">
          You need to create your availability schedule first, otherwise pet
          parents cannot book an appointment with you.
        </p>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => router.push("/vet/setup-schedule")}
            className="px-6 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow"
          >
            Go to Setup Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
