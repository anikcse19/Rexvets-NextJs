"use client";
import { MessageSenderType } from "@/lib";
import {
  File,
  Image,
  Mic,
  MicOff,
  Music,
  Paperclip,
  PawPrint,
  Send,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface IProps {
  receiverId: string; // petParentId if admin, adminId if petParent
  isAdmin?: boolean;
}

interface Message {
  _id?: string;
  text: string;
  sender: "admin" | "petParent";
  timestamp: Date;
  file?: {
    name: string;
    type: string;
    size: number;
    url: string;
  };
}

const ChatBox: React.FC<IProps> = ({ receiverId, isAdmin = true }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingTime, setRecordingTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // ---------- API INTEGRATION ----------
  const fetchMessages = async () => {
    try {
      const adminId = isAdmin ? "ADMIN_OBJECT_ID" : receiverId;
      const petParentId = isAdmin ? receiverId : "PETPARENT_OBJECT_ID";

      const res = await fetch(
        `/api/messages?adminId=${adminId}&petParentId=${petParentId}`
      );
      const data = await res.json();
      if (data.success) {
        setMessages(
          data.data.map((msg: any) => ({
            _id: msg._id,
            text: msg.content,
            sender: msg.senderType,
            timestamp: new Date(msg.createdAt),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [receiverId, isAdmin]);

  const sendMessage = async (content: string) => {
    try {
      const adminId = isAdmin;
      const petParentId = isAdmin ? receiverId : "PETPARENT_OBJECT_ID";

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin: adminId,
          petParent: petParentId,
          senderType: isAdmin
            ? MessageSenderType.Admin
            : MessageSenderType.VetParent,
          content,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const newMessage: Message = {
          _id: data.data._id,
          text: data.data.content,
          sender: data.data.senderType,
          timestamp: new Date(data.data.createdAt),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  // ---------- UI HANDLERS ----------
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    const newMessage: Message = {
      text: `Shared a file: ${file.name}`,
      sender: isAdmin ? "admin" : "petParent",
      timestamp: new Date(),
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
        url: fileUrl,
      },
    };

    setMessages((prev) => [...prev, newMessage]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);

        const newMessage: Message = {
          text: `Voice message (${recordingTime}s)`,
          sender: isAdmin ? "admin" : "petParent",
          timestamp: new Date(),
          file: {
            name: `voice-message-${Date.now()}.wav`,
            type: "audio/wav",
            size: audioBlob.size,
            url: audioUrl,
          },
        };

        setMessages((prev) => [...prev, newMessage]);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="w-4 h-4" />;
    if (type.startsWith("audio/")) return <Music className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // ---------- UI ----------
  return (
    <div className="flex flex-col h-[80vh] w-full bg-white">
      <div className="container h-full max-w-4xl mx-auto flex flex-col shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 sm:p-4 flex items-center space-x-3 text-white">
          <PawPrint className="w-8 h-8 sm:w-10 sm:h-10" />
          <div className="flex-1">
            <h1 className="font-semibold text-base sm:text-lg">
              Vet Care Support
            </h1>
            <p className="text-xs sm:text-sm opacity-90">
              Caring for your pets 24/7
            </p>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50"
          ref={messagesContainerRef}
        >
          {messages.map((message, idx) => (
            <div
              key={message._id || idx}
              className={`flex items-end space-x-2 ${
                message.sender === (isAdmin ? "admin" : "petParent")
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              {message.sender === "admin" && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <PawPrint className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-[70%] p-3 rounded-2xl shadow-md ${
                  message.sender === (isAdmin ? "admin" : "petParent")
                    ? "bg-blue-100 text-blue-900"
                    : "bg-green-100 text-green-900"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">
                  {message.text}
                </p>

                {message.file && (
                  <div className="mt-2 p-2 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex-shrink-0 text-gray-600">
                        {getFileIcon(message.file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate text-gray-800">
                          {message.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(message.file.size)}
                        </p>
                      </div>
                    </div>

                    {message.file.type.startsWith("audio/") && (
                      <audio controls className="w-full mt-2 h-8 sm:h-10">
                        <source
                          src={message.file.url}
                          type={message.file.type}
                        />
                        Your browser does not support the audio element.
                      </audio>
                    )}

                    {message.file.type.startsWith("image/") && (
                      <img
                        src={message.file.url}
                        alt={message.file.name}
                        className="w-full max-h-48 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.sender === (isAdmin ? "admin" : "petParent") && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <span className="text-sm font-bold">YOU</span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div className="px-3 sm:px-4 py-2 bg-red-50 border-t border-red-100 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-700 text-sm">
                  Recording... {recordingTime}s
                </span>
              </div>
              <button
                onClick={stopRecording}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 p-3 sm:p-4">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors group flex-shrink-0"
              title="Attach file"
            >
              <Paperclip className="w-6 h-6 text-gray-600 group-hover:text-gray-800" />
            </button>

            <div className="flex-1">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message about your pet..."
                rows={1}
                className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[48px] shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                style={{
                  height: "auto",
                  minHeight: "48px",
                  maxHeight: "150px",
                }}
              />
            </div>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "hover:bg-gray-100"
              }`}
              title={isRecording ? "Stop recording" : "Start voice recording"}
            >
              {isRecording ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-gray-600 hover:text-gray-800" />
              )}
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors flex-shrink-0 shadow-md"
              title="Send message"
            >
              <Send className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatBox);
