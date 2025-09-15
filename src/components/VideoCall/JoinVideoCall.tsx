"use client";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";
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
const VideoCallContent = dynamic(
  () => import("./VideoCallContent").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <AgoraLoadingScreen />,
  }
);

const JoinVideoCall: React.FC<VideoCallProps> = ({ onEndCall }) => {
  return (
    <Suspense fallback={<AgoraLoadingScreen />}>
      <VideoCallContent onEndCall={onEndCall} />
    </Suspense>
  );
};

export default JoinVideoCall;
