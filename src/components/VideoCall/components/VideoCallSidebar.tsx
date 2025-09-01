"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IPet } from "@/lib";
import { IAppointment } from "@/models";
import Image from "next/image";
import {
  FaBuilding,
  FaCity,
  FaHome,
  FaImage,
  FaMountain,
  FaPalette,
  FaTimes,
  FaTree,
  FaWater,
} from "react-icons/fa";

interface VideoCallSidebarProps {
  onEndCall: () => void;
  isVirtualBackgroundSupported: boolean;
  selectedBackground: string | null;
  onApplyVirtualBackground: (backgroundType: string | null) => void;
  petParent: any;
  reasonForAppointment?: string[];
  appointmentDetails?: IAppointment;
  isProcessingVirtualBg?: boolean;
}
interface VirtualBackground {
  id: string;
  name: string;
  type: "image" | "blur" | "color";
  value: string;
  icon: React.ReactNode;
  preview?: string;
}
const VIRTUAL_BACKGROUNDS = [
  {
    id: 1,
    name: "Blur",
    url: "blur",
    image: "/images/how-it-works/SecondImg.webp",
  },
  {
    id: 2,
    name: "Office",
    url: "/images/donate-page/Texture.webp",
    image: "/images/donate-page/Texture.webp",
  },
  {
    id: 3,
    name: "Beach",
    url: "/images/mission/dog.webp",
    image: "/images/mission/dog.webp",
  },
  {
    id: 4,
    name: "Nature",
    url: "/images/about/About1.webp",
    image: "/images/about/About1.webp",
  },
  {
    id: 5,
    name: "Space",
    url: "/images/how-it-works/PrincipalImgWorks.webp",
    image: "/images/how-it-works/PrincipalImgWorks.webp",
  },
  { id: 6, name: "None", url: "none", image: "/images/Logo.svg" },
];
// Convert VIRTUAL_BACKGROUNDS to VirtualBackground format
const virtualBackgrounds: VirtualBackground[] = VIRTUAL_BACKGROUNDS.map(
  (bg) => {
    if (bg.url === "blur") {
      return {
        id: bg.id.toString(),
        name: bg.name,
        type: "blur" as const,
        value: "blur",
        icon: <FaPalette className="w-5 h-5" />,
        preview: bg.image,
      };
    } else if (bg.url === "none") {
      return {
        id: bg.id.toString(),
        name: bg.name,
        type: "image" as const,
        value: "none",
        icon: <FaImage className="w-5 h-5" />,
        preview: bg.image,
      };
    } else {
      return {
        id: bg.id.toString(),
        name: bg.name,
        type: "image" as const,
        value: bg.url,
        icon: <FaImage className="w-5 h-5" />,
        preview: bg.image,
      };
    }
  }
);
const VideoCallSidebar: React.FC<VideoCallSidebarProps> = ({
  onEndCall,
  isVirtualBackgroundSupported,
  selectedBackground,
  onApplyVirtualBackground,
  petParent,
  reasonForAppointment,
  isProcessingVirtualBg = false,
  appointmentDetails,
}) => {
  const petInfo: any = appointmentDetails?.pet;
  const parent: any = appointmentDetails?.petParent;
  console.log("parent INFO", parent);
  return (
    <ScrollArea className="md:w-[30%] hidden md:block   h-full">
      <div className=" w-full  bg-[#4346a0]/20 backdrop-blur-sm p-3 relative rounded-2xl">
        <Button
          onClick={onEndCall}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-white hover:bg-white/10 w-6 h-6 p-0"
        >
          <FaTimes className="w-3 h-3" />
        </Button>

        {petInfo && typeof petInfo === "object" ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
            <div className="text-center">
              {/* Pet Avatar Section */}
              <div className="relative inline-block mb-4">
                <div className="relative">
                  <Avatar className="h-20 w-20 ring-4 ring-white/30 shadow-lg">
                    <AvatarImage src={petInfo?.image} alt={petInfo?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white text-lg font-bold">
                      {petInfo?.name?.charAt(0) || "P"}
                    </AvatarFallback>
                  </Avatar>
                  {/* <div className="absolute -bottom-1 -right-1">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Pet Name */}
              <h3 className="text-white text-lg font-bold mb-4 tracking-wide">
                {petInfo?.name}
              </h3>

              {/* Pet Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Species
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {petInfo?.species}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Gender
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {petInfo?.gender}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Breed
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {petInfo?.breed}
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Spayed Neutered
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {petInfo?.spayedNeutered}
                  </p>
                </div>

                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-1">
                    Weight
                  </p>
                  <p className="text-white text-sm font-semibold">
                    {petInfo?.weight}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Active Session
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20 text-center">
            <div className="text-gray-300 mb-2">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <p className="text-white/70 text-sm font-medium">
              Pet information not available
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Please check your appointment details
            </p>
          </div>
        )}

        {/* Reason for appointment */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-1 text-base">
            Reason for appointment
          </h4>
          {reasonForAppointment?.map((reason, index) => (
            <Input
              value={reason}
              key={index}
              readOnly
              className="bg-white/20 mb-1 outline-none border-none focus:outline-none focus:ring-0 focus:shadow-none focus:border-none border-white/30 text-white placeholder-gray-300 h-10 text-xs"
            />
          ))}
          {/* <Input
          value="Nutrition"
          readOnly
          className="bg-white/20 border-white/30 text-white placeholder-gray-300 h-10 text-xs"
        /> */}
        </div>

        {/* Veterinarian Details */}
        <div className="mb-4">
          <h4 className="text-white font-semibold mb-2 text-sm">
            Parent Details
          </h4>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {(parent?.name as string)[0]?.toLowerCase() +
                    (parent?.name as string)[1]?.toLowerCase()}
                </span>
              </div>
              <div className="flex-1">
                <h5 className="text-white font-semibold text-base">
                  {parent?.name || "Veterinarian Name"}
                </h5>
                {parent?.state && (
                  <p className="text-gray-200 text-xs">{parent?.state}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Virtual Background Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-semibold text-base">
              Virtual Background
            </h4>
            {isProcessingVirtualBg && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-spin"></div>
                <span className="text-blue-400 text-xs">Processing...</span>
              </div>
            )}
          </div>
          <p className="text-gray-300 text-xs mb-2">
            Choose a beautiful background to enhance your video call experience
          </p>

          {!isVirtualBackgroundSupported && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 text-xs font-medium">
                  Virtual background is not supported on your device/browser.
                  Try using Chrome or Edge for best compatibility.
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {virtualBackgrounds.map((background) => (
              <div
                key={background.id}
                onClick={() =>
                  !isProcessingVirtualBg &&
                  onApplyVirtualBackground(background.value)
                }
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  selectedBackground === background.value
                    ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-black"
                    : "hover:ring-2 hover:ring-white/30"
                } ${
                  isProcessingVirtualBg ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{
                  pointerEvents: isProcessingVirtualBg ? "none" : "auto",
                }}
              >
                {/* Background Preview */}
                <div className="aspect-video relative">
                  {background.type === "image" && background.preview ? (
                    <img
                      src={background.preview}
                      alt={background.name}
                      className="w-full h-full object-cover"
                    />
                  ) : background.type === "color" ? (
                    <div
                      className="w-full h-full"
                      style={{ background: background.value }}
                    />
                  ) : background.type === "blur" ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <div className="text-white/80 text-xs">Blur Effect</div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-white/60 text-xs">No Background</div>
                    </div>
                  )}

                  {/* Overlay with icon and name */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                    <div className="text-white mb-1">{background.icon}</div>
                    <p className="text-white text-xs font-medium text-center px-2">
                      {background.name}
                    </p>
                  </div>

                  {/* Selected indicator or loading indicator */}
                  {selectedBackground === background.value && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      {isProcessingVirtualBg ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default VideoCallSidebar;
