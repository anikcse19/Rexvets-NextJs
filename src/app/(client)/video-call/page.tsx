"use client";

import VideoCallPreview from "@/components/VideoCall/VideoCallPreview";

import React, { Suspense } from "react";

function VideoCallContent() {

  return (
    <div className="min-h-screen ">
      {/* <VideoCallInterface
        channel={CHANNEL}
        uid={uid}
        appId={APP_ID}
        isPublisher={isPublisher}
      /> */}
      {/* <VideoCallVersantParents mode="access" /> */}
      <VideoCallPreview />
    </div>
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
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VideoCallContent />
    </Suspense>
  );
}
