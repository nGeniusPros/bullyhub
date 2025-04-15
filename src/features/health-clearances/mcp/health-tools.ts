// Health Clearances Feature - MCP Tools
import { z } from "zod";
import { healthClearanceQueries } from "../data/queries";

/**
 * MCP tools for health clearances feature
 * These tools allow AI models to interact with health clearance data
 */
export const healthClearanceTools = [
  {
    name: "fetch-health-clearances",
    description: "Fetch health clearances for a dog",
    parameters: {
      type: "object",
      properties: {
        dogId: { type: "string" },
      },
      required: ["dogId"]
    },
    handler: async ({ dogId }) => {
      try {
        const clearances = await healthClearanceQueries.getDogHealthClearances(dogId);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(clearances, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching health clearances: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "verify-health-clearance",
    description: "Verify a health clearance by verification number",
    parameters: {
      type: "object",
      properties: {
        verificationNumber: { type: "string" },
      },
      required: ["verificationNumber"]
    },
    handler: async ({ verificationNumber }) => {
      try {
        const clearance = await healthClearanceQueries.verifyHealthClearance(verificationNumber);
        
        if (!clearance) {
          return {
            content: [
              {
                type: "text",
                text: `No health clearance found with verification number: ${verificationNumber}`
              }
            ],
            isError: true
          };
        }
        
        // Check if the clearance is expired
        const isExpired = clearance.expiry_date && new Date(clearance.expiry_date) < new Date();
        
        return {
          content: [
            {
              type: "text",
              text: `
                # Health Clearance Verification
                
                **Verification Number:** ${clearance.verification_number}
                **Status:** ${isExpired ? "EXPIRED" : clearance.status.toUpperCase()}
                **Test:** ${clearance.test}
                **Date:** ${clearance.date}
                **Result:** ${clearance.result}
                ${clearance.expiry_date ? `**Expiry Date:** ${clearance.expiry_date}` : ""}
                
                ## Dog Information
                **Name:** ${clearance.dog?.name || "Unknown"}
                **Breed:** ${clearance.dog?.breed || "Unknown"}
                **Color:** ${clearance.dog?.color || "Unknown"}
                
                ${isExpired ? "⚠️ **WARNING:** This health clearance has expired." : ""}
              `
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error verifying health clearance: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "analyze-health-clearances",
    description: "Analyze health clearances for a dog and provide recommendations",
    parameters: {
      type: "object",
      properties: {
        dogId: { type: "string" },
        breed: { type: "string" },
      },
      required: ["dogId", "breed"]
    },
    handler: async ({ dogId, breed }) => {
      try {
        const clearances = await healthClearanceQueries.getDogHealthClearances(dogId);
        
        // Get recommended tests for the breed
        const recommendedTests = getRecommendedTestsForBreed(breed);
        
        // Check which recommended tests are missing
        const existingTests = clearances.map(c => c.test);
        const missingTests = recommendedTests.filter(test => !existingTests.includes(test.name));
        
        // Check for expired clearances
        const now = new Date();
        const expiredClearances = clearances.filter(c => 
          c.expiry_date && new Date(c.expiry_date) < now
        );
        
        // Generate analysis
        const analysis = `
          # Health Clearance Analysis
          
          ## Current Status
          Total Health Clearances: ${clearances.length}
          - Passed: ${clearances.filter(c => c.status === "passed").length}
          - Pending: ${clearances.filter(c => c.status === "pending").length}
          - Failed: ${clearances.filter(c => c.status === "failed").length}
          
          ${expiredClearances.length > 0 ? `
          ## Expired Clearances
          The following clearances have expired and should be renewed:
          ${expiredClearances.map(c => `- ${c.test} (Expired: ${c.expiry_date})`).join("\\n")}
          ` : ""}
          
          ${missingTests.length > 0 ? `
          ## Recommended Tests
          The following tests are recommended for ${breed} but are missing:
          ${missingTests.map(test => `- ${test.name}: ${test.description}`).join("\\n")}
          ` : "All recommended tests for this breed have been completed."}
          
          ## Health Status Summary
          ${generateHealthSummary(clearances, breed)}
        `;
        
        return {
          content: [
            {
              type: "text",
              text: analysis
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error analyzing health clearances: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  }
];

/**
 * Get recommended health tests for a specific breed
 */
function getRecommendedTestsForBreed(breed: string) {
  // This would ideally come from a database of breed-specific health tests
  // For now, we'll use a simple mapping for common breeds
  
  const breedLower = breed.toLowerCase();
  
  if (breedLower.includes("bulldog") || breedLower.includes("bully")) {
    return [
      { name: "BOAS Assessment", description: "Brachycephalic Obstructive Airway Syndrome evaluation" },
      { name: "Cardiac Evaluation", description: "Heart examination by a veterinary cardiologist" },
      { name: "Patella Evaluation", description: "Examination of the knee joints" },
      { name: "Hip Evaluation", description: "X-ray examination of the hip joints" },
      { name: "Tracheal Hypoplasia", description: "Examination of the trachea width" },
      { name: "DNA Test for HUU", description: "Hyperuricosuria genetic test" }
    ];
  }
  
  if (breedLower.includes("retriever") || breedLower.includes("labrador")) {
    return [
      { name: "Hip Evaluation", description: "X-ray examination of the hip joints" },
      { name: "Elbow Evaluation", description: "X-ray examination of the elbow joints" },
      { name: "Eye Examination", description: "Examination by a veterinary ophthalmologist" },
      { name: "EIC DNA Test", description: "Exercise-Induced Collapse genetic test" },
      { name: "PRA DNA Test", description: "Progressive Retinal Atrophy genetic test" }
    ];
  }
  
  // Default recommendations for all breeds
  return [
    { name: "Annual Veterinary Exam", description: "Complete physical examination" },
    { name: "Cardiac Evaluation", description: "Heart examination by a veterinary cardiologist" },
    { name: "DNA Health Panel", description: "Comprehensive genetic health screening" }
  ];
}

/**
 * Generate a health summary based on clearances and breed
 */
function generateHealthSummary(clearances: any[], breed: string) {
  // This would be a more sophisticated analysis in a real implementation
  
  if (clearances.length === 0) {
    return "No health clearances have been recorded yet. We recommend scheduling the appropriate health tests for your dog.";
  }
  
  const passedTests = clearances.filter(c => c.status === "passed").map(c => c.test);
  const failedTests = clearances.filter(c => c.status === "failed").map(c => c.test);
  
  let summary = "";
  
  if (failedTests.length > 0) {
    summary += `Health concerns have been identified in the following areas: ${failedTests.join(", ")}. We recommend consulting with your veterinarian about these results.\n\n`;
  }
  
  if (passedTests.length > 0) {
    summary += `Your dog has passed the following health tests: ${passedTests.join(", ")}.\n\n`;
  }
  
  // Add breed-specific advice
  const breedLower = breed.toLowerCase();
  
  if (breedLower.includes("bulldog") || breedLower.includes("bully")) {
    summary += "Bulldogs often require special attention to respiratory health, temperature regulation, and skin care. Regular monitoring of breathing quality and exercise tolerance is recommended.";
  } else if (breedLower.includes("retriever") || breedLower.includes("labrador")) {
    summary += "Retrievers are generally healthy but can be prone to hip and elbow dysplasia, as well as certain eye conditions. Regular exercise and weight management are important for joint health.";
  } else {
    summary += "Regular veterinary check-ups and preventative care are essential for maintaining your dog's health.";
  }
  
  return summary;
}
