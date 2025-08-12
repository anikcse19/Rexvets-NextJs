/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";

const APP_ID = "4a555d4c9a294e6a8bbe28e910a9495b";
const CHANNEL = "testChannel";
console.log("APP IDDDDDDDDDDD", process.env.NEXT_PUBLIC_AGORA_APP_ID);
export default function VideoCall() {
  const [AgoraRTC, setAgoraRTC] = useState<any>(null);

  const client = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const localAudioTrack = useRef<any>(null);
  const localVideoTrack = useRef<any>(null);

  const [joined, setJoined] = useState(false);
  const [uid] = useState(Math.floor(Math.random() * 100000));

  useEffect(() => {
    // Dynamically import Agora RTC SDK client only in the browser
    import("agora-rtc-sdk-ng").then((module) => {
      setAgoraRTC(module.default);
      client.current = module.default.createClient({
        mode: "rtc",
        codec: "vp8",
      });
    });
  }, []);

  useEffect(() => {
    if (!AgoraRTC || !client.current) return;

    const startCall = async () => {
      const res = await fetch(
        `/api/agora-token?channelName=${CHANNEL}&uid=${uid}`
      );
      const data = await res.json();
      if (!data.token) {
        console.error("Failed to get token");
        return;
      }
      const token = data.token;

      const clientInstance = client.current;

      await clientInstance.join(APP_ID, CHANNEL, token, uid);

      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack();

      localVideoTrack.current.play(localVideoRef.current!);

      await clientInstance.publish([
        localAudioTrack.current,
        localVideoTrack.current,
      ]);

      clientInstance.on(
        "user-published",
        async (user: any, mediaType: string) => {
          await clientInstance.subscribe(user, mediaType);

          if (mediaType === "video") {
            const remoteTrack = user.videoTrack;
            if (remoteTrack) {
              remoteTrack.play(remoteVideoRef.current!);
            }
          }
          if (mediaType === "audio") {
            const remoteAudioTrack = user.audioTrack;
            if (remoteAudioTrack) {
              remoteAudioTrack.play();
            }
          }
        }
      );

      clientInstance.on("user-unpublished", (user: any, mediaType: string) => {
        if (mediaType === "video") {
          if (remoteVideoRef.current) remoteVideoRef.current.innerHTML = "";
        }
      });

      setJoined(true);
    };

    startCall();

    return () => {
      client.current.leave();
      localVideoTrack.current?.close();
      localAudioTrack.current?.close();
    };
  }, [AgoraRTC, uid]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6 p-4 text-white">
      <h1 className="text-3xl font-bold">Agora Video Call</h1>
      <div className="flex space-x-4">
        <div ref={localVideoRef} className="w-80 h-60 bg-gray-900 rounded-md" />
        <div
          ref={remoteVideoRef}
          className="w-80 h-60 bg-gray-800 rounded-md"
        />
      </div>
      {!joined && <p>Joining channel...</p>}
    </div>
  );
}
