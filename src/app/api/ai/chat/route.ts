// app/api/ai/chat/route.ts
import { faqData } from "@/lib/data";
import { NextRequest } from "next/server";
import OpenAI from "openai";

const token = process.env.GITHUB_TOKE_NV3;
const endpoint = "https://models.github.ai/inference";
const modelName = "openai/gpt-4o";

// Consultation state interface
interface ConsultationState {
  isActive: boolean;
  currentQuestion: string;
  collectedData: {
    petType?: string;
    symptoms?: string[];
    duration?: string;
    severity?: string;
    eatingDrinking?: string;
    behaviorChanges?: string;
    previousConditions?: string;
    currentMedications?: string;
  };
}

const systemPrompt = `You are Rex Vet's AI Assistant, a knowledgeable and compassionate virtual support specialist for a veterinary telehealth platform. Your primary role is to assist pet parents, veterinarians, and potential users with comprehensive information about Rex Vet's services while maintaining the highest standards of professionalism and care.

CORE RESPONSIBILITIES:
1. Provide accurate information about Rex Vet's telehealth services, pricing structure, and company policies
2. Utilize the comprehensive FAQ knowledge base to address common inquiries
3. When users describe pet health issues, automatically detect this and initiate a structured consultation process
4. Ask ONE relevant follow-up question at a time to gather necessary information about the pet's condition
5. After gathering sufficient information, provide appropriate advice based on the severity of symptoms
6. For emergency situations, immediately direct users to seek in-person emergency care
7. Always emphasize that you provide general information, not medical diagnoses

HEALTH CONSULTATION PROTOCOL:
- When a user describes a health concern, initiate a consultation by asking ONE question at a time
- Gather information about: pet type, symptoms, duration, severity, eating/drinking habits, behavior changes, medical history, and current medications
- After gathering sufficient information, provide appropriate advice
- For emergency situations, immediately direct users to seek in-person emergency care
- Always maintain a compassionate, professional tone

CRITICAL PROTOCOLS:
- For emergency situations: Immediately direct users to emergency veterinary care
- For prescription inquiries: Explain prescription availability depends on state regulations
- For treatment advice: Clarify that specific recommendations require consultation with licensed veterinarians
- Always prioritize pet safety and well-being above all other considerations

Remember: You are a support tool designed to enhance the Rex Vet experience, not replace professional veterinary care.`;

