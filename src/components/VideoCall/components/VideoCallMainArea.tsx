"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IUser } from "@/models";

interface VideoCallMainAreaProps {
  callState: string;
  errorMessage: string | null;
  remoteUsersState: { [uid: string]: any };
  remoteVideoRef: React.RefObject<HTMLDivElement>;
  petParent: IUser | null;
}

const VideoCallMainArea: React.FC<VideoCallMainAreaProps> = ({
  callState,
  errorMessage,
  remoteUsersState,
  remoteVideoRef,
  petParent,
}) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 pt-24">
      <div className="relative flex gap-4 w-full h-full">
        {callState === "connecting" && !errorMessage && (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-white text-xl font-semibold mb-2">
              Connecting...
            </div>
            <div className="text-gray-300 text-sm">
              Establishing secure connection
            </div>
          </div>
        )}
        {callState === "failed" && errorMessage && (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-red-400 text-xl font-semibold mb-2">
              Connection Failed
            </div>
            <div className="text-gray-300 text-sm max-w-md">{errorMessage}</div>
          </div>
        )}
        {callState !== "connecting" &&
          !errorMessage &&
          Object.keys(remoteUsersState).length !== 0 && (
            <div className="w-full h-full rounded-[2.5rem] p-2 shadow-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <div className="w-full h-full bg-gray-900 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden border border-white/10">
                <div
                  ref={remoteVideoRef}
                  className="w-full h-full flex items-center justify-center"
                  style={{ minHeight: "100%", minWidth: "100%" }}
                ></div>
              </div>
            </div>
          )}
        {callState !== "connecting" &&
          !errorMessage &&
          Object.keys(remoteUsersState).length === 0 && (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <div className="relative mb-6 flex flex-col items-center justify-center gap-4">
                  <Avatar className="w-[140px] h-[140px] border-4 items-center justify-center  border-white/20 shadow-2xl">
                    <AvatarImage src={petParent?.profileImage} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-3xl font-bold">
                      {petParent?.name?.toUpperCase()?.split("").slice(0, 1) ||
                        "MM"}
                    </AvatarFallback>
                  </Avatar>
                  {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 animate-pulse"></div> */}
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Waiting for {petParent?.name} ...
                  </h2>
                  <p className="text-gray-300 text-base mb-4">
                    Please wait while we establish the connection
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default VideoCallMainArea;
