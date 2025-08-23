"use client";
import { HumanChatBox } from "@/components/Chat";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const ChatPageContent = () => {
  const searchParams = useSearchParams();

  const name = searchParams.get("name"); // "M Junaid"
  const email = searchParams.get("email"); // "m.junaidbkh2020@gmail.com"
  const sessionId = searchParams.get("sessionId"); // "9bfpicnv6dnmenumfej"

  return (
    <div>
      {/* <h1>Hello human Chat</h1>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Session ID: {sessionId}</p> */}
      <HumanChatBox name={name} email={email} sessionId={sessionId} />
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
};

export default Page;
