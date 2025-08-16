"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";

// Dynamically import the VideoCallInterface to prevent SSR
const VideoCallInterface = dynamic(
  () => import("@/components/VideoCall/VideoCall"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading video call...</div>
      </div>
    )
  }
);

const APP_ID = "4a555d4c9a294e6a8bbe28e910a9495b";
const CHANNEL = "testChannel";

function VideoCallContent() {
  const searchParams = useSearchParams();
  const isPublisher = searchParams.get("isPublisher") === "true";

  const [uid] = useState(Math.floor(Math.random() * 100000));

  return (
    <div className="min-h-screen">
      <VideoCallInterface
        channel={CHANNEL}
        uid={uid}
        appId={APP_ID}
        isPublisher={isPublisher}
      />
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
