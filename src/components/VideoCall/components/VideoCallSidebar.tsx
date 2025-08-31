"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import NextImage from "next/image";
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
const virtualBackgrounds: VirtualBackground[] = [
  {
    id: "none",
    name: "No Background",
    type: "image",
    value: "none",
    icon: <FaImage className="w-5 h-5" />,
  },
  {
    id: "blur",
    name: "Blur Background",
    type: "blur",
    value: "blur",
    icon: <FaPalette className="w-5 h-5" />,
  },
  {
    id: "office",
    name: "Modern Office",
    type: "image",
    value: "/images/donate-page/Texture.webp",
    icon: <FaBuilding className="w-5 h-5" />,
    preview: "/images/donate-page/Texture.webp",
  },
  {
    id: "home",
    name: "Cozy Home",
    type: "image",
    value: "/images/mission/dog.webp",
    icon: <FaHome className="w-5 h-5" />,
    preview: "/images/mission/dog.webp",
  },
  {
    id: "nature",
    name: "Nature Scene",
    type: "image",
    value: "/images/about/About1.webp",
    icon: <FaTree className="w-5 h-5" />,
    preview: "/images/about/About1.webp",
  },
  {
    id: "mountain",
    name: "Mountain View",
    type: "image",
    value: "/images/how-it-works/PrincipalImgWorks.webp",
    icon: <FaMountain className="w-5 h-5" />,
    preview: "/images/how-it-works/PrincipalImgWorks.webp",
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    type: "image",
    value: "/images/how-it-works/SecondImg.webp",
    icon: <FaWater className="w-5 h-5" />,
    preview: "/images/how-it-works/SecondImg.webp",
  },
  {
    id: "city",
    name: "City Skyline",
    type: "image",
    value: "/images/about/About2.webp",
    icon: <FaCity className="w-5 h-5" />,
    preview: "/images/about/About2.webp",
  },
  {
    id: "gradient-blue",
    name: "Blue Gradient",
    type: "color",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    icon: <FaPalette className="w-5 h-5" />,
  },
  {
    id: "gradient-purple",
    name: "Purple Gradient",
    type: "color",
    value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    icon: <FaPalette className="w-5 h-5" />,
  },
  {
    id: "gradient-green",
    name: "Green Gradient",
    type: "color",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    icon: <FaPalette className="w-5 h-5" />,
  },
  {
    id: "gradient-orange",
    name: "Orange Gradient",
    type: "color",
    value: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    icon: <FaPalette className="w-5 h-5" />,
  },
];
const VideoCallSidebar: React.FC<VideoCallSidebarProps> = ({
  onEndCall,
  isVirtualBackgroundSupported,
  selectedBackground,
  onApplyVirtualBackground,
  petParent,
  reasonForAppointment,
  isProcessingVirtualBg = false,
}) => {
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

        {/* Patient Avatar and Info */}
        <div className="text-center mb-4 pt-4">
          <div className="relative inline-block mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
              <div className="text-white text-sm">🐾</div>
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <h3 className="text-white text-sm font-semibold mb-1">new image 2</h3>
          <p className="text-gray-200 text-xs mb-1">
            Amphibian • Male Neutered • fsdaf
          </p>
          <p className="text-gray-200 text-xs mb-1">Weight: 20</p>

          {/* <Badge className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
          Active
        </Badge> */}
        </div>

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
            Veterinarian Details
          </h4>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">MM</span>
              </div>
              <div className="flex-1">
                <h5 className="text-white font-semibold text-base">
                  {petParent?.name || "Veterinarian Name"}
                </h5>
                <p className="text-gray-200 text-xs">America/New_York</p>
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
                  Virtual background is not supported on your device/browser. Try using Chrome or Edge for best compatibility.
                </span>
              </div>
            </div>
          )}

          {/* <div className="grid grid-cols-2 gap-1.5">
            {VIRTUAL_BACKGROUNDS.map((bg) => (
              <div
                key={bg.id}
                className={`group relative flex flex-col items-center cursor-pointer p-1.5 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedBackground === bg.url
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/50 shadow-lg shadow-purple-500/25"
                    : "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30"
                }`}
                onClick={() => onApplyVirtualBackground(bg.url)}
              >
                <div className="relative w-[40px] h-[40px] rounded-lg overflow-hidden mb-1 group-hover:shadow-lg transition-all duration-300">
                  <NextImage
                    src={bg.image}
                    alt={bg.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    quality={90}
                    priority={bg.id <= 3}
                  />
                  {selectedBackground === bg.url && (
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/30 to-transparent flex items-end justify-center pb-1">
                      <div className="bg-purple-500 text-white px-1 py-0.5 rounded-full text-xs font-semibold">
                        ✓
                      </div>
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-300 text-center ${
                    selectedBackground === bg.url
                      ? "text-purple-300"
                      : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  {bg.name}
                </span>
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-2 gap-4">
            {virtualBackgrounds.map((background) => (
              <div
                key={background.id}
                onClick={() => !isProcessingVirtualBg && onApplyVirtualBackground(background.value)}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                  selectedBackground === background.value
                    ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-black"
                    : "hover:ring-2 hover:ring-white/30"
                } ${isProcessingVirtualBg ? "opacity-50 cursor-not-allowed" : ""}`}
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

                  {/* Selected indicator */}
                  {selectedBackground === background.value && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
