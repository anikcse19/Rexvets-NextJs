import { connectToDatabase } from "@/lib/mongoose";
import { DoctorModel, IDoctorDocument } from "@/models/Doctor";

export interface IVeterinaryMedicalReport {
  petInformation: {
    name: string;
    species: string;
    breed: string;
    age: string;
    gender: string;
    spayedOrNeutered: boolean;
    weightKg: number;
  };
  presentingComplaint: {
    description: string;
    onsetDate: string;
    symptomProgression: string;
  };
  clinicalObservations: {
    vomitingFrequency: string;
    appetite: string;
    behavior: string;
    hydrationStatus: string;
  };
  diagnosis: {
    suspectedCondition: string;
    diagnosticTests: string[];
    labFindings: string;
  };
  treatmentPlan: {
    medications: string[];
    diet: string;
    lifestyleRecommendations: string[];
    followUp: string;
  };
  prognosis: {
    expectedRecovery: string;
    warningSigns: string[];
  };
  notes: string[];
}

const systemPrompt = `You are Rex Vet's AI Assistant, a compassionate, clinically minded, telemedicine-first agent. 
Your role is to conduct step-by-step veterinary intake conversations with pet parents.

BEHAVIOR:
- Empathetic, calm, clear
- Ask ONLY ONE specific question at a time and wait for responses
- Not a substitute for in-person veterinary care - always include a brief disclaimer
- Immediately advise emergency care for red-flag symptoms (seizures, collapse, trauma, severe bleeding, breathing difficulty, toxin ingestion)
- Summarize key points periodically

INTERVIEW FLOW (ASK ONE SPECIFIC QUESTION AT A TIME IN THIS ORDER):
1) Greeting & explain purpose
2) Pet basics: name, species, breed, sex (spayed/neutered?), age, weight
3) Presenting problem in owner's words - ask specifically about symptoms
4) Onset and progression - when did it start, how has it changed
5) Detailed symptoms: ask about vomiting, appetite, behavior, hydration, etc.
6) Risks/exposures: toxins, foreign bodies, diet changes, travel, other sick pets
7) Environment and lifestyle
8) Diet and daily routine
9) Medications, chronic issues, vaccination/deworming status
10) Observations and vitals (if known)
11) Pain/severity scale and goals

CRITICAL: You MUST collect complete information before generating a report. If any field is missing, ask a specific question to get that information.

After collecting ALL information, you will:
1. Summarize the case
2. Assess triage level and telemedicine suitability
3. Suggest care steps and follow-up
4. Create a complete Medical Health Report in JSON format
5. Recommend appropriate veterinarians based on the diagnosis

IMPORTANT: Only generate a report when ALL necessary information has been collected.`;

interface ChatMessage {
  role: string;
  content: string;
}

interface ApiResponse {
  message?: string;
  report?: IVeterinaryMedicalReport | null;
  recommendedDoctors?: IDoctorDocument[] | null;
  error?: string;
}

const hasSufficientInformation = (messages: ChatMessage[]): boolean => {
  const conversationText = messages
    .map((m) => m.content)
    .join(" ")
    .toLowerCase();

  // Check for key information points
  const requiredFields = [
    "species",
    "breed",
    "age",
    "weight",
    "symptom",
    "vomit",
    "appetite",
    "behavior",
    "hydration",
    "onset",
    "start",
    "problem",
  ];

  let foundCount = 0;
  for (const field of requiredFields) {
    if (conversationText.includes(field)) {
      foundCount++;
    }
  }

  // Also check if we have at least 8 user messages with substantial content
  const userMessages = messages.filter((m) => m.role === "user");
  const substantialMessages = userMessages.filter((m) => m.content.length > 10);

  return foundCount >= 6 && substantialMessages.length >= 8;
};

