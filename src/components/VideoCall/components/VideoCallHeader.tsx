"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/models";

interface VideoCallHeaderProps {
  petParent: IUser | null;
}

const VideoCallHeader: React.FC<VideoCallHeaderProps> = ({ petParent }) => {
  return (
    <div className="flex items-center justify-between p-6 absolute top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg">
            {petParent?.profileImage && (
              <AvatarImage src={petParent?.profileImage} />
            )}
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
              {petParent?.name?.toUpperCase()?.split("").slice(0, 1) || "P"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
        </div>
        <div className="text-white">
          <div className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {petParent?.name || "Pet Parent"}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCallHeader;
