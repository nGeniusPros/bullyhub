// Stud Services Feature - Stud Receptionist Function
import { createResponse, handleOptions } from "../../../netlify/utils/cors-headers.js";
import { supabase } from "../../../netlify/utils/supabase-client.js";
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

Always be professional, courteous, and knowledgeable. If you don't know something, say so rather than making up information.
Suggest follow-up questions that might be helpful for the customer.

At the end of your response, include 2-3 suggested follow-up questions that the customer might want to ask.
Format these as a numbered list with the heading "Suggested Questions:".
`;

/**
 * Handler for the stud receptionist function
 */
export const handler = async (event, context) => {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { studServiceId, message, conversationId } = data;

    if (!studServiceId || !message) {
      return createResponse(400, { error: "Both studServiceId and message are required" });
    }

    // Get the stud service details
    const { data: studService, error: studServiceError } = await supabase
      .from("stud_services")
      .select(`
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
      `)
      .eq("id", studServiceId)
      .single();

    if (studServiceError || !studService) {
      console.error("Error fetching stud service:", studServiceError);
      return createResponse(404, { error: "Stud service not found" });
    }

    // Generate AI response
    const aiResponse = await generateAIResponse(studService, message, conversationId);
    return aiResponse;
  } catch (error) {
    console.error("Error in stud receptionist:", error);
    return createResponse(500, { error: "Internal server error" });
  }
};

/**
 * Generate AI response based on stud service details and user message
 */
async function generateAIResponse(studService, message, conversationId) {
  try {
    // Get conversation history if conversationId is provided
    let conversationHistory = [];

    if (conversationId) {
      const { data: conversation, error: conversationError } = await supabase
        .from("stud_receptionist_conversations")
        .select("messages")
        .eq("id", conversationId)
        .single();

      if (!conversationError && conversation) {
        conversationHistory = conversation.messages;
      }
    }

    // Calculate dog's age
    const calculateAge = (dateOfBirth) => {
      if (!dateOfBirth) return "Unknown";
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years`;
    };

    // Create a prompt with stud service details
    const studDetails = `
    Stud Dog Information:
    - Name: ${studService.stud.name}
    - Breed: ${studService.stud.breed}
    - Color: ${studService.stud.color}
    - Age: ${calculateAge(studService.stud.date_of_birth)}
    - Owner: ${studService.stud.profiles.first_name} ${studService.stud.profiles.last_name}
    
    Stud Service Information:
    - Fee: $${studService.fee}
    - Availability: ${studService.availability ? "Available" : "Not available at this time"}
    - Description: ${studService.description || "No additional description provided"}
    
    Health Requirements for Female Dogs:
    - Up-to-date vaccinations
    - Negative brucellosis test within 30 days of breeding
    - Health clearances appropriate for the breed
    - Female must be in good health and condition
    
    Breeding Process:
    - Initial consultation and compatibility assessment
    - Health verification for both dogs
    - Timing coordination based on female's cycle
    - Multiple breeding attempts may be arranged as needed
    - Follow-up support and pregnancy confirmation
    `;

    // Prepare messages for the AI
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: studDetails },
    ];

    // Add conversation history
    conversationHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add the current message
    messages.push({ role: "user", content: message });

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      max_tokens: 1000,
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;

    // Extract suggested questions (if any)
    const suggestedQuestions = extractSuggestedQuestions(aiResponse);

    // Extract availability info (if any)
    const availabilityInfo = extractAvailabilityInfo(aiResponse, studService.availability);

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

    // Save the conversation to the database
    await saveConversation(studService.id, message, aiResponse, conversationId);

    return createResponse(200, {
      message: aiResponse,
      suggestedQuestions,
      availabilityInfo,
      pricing: pricingInfo,
      healthInfo,
    });
  } catch (error) {
    console.error("Error generating AI response:", error);
    return createResponse(500, { error: "Failed to generate AI response" });
  }
}

/**
 * Extract suggested questions from AI response
 */
function extractSuggestedQuestions(response) {
  try {
    const suggestedQuestionsRegex = /Suggested Questions:[\s\n]+((?:\d+\.\s+[^\n]+[\n]?)+)/i;
    const match = response.match(suggestedQuestionsRegex);
    
    if (match && match[1]) {
      const questionsText = match[1];
      const questionLines = questionsText.split(/\n/).filter(line => line.trim() !== '');
      
      return questionLines.map(line => {
        // Remove the number and any leading/trailing whitespace
        return line.replace(/^\d+\.\s+/, '').trim();
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error extracting suggested questions:", error);
    return [];
  }
}

/**
 * Extract availability information from AI response
 */
function extractAvailabilityInfo(response, defaultAvailability) {
  try {
    const isAvailable = defaultAvailability;
    let nextAvailableDate = null;
    let bookingInstructions = null;

    // Look for next available date in the response
    const dateRegex = /(available|open)(?:\s+for\s+booking)?(?:\s+on|\s+from)?\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,\s+\d{4})?)/i;
    const dateMatch = response.match(dateRegex);
    
    if (dateMatch && dateMatch[2]) {
      nextAvailableDate = dateMatch[2];
    }

    // Look for booking instructions
    const instructionsRegex = /(to\s+book|booking\s+process|schedule\s+a\s+breeding)[^.!?]*[.!?]/i;
    const instructionsMatch = response.match(instructionsRegex);
    
    if (instructionsMatch && instructionsMatch[0]) {
      bookingInstructions = instructionsMatch[0].trim();
    }

    return {
      isAvailable,
      nextAvailableDate,
      bookingInstructions,
    };
  } catch (error) {
    console.error("Error extracting availability info:", error);
    return {
      isAvailable: defaultAvailability,
      nextAvailableDate: null,
      bookingInstructions: null,
    };
  }
}

/**
 * Save conversation to the database
 */
async function saveConversation(studServiceId, userMessage, aiResponse, conversationId) {
  try {
    const timestamp = new Date().toISOString();
    
    if (conversationId) {
      // Update existing conversation
      const { data: conversation, error: getError } = await supabase
        .from("stud_receptionist_conversations")
        .select("messages")
        .eq("id", conversationId)
        .single();
      
      if (getError) {
        console.error("Error fetching conversation:", getError);
        return;
      }
      
      const updatedMessages = [
        ...conversation.messages,
        { role: "user", content: userMessage, timestamp },
        { role: "assistant", content: aiResponse, timestamp },
      ];
      
      const { error: updateError } = await supabase
        .from("stud_receptionist_conversations")
        .update({
          messages: updatedMessages,
          updated_at: timestamp,
        })
        .eq("id", conversationId);
      
      if (updateError) {
        console.error("Error updating conversation:", updateError);
      }
    } else {
      // Create new conversation
      const { error: insertError } = await supabase
        .from("stud_receptionist_conversations")
        .insert({
          stud_service_id: studServiceId,
          messages: [
            { role: "user", content: userMessage, timestamp },
            { role: "assistant", content: aiResponse, timestamp },
          ],
          status: "active",
          created_at: timestamp,
          updated_at: timestamp,
        });
      
      if (insertError) {
        console.error("Error creating conversation:", insertError);
      }
    }
  } catch (error) {
    console.error("Error saving conversation:", error);
  }
}