// Function to extract information from conversation
const extractInformationFromConversation = (
  messages: ChatMessage[]
): Partial<IVeterinaryMedicalReport> => {
  const conversationText = messages.map((m) => m.content).join(" ");

  // This is a simplified extraction - in a real application, you'd use more sophisticated NLP
  const extractedInfo: Partial<IVeterinaryMedicalReport> = {
    petInformation: {
      name: extractValue(conversationText, ["name", "called"]),
      species: extractValue(conversationText, ["species", "dog", "cat", "pet"]),
      breed: extractValue(conversationText, ["breed"]),
      age: extractValue(conversationText, ["age", "old", "year"]),
      gender: extractValue(conversationText, ["gender", "male", "female"]),
      spayedOrNeutered:
        conversationText.includes("spayed") ||
        conversationText.includes("neutered"),
      weightKg: extractNumber(conversationText, [
        "weight",
        "kg",
        "pound",
        "lb",
      ]),
    },
    presentingComplaint: {
      description: extractValue(conversationText, [
        "symptom",
        "problem",
        "issue",
        "wrong",
      ]),
      onsetDate: extractValue(conversationText, [
        "start",
        "begin",
        "onset",
        "when",
      ]),
      symptomProgression: extractValue(conversationText, [
        "worse",
        "better",
        "progress",
        "change",
      ]),
    },
    clinicalObservations: {
      vomitingFrequency: extractValue(conversationText, ["vomit", "throw up"]),
      appetite: extractValue(conversationText, ["appetite", "eat", "food"]),
      behavior: extractValue(conversationText, ["behavior", "act", "energy"]),
      hydrationStatus: extractValue(conversationText, [
        "water",
        "drink",
        "hydrat",
      ]),
    },
  };

  return extractedInfo;
};

// Helper function to extract values from text
const extractValue = (text: string, keywords: string[]): string => {
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      // Simple extraction - in a real app, you'd use more sophisticated NLP
      const regex = new RegExp(`${keyword}[\\s:]+([^.,!?]+)`, "i");
      const match = text.match(regex);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
  }
  return "";
};

// Helper function to extract numbers from text
const extractNumber = (text: string, keywords: string[]): number => {
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      const regex = new RegExp(`${keyword}[\\s:]+([0-9]+)`, "i");
      const match = text.match(regex);
      if (match && match[1]) {
        return parseFloat(match[1]);
      }
    }
  }
  return 0;
};

// Function to find relevant veterinarians based on the medical report
const findRelevantVeterinarians = async (
  report: IVeterinaryMedicalReport
): Promise<IDoctorDocument[]> => {
  try {
    await connectToDatabase();

    const { species } = report.petInformation;
    const { suspectedCondition } = report.diagnosis;

    // Build query based on the pet's species and condition
    const query: any = {
      isActive: true,
      isApproved: true,
      available: true,
    };

    // Add species filter if available
    if (species && species.toLowerCase() !== "not provided") {
      query.$or = [
        { treatedSpecies: { $in: [species.toLowerCase()] } },
        { treatedSpecies: { $in: ["all"] } },
        { treatedSpecies: { $exists: false } },
      ];
    }

    // Add specialities filter based on condition if available
    if (
      suspectedCondition &&
      suspectedCondition.toLowerCase() !== "not determined"
    ) {
      // Map conditions to specialities
      const conditionSpecialityMap: Record<string, string[]> = {
        gastrointestinal: ["Internal Medicine", "Gastroenterology"],
        respiratory: ["Internal Medicine", "Pulmonology"],
        dermatology: ["Dermatology"],
        neurological: ["Neurology"],
        urinary: ["Internal Medicine", "Urology"],
        reproductive: ["Reproduction"],
        orthopedic: ["Surgery", "Orthopedics"],
        dental: ["Dentistry"],
        cardiac: ["Cardiology"],
        oncology: ["Oncology"],
        ophthalmology: ["Ophthalmology"],
        behavioral: ["Behavioral Medicine"],
      };

      const conditionLower = suspectedCondition.toLowerCase();
      let relevantSpecialities: string[] = [];

      // Find matching specialities
      for (const [key, specialities] of Object.entries(
        conditionSpecialityMap
      )) {
        if (conditionLower.includes(key)) {
          relevantSpecialities = [...relevantSpecialities, ...specialities];
        }
      }

      // If we found relevant specialities, add to query
      if (relevantSpecialities.length > 0) {
        query.specialities = { $in: relevantSpecialities };
      }
    }

    // Find available veterinarians
    const veterinarians = await DoctorModel.find(query)
      .limit(5) // Limit to 5 results
      .sort({ consultationFee: 1 }); // Sort by consultation fee (lowest first)

    return veterinarians;
  } catch (error) {
    console.error("Error finding veterinarians:", error);
    return [];
  }
};

