"use client";
import Script from "next/script";

export default function PusherClientLoader() {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  if (!key) return null;
  return (
    <Script
      src="https://js.pusher.com/8.2/pusher.min.js"
      strategy="lazyOnload"
      onLoad={() => {
        import("@/lib/pusherClient");
      }}
    />
  );
}
