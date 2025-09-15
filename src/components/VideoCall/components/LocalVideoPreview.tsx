"use client";
import { FaVideoSlash } from "react-icons/fa";

interface LocalVideoPreviewProps {
  localVideoRef: React.RefObject<HTMLDivElement>;
  localVideoTrack: React.MutableRefObject<any>;
  isVideoEnabled: boolean;
}

const LocalVideoPreview: React.FC<LocalVideoPreviewProps> = ({
  localVideoRef,
  localVideoTrack,
  isVideoEnabled,
}) => {
  return (
    <div className="md:w-[180px] md:h-[240px] w-[120px] h-[160px] absolute md:top-20 top-1 md:right-6 right-0 z-50 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-1 shadow-2xl border border-white/10">
      <div className="w-full h-full bg-black rounded-xl overflow-hidden relative">
        <div
          ref={localVideoRef}
          className="w-full h-full flex items-center justify-center"
          style={{ minHeight: "100%", minWidth: "100%" }}
        >
          {!localVideoTrack.current && (
            <div className="text-white text-sm font-medium text-center">
              <div className="mb-2">📹</div>
              <div>Initializing Camera...</div>
            </div>
          )}
          {!isVideoEnabled && localVideoTrack.current && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <FaVideoSlash className="text-white text-3xl opacity-60 mb-2 mx-auto" />
                <div className="text-white text-xs opacity-60">Camera Off</div>
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          You
        </div>
      </div>
    </div>
  );
};

export default LocalVideoPreview;
