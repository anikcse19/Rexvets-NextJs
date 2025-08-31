"use client";
import { VideoCallProvider } from "@/hooks/VideoCallContext";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useState } from "react";
import PostCallModal from "../PostCallReviewModal";

interface VideoCallProps {
  onEndCall?: () => void;
}

// Loading component for when Agora SDK is loading
const AgoraLoadingScreen = () => (
  <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
      <p className="text-lg">Initializing video call...</p>
    </div>
  </div>
);

// Dynamically import the VideoCallContent component to prevent SSR issues
const VideoCallContent = dynamic(() => import("./VideoCallContent").then(mod => mod.default), {
  ssr: false,
  loading: () => <AgoraLoadingScreen />,
});

const VideoCall: React.FC<VideoCallProps> = ({ onEndCall }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <AgoraLoadingScreen />;
  }

  return (
    <VideoCallProvider>
      <Suspense fallback={<AgoraLoadingScreen />}>
        <VideoCallContent onEndCall={onEndCall} />
      </Suspense>
    </VideoCallProvider>
  );
};

export default VideoCall;