export async function POST(req: Request): Promise<Response> {
  try {
    const messages: ChatMessage[] = await req.json();

    // Check if we have enough information to generate a report
    const shouldGenerateReport = hasSufficientInformation(messages);

    let prompt: string;

    if (shouldGenerateReport) {
      // Extract information from conversation to help the AI
      const extractedInfo = extractInformationFromConversation(messages);

      prompt = `
      ${systemPrompt}
      
      Based on the following conversation, generate a comprehensive veterinary health report using the IVeterinaryMedicalReport format.
      
      Conversation:
      ${messages.map((m) => `${m.role}: ${m.content}`).join("\n")}
      
      Extracted information:
      ${JSON.stringify(extractedInfo, null, 2)}
      
      Please generate a COMPLETE JSON report with the following structure. Do not leave any fields as "not provided" - use the information from the conversation:
      {
        "petInformation": {
          "name": "string",
          "species": "string",
          "breed": "string",
          "age": "string",
          "gender": "string",
          "spayedOrNeutered": boolean,
          "weightKg": number
        },
        "presentingComplaint": {
          "description": "string",
          "onsetDate": "string",
          "symptomProgression": "string"
        },
        "clinicalObservations": {
          "vomitingFrequency": "string",
          "appetite": "string",
          "behavior": "string",
          "hydrationStatus": "string"
        },
        "diagnosis": {
          "suspectedCondition": "string",
          "diagnosticTests": ["string"],
          "labFindings": "string"
        },
        "treatmentPlan": {
          "medications": ["string"],
          "diet": "string",
          "lifestyleRecommendations": ["string"],
          "followUp": "string"
        },
        "prognosis": {
          "expectedRecovery": "string",
          "warningSigns": ["string"]
        },
        "notes": ["string"]
      }
      
      Also provide a human-readable summary of this report and suggest what type of veterinary specialist would be most appropriate for this case.
      `;
    } else {
      // Continue the conversation - ask just one specific question
      prompt = `
      ${systemPrompt}
      
      Previous conversation:
      ${messages
        .slice(0, -1)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")}
      
      Current user message: ${messages[messages.length - 1].content}
      
      Analyze what information is still missing and ask ONLY ONE specific question to gather the most important missing information.
      Focus on getting complete information about symptoms, onset, and clinical observations.
      `;
    }

    // Prepare the request to OpenRouter
    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.SITE_URL || "",
          "X-Title": process.env.SITE_NAME || "Rex Vet AI Assistant",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1:free",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...messages,
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API error: ${openRouterResponse.statusText}`);
    }

    const openRouterData = await openRouterResponse.json();
    const text = openRouterData.choices[0].message.content;

    if (shouldGenerateReport) {
      // Try to extract JSON from the response
      try {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonString = text.substring(jsonStart, jsonEnd);
        const report: IVeterinaryMedicalReport = JSON.parse(jsonString);

        // Find relevant veterinarians based on the medical report
        const recommendedDoctors = await findRelevantVeterinarians(report);

        const response: ApiResponse = {
          message: text.replace(jsonString, "").trim(),
          report,
          recommendedDoctors:
            recommendedDoctors.length > 0 ? recommendedDoctors : null,
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      } catch (e) {
        console.error("Error parsing JSON from model response:", e);
        // Fallback: return the text response without JSON parsing
        const response: ApiResponse = {
          message: text,
          report: null,
          recommendedDoctors: null,
        };

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
    } else {
      const response: ApiResponse = {
        message: text,
        report: null,
        recommendedDoctors: null,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error:", error);
    const response: ApiResponse = {
      error: "Internal server error",
    };

    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
