"use client";
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface VirtualBackground {
  id: string;
  name: string;
  type: 'image' | 'blur' | 'color';
  value: string;
  icon?: React.ReactNode;
  preview?: string;
}

interface VideoCallState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  selectedBackground: string | null;
  hasInitializedCamera: boolean;
  isVirtualBackgroundSupported: boolean;
}

interface VideoCallContextType {
  videoCallState: VideoCallState;
  setVideoEnabled: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setSelectedBackground: (background: string | null) => void;
  setHasInitializedCamera: (initialized: boolean) => void;
  setVirtualBackgroundSupported: (supported: boolean) => void;
  resetState: () => void;
  virtualBackgrounds: VirtualBackground[];
}

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

const initialState: VideoCallState = {
  isVideoEnabled: true,
  isAudioEnabled: true,
  selectedBackground: null,
  hasInitializedCamera: false,
  isVirtualBackgroundSupported: false,
};

// Virtual backgrounds data - same as in VideoCallControls
const virtualBackgrounds: VirtualBackground[] = [
  {
    id: "none",
    name: "No Background",
    type: "image",
    value: "none",
  },
  {
    id: "blur",
    name: "Blur Background",
    type: "blur",
    value: "blur",
  },
  {
    id: "office",
    name: "Modern Office",
    type: "image",
    value: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=150&fit=crop",
  },
  {
    id: "home",
    name: "Cozy Home",
    type: "image",
    value: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    preview: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
  },
  {
    id: "nature",
    name: "Nature Scene",
    type: "image",
    value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
  },
  {
    id: "mountain",
    name: "Mountain View",
    type: "image",
    value: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    type: "image",
    value: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop",
  },
  {
    id: "city",
    name: "City Skyline",
    type: "image",
    value: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
    preview: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=150&fit=crop",
  },
  {
    id: "gradient-blue",
    name: "Blue Gradient",
    type: "color",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "gradient-purple",
    name: "Purple Gradient",
    type: "color",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "gradient-green",
    name: "Green Gradient",
    type: "color",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "gradient-orange",
    name: "Orange Gradient",
    type: "color",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
];

export const VideoCallProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videoCallState, setVideoCallState] = useState<VideoCallState>(initialState);

  const setVideoEnabled = (enabled: boolean) => {
    setVideoCallState(prev => ({ ...prev, isVideoEnabled: enabled }));
  };

  const setAudioEnabled = (enabled: boolean) => {
    setVideoCallState(prev => ({ ...prev, isAudioEnabled: enabled }));
  };

  const setSelectedBackground = (background: string | null) => {
    setVideoCallState(prev => ({ ...prev, selectedBackground: background }));
  };

  const setHasInitializedCamera = (initialized: boolean) => {
    setVideoCallState(prev => ({ ...prev, hasInitializedCamera: initialized }));
  };

  const setVirtualBackgroundSupported = (supported: boolean) => {
    setVideoCallState(prev => ({ ...prev, isVirtualBackgroundSupported: supported }));
  };

  const resetState = () => {
    setVideoCallState(initialState);
  };

  const value: VideoCallContextType = {
    videoCallState,
    setVideoEnabled,
    setAudioEnabled,
    setSelectedBackground,
    setHasInitializedCamera,
    setVirtualBackgroundSupported,
    resetState,
    virtualBackgrounds,
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCallContext = () => {
  const context = useContext(VideoCallContext);
  if (context === undefined) {
    throw new Error('useVideoCallContext must be used within a VideoCallProvider');
  }
  return context;
};
