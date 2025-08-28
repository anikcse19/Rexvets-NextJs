"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Check,
  CheckCheck,
  Image,
  MessageCircle,
  Paperclip,
  Send,
  Smile,
  Video,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ChatBoxProps {
  appointmentId: string;
  doctorName: string;
  doctorImage: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderImage: string;
  content: string;
  type: "text" | "image" | "video" | "assessment" | "prescription";
  timestamp: string;
  isRead: boolean;
  isDelivered: boolean;
}

// Mock messages for pet parent view
const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "parent-1",
    senderName: "Sarah Johnson",
    senderImage:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    content:
      "Hi Dr. Rahman, I'm a bit worried about Max. He's been less active today.",
    type: "text",
    timestamp: "2025-01-15T09:15:00Z",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "2",
    senderId: "doctor-1",
    senderName: "Dr. Anik Rahman",
    senderImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    content:
      "Thank you for letting me know, Sarah. I'll make sure to examine Max thoroughly during our appointment today. Any other symptoms you've noticed?",
    type: "text",
    timestamp: "2025-01-15T09:18:00Z",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "3",
    senderId: "parent-1",
    senderName: "Sarah Johnson",
    senderImage:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    content:
      "He's eating normally, but he seems to be sleeping more than usual. Should I be concerned?",
    type: "text",
    timestamp: "2025-01-15T09:22:00Z",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "4",
    senderId: "doctor-1",
    senderName: "Dr. Anik Rahman",
    senderImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    content:
      "📋 **Assessment Added**\n\nI've completed Max's examination. Temperature is slightly elevated at 101.5°F. Heart and lung sounds are normal. Prescribing antibiotics for mild infection.",
    type: "assessment",
    timestamp: "2025-01-15T10:45:00Z",
    isRead: true,
    isDelivered: true,
  },
  {
    id: "5",
    senderId: "doctor-1",
    senderName: "Dr. Anik Rahman",
    senderImage:
      "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
    content:
      "💊 **Prescription Written**\n\n**Medications:**\n• Amoxicillin 250mg - Twice daily for 7 days\n• Metacam 1.5mg - Once daily for 5 days\n\n**Notes:** Monitor for any adverse reactions. Return if symptoms persist after 3 days.",
    type: "prescription",
    timestamp: "2025-01-15T10:50:00Z",
    isRead: true,
    isDelivered: true,
  },
];

export default function ChatBox({ doctorName, doctorImage }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "parent-1",
        senderName: "Sarah Johnson",
        senderImage:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face",
        content: newMessage,
        type: "text",
        timestamp: new Date().toISOString(),
        isRead: false,
        isDelivered: true,
      };

      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (type: "image" | "video") => {
    // This would handle file upload
    console.log(`Uploading ${type}`);
    fileInputRef.current?.click();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isParent = (senderId: string) => senderId.startsWith("parent");

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-white">
              Chat with {doctorName}
            </CardTitle>
            <p className="text-teal-100 text-sm">Real-time communication</p>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-white/30">
              <AvatarImage src={doctorImage} alt={doctorName} />
              <AvatarFallback className="text-xs">
                {doctorName
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                isParent(message.senderId) ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage
                  src={message.senderImage}
                  alt={message.senderName}
                />
                <AvatarFallback className="text-xs">
                  {message.senderName
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex-1 max-w-[70%] ${
                  isParent(message.senderId) ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!isParent(message.senderId) && (
                    <span className="text-xs font-medium text-gray-600">
                      {message.senderName}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                  {isParent(message.senderId) && (
                    <span className="text-xs font-medium text-gray-600">
                      You
                    </span>
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isParent(message.senderId)
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      : message.type === "assessment" ||
                        message.type === "prescription"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.type === "assessment" ||
                  message.type === "prescription" ? (
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                        {message.type === "assessment"
                          ? "Medical Assessment"
                          : "Prescription"}
                      </Badge>
                      <div className="text-sm text-green-900 whitespace-pre-line">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {message.content}
                    </p>
                  )}
                </div>

                {isParent(message.senderId) && (
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {message.isDelivered ? (
                      message.isRead ? (
                        <CheckCheck className="w-3 h-3 text-blue-500" />
                      ) : (
                        <CheckCheck className="w-3 h-3 text-gray-400" />
                      )
                    ) : (
                      <Check className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={doctorImage} alt={doctorName} />
                <AvatarFallback className="text-xs">
                  {doctorName
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFileUpload("image")}
              className="border-gray-300 hover:bg-gray-100"
            >
              <Image className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFileUpload("video")}
              className="border-gray-300 hover:bg-gray-100"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-100"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-12 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            // Handle file upload
            console.log("File selected:", e.target.files?.[0]);
          }}
        />
      </div>
    </Card>
  );
}
