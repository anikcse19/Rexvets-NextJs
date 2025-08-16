import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, MicOff, Video, VideoOff } from "lucide-react"; // ✅ Fixed import
import { FC, RefObject } from "react";

interface VideoPreviewProps {
  localVideoRef: RefObject<HTMLVideoElement>;
  audioEnabled: boolean;
  videoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
}

const VideoPreview: FC<VideoPreviewProps> = ({
  localVideoRef,
  audioEnabled,
  videoEnabled,
  toggleAudio,
  toggleVideo,
}) => {
  return (
    <div
      className={cn(
        "relative w-full max-w-[500px] h-[280px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10",
        videoEnabled ? "bg-black/40" : "bg-black/80"
      )}
    >
      {/* Video element */}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        muted
        className={cn(
          "w-full h-full object-cover",
          videoEnabled ? "block" : "hidden"
        )}
      />

      {/* Camera off placeholder */}
      <AnimatePresence>
        {!videoEnabled && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center text-white bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-[60px] h-[60px] rounded-full bg-white/10 flex items-center justify-center mb-3">
              <VideoOff className="w-7 h-7" />
            </div>
            <span className="text-base font-medium opacity-90">
              Camera is off
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio indicator */}
      <AnimatePresence>
        {audioEnabled && (
          <motion.div
            className="absolute top-4 left-4 bg-green-500/90 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              opacity: { duration: 0.3 },
              scale: { repeat: Infinity, repeatType: "reverse", duration: 2 },
            }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-current"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Microphone active
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video controls */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 bg-black/50 p-3 rounded-3xl backdrop-blur-md"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Toggle Audio */}
        <Button
          variant="default"
          size="icon"
          className={cn(
            "w-11 h-11 rounded-full",
            audioEnabled
              ? "bg-white/90 text-gray-700"
              : "bg-red-500/90 text-white"
          )}
          asChild
        >
          <motion.button
            onClick={toggleAudio}
            title={audioEnabled ? "Mute microphone" : "Unmute microphone"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {audioEnabled ? (
              <Mic className="w-5 h-5" />
            ) : (
              <MicOff className="w-5 h-5" />
            )}
          </motion.button>
        </Button>

        {/* Toggle Video */}
        <Button
          variant="default"
          size="icon"
          className={cn(
            "w-11 h-11 rounded-full",
            videoEnabled
              ? "bg-white/90 text-gray-700"
              : "bg-red-500/90 text-white"
          )}
          asChild
        >
          <motion.button
            onClick={toggleVideo}
            title={videoEnabled ? "Turn off camera" : "Turn on camera"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {videoEnabled ? (
              <Video className="w-5 h-5" />
            ) : (
              <VideoOff className="w-5 h-5" />
            )}
          </motion.button>
        </Button>
      </motion.div>
    </div>
  );
};

export default VideoPreview;
