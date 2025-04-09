// netlify/functions/ai-advisor.js
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { createResponse, handleOptions } from "../utils/cors-headers";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for the AI advisor
const SYSTEM_PROMPT = `
You are an AI Bulldog Advisor, a specialized assistant for Bulldog owners and breeders.
Your role is to provide helpful, accurate information about Bulldog care, health, training, and breeding.

Key areas of expertise:
1. Bulldog health issues and management (respiratory, skin, joint problems)
2. Proper care and maintenance (wrinkle cleaning, exercise needs, temperature sensitivity)
3. Nutrition and diet recommendations
4. Training and behavior
5. Breeding best practices and genetics

When responding:
- Keep answers concise but informative
- Suggest follow-up questions when appropriate
- Mention health reminders when relevant
- Emphasize responsible ownership and breeding
- Be friendly and supportive
`;

export async function handler(event, context) {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Method Not Allowed" });
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { message, conversationHistory = [] } = data;

    if (!message) {
      return createResponse(400, { error: "Message is required" });
    }

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 800
    });

    // Extract the response
    const aiResponse = completion.choices[0].message.content;

    // Extract follow-up questions
    const followUpQuestions = extractFollowUpQuestions(aiResponse);

    // Extract health reminders
    const healthReminders = extractHealthReminders(aiResponse);

    // Save the conversation to the database (optional)
    // This would be implemented in a real application
    
    return createResponse(200, {
      message: aiResponse,
      followUpQuestions,
      healthReminders
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return createResponse(500, { error: "Internal Server Error" });
  }
}

// Helper function to extract follow-up questions from AI response
function extractFollowUpQuestions(response) {
  // Look for questions in the response
  const questions = response.match(/(?:\?|🤔)\s*([^.!?\n]+\?)/g) || [];
  return questions
    .map(q => q.trim())
    .filter(q => q.length > 10 && q.length < 100)
    .slice(0, 3);
}

// Helper function to extract health reminders from AI response
function extractHealthReminders(response) {
  // Look for health-related keywords and surrounding context
  const healthKeywords = ['vaccination', 'checkup', 'medication', 'exercise', 'diet', 'grooming'];
  const reminders = [];

  healthKeywords.forEach(keyword => {
    const regex = new RegExp(`[^.!?]*(?:${keyword})[^.!?]*[.!?]`, 'gi');
    const matches = response.match(regex) || [];
    
    matches.forEach(match => {
      if (match.length > 10) {
        reminders.push({
          title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Reminder`,
          description: match.trim(),
          category: keyword,
          priority: match.toLowerCase().includes('important') ? 'high' : 'medium'
        });
      }
    });
  });

  return reminders.slice(0, 2); // Limit to 2 suggestions at a time
}
