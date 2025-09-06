"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { MdFlipCameraIos } from "react-icons/md";
import {
  FaComments,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPalette,
  FaPhoneSlash,
  FaVideoSlash,
} from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCheck, File, Image, Loader2, Paperclip, Send, Video, X } from "lucide-react";
import ChatFileUpload from "@/components/shared/ChatFileUpload";
import MessageAttachment from "@/components/shared/MessageAttachment";
import pusherClient from "@/lib/pusherClient";

interface VideoCallControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  onSwitchCamera: () => void;
  onApplyVirtualBackground?: (background: string) => void;
  selectedBackground: string | null;
  isVirtualBackgroundSupported: boolean;
  isProcessingVirtualBg?: boolean;
  userRole: string;
  appointmentId: string;
  otherPartyName?: string;
  otherPartyImage?: string;
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
interface VirtualBackground {
  id: string;
  name: string;
  type: "image" | "blur" | "color";
  value: string;
  icon: React.ReactNode;
  preview?: string;
}
const VIRTUAL_BACKGROUNDS = [
  {
    id: 1,
    name: "Blur",
    url: "blur",
    image: "/images/how-it-works/SecondImg.webp",
  },
  {
    id: 2,
    name: "Office",
    url: "/images/donate-page/Texture.webp",
    image: "/images/donate-page/Texture.webp",
  },
  {
    id: 3,
    name: "Beach",
    url: "/images/mission/dog.webp",
    image: "/images/mission/dog.webp",
  },
  {
    id: 4,
    name: "Nature",
    url: "/images/about/About1.webp",
    image: "/images/about/About1.webp",
  },
  {
    id: 5,
    name: "Space",
    url: "/images/how-it-works/PrincipalImgWorks.webp",
    image: "/images/how-it-works/PrincipalImgWorks.webp",
  },
  { id: 6, name: "None", url: "none", image: "/images/Logo.svg" },
];
// Convert VIRTUAL_BACKGROUNDS to VirtualBackground format
const virtualBackgrounds: VirtualBackground[] = VIRTUAL_BACKGROUNDS.map(
  (bg) => {
    if (bg.url === "blur") {
      return {
        id: bg.id.toString(),
        name: bg.name,
        type: "blur" as const,
        value: "blur",
        icon: <FaPalette className="w-5 h-5" />,
        preview: bg.image,
      };
    } else if (bg.url === "none") {
      return {
        id: bg.id.toString(),
        name: bg.name,
        type: "image" as const,
        value: "none",
        icon: <FaImage className="w-5 h-5" />,
        preview: bg.image,
      };
    } else {
      return {
        id: bg.id.toString(),
        name: bg.name,
        type: "image" as const,
        value: bg.url,
        icon: <FaImage className="w-5 h-5" />,
        preview: bg.image,
      };
    }
  }
);
const VideoCallControls: React.FC<VideoCallControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
  onSwitchCamera,
  onApplyVirtualBackground,
  selectedBackground,
  isVirtualBackgroundSupported,
  isProcessingVirtualBg = false,
  userRole,
  appointmentId,
  otherPartyName = userRole === "veterinarian" ? "Pet Parent" : "Doctor",
  otherPartyImage,
}) => {
  const { data: session } = useSession();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  console.log("userRole", userRole);
  
  // Helper functions for chat
  const isAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
  };

  // Handle scroll events to determine if we should auto-scroll
  const handleScroll = () => {
    setShouldAutoScroll(isAtBottom());
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };
  
  // Fetch messages on component mount and when appointmentId changes
  useEffect(() => {
    if (appointmentId && isChatModalOpen) {
      fetchMessages(true); // Initial fetch
    }
  }, [appointmentId, isChatModalOpen]);
  
  // Auto-scroll when messages change
  useEffect(() => {
    // Only auto-scroll if user is at bottom or if it's the first load
    if (shouldAutoScroll || messages.length === 0) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Set up Pusher for real-time messages
  useEffect(() => {
    if (!appointmentId) return;

    // Subscribe to the appointment's channel
    const channel = pusherClient.subscribe(`appointment-${appointmentId}`);
    
    // Listen for new messages - add directly instead of refetching all
    channel.bind('new-message', (data: { message: Message }) => {
      if (data.message) {
        setMessages(prev => {
          // Check if this is a message from the current user (replace optimistic message)
          const isCurrentUser = data.message.senderId === (session?.user as any)?.refId;
          
          if (isCurrentUser) {
            // Replace optimistic messages with real message
            return prev.filter(msg => !msg._id.startsWith('temp-')).concat(data.message);
          } else {
            // Add new message from other user
            return [...prev, data.message];
          }
        });
        
        // Auto-open chat modal when receiving a new message from someone else
        const isCurrentUser = data.message.senderId === (session?.user as any)?.refId;
        if (!isCurrentUser && !isChatModalOpen) {
          setIsChatModalOpen(true);
        }
      }
    });

    // Listen for typing events
    channel.bind('typing-start', (data: { userId: string, userName: string }) => {
      const isCurrentUser = data.userId === (session?.user as any)?.refId;
      if (!isCurrentUser) {
        setOtherUserTyping(true);
      }
    });

    channel.bind('typing-stop', (data: { userId: string }) => {
      const isCurrentUser = data.userId === (session?.user as any)?.refId;
      if (!isCurrentUser) {
        setOtherUserTyping(false);
      }
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`appointment-${appointmentId}`);
      
      // Cleanup typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Send typing stop event on unmount
      if (isTyping && appointmentId) {
        fetch('/api/appointment-chat/typing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId,
            userId: (session?.user as any)?.refId,
            action: 'stop'
          })
        }).catch(console.error);
      }
    };
  }, [appointmentId]);
  
  const fetchMessages = async (isInitial = false) => {
    if (!appointmentId) return;
    
    try {
      if (isInitial) {
        setIsInitialLoading(true);
      } else {
        setIsLoading(true);
      }
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
      if (isInitial) {
        setIsInitialLoading(false);
      } else {
        setIsLoading(false);
      }
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

    const currentUserId = (session?.user as any)?.refId;
    const currentUserName = session?.user?.name || 'You';
    const currentUserImage = session?.user?.image || undefined;

    try {
      setError(null);

      // Force auto-scroll when user sends a message
      setShouldAutoScroll(true);

      // Create optimistic messages for instant display
      const optimisticMessages: Message[] = [];

      // Add optimistic text message if there's text content
      if (newMessage.trim()) {
        const optimisticTextMessage: Message = {
          _id: `temp-${Date.now()}-text`,
          senderId: currentUserId,
          senderName: currentUserName,
          senderImage: currentUserImage,
          content: newMessage.trim(),
          messageType: 'text',
          isRead: false,
          isDelivered: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        optimisticMessages.push(optimisticTextMessage);
      }

      // Add optimistic file messages for each uploaded file
      uploadedFiles.forEach((file, index) => {
        const optimisticFileMessage: Message = {
          _id: `temp-${Date.now()}-file-${index}`,
          senderId: currentUserId,
          senderName: currentUserName,
          senderImage: currentUserImage,
          content: file.fileName,
          messageType: file.messageType as "image" | "video" | "file",
          attachments: [{
            url: file.url,
            fileName: file.fileName,
            fileSize: file.fileSize,
          }],
          isRead: false,
          isDelivered: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        optimisticMessages.push(optimisticFileMessage);
      });

      // Add optimistic messages to state immediately
      setMessages(prev => [...prev, ...optimisticMessages]);

      // Clear input fields immediately
      setNewMessage('');
      setUploadedFiles([]);
      setShowFileUpload(false);

      // Send messages to API in background
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

      // Remove optimistic messages when real messages arrive via Pusher
      // The Pusher update will replace the optimistic messages with real ones
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      
      // Remove optimistic messages on error
      setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Typing indicator functions
  const sendTypingStart = () => {
    if (!isTyping && appointmentId) {
      setIsTyping(true);
      fetch('/api/appointment-chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          userId: (session?.user as any)?.refId,
          userName: session?.user?.name || 'You',
          action: 'start'
        })
      }).catch(console.error);
    }
  };

  const sendTypingStop = () => {
    if (isTyping && appointmentId) {
      setIsTyping(false);
      fetch('/api/appointment-chat/typing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          userId: (session?.user as any)?.refId,
          action: 'stop'
        })
      }).catch(console.error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    
    // Send typing start event
    sendTypingStart();
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingStop();
    }, 2000);
  };
  
  return (
    <>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center gap-4 bg-black/30 backdrop-blur-md rounded-full px-6 py-3 border border-white/10 shadow-2xl">
          <Button
            onClick={onToggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
              isAudioEnabled
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            }`}
          >
            {isAudioEnabled ? (
              <FaMicrophone className="text-white text-base" />
            ) : (
              <FaMicrophoneSlash className="text-white text-base" />
            )}
          </Button>

          <Button
            onClick={onEndCall}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaPhoneSlash className="text-white text-base" />
          </Button>

          <Button
            onClick={onToggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl ${
              isVideoEnabled
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            }`}
          >
            {isVideoEnabled ? (
              <FaVideoSlash className="text-white text-base" />
            ) : (
              <FaVideoSlash className="text-white text-base" />
            )}
          </Button>

          <Button
            onClick={onSwitchCamera}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MdFlipCameraIos className="text-white text-base" />
          </Button>

          {/* Chat Button */}
          <Button
            onClick={() => setIsChatModalOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <FaComments className="text-white text-base" />
          </Button>

          {/* Virtual Background Button for Desktop */}
          {isVirtualBackgroundSupported && (
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              {/* <SheetTrigger asChild>
                <Button className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                  <FaImage className="text-white text-base" />
                </Button>
              </SheetTrigger> */}
              <SheetContent
                side="bottom"
                className="h-[80vh] bg-black/95 backdrop-blur-md border-t border-white/20"
              >
                <SheetHeader className="text-left">
                  <SheetTitle className="text-white text-xl font-semibold flex items-center gap-2">
                    <FaImage className="w-5 h-5 text-blue-400" />
                    Virtual Backgrounds
                  </SheetTitle>
                  <p className="text-white/60 text-sm">
                    Choose a beautiful background to enhance your video call
                    experience
                  </p>
                </SheetHeader>

                <ScrollArea className="h-[77vh] pb-14">
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {virtualBackgrounds.map((background) => (
                        <div
                          key={background.id}
                          onClick={() =>
                            !isProcessingVirtualBg &&
                            onApplyVirtualBackground?.(background.value)
                          }
                          className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                            selectedBackground === background.value
                              ? "ring-2 ring-blue-400 ring-offset-2 ring-offset-black"
                              : "hover:ring-2 hover:ring-white/30"
                          } ${
                            isProcessingVirtualBg
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          style={{
                            pointerEvents: isProcessingVirtualBg
                              ? "none"
                              : "auto",
                          }}
                        >
                          {/* Background Preview */}
                          <div className="aspect-video relative">
                            {background.type === "image" && background.preview ? (
                              <img
                                src={background.preview}
                                alt={background.name}
                                className="w-full h-full object-cover"
                              />
                            ) : background.type === "color" ? (
                              <div
                                className="w-full h-full"
                                style={{ background: background.value }}
                              />
                            ) : background.type === "blur" ? (
                              <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                <div className="text-white/80 text-xs">
                                  Blur Effect
                                </div>
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <div className="text-white/60 text-xs">
                                  No Background
                                </div>
                              </div>
                            )}

                            {/* Overlay with icon and name */}
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                              <div className="text-white mb-1">
                                {background.icon}
                              </div>
                              <p className="text-white text-xs font-medium text-center px-2">
                                {background.name}
                              </p>
                            </div>

                            {/* Selected indicator or loading indicator */}
                            {selectedBackground === background.value && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                {isProcessingVirtualBg ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <svg
                                    className="w-4 h-4 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Additional Controls */}
                    <div className="pt-4 border-t border-white/10">
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={onSwitchCamera}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                        >
                          <AiOutlineCamera className="w-4 h-4 mr-2" />
                          Switch Camera
                        </Button>
                        <Button
                          onClick={() => setIsDrawerOpen(false)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Done
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          )}

          {/* Mobile Menu Button - Show for mobile devices when virtual backgrounds are supported */}
          {isVirtualBackgroundSupported &&
            userRole &&
            userRole === "veterinarian" && (
              <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetTrigger asChild>
                  <Button className="md:hidden w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                    <HiDotsHorizontal className="text-white text-base" />
                  </Button>
                </SheetTrigger>
              </Sheet>
            )}
        </div>
      </div>

      {/* Chat Modal */}
      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className="bg-white border border-gray-200 text-gray-900 max-w-md shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <FaComments className="w-5 h-5 text-indigo-600" />
              Chat with {otherPartyName}
            </DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {/* Chat messages area */}
            <div 
              ref={messagesContainerRef}
              className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto border border-gray-200"
            >
              {isInitialLoading && messages.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  <span className="ml-2 text-gray-600">Loading messages...</span>
                </div>
              )}
              
              {!isInitialLoading && messages.length === 0 && (
                <div className="flex items-center justify-center h-32">
                  <span className="text-gray-500">No messages yet</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                {messages.map((message) => {
                  // Fix the isCurrentUser logic to correctly check based on user role
                  const isCurrentUser = message.senderId === (session?.user as any)?.refId;
                    
                  return (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${isCurrentUser ? "justify-end" : ""}`}
                    >
                      {!isCurrentUser && (
                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                          {message.senderName?.charAt(0) || (userRole === "veterinarian" ? "P" : "V")}
                        </div>
                      )}
                      
                      <div className={`flex-1 ${isCurrentUser ? "flex justify-end" : ""}`}>
                        <div 
                          className={`rounded-lg p-3 max-w-[80%] ${isCurrentUser 
                            ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                            : message.messageType === "assessment" || message.messageType === "prescription" 
                              ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg text-gray-800" 
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.messageType === "assessment" || message.messageType === "prescription" ? (
                            <div className="space-y-2">
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs font-medium">
                                {message.messageType === "assessment" ? "📋 Data Assessment" : "💊 Prescription"}
                              </Badge>
                              <div className="text-sm whitespace-pre-line leading-relaxed text-gray-800">
                                {message.content}
                              </div>
                            </div>
                          ) : message.messageType === "image" || message.messageType === "video" || message.messageType === "file" ? (
                            <div className="space-y-2">
                              {message.attachments && message.attachments.map((attachment, index) => {
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
                                    className=""
                                  />
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {new Date(message.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        
                        {isCurrentUser && (
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
                      
                      {isCurrentUser && (
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                          {session?.user?.name?.charAt(0) || "Y"}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Typing indicator */}
                {otherUserTyping && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                      {userRole === "veterinarian" ? "P" : "V"}
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
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
            </div>
            
            {/* File Upload Section */}
            {showFileUpload && (
              <div className="mb-4">
                <ChatFileUpload
                  appointmentId={appointmentId}
                  onFileUploaded={(fileUrl, fileName, messageType, fileSize) => {
                    setUploadedFiles(prev => [...prev, { url: fileUrl, fileName, messageType, fileSize }]);
                  }}
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
                        onClick={() => {
                          setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat input */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFileUpload(!showFileUpload)}
                className="border-gray-300 hover:bg-gray-100 text-gray-700"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <Input
                value={newMessage}
                onChange={handleTyping}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    // Stop typing indicator when sending
                    if (typingTimeoutRef.current) {
                      clearTimeout(typingTimeoutRef.current);
                    }
                    sendTypingStop();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && uploadedFiles.length === 0)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Close button */}
            <Button
              onClick={() => setIsChatModalOpen(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoCallControls;
