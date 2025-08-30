"use client";
import PostCallModal from "@/components/PostCallReviewModal";
import React, { useState } from "react";

const page = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="h-screen bg-white">
      <PostCallModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        doctorId="123"
        docType="Parent"
        appointmentDetails={null}
      />
    </div>
  );
};

export default page;
