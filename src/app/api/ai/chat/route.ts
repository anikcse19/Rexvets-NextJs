// app/api/ai/chat/route.ts
import { authOptions } from "@/lib/auth";
import { faqData } from "@/lib/data";
import { connectToDatabase } from "@/lib/mongoose";
import { ChatConversation } from "@/models/ChatConversation";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { generateSessionId, saveConversation } from "../ai.chat.utils";

// Rex Vet Team Information
const rexVetTeam = {
  leadership: {
    chipLabel: "👑 Leadership",
    title: "Exploring Our Leadership",
    subtitle:
      "Meet the visionary leaders driving innovation in veterinary care",
    leaders: [
      {
        name: "Tiffany Delacruz",
        title: "Chief Executive Officer",
        description:
          "Tiffany Delacruz, the CEO of Rex Vets, is a licensed veterinarian with a profound dedication to preventive medicine, striving to enhance the well-being of pets. With extensive experience in veterinary practice, Tiffany possesses a comprehensive understanding of the concerns of pet owners and their beloved companions. Under her astute leadership, Rex Vets has emerged as a renowned entity in the veterinary realm.",
        image: "/images/our-team/CEO.webp",
        icon: "School",
        gradient: "accent",
      },
      {
        name: "Johnny Dominguez",
        title: "Founder",
        description:
          "Johnny Dominguez is the visionary founder behind Rex Vets. With a doctorate in computer science philosophy and a lifelong love for animals, Johnny set out to reimagine how pet families access care. Driven by a passion for innovation and compassion, he built Rex Vets to make veterinary support more accessible, especially for those who need it most.",
        image: "/images/our-team/Founder.webp",
        icon: "Psychology",
        gradient: "secondary",
      },
    ],
  },
};

