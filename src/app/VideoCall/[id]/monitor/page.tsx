"use client";

import VideoCallMonitor from "@/components/VideoCall/VideoCallMonitor";
import React, { Suspense, useEffect, useState } from "react";

function VideoCallMonitorContent() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Loading monitoring interface...
          </h2>
          <p className="text-purple-200">Initializing video call monitor</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen">
        <VideoCallMonitor />
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Connecting to monitor...</div>
    </div>
  );
}

export default function VideoCallMonitorPage() {
  return <VideoCallMonitorContent />;
}


