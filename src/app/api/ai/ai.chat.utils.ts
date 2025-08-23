import { ChatConversation, IChatBotMessage } from "@/models/ChatConversation";

export const saveConversation = async ({
  sessionId,
  userId,
  userName,
  userEmail,
  userMessage,
  assistantMessage,
  requiresHumanSupport,
  tags = [],
}: {
  sessionId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userMessage: string;
  assistantMessage: string;
  requiresHumanSupport: boolean;
  tags?: string[];
}) => {
  try {
    // Find existing conversation or create new one
    let conversation = await ChatConversation.findOne({ sessionId });

    const userMessageDoc: IChatBotMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    };

    const assistantMessageDoc: IChatBotMessage = {
      role: "assistant",
      content: assistantMessage,
      timestamp: new Date(),
      requiresHumanSupport,
    };

    if (conversation) {
      // Update existing conversation
      conversation.messages.push(userMessageDoc, assistantMessageDoc);
      conversation.requiresHumanSupport =
        conversation.requiresHumanSupport || requiresHumanSupport;
      conversation.tags = [...new Set([...conversation.tags, ...tags])];
      await conversation.save();
    } else {
      // Create new conversation
      conversation = new ChatConversation({
        sessionId,
        userId,
        userName,
        userEmail,
        messages: [userMessageDoc, assistantMessageDoc],
        requiresHumanSupport,
        tags,
      });
      await conversation.save();
    }
  } catch (error) {
    console.error("Error saving conversation:", error);
    // Don't throw error to avoid breaking the chat functionality
  }
};
export const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};
