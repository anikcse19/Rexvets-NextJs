"use client";

import VideoCallPreview from "@/components/VideoCall/VideoCallPreview";

import React, { Suspense } from "react";

function VideoCallContent() {
  return (
    <>
      <div className="min-h-screen ">
        <VideoCallPreview />
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Loading video call...</div>
    </div>
  );
}

export default function VideoCall() {
  return <VideoCallContent />;
}
