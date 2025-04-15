// Dogs Feature - MCP Tools
import { z } from "zod";
import { dogQueries } from "../data/queries";

/**
 * MCP tools for dogs feature
 * These tools allow AI models to interact with dog data
 */
export const dogTools = [
  {
    name: "fetch-dogs",
    description: "Fetch all dogs for a user",
    parameters: {
      type: "object",
      properties: {
        userId: { type: "string" },
      },
      required: ["userId"]
    },
    handler: async ({ userId }) => {
      try {
        const dogs = await dogQueries.getAllDogs(userId);
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(dogs, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching dogs: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "get-dog-details",
    description: "Get detailed information about a specific dog",
    parameters: {
      type: "object",
      properties: {
        dogId: { type: "string" },
      },
      required: ["dogId"]
    },
    handler: async ({ dogId }) => {
      try {
        const dog = await dogQueries.getDogById(dogId);
        
        if (!dog) {
          return {
            content: [
              {
                type: "text",
                text: `Dog with ID ${dogId} not found`
              }
            ],
            isError: true
          };
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(dog, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching dog details: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "get-dog-pedigree",
    description: "Get pedigree information for a specific dog",
    parameters: {
      type: "object",
      properties: {
        dogId: { type: "string" },
      },
      required: ["dogId"]
    },
    handler: async ({ dogId }) => {
      try {
        const pedigree = await dogQueries.getDogPedigree(dogId);
        
        if (!pedigree) {
          return {
            content: [
              {
                type: "text",
                text: `Pedigree for dog with ID ${dogId} not found`
              }
            ],
            isError: true
          };
        }
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(pedigree, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching dog pedigree: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  }
];
