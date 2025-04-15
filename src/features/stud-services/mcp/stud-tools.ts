// Stud Services Feature - MCP Tools
import { z } from "zod";
import { studServiceQueries } from "../data/queries";
import { calculateAge } from "@/lib/utils";

/**
 * MCP tools for stud services feature
 * These tools allow AI models to interact with stud service data
 */
export const studServiceTools = [
  {
    name: "fetch-stud-services",
    description: "Fetch available stud services",
    parameters: {
      type: "object",
      properties: {
        ownerId: { type: "string", description: "Optional owner ID to filter by" },
      },
      required: []
    },
    handler: async ({ ownerId }) => {
      try {
        let services;
        if (ownerId) {
          services = await studServiceQueries.getStudServicesByOwner(ownerId);
        } else {
          services = await studServiceQueries.getAllStudServices();
        }
        
        // Filter to only available services if no owner specified
        if (!ownerId) {
          services = services.filter(service => service.availability);
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(services, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching stud services: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "get-stud-service-details",
    description: "Get detailed information about a specific stud service",
    parameters: {
      type: "object",
      properties: {
        serviceId: { type: "string" },
      },
      required: ["serviceId"]
    },
    handler: async ({ serviceId }) => {
      try {
        const service = await studServiceQueries.getStudService(serviceId);
        
        if (!service) {
          return {
            content: [
              {
                type: "text",
                text: `No stud service found with ID: ${serviceId}`
              }
            ],
            isError: true
          };
        }
        
        // Format the response in a more readable way
        const formattedResponse = `
          # Stud Service Details
          
          ## Stud Dog Information
          **Name:** ${service.stud?.name || "Unknown"}
          **Breed:** ${service.stud?.breed || "Unknown"}
          **Color:** ${service.stud?.color || "Unknown"}
          ${service.stud?.dateOfBirth ? `**Age:** ${calculateAge(service.stud.dateOfBirth)}` : ""}
          
          ## Service Information
          **Fee:** $${service.fee.toFixed(2)}
          **Availability:** ${service.availability ? "Available" : "Not Available"}
          ${service.description ? `**Description:** ${service.description}` : ""}
          
          ## Owner Information
          **Owner:** ${service.stud?.owner ? `${service.stud.owner.firstName} ${service.stud.owner.lastName}` : "Unknown"}
          ${service.stud?.owner?.email ? `**Contact:** ${service.stud.owner.email}` : ""}
        `;
        
        return {
          content: [
            {
              type: "text",
              text: formattedResponse
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching stud service details: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "analyze-stud-compatibility",
    description: "Analyze compatibility between a stud and a female dog",
    parameters: {
      type: "object",
      properties: {
        studId: { type: "string" },
        femaleId: { type: "string" },
      },
      required: ["studId", "femaleId"]
    },
    handler: async ({ studId, femaleId }) => {
      try {
        // In a real implementation, we would fetch both dogs' details,
        // including health records, DNA tests, and pedigree information
        // For now, we'll return a mock analysis
        
        return {
          content: [
            {
              type: "text",
              text: `
                # Stud Compatibility Analysis
                
                ## Overall Compatibility
                Based on the available information, these dogs appear to be **moderately compatible**.
                
                ## Health Considerations
                - No concerning health issues detected in either dog
                - Both dogs have passed basic health clearances
                - Recommend additional testing for breed-specific conditions
                
                ## Genetic Considerations
                - Color compatibility: Good match for producing desired colors
                - Inbreeding coefficient: Low (3.2%)
                - Genetic diversity: Good
                
                ## Structural Considerations
                - Complementary body structures
                - Female's head type balances well with stud's
                - Size difference is within acceptable range
                
                ## Recommendations
                1. Proceed with additional health testing
                2. Consider a trial mating agreement
                3. Discuss specific goals with a breeding advisor
              `
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error analyzing stud compatibility: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "get-stud-bookings",
    description: "Get bookings for a specific stud service",
    parameters: {
      type: "object",
      properties: {
        serviceId: { type: "string" },
      },
      required: ["serviceId"]
    },
    handler: async ({ serviceId }) => {
      try {
        const bookings = await studServiceQueries.getStudBookings(serviceId);
        
        if (bookings.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No bookings found for this stud service."
              }
            ]
          };
        }
        
        // Format the response in a more readable way
        const formattedResponse = `
          # Stud Service Bookings
          
          Found ${bookings.length} booking(s) for this stud service:
          
          ${bookings.map((booking, index) => `
          ## Booking ${index + 1}
          **Status:** ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          **Female Dog:** ${booking.femaleDog?.name || "Unknown"} (${booking.femaleDog?.breed || "Unknown"}, ${booking.femaleDog?.color || "Unknown"})
          **Client:** ${booking.client ? `${booking.client.firstName} ${booking.client.lastName}` : "Unknown"}
          ${booking.scheduledDate ? `**Scheduled Date:** ${new Date(booking.scheduledDate).toLocaleDateString()}` : ""}
          ${booking.notes ? `**Notes:** ${booking.notes}` : ""}
          `).join('\n')}
        `;
        
        return {
          content: [
            {
              type: "text",
              text: formattedResponse
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching stud bookings: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  }
];