const systemPrompt = `You are Rex Vet's AI Support Assistant, a knowledgeable and professional virtual support specialist for a veterinary telehealth platform. Your primary role is to assist pet parents, veterinarians, and potential users with comprehensive information about Rex Vet's services while maintaining the highest standards of professionalism.

CORE RESPONSIBILITIES:
1. Provide accurate information about Rex Vet's telehealth services, pricing structure, and company policies
2. Utilize the comprehensive FAQ knowledge base to address common inquiries
3. Assist with account-related questions, technical issues, and general platform guidance
4. Direct users to appropriate resources or human support when needed
5. Explain service features, appointment booking process, and platform functionality
6. Provide information about Rex Vet's leadership team and company background when asked

REX VET LEADERSHIP TEAM INFORMATION:
${JSON.stringify(rexVetTeam.leadership, null, 2)}

IMPORTANT PROTOCOLS:
- For health-related questions: Politely direct users to schedule a consultation with licensed veterinarians
- For emergency situations: Immediately direct users to seek in-person emergency veterinary care
- For prescription inquiries: Explain prescription availability depends on state regulations
- Always emphasize that you provide general information and platform support, not medical advice
- Maintain a helpful, professional, and compassionate tone at all times
- If a user requests to speak with a human agent, acknowledge their request and inform them they'll be connected to a human representative
- Personalize responses when user information is available

CRITICAL BOUNDARIES:
- DO NOT provide any medical advice, diagnoses, or treatment recommendations
- DO NOT ask health-related follow-up questions about pets' conditions
- DO NOT attempt to assess symptoms or severity of medical issues
- Immediately redirect any health concerns to professional veterinary consultation

Remember: You are a support tool designed to enhance the Rex Vet experience and provide platform assistance, not replace professional veterinary care.`;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase(); // Connect to MongoDB

    // Check if user is authenticated
    const session: Session | null = await getServerSession(authOptions as any);

    const {
      question,
      conversationHistory = [],
      userName,
      userEmail,
      sessionId: clientSessionId,
    } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({
          error: "Question is required",
          suggestion:
            "Please provide details about how we can assist you today",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Generate or use existing session ID
    const sessionId = clientSessionId || generateSessionId();

    // Add user info to system prompt if available
    let enhancedSystemPrompt = systemPrompt;
    if (userName || userEmail) {
      enhancedSystemPrompt += `\n\nCURRENT USER INFORMATION:\n- Name: ${
        userName || "Not provided"
      }\n- Email: ${
        userEmail || "Not provided"
      }\n- Authenticated: ${!!session}`;

      // Add personalized greeting instruction
      enhancedSystemPrompt += `\n\nPERSONALIZATION GUIDELINES:\n- If user provides their name, you may use it to personalize responses (e.g., "Thank you, ${userName}!")\n- Maintain professionalism while being personable\n- Do not overuse personal information - only when appropriate for context`;
    }

    // Check if user is requesting to speak with a human agent
    const humanAgentKeywords = [
      "human",
      "agent",
      "representative",
      "person",
      "real person",
      "live agent",
      "talk to someone",
      "speak with someone",
      "customer service",
      "support agent",
      "human support",
    ];

    const isRequestingHuman = humanAgentKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isRequestingHuman) {
      // Personalize the response if we have user info
      let responseMessage =
        "I understand you'd like to speak with a human representative. I'll connect you with our support team who can provide personalized assistance.";

      if (userName) {
        responseMessage = `I understand you'd like to speak with a human representative, ${userName}. I'll connect you with our support team who can provide personalized assistance.`;
      }

      responseMessage +=
        " Please hold while I transfer you, or you can email us directly at support@rexvet.com.";

      // Save the conversation
      await saveConversation({
        sessionId,
        userId: (session?.user as any)?.id,
        userName: userName || "Unknown",
        userEmail: userEmail || "unknown@example.com",
        userMessage: question,
        assistantMessage: responseMessage,
        requiresHumanSupport: true,
      });

      return new Response(
        JSON.stringify({
          response: responseMessage,
          requiresHumanSupport: true,
          sessionId, // Send session ID back to client
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Health-related query detection for redirection
    const healthKeywords = [
      "sick",
      "vomit",
      "diarrhea",
      "lethargic",
      "not eating",
      "limping",
      "pain",
      "hurt",
      "injury",
      "wound",
      "bleeding",
      "coughing",
      "sneezing",
      "breathing",
      "eye",
      "ear",
      "skin",
      "rash",
      "allergy",
      "infection",
      "behavior change",
      "emergency",
      "urgent",
      "fever",
      "swelling",
      "lump",
      "scratching",
      "itching",
      "redness",
      "discharge",
    ];

    const isHealthRelated = healthKeywords.some((keyword) =>
      question.toLowerCase().includes(keyword.toLowerCase())
    );

    if (isHealthRelated) {
      let responseMessage =
        "I understand you have concerns about your pet's health. For medical questions, symptoms, or health concerns, I recommend scheduling a consultation with one of our licensed veterinarians.";

      if (userName) {
        responseMessage = `I understand you have concerns about your pet's health, ${userName}. For medical questions, symptoms, or health concerns, I recommend scheduling a consultation with one of our licensed veterinarians.`;
      }

      responseMessage +=
        " I'd be happy to help you with platform questions, account assistance, or general information about our services. How else can I assist you today?";

      // Save the conversation
      await saveConversation({
        sessionId,
        userId: (session?.user as any)?.id,
        userName: userName || "Unknown",
        userEmail: userEmail || "unknown@example.com",
        userMessage: question,
        assistantMessage: responseMessage,
        requiresHumanSupport: false,
        tags: ["health-related"],
      });

      return new Response(
        JSON.stringify({
          response: responseMessage,
          requiresHumanSupport: false,
          sessionId, // Send session ID back to client
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prepare messages for OpenRouter
    const messages = [
      {
        role: "system",
        content:
          enhancedSystemPrompt +
          "\n\nKNOWLEDGE BASE:\n" +
          JSON.stringify(faqData, null, 2),
      },
      ...conversationHistory,
      {
        role: "user",
        content: question,
      },
    ];

    try {
      // Use OpenRouter API instead of OpenAI
      const openRouterResponse = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "HTTP-Referer": process.env.SITE_URL || "https://rexvet.com",
            "X-Title": process.env.SITE_NAME || "Rex Vet AI Assistant",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: messages,
            temperature: 0.7,
            max_tokens: 800,
          }),
        }
      );

      if (!openRouterResponse.ok) {
        const errorText = await openRouterResponse.text();
        console.error(
          "OpenRouter API error:",
          openRouterResponse.status,
          errorText
        );
        throw new Error(
          `OpenRouter API error: ${openRouterResponse.status} ${errorText}`
        );
      }

      const responseData = await openRouterResponse.json();

      // Handle different possible response structures from OpenRouter
      let aiResponse =
        "I apologize, I'm having trouble processing your request. Please try again or contact our support team at support@rexvet.com.";

      if (
        responseData.choices &&
        responseData.choices[0] &&
        responseData.choices[0].message
      ) {
        aiResponse = responseData.choices[0].message.content || aiResponse;
      } else if (responseData.message) {
        // Some models might return message directly
        aiResponse = responseData.message;
      } else if (responseData.error) {
        // Handle error responses
        aiResponse = `I'm experiencing technical difficulties: ${
          responseData.error.message || "Unknown error"
        }. Please contact support@rexvet.com.`;
      }

      // Check if the AI response indicates a need for human support
      const requiresHumanFromAI =
        aiResponse.includes("human agent") ||
        aiResponse.includes("contact support") ||
        aiResponse.includes("representative") ||
        aiResponse.includes("support team");

      // Save the conversation
      await saveConversation({
        sessionId,
        userId: (session?.user as any)?.id,
        userName: userName || "Unknown",
        userEmail: userEmail || "unknown@example.com",
        userMessage: question,
        assistantMessage: aiResponse,
        requiresHumanSupport: requiresHumanFromAI,
        tags: requiresHumanFromAI ? ["human-support-requested"] : [],
      });

      return new Response(
        JSON.stringify({
          response: aiResponse,
          requiresHumanSupport: requiresHumanFromAI,
          sessionId, // Send session ID back to client
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (apiError) {
      console.error("OpenRouter API Error:", apiError);

      // Fallback response if API fails
      let errorResponse =
        "I'm currently experiencing technical difficulties. Please try again shortly or contact our support team at support@rexvet.com for immediate assistance.";

      if (userName) {
        errorResponse = `I'm currently experiencing technical difficulties, ${userName}. Please try again shortly or contact our support team at support@rexvet.com for immediate assistance.`;
      }

      // Save the error conversation
      await saveConversation({
        sessionId,
        userId: (session?.user as any)?.id,
        userName: userName || "Unknown",
        userEmail: userEmail || "unknown@example.com",
        userMessage: question,
        assistantMessage: errorResponse,
        requiresHumanSupport: true,
        tags: ["api-error"],
      });

      return new Response(
        JSON.stringify({
          response: errorResponse,
          requiresHumanSupport: true,
          sessionId, // Send session ID back to client
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        error: "Unable to process your request at this time",
        supportContact: "support@rexvet.com",
        responseTime: "Typically within 1 business day",
        requiresHumanSupport: true,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "30",
        },
      }
    );
  }
}
export const GET = async () => {
  try {
    await connectToDatabase();
    const conv = await ChatConversation.find({});
    return NextResponse.json({ conv });
  } catch (error) {
    console.error("Error fetching chat conversations:", error);
    return NextResponse.json({ error: "Failed to fetch conversations" });
  }
};
