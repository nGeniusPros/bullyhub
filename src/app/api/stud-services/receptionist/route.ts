import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the AI stud receptionist
const SYSTEM_PROMPT = `
You are an AI stud receptionist for a dog breeding service specializing in Bulldogs.
Your role is to provide helpful, professional information about stud services to potential customers.

Key responsibilities:
1. Answer questions about the stud dog (health, temperament, color, lineage)
2. Provide information about stud fees and the breeding process
3. Check availability for breeding dates
4. Explain health testing and requirements for females
5. Collect basic information from interested customers

Always be polite, professional, and knowledgeable about Bulldogs.
If you don't know specific details about a particular stud dog, ask for clarification or suggest contacting the breeder directly.

When responding:
- Keep answers concise but informative
- Suggest follow-up questions when appropriate
- Collect customer contact information when they express serious interest
- Emphasize the importance of health testing and responsible breeding
- Never make up information about specific dogs if it's not provided to you
`;

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Parse the request body
    const { studServiceId, message, conversationId } = await request.json();

    if (!studServiceId || !message) {
      return NextResponse.json(
        { error: "Both studServiceId and message are required" },
        { status: 400 }
      );
    }

    // Get the stud service details
    const { data: studService, error: studServiceError } = await supabase
      .from("stud_services")
      .select(
        `
        *,
        stud:dogs(
          id,
          name,
          breed,
          color,
          date_of_birth,
          owner_id,
          profiles:owner_id(first_name, last_name)
        )
      `
      )
      .eq("id", studServiceId)
      .single();

    if (studServiceError || !studService) {
      console.error("Error fetching stud service:", studServiceError);
      return NextResponse.json(
        { error: "Stud service not found" },
        { status: 404 }
      );
    }

    // Generate AI response using the stud service details
    return generateAIResponse(studService, message, conversationId);
  } catch (error) {
    console.error("Error in stud receptionist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateAIResponse(
  studService: any,
  message: string,
  conversationId?: string
) {
  try {
    // Get conversation history if conversationId is provided
    let conversationHistory = [];

    if (conversationId) {
      // In a real implementation, we would fetch the conversation history from the database
      // For now, we'll use an empty history
      conversationHistory = [];
    }

    // Create a prompt with stud service details
    const studDetails = `
    Stud Dog Information:
    - Name: ${studService.stud.name}
    - Breed: ${studService.stud.breed}
    - Color: ${studService.stud.color}
    - Age: ${calculateAge(studService.stud.date_of_birth)}
    - Owner: ${studService.stud.profiles.first_name} ${
      studService.stud.profiles.last_name
    }
    - Stud Fee: $${studService.fee}
    - Description: ${studService.description}
    - Currently Available: ${studService.availability ? "Yes" : "No"}
    `;

    // Prepare messages for OpenAI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT + "\n\n" + studDetails },
      ...conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;

    // Extract suggested questions (if any)
    const suggestedQuestions = extractSuggestedQuestions(aiResponse);

    // Extract availability info (if any)
    const availabilityInfo = extractAvailabilityInfo(
      aiResponse,
      studService.availability
    );

    // Extract pricing info (if any)
    const pricingInfo = {
      fee: studService.fee,
      additionalFees: [],
    };

    // Extract health info (if any)
    const healthInfo = {
      healthTests: ["DNA Health Panel", "OFA Hip Evaluation"],
      clearances: ["BOAS Assessment", "Cardiac Evaluation"],
    };

    // Save the conversation to the database (in a real implementation)
    // ...

    return NextResponse.json({
      message: aiResponse,
      suggestedQuestions,
      availabilityInfo,
      pricing: pricingInfo,
      healthInfo,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth: string): string {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }

  return `${years} years old`;
}

// Helper function to extract suggested questions from AI response
function extractSuggestedQuestions(response: string): string[] {
  // This is a simple implementation - in a real app, you might use more sophisticated parsing
  const questions = [];

  // Look for lines that end with question marks
  const lines = response.split("\n");
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.endsWith("?") && trimmedLine.length > 10) {
      questions.push(trimmedLine);
    }
  }

  // Limit to 3 questions
  return questions.slice(0, 3);
}

// Helper function to extract availability info from AI response
function extractAvailabilityInfo(response: string, isAvailable: boolean): any {
  return {
    isAvailable,
    nextAvailableDate: isAvailable ? "Immediately" : "2023-12-15",
    bookingInstructions: isAvailable
      ? "Contact the breeder to schedule a breeding date"
      : "This stud is currently unavailable. Check back later or contact the breeder for more information.",
  };
}
