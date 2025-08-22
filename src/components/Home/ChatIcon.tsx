// app/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineChatAlt2,
  HiOutlineHeart,
  HiOutlineMinus,
  HiOutlinePaperAirplane,
  HiOutlineX,
} from "react-icons/hi";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  requiresHumanSupport?: boolean;
  isTeamRelated?: boolean;
};

export default function ChatIcon() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showDonationPanel, setShowDonationPanel] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when chatbot opens for the first time
  useEffect(() => {
    if (showChatbot && messages.length === 0) {
      const welcomeMessage: Message = {
        role: "assistant",
        content:
          "Hello! I'm your Rex Vet support assistant. How can I help you today? 🐾\n\nYou can ask me about our services, appointments, pricing, or learn about our leadership team.",
        timestamp: new Date(),
        requiresHumanSupport: false,
        isTeamRelated: false,
      };
      setMessages([welcomeMessage]);
    }
  }, [showChatbot, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setHasNewMessage(false);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: input,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        requiresHumanSupport: data.requiresHumanSupport,
        isTeamRelated: data.isTeamRelated,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (isMinimized) {
        setHasNewMessage(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again or contact support@rexvet.com for assistance.",
          timestamp: new Date(),
          requiresHumanSupport: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
    setIsMinimized(false);
    setHasNewMessage(false);
  };

  const minimizeChat = () => setIsMinimized(true);
  const maximizeChat = () => {
    setIsMinimized(false);
    setHasNewMessage(false);
  };
  const closeChat = () => {
    setShowChatbot(false);
    setIsMinimized(false);
  };

  // Function to make URLs clickable
  const renderWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chat Icon - Sticky position */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleChatbot}
          className="group bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 relative"
        >
          <HiOutlineChatAlt2 className="w-6 h-6" />
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            ?
          </div>
        </button>
        {/* Tooltip */}
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Need help? Chat with us!
        </div>
      </div>

      {/* Minimized Chat Indicator */}
      {showChatbot && isMinimized && (
        <div className="fixed bottom-6 right-20 z-40">
          <button
            onClick={maximizeChat}
            className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200 flex items-center space-x-2"
          >
            <HiOutlineChatAlt2 className="w-5 h-5" />
            <span className="text-sm font-medium">Rex Vet</span>
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                1
              </div>
            )}
          </button>
        </div>
      )}

      {/* Chatbot Modal */}
      {showChatbot && !isMinimized && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden border">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/Logo.svg"
                  alt="Rex Vet Logo"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Rex Vet Support</h3>
                <p className="text-xs opacity-90">Online now</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDonationPanel(true)}
                className="text-white hover:text-blue-200 p-1 rounded transition-colors"
                title="Support our mission"
              >
                <HiOutlineHeart className="w-4 h-4" />
              </button>
              <button
                onClick={minimizeChat}
                className="text-white hover:text-blue-200 p-1 rounded transition-colors"
              >
                <HiOutlineMinus className="w-4 h-4" />
              </button>
              <button
                onClick={closeChat}
                className="text-white hover:text-blue-200 p-1 rounded transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
          >
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-2 text-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : message.requiresHumanSupport
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-bl-sm"
                        : message.isTeamRelated
                        ? "bg-purple-100 text-purple-800 border border-purple-200 rounded-bl-sm"
                        : "bg-white text-gray-800 shadow-sm rounded-bl-sm border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {renderWithLinks(message.content)}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.role === "user"
                          ? "text-blue-200"
                          : message.requiresHumanSupport
                          ? "text-yellow-600"
                          : message.isTeamRelated
                          ? "text-purple-600"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {message.requiresHumanSupport && (
                        <span className="ml-2">⚠️ Needs human support</span>
                      )}
                      {message.isTeamRelated && (
                        <span className="ml-2">👑 Team info</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Form */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services, pricing, or team..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled: cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <HiOutlinePaperAirplane className="w-4 h-4 transform rotate-45" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2 text-center">
              For health emergencies, contact your nearest vet clinic
              immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
