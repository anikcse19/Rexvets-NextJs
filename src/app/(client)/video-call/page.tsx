"use client";

import VideoCallInterface from "@/components/VideoCall/VideoCall";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const APP_ID = "4a555d4c9a294e6a8bbe28e910a9495b";
const CHANNEL = "testChannel";
export default function VideoCall() {
  const searchParams = useSearchParams();
  const isPublisher = searchParams.get("isPublisher") === "true";

  const [uid] = useState(Math.floor(Math.random() * 100000));

  return (
    <div className="min-h-screen ">
      <VideoCallInterface
        channel={CHANNEL}
        uid={uid}
        appId={APP_ID}
        isPublisher={isPublisher}
      />
    </div>
  );
}