// Simple health keyword detection as fallback
function isHealthRelatedFallback(text: string): boolean {
  const healthKeywords = [
    "sick",
    "not feeling well",
    "vomit",
    "throw up",
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
    "temperature",
    "swelling",
    "lump",
    "bump",
    "scratching",
    "itching",
    "redness",
    "discharge",
    "whining",
    "crying",
    "whimpering",
  ];

  return healthKeywords.some((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

export async function POST(req: NextRequest) {
  try {
    const {
      question,
      conversationHistory = [],
      consultationState,
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

    const client = new OpenAI({ baseURL: endpoint, apiKey: token });

    // If we have an active consultation, handle it with the AI
    if (consultationState?.isActive) {
      const messages = [
        {
          role: "system",
          content:
            systemPrompt +
            "\n\nYou are currently in a health consultation. Ask ONE relevant follow-up question based on the user's response and the information you've already gathered. Only ask for one piece of information at a time." +
            "\n\nCurrent consultation data: " +
            JSON.stringify(consultationState.collectedData) +
            "\n\nPrevious question: " +
            consultationState.currentQuestion,
        },
        ...conversationHistory,
        {
          role: "user",
          content: question,
        },
      ];

      const response = await client.chat.completions.create({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 300,
      });

      // Safely extract the AI response
      const aiResponse =
        response.choices?.[0]?.message?.content ||
        "I apologize, I'm having trouble processing your response. Could you please provide more details?";

      // Update collected data based on the previous question
      const updatedData = { ...consultationState.collectedData };
      const previousQuestion = consultationState.currentQuestion.toLowerCase();

      if (
        previousQuestion.includes("type of pet") ||
        previousQuestion.includes("what kind of pet")
      ) {
        updatedData.petType = question;
      } else if (
        previousQuestion.includes("symptom") ||
        previousQuestion.includes("noticing")
      ) {
        updatedData.symptoms = [...(updatedData.symptoms || []), question];
      } else if (
        previousQuestion.includes("how long") ||
        previousQuestion.includes("duration")
      ) {
        updatedData.duration = question;
      } else if (
        previousQuestion.includes("severity") ||
        previousQuestion.includes("scale")
      ) {
        updatedData.severity = question;
      } else if (
        previousQuestion.includes("eating") ||
        previousQuestion.includes("drinking")
      ) {
        updatedData.eatingDrinking = question;
      } else if (
        previousQuestion.includes("behavior") ||
        previousQuestion.includes("energy")
      ) {
        updatedData.behaviorChanges = question;
      } else if (
        previousQuestion.includes("previous") ||
        previousQuestion.includes("medical history")
      ) {
        updatedData.previousConditions = question;
      } else if (
        previousQuestion.includes("medication") ||
        previousQuestion.includes("supplement")
      ) {
        updatedData.currentMedications = question;
      }

      // Check if we have enough information to provide advice
      const hasSufficientInfo =
        updatedData.petType &&
        updatedData.symptoms &&
        updatedData.symptoms.length > 0 &&
        updatedData.duration &&
        updatedData.severity;

      // Check if this is an emergency situation
      const isEmergency =
        (updatedData.severity && parseInt(updatedData.severity) >= 8) ||
        (updatedData.symptoms &&
          updatedData.symptoms.some((s: string) =>
            [
              "bleeding",
              "difficulty breathing",
              "unconscious",
              "seizure",
              "collapse",
            ].some((emergencyTerm) => s.toLowerCase().includes(emergencyTerm))
          ));

      if (isEmergency) {
        const completedConsultation = {
          isActive: false,
          currentQuestion: "",
          collectedData: updatedData,
        };

        const emergencyResponse = `Based on the symptoms you've described (${updatedData.symptoms?.join(
          ", "
        )}), which you've rated as severe (${
          updatedData.severity
        }/10), I strongly recommend contacting an emergency veterinary clinic immediately. Your ${
          updatedData.petType
        } may need urgent medical attention that cannot be provided through telehealth.\n\nPlease proceed to the nearest emergency veterinary hospital or call them for guidance.`;

        return new Response(
          JSON.stringify({
            response: emergencyResponse,
            consultationState: completedConsultation,
            isComplete: true,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (hasSufficientInfo) {
        const completedConsultation = {
          isActive: false,
          currentQuestion: "",
          collectedData: updatedData,
        };

        // Generate appropriate advice based on the collected information
        const severity = parseInt(updatedData.severity || "3");

        let advice = "";
        if (severity >= 5) {
          advice = `Thank you for providing details about your ${
            updatedData.petType
          }. Based on the symptoms (${updatedData.symptoms?.join(
            ", "
          )}) that have been ongoing for ${
            updatedData.duration
          }, I recommend scheduling a consultation with a veterinarian within the next 24-48 hours.\n\nIn the meantime:\n1. Keep your ${
            updatedData.petType
          } comfortable and rested\n2. Ensure they have access to fresh water\n3. Monitor for any changes in symptoms\n4. Avoid giving any human medications unless directed by a veterinarian\n\nWould you like me to help you book a telehealth appointment?`;
        } else {
          advice = `Thank you for the information about your ${
            updatedData.petType
          }. Based on the mild symptoms you've described (${updatedData.symptoms?.join(
            ", "
          )}), here's what I recommend:\n\n1. Continue monitoring your ${
            updatedData.petType
          } closely\n2. Ensure they're eating, drinking, and eliminating normally\n3. Provide a quiet, comfortable resting area\n4. Watch for any changes or worsening of symptoms\n\nIf symptoms persist for more than 24-48 hours or worsen, please schedule a consultation with one of our veterinarians. Would you like me to help you book an appointment?`;
        }

        return new Response(
          JSON.stringify({
            response: advice,
            consultationState: completedConsultation,
            isComplete: true,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Continue with the next question
      const updatedConsultation = {
        isActive: true,
        currentQuestion: aiResponse,
        collectedData: updatedData,
      };

      return new Response(
        JSON.stringify({
          response: aiResponse,
          consultationState: updatedConsultation,
          isComplete: false,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let isHealthRelated = false;

    // Try to use AI for health detection, but fall back to keyword matching if it fails
    try {
      // Check if this is a health-related question using AI
      const healthCheckMessages = [
        {
          role: "system",
          content: `Analyze the user's message and determine if it describes a pet health issue that requires a consultation. 
          Respond with ONLY "true" if it's a health issue, or "false" if it's not. 
          Health issues include: symptoms, illnesses, injuries, behavioral changes, or any concern about a pet's wellbeing.`,
        },
        {
          role: "user",
          content: question,
        },
      ];

      const healthCheckResponse = await client.chat.completions.create({
        model: modelName,
        messages: healthCheckMessages,
        temperature: 0.1,
        max_tokens: 10,
      });

      // Safely extract the health check response
      const healthCheckResult =
        healthCheckResponse.choices?.[0]?.message?.content || "";
      isHealthRelated = healthCheckResult.toLowerCase().includes("true");
    } catch (error) {
      console.error("Health check AI failed, using fallback:", error);
      // Fall back to keyword detection if AI health check fails
      isHealthRelated = isHealthRelatedFallback(question);
    }

    // If this is a new health problem, start consultation
    if (isHealthRelated) {
      const consultationStartMessage =
        "I understand you're concerned about your pet's health. Let me help you with that. To give you the best advice, I need to ask you a few questions.";

      const newConsultation: ConsultationState = {
        isActive: true,
        currentQuestion: "First, what type of pet do you have?",
        collectedData: {},
      };

      return new Response(
        JSON.stringify({
          response:
            consultationStartMessage + " " + newConsultation.currentQuestion,
          consultationState: newConsultation,
          isComplete: false,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Regular FAQ-based response
    const messages = [
      {
        role: "system",
        content:
          systemPrompt +
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
      // Try to get a streamed response first
      const stream = await client.chat.completions.create({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200,
        stream: true,
      });

      const encoder = new TextEncoder();
      const reader = stream[Symbol.asyncIterator]();

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of reader) {
                const text = chunk.choices?.[0]?.delta?.content || "";
                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              }
              controller.close();
            } catch (error) {
              console.error("Stream error:", error);
              controller.error(error);
            }
          },
          cancel() {
            reader.return?.();
          },
        }),
        {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "X-Professional-Service": "Rex-Vet-AI-Support",
            "Cache-Control": "no-cache",
          },
        }
      );
    } catch (streamError) {
      console.error("Stream failed, using regular response:", streamError);

      // Fall back to non-streamed response if streaming fails
      const response = await client.chat.completions.create({
        model: modelName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200,
      });

      const aiResponse =
        response.choices?.[0]?.message?.content ||
        "I apologize, I'm having trouble processing your request. Please try again.";

      return new Response(
        JSON.stringify({
          response: aiResponse,
          consultationState: null,
          isComplete: false,
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
