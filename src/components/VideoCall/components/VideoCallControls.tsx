// "use client";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { useVideoCallContext } from "@/hooks/VideoCallContext";
// import { useState } from "react";
// import { AiOutlineCamera } from "react-icons/ai";
// import {
//   FaBuilding,
//   FaCity,
//   FaHome,
//   FaImage,
//   FaMicrophone,
//   FaMicrophoneSlash,
//   FaMountain,
//   FaPalette,
//   FaPhoneSlash,
//   FaTree,
//   FaVideoSlash,
//   FaWater,
// } from "react-icons/fa";
// import { HiDotsHorizontal } from "react-icons/hi";

// interface VideoCallControlsProps {
//   isAudioEnabled: boolean;
//   isVideoEnabled: boolean;
//   onToggleAudio: () => void;
//   onToggleVideo: () => void;
//   onEndCall: () => void;
//   onSwitchCamera: () => void;
//   onVirtualBackgroundChange?: (background: string) => void;
// }

// interface VirtualBackground {
//   id: string;
//   name: string;
//   type: "image" | "blur" | "color";
//   value: string;
//   icon?: React.ReactNode;
//   preview?: string;
// }

// const VideoCallControls: React.FC<VideoCallControlsProps> = ({
//   isAudioEnabled,
//   isVideoEnabled,
//   onToggleAudio,
//   onToggleVideo,
//   onEndCall,
//   onSwitchCamera,
//   onVirtualBackgroundChange,
// }) => {

//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//   const handleBackgroundChange = (background: VirtualBackground) => {
//     setSelectedBackground(background.value);
//     onVirtualBackgroundChange?.(background.value);
//   };

//   return (
//     <>
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//         <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 shadow-2xl">
//           <Button
//             onClick={onToggleAudio}
//             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
//               isAudioEnabled
//                 ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
//                 : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
//             }`}
//           >
//             {isAudioEnabled ? (
//               <FaMicrophone className="text-white text-base" />
//             ) : (
//               <FaMicrophoneSlash className="text-white text-base" />
//             )}
//           </Button>

//           <Button
//             onClick={onEndCall}
//             className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             <FaPhoneSlash className="text-white text-base" />
//           </Button>

//           <Button
//             onClick={onToggleVideo}
//             className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
//               isVideoEnabled
//                 ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
//                 : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
//             }`}
//           >
//             <FaVideoSlash className="text-white text-base" />
//           </Button>

//           <Button
//             onClick={onSwitchCamera}
//             className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
//           >
//             <AiOutlineCamera className="text-white text-base" />
//           </Button>

//           <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
//             <SheetTrigger asChild>
//               <Button className=" md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
//                 <HiDotsHorizontal className="text-white text-base" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent
//               side="bottom"
//               className="h-[80vh] bg-black/95 backdrop-blur-md border-t border-white/20"
//             >
//               <SheetHeader className="text-left">
//                 <SheetTitle className="text-white text-xl font-semibold flex items-center gap-2">
//                   <FaImage className="w-5 h-5 text-blue-400" />
//                   Virtual Backgrounds
//                 </SheetTitle>
//                 <p className="text-white/60 text-sm">
//                   Choose a beautiful background to enhance your video call
//                   experience
//                 </p>
//               </SheetHeader>

//               <ScrollArea className="h-[77vh] pb-14">
//                 <div className="mt-6 space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     {virtualBackgrounds.map((background) => (
//                       <div
//                         key={background.id}
//                         onClick={() => handleBackgroundChange(background)}
//                         className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
//                           videoCallState.selectedBackground === background.value
//                             ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-black"
//                             : "hover:ring-2 hover:ring-white/30"
//                         }`}
//                       >
//                         {/* Background Preview */}
//                         <div className="aspect-video relative">
//                           {background.type === "image" && background.preview ? (
//                             <img
//                               src={background.preview}
//                               alt={background.name}
//                               className="w-full h-full object-cover"
//                             />
//                           ) : background.type === "color" ? (
//                             <div
//                               className="w-full h-full"
//                               style={{ background: background.value }}
//                             />
//                           ) : background.type === "blur" ? (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
//                               <div className="text-white/80 text-xs">
//                                 Blur Effect
//                               </div>
//                             </div>
//                           ) : (
//                             <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
//                               <div className="text-white/60 text-xs">
//                                 No Background
//                               </div>
//                             </div>
//                           )}

//                           {/* Overlay with icon and name */}
//                           <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
//                             <div className="text-white mb-1">
//                               {background.icon || (
//                                 <FaImage className="w-5 h-5" />
//                               )}
//                             </div>
//                             <p className="text-white text-xs font-medium text-center px-2">
//                               {background.name}
//                             </p>
//                           </div>

//                           {/* Selected indicator */}
//                           {videoCallState.selectedBackground ===
//                             background.value && (
//                             <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
//                               <svg
//                                 className="w-4 h-4 text-white"
//                                 fill="currentColor"
//                                 viewBox="0 0 20 20"
//                               >
//                                 <path
//                                   fillRule="evenodd"
//                                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                                   clipRule="evenodd"
//                                 />
//                               </svg>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Additional Controls */}
//                   <div className="pt-4 border-t border-white/10">
//                     <div className="grid grid-cols-2 gap-3">
//                       <Button
//                         onClick={onSwitchCamera}
//                         className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
//                       >
//                         <AiOutlineCamera className="w-4 h-4 mr-2" />
//                         Switch Camera
//                       </Button>
//                       <Button
//                         onClick={() => setIsDrawerOpen(false)}
//                         className="bg-blue-600 hover:bg-blue-700 text-white"
//                       >
//                         Done
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </ScrollArea>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </>
//   );
// };

// export default VideoCallControls;
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
