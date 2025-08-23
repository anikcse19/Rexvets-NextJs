"use client";

import { ChatBox } from "@/components/Chat";
import { useParams } from "next/navigation";
import React from "react";

const ChatBoxPage = () => {
  const { receiverId } = useParams<{ receiverId: string }>();

  return (
    <div>
      <ChatBox receiverId={receiverId} />
    </div>
  );
};

export default ChatBoxPage;
