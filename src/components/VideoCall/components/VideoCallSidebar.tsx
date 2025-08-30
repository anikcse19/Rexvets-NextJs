"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NextImage from "next/image";
import { FaTimes } from "react-icons/fa";

interface VideoCallSidebarProps {
  onEndCall: () => void;
  isVirtualBackgroundSupported: boolean;
  selectedBackground: string | null;
  onApplyVirtualBackground: (backgroundType: string | null) => void;
  petParent: any;
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

const VideoCallSidebar: React.FC<VideoCallSidebarProps> = ({
  onEndCall,
  isVirtualBackgroundSupported,
  selectedBackground,
  onApplyVirtualBackground,
  petParent,
}) => {
  return (
    <div className="hidden md:block w-full md:w-[30%] bg-[#4346a0]/20 backdrop-blur-sm p-3 relative rounded-2xl">
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

        <Badge className="bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-medium">
          Active
        </Badge>
      </div>

      {/* Reason for appointment */}
      <div className="mb-4">
        <h4 className="text-white font-semibold mb-1 text-base">
          Reason for appointment
        </h4>
        <Input
          value="Nutrition"
          readOnly
          className="bg-white/20 border-white/30 text-white placeholder-gray-300 h-10 text-xs"
        />
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
        <h4 className="text-white font-semibold mb-2 text-base">
          Virtual Background
        </h4>
        <p className="text-gray-300 text-xs mb-2">
          Choose a beautiful background to enhance your video call experience
        </p>

        {!isVirtualBackgroundSupported && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 text-xs font-medium">
                Virtual background is not supported on your device/browser
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-1.5">
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
        </div>
      </div>
    </div>
  );
};

export default VideoCallSidebar;
