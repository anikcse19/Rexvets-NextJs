"use client";
import { HumanChatBox } from "@/components/Chat";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const Page = () => {
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

export default page;
