"use client";
import React from "react";
import { useVideoCall } from "../../hooks/useVideoCall";
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
    localVideoRef,
    remoteVideoRef,
    localVideoTrack,
    toggleAudio,
    toggleVideo,
    endCall,
    switchCamera,
    applyVirtualBackground,
  } = useVideoCall();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!appointmentDetails && !isLoading) {
    return <ErrorScreen />;
  }
  console.log("appointmentDetails", appointmentDetails);
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
            onVirtualBackgroundChange={applyVirtualBackground}
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
