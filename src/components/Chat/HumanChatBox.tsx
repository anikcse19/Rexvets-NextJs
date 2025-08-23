"use client";

import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import {
  FaCircle,
  FaFileAudio,
  FaFileVideo,
  FaImage,
  FaMicrophone,
  FaPaperclip,
  FaPaperPlane,
  FaPhone,
  FaRobot,
  FaStop,
  FaTimes,
  FaUser,
  FaVideo,
} from "react-icons/fa";

// Type definitions
interface UploadedFile {
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface Message {
  id: number;
  sender: "user" | "assistant";
  content: string;
  files?: UploadedFile[];
  timestamp: string;
  status?: "sending" | "sent" | "delivered";
}
interface IProps {
  name?: string | null;
  email?: string | null;
  sessionId?: string | null;
}
const HumanChatBox: React.FC<IProps> = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "assistant",
      content:
        "Hello! Welcome to Rexvet. I'm here to help you with all your veterinary needs. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "delivered",
    },
  ]);
  const [showFileOptions, setShowFileOptions] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Simulated file upload handler
  const handleFileUploadProcessing = async (file: File): Promise<string> => {
    // Simulate file upload
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(file));
      }, 1000);
    });
  };

  // Simulated voice call handler
  const handleVoiceCall = () => {
    console.log("Initiating voice call...");
    // Add your voice call implementation here
  };

  // Simulated video call handler
  const handleVideoCall = () => {
    console.log("Initiating video call...");
    // Add your video call implementation here
  };

  const handleSendMessage = useCallback(() => {
    if (message.trim() || uploadedFiles.length > 0) {
      const newMessage: Message = {
        id: Date.now(),
        sender: "user",
        content: message.trim(),
        files: uploadedFiles,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sending",
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setUploadedFiles([]);
      setIsTyping(true);

      // Simulate message status updates
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
          )
        );
      }, 500);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
          )
        );
      }, 1000);

      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          sender: "assistant",
          content:
            "Thank you for reaching out to Rexvet! Our veterinary experts are reviewing your message and will provide you with professional guidance shortly. Is there anything specific about your pet that you'd like me to know?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "delivered",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 2000);
    }
  }, [message, uploadedFiles]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleFileUpload = useCallback(
    async (type: "image" | "audio" | "video" | "file") => {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;

      const acceptTypes: Record<string, string> = {
        image: "image/*",
        audio: "audio/*",
        video: "video/*",
        file: "*",
      };

      input.accept = acceptTypes[type];

      input.onchange = async (e: Event) => {
        const target = e.target as HTMLInputElement;
        const files = Array.from(target.files || []);

        for (const file of files) {
          const newFile: UploadedFile = {
            name: file.name,
            type: file.type,
            size: file.size,
          };

          try {
            newFile.url = await handleFileUploadProcessing(file);
          } catch (error) {
            console.error("File upload failed:", error);
          }

          setUploadedFiles((prev) => [...prev, newFile]);
        }
      };

      input.click();
      setShowFileOptions(false);
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleRecording = useCallback(() => {
    setIsRecording((prev) => !prev);
    // In a real implementation, you'd handle audio recording here
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string): JSX.Element => {
    if (type.startsWith("image/"))
      return <FaImage className="text-green-500" />;
    if (type.startsWith("audio/"))
      return <FaFileAudio className="text-purple-500" />;
    if (type.startsWith("video/"))
      return <FaFileVideo className="text-red-500" />;
    return <FaPaperclip className="text-gray-500" />;
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(async (file) => {
      const newFile: UploadedFile = {
        name: file.name,
        type: file.type,
        size: file.size,
      };

      try {
        newFile.url = await handleFileUploadProcessing(file);
      } catch (error) {
        console.error("File upload failed:", error);
      }

      setUploadedFiles((prev) => [...prev, newFile]);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src="https://www.rexvet.org/images/Logo-CUtVNW5R.svg"
                alt="Rexvet Logo"
                className="h-12 w-12 bg-white rounded-full p-2 shadow-lg"
              />
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-400"
              ></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text">
                Rexvet Support
              </h1>
              <p className="text-blue-100 text-sm flex items-center gap-2">
                <FaCircle
                  className="w-2 h-2 text-green-300"
                />
                Online - Professional Veterinary Care
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleVoiceCall}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              title="Voice Call"
            >
              <FaPhone className="text-white w-4 h-4" />
            </button>
            <button
              onClick={handleVideoCall}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 hover:scale-110 backdrop-blur-sm"
              title="Video Call"
            >
              <FaVideo className="text-white w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white relative ${
          isDragging ? "bg-blue-50 border-2 border-dashed border-blue-300" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-blue-50/80 flex items-center justify-center z-10 backdrop-blur-sm">
            <div className="text-blue-600 text-center">
              <FaPaperclip className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-semibold">Drop files here to upload</p>
            </div>
          </div>
        )}

        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.sender === "user" ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                {msg.sender === "user" ? (
                  <FaUser className="text-white w-4 h-4" />
                ) : (
                  <FaRobot className="text-gray-600 w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-xs lg:max-w-md ${
                  msg.sender === "user" ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
                  }`}
                >
                  {msg.files && msg.files.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {msg.files.map((file, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            msg.sender === "user"
                              ? "bg-blue-400/30"
                              : "bg-gray-100"
                          }`}
                        >
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                              {file.name}
                            </p>
                            <p
                              className={`text-xs ${
                                msg.sender === "user"
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.content && (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}
                </div>
                <div
                  className={`flex items-center gap-2 mt-1 px-1 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <p className="text-xs text-gray-500">{msg.timestamp}</p>
                  {msg.sender === "user" && msg.status && (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        msg.status === "sending"
                          ? "bg-gray-400"
                          : msg.status === "sent"
                          ? "bg-blue-400"
                          : "bg-green-400"
                      }`}
                      title={msg.status}
                    ></div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <FaRobot className="text-gray-600 w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
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
        </div>
        <div ref={chatEndRef} />
      </div>

      {/* File Upload Preview */}
      {uploadedFiles.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm"
              >
                {getFileIcon(file.type)}
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="ml-3 text-gray-400 hover:text-red-500 transition-colors duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="flex items-end gap-3">
          {/* File Upload Options */}
          <div className="relative">
            <button
              onClick={() => setShowFileOptions(!showFileOptions)}
              className={`p-3 rounded-full transition-all duration-200 ${
                showFileOptions
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
              }`}
              title="Attach files"
            >
              <FaPaperclip className="w-5 h-5" />
            </button>

            {showFileOptions && (
              <div className="absolute bottom-16 left-0 bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-1 w-48 z-10">
                <button
                  onClick={() => handleFileUpload("image")}
                  className="flex items-center gap-3 w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors duration-200"
                >
                  <FaImage className="text-green-500 w-5 h-5" />
                  <span className="font-medium">Images</span>
                </button>
                <button
                  onClick={() => handleFileUpload("audio")}
                  className="flex items-center gap-3 w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors duration-200"
                >
                  <FaFileAudio className="text-purple-500 w-5 h-5" />
                  <span className="font-medium">Audio</span>
                </button>
                <button
                  onClick={() => handleFileUpload("video")}
                  className="flex items-center gap-3 w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors duration-200"
                >
                  <FaFileVideo className="text-red-500 w-5 h-5" />
                  <span className="font-medium">Video</span>
                </button>
                <button
                  onClick={() => handleFileUpload("file")}
                  className="flex items-center gap-3 w-full text-left p-3 hover:bg-gray-50 rounded-lg text-sm transition-colors duration-200"
                >
                  <FaPaperclip className="text-gray-500 w-5 h-5" />
                  <span className="font-medium">Documents</span>
                </button>
              </div>
            )}
          </div>

          {/* Voice Recording */}
          <button
            onClick={toggleRecording}
            className={`p-3 rounded-full transition-all duration-200 ${
              isRecording
                ? "bg-red-100 text-red-600 animate-pulse"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title={isRecording ? "Stop recording" : "Start voice recording"}
          >
            {isRecording ? (
              <FaStop className="w-5 h-5" />
            ) : (
              <FaMicrophone className="w-5 h-5" />
            )}
          </button>

          {/* Message Input */}
          <div
            className={`flex-1 relative bg-gray-50 rounded-2xl border-2 transition-colors duration-200 ${
              isTextareaFocused ? "border-blue-500 bg-white" : "border-gray-200"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsTextareaFocused(true)}
              onBlur={() => setIsTextareaFocused(false)}
              placeholder="Type your message here..."
              className="w-full px-4 py-3 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500"
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && uploadedFiles.length === 0}
            className={`p-3 rounded-full transition-all duration-200 ${
              message.trim() || uploadedFiles.length > 0
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            title="Send message"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HumanChatBox);
