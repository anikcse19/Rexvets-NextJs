"use client";
import { useVideoCall } from "@/hooks/useVideoCall";
import React, { useEffect } from "react";
import PostCallModal from "../PostCallReviewModal";
import {
  ErrorScreen,
  LoadingScreen,
  LocalVideoPreview,
  VideoCallControls,
  VideoCallHeader,
  VideoCallLogo,
  VideoCallMainArea,
  VideoCallSidebar,
} from "./components";

interface VideoCallContentProps {
  onEndCall?: () => void;
}

const VideoCallContent: React.FC<VideoCallContentProps> = ({ onEndCall }) => {
  const {
    petParent,
    appointmentDetails,
    isLoading,
    isOpen,
    setIsOpen,
    isAudioEnabled,
    isVideoEnabled,
    callState,
    errorMessage,
    remoteUsersState,
    isVirtualBackgroundSupported,
    selectedBackground,
    isProcessingVirtualBg,
    localVideoRef,
    remoteVideoRef,
    localVideoTrack,
    toggleAudio,
    toggleVideo,
    endCall,
    switchCamera,
    applyVirtualBackground,
  } = useVideoCall();

  // Log when component mounts (only once)
  useEffect(() => {
    console.log("VideoCallContent - Component mounted with initial state:", {
      isVideoEnabled,
      isAudioEnabled,
    });

    // Force a re-render of the video after a short delay to ensure it's displayed
    const timer = setTimeout(() => {
      if (localVideoTrack.current && localVideoRef.current) {
        try {
          localVideoTrack.current.play(localVideoRef.current);
          console.log("Video re-displayed after mount");
        } catch (error) {
          console.error("Error re-displaying video after mount:", error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!appointmentDetails && !isLoading) {
    return <ErrorScreen />;
  }
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgb(0, 35, 102) 20%, rgb(36, 36, 62) 25%, rgb(48, 43, 99) 50%, rgb(15, 52, 96) 75%, rgb(15, 12, 41) 100%)",
      }}
      className="h-screen flex justify-center"
    >
      <div className="max-w-[1200px] w-full flex flex-col md:flex-row gap-7 py-5 md:py-24 px-4">
        {/* Left Main Section */}
        <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-2xl flex flex-col relative">
          <VideoCallLogo />
          <VideoCallHeader petParent={petParent} />
          <VideoCallMainArea
            callState={callState}
            errorMessage={errorMessage}
            remoteUsersState={remoteUsersState}
            remoteVideoRef={remoteVideoRef as React.RefObject<HTMLDivElement>}
            petParent={petParent}
          />
          <LocalVideoPreview
            localVideoRef={localVideoRef as React.RefObject<HTMLDivElement>}
            localVideoTrack={localVideoTrack}
            isVideoEnabled={isVideoEnabled}
          />
          <VideoCallControls
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onEndCall={endCall}
            onSwitchCamera={switchCamera}
            onApplyVirtualBackground={applyVirtualBackground}
            selectedBackground={selectedBackground}
            isVirtualBackgroundSupported={isVirtualBackgroundSupported}
            isProcessingVirtualBg={isProcessingVirtualBg}
          />
        </div>

        {/* Right Sidebar */}
        <VideoCallSidebar
          onEndCall={onEndCall || endCall}
          isVirtualBackgroundSupported={isVirtualBackgroundSupported}
          selectedBackground={selectedBackground}
          onApplyVirtualBackground={applyVirtualBackground}
          petParent={petParent}
          reasonForAppointment={appointmentDetails?.concerns}
          isProcessingVirtualBg={isProcessingVirtualBg}
        />
      </div>

      <PostCallModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        doctorId="123"
        docType="Parent"
        appointmentDetails={appointmentDetails}
      />
    </div>
  );
};

export default VideoCallContent;
