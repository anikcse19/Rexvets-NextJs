"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import React from "react";

interface IProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const PostCallReviewModalContainer: React.FC<IProps> = ({
  children,
  isOpen,
  onClose,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[40%] z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border-l-0 p-0 overflow-hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Review Session</SheetTitle>
        </SheetHeader>
        <div className="h-full overflow-hidden">{children}</div>
      </SheetContent>
    </Sheet>
  );
};

export default React.memo(PostCallReviewModalContainer);
