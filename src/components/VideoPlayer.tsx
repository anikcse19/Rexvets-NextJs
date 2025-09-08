import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const VIDEO_URL =
  "https://res.cloudinary.com/di6zff0rd/video/upload/v1753102241/RexVetsWeb_tb3zcq.mp4";

interface HeroVideoProps {
  shouldPause?: boolean;
  onReady?: () => void;
}

const HeroVideo = ({ shouldPause, onReady }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS device
  useEffect(() => {
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(iOS);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Load video source when in view
  useEffect(() => {
    if (isInView && videoRef.current && !isVideoLoaded) {
      setIsLoading(true);
      setHasError(false);

      const video = videoRef.current;
      video.src = VIDEO_URL;

      const handleLoadedData = () => {
        setIsVideoLoaded(true);
        setIsLoading(false);
        onReady?.();
      };

      const handleError = (e: Event) => {
        console.error("Video loading error:", e);
        setIsLoading(false);
        setHasError(true);
        video.removeEventListener("error", handleError);
      };

      video.addEventListener("canplay", handleLoadedData);
      video.addEventListener("error", handleError);

      video.load();
    }
  }, [isInView, isVideoLoaded]);

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video || !isVideoLoaded) return;

    try {
      if (video.paused) {
        if (isIOS) {
          video.muted = true;
          setIsMuted(true);
        } else {
          video.muted = false;
          setIsMuted(false);
        }

        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error playing video:", error);
      if (isIOS && video.paused) {
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
        } catch (mutedError) {
          console.error("Error playing muted video:", mutedError);
        }
      }
    }
  };

  const handleMuteToggle = async () => {
    const video = videoRef.current;
    if (!video || !isVideoLoaded) return;

    try {
      video.muted = !video.muted;
      setIsMuted(video.muted);

      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  };

  // Pause when parent signals
  useEffect(() => {
    if (shouldPause) {
      const video = videoRef.current;
      if (video && isPlaying && !video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [shouldPause, isPlaying]);

  return (
    <div
      ref={containerRef}
      className="
        relative flex items-center justify-center 
        w-full sm:w-[85%] max-w-[600px] 
        h-[500px] sm:h-[600px] 
        mx-auto mt-0 sm:mt-4 mb-0 sm:mb-2 
        rounded-2xl sm:rounded-3xl 
        overflow-hidden shadow-lg sm:shadow-2xl
        bg-gradient-to-br from-indigo-500 to-purple-700
      "
    >
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 gap-3">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white font-medium text-sm drop-shadow">
            Loading video...
          </p>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-40 text-white px-4">
          <AlertTriangle className="w-8 h-8 mb-2 text-red-300" />
          <p className="font-semibold text-lg">Video unavailable</p>
          <p className="text-sm opacity-90">Please try refreshing the page</p>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        loop
        muted={isMuted}
        playsInline
        preload="none"
        className={`w-full h-full object-cover ${
          isVideoLoaded ? "block" : "hidden"
        }`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        Sorry, your browser does not support embedded videos.
      </video>

      {/* Overlay click (play/pause) */}
      {isVideoLoaded && !isLoading && !hasError && (
        <div
          onClick={handlePlayPause}
          className="absolute inset-0 cursor-pointer z-20"
        />
      )}

      {/* Controls */}
      {isVideoLoaded && !isLoading && !hasError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4">
          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            className="
              w-14 h-14 flex items-center justify-center rounded-full 
              bg-white/90 hover:bg-white 
              transition transform hover:scale-110
            "
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-[#002366]" />
            ) : (
              <Play className="w-8 h-8 text-[#002366]" />
            )}
          </button>

          {/* Mute/Unmute */}
          <button
            onClick={handleMuteToggle}
            className="
              w-14 h-14 flex items-center justify-center rounded-full 
              bg-white/70 hover:bg-white/90 
              transition
            "
          >
            {isMuted ? (
              <VolumeX className="w-7 h-7 text-[#002366]" />
            ) : (
              <Volume2 className="w-7 h-7 text-[#002366]" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HeroVideo;
