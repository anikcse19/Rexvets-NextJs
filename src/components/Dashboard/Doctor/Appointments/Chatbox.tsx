"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import {
  MessageCircle,
  Send,
  Paperclip,
  Image,
  Video,
  Smile,
  Check,
  CheckCheck,
  Loader2,
  X,
  File,
} from "lucide-react";
import ChatFileUpload from "@/components/shared/ChatFileUpload";
import MessageAttachment from "@/components/shared/MessageAttachment";

interface ChatBoxProps {
  appointmentId: string;
  parentName: string;
  parentImage?: string;
}

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderImage?: string;
  content: string;
  messageType: "text" | "image" | "video" | "assessment" | "prescription" | "file";
  attachments?: Array<{
    url: string;
    fileName: string;
    fileSize?: number;
  }>;
  isRead: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChatBox({
  appointmentId,
  parentName,
  parentImage,
}: ChatBoxProps) {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    fileName: string;
    messageType: string;
    fileSize?: number;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages on component mount and when appointmentId changes
  useEffect(() => {
    if (appointmentId) {
      fetchMessages();
    }
  }, [appointmentId]);

  // Set up polling to fetch new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (appointmentId && !isLoading) {
        fetchMessages();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [appointmentId, isLoading]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!appointmentId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/appointment-chat/messages?appointmentId=${appointmentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploaded = (fileUrl: string, fileName: string, messageType: string, fileSize?: number) => {
    setUploadedFiles(prev => [...prev, { url: fileUrl, fileName, messageType, fileSize }]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && uploadedFiles.length === 0) || !appointmentId || isSending) return;

    try {
      setIsSending(true);
      setError(null);

      // Send text message if there's text content
      if (newMessage.trim()) {
        const textResponse = await fetch('/api/appointment-chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appointmentId,
            content: newMessage.trim(),
            messageType: 'text',
          }),
        });

        if (!textResponse.ok) {
          throw new Error('Failed to send text message');
        }
      }

      // Send file messages for each uploaded file
      for (const file of uploadedFiles) {
        const fileResponse = await fetch('/api/appointment-chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appointmentId,
            content: file.fileName,
            messageType: file.messageType as "image" | "video" | "file",
            attachments: [{
              url: file.url,
              fileName: file.fileName,
              fileSize: file.fileSize,
            }],
          }),
        });

        if (!fileResponse.ok) {
          throw new Error(`Failed to send file message: ${file.fileName}`);
        }
      }

      setNewMessage('');
      setUploadedFiles([]);
      setShowFileUpload(false);
      
      // Fetch latest messages to ensure consistency
      setTimeout(() => {
        fetchMessages();
      }, 500);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    } finally {
      setIsSending(false);
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

  const isDoctor = (senderId: string) => {
    // Check if the sender is the current user (doctor/veterinarian) using refId
    return (session?.user as any)?.refId === senderId;
  };

  return (
    <Card className="shadow-lg border-0 bg-white overflow-hidden h-[600px] flex flex-col">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-white">
              Chat with {parentName || "Pet Parent"}
            </CardTitle>
            {/* <p className="text-teal-100 text-sm">Real-time communication</p> */}
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 border-2 border-white/30">
              <AvatarImage src={parentImage} alt={parentName || "Pet Parent"} />
              <AvatarFallback className="text-xs">
                {parentName
                  ? parentName
                      .split(" ")
                      .map((n) => n.charAt(0))
                      .join("")
                  : "PP"}
              </AvatarFallback>
            </Avatar>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <CardContent className="p-0 overflow-hidden">
        <div ref={messagesContainerRef} className="h-full overflow-y-auto p-4 pb-8 space-y-4">
          {isLoading && messages.length === 0 && (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              <span className="ml-2 text-gray-600">Loading messages...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex gap-3 ${
                isDoctor(message.senderId) ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage
                  src={message.senderImage || ""}
                  alt={message.senderName}
                />
                <AvatarFallback className="text-xs">
                  {message.senderName
                    .split(" ")
                    .map((n) => n.charAt(0))
                    .join("")}
                </AvatarFallback>
              </Avatar>
{/* text message color is black  theis for message text color and all */}
              <div
                className={`max-w-[70%] ${
                  isDoctor(message.senderId) ? "text-right" : "text-left"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!isDoctor(message.senderId) && (
                    <span className="text-xs font-medium text-gray-600">
                      {message.senderName}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTime(message.createdAt)}
                  </span>
                  {isDoctor(message.senderId) && (
                    <span className="text-xs font-medium text-gray-600">
                      You
                    </span>
                  )}
                </div>

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isDoctor(message.senderId)
                      ? "bg-gradient-to-r from-gray-500 to-blue-600 text-white"
                      : message.messageType === "assessment" ||
                        message.messageType === "prescription"
                      ? "bg-gradient-to-r from-gray-50 to-emerald-50 border border-green-200"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.messageType === "assessment" ||
                  message.messageType === "prescription" ? (
                    <div className="space-y-2">
                      <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">
                        {message.messageType === "assessment"
                          ? "Assessment"
                          : "Prescription"}
                      </Badge>
                      <div className="text-sm text-green-900 whitespace-pre-line">
                        {message.content}
                      </div>
                    </div>
                  ) : message.messageType === "image" || message.messageType === "video" || message.messageType === "file" ? (
                    <div className="space-y-2">
                      {message.attachments && message.attachments.map((attachment, index) => {
                        // Only render if URL is valid
                        if (typeof attachment.url !== 'string' || !attachment.url) {
                          return null;
                        }
                        
                        return (
                          <MessageAttachment
                            key={index}
                            url={attachment.url}
                            fileName={attachment.fileName}
                            messageType={message.messageType as "image" | "video" | "file"}
                            fileSize={attachment.fileSize}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="max-h-32 overflow-y-auto text-start">
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>
                  )}
                </div>

                {isDoctor(message.senderId) && (
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

          {isSending && (
            <div className="flex gap-3 flex-row-reverse mb-8">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={session?.user?.image || ""} alt="You" />
                <AvatarFallback className="text-xs">
                  {session?.user?.name?.split(" ").map((n: string) => n.charAt(0)).join("") || "U"}
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
        {/* File Upload Section */}
        {showFileUpload && (
          <div className="mb-4">
            <ChatFileUpload
              appointmentId={appointmentId}
              onFileUploaded={handleFileUploaded}
              onError={(error) => setError(error)}
              disabled={isSending}
            />
          </div>
        )}

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Files to send:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUploadedFiles([])}
                className="text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2">
                    {file.messageType === 'image' && <Image className="w-4 h-4 text-blue-600" />}
                    {file.messageType === 'video' && <Video className="w-4 h-4 text-purple-600" />}
                    {file.messageType === 'file' && <File className="w-4 h-4 text-gray-600" />}
                    <span className="text-sm text-gray-700 truncate">{file.fileName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFileUpload(!showFileUpload)}
              className="border-gray-300 hover:bg-gray-100"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="border-gray-300 hover:bg-gray-100"
            >
              <Smile className="w-4 h-4" />
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
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && uploadedFiles.length === 0) || isSending}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
