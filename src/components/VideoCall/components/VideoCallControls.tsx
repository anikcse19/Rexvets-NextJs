"use client";
import { Button } from "@/components/ui/button";
import { AiOutlineCamera } from "react-icons/ai";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideoSlash,
} from "react-icons/fa";

interface VideoCallControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onSwitchCamera: () => void;
  onVirtualBackgroundChange?: (background: string) => void;
}

const VideoCallControls: React.FC<VideoCallControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onSwitchCamera,
}) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 shadow-2xl">
        <Button
          onClick={onToggleAudio}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
            isAudioEnabled
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          }`}
        >
          {isAudioEnabled ? (
            <FaMicrophone className="text-white text-base" />
          ) : (
            <FaMicrophoneSlash className="text-white text-base" />
          )}
        </Button>

        <Button
          onClick={onEndCall}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <FaPhoneSlash className="text-white text-base" />
        </Button>

        <Button
          onClick={onToggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
            isVideoEnabled
              ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
          }`}
        >
          <FaVideoSlash className="text-white text-base" />
        </Button>

        <Button
          onClick={onSwitchCamera}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <AiOutlineCamera className="text-white text-base" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCallControls;
