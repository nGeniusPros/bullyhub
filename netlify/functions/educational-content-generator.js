// netlify/functions/educational-content-generator.js
import { createResponse, handleOptions } from "../utils/cors-headers";
import { supabase } from "../utils/supabase-client.js";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function handler(event, context) {
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return handleOptions();
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return createResponse(405, { error: "Method Not Allowed" });
  }

  try {
    // Parse the incoming request body
    const data = JSON.parse(event.body);
    const { topic, format, audience, length } = data;

    if (!topic) {
      return createResponse(400, { error: "Topic is required" });
    }

    // Set defaults for optional parameters
    const contentFormat = format || "article";
    const contentAudience = audience || "dog owners";
    const contentLength = length || "medium";

    // Define length in words based on the requested length
    let wordCount;
    switch (contentLength) {
      case "short":
        wordCount = "300-500";
        break;
      case "medium":
        wordCount = "800-1200";
        break;
      case "long":
        wordCount = "1500-2000";
        break;
      default:
        wordCount = "800-1200";
    }

    // Generate the prompt for OpenAI
    const prompt = `
      Create a ${contentFormat} about ${topic} for ${contentAudience}.
      The content should be approximately ${wordCount} words.
      Include factual information, practical advice, and engaging content.
      Format the content with appropriate headings, subheadings, and paragraphs.
      Use a friendly, informative tone that is accessible to the target audience.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert in dog breeding, genetics, and canine health who creates educational content.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
    });

    // Extract the generated content
    const generatedContent = completion.choices[0].message.content;

    // Store the generated content in Supabase
    const { data: storedContent, error } = await supabase
      .from("educational_content")
      .insert([
        {
          topic,
          format: contentFormat,
          audience: contentAudience,
          content: generatedContent,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("Error storing educational content:", error);
      // Continue anyway, just log the error
    }

    return createResponse(200, {
      content: generatedContent,
      id: storedContent?.[0]?.id,
    });
  } catch (error) {
    console.error("Error generating educational content:", error);
    return createResponse(500, { error: "Failed to generate educational content" });
  }
}
