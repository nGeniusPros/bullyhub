// Marketplace Feature - MCP Tools
import { z } from "zod";
import { marketplaceQueries } from "../data/queries";

/**
 * MCP tools for marketplace feature
 * These tools allow AI models to interact with marketplace data
 */
export const marketplaceTools = [
  {
    name: "fetch-product-categories",
    description: "Fetch product categories from the marketplace",
    parameters: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async () => {
      try {
        const categories = await marketplaceQueries.getAllCategories();
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(categories, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching product categories: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "fetch-products",
    description: "Fetch products from the marketplace",
    parameters: {
      type: "object",
      properties: {
        categoryId: { type: "string", description: "Optional category ID to filter by" },
        featured: { type: "boolean", description: "Optional flag to filter by featured products" },
        limit: { type: "number", description: "Optional limit on the number of products to return" }
      },
      required: []
    },
    handler: async ({ categoryId, featured, limit }) => {
      try {
        const products = await marketplaceQueries.getAllProducts({
          categoryId,
          featured,
          limit
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(products, null, 2)
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error fetching products: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "get-product-details",
    description: "Get detailed information about a specific product",
    parameters: {
      type: "object",
      properties: {
        productId: { type: "string" },
      },
      required: ["productId"]
    },
    handler: async ({ productId }) => {
      try {
        const product = await marketplaceQueries.getProduct(productId);
        
        if (!product) {
          return {
            content: [
              {
                type: "text",
                text: `No product found with ID: ${productId}`
              }
            ],
            isError: true
          };
        }
        
        // Format the response in a more readable way
        const formattedResponse = `
          # Product Details
          
          ## Basic Information
          **Name:** ${product.name}
          **Price:** $${product.price.toFixed(2)}
          ${product.salePrice ? `**Sale Price:** $${product.salePrice.toFixed(2)}` : ""}
          **Category:** ${product.category?.name || "Uncategorized"}
          **In Stock:** ${product.inStock ? "Yes" : "No"}
          ${product.featured ? "**Featured Product**" : ""}
          
          ## Description
          ${product.description || "No description available."}
          
          ## Attributes
          ${product.attributes ? Object.entries(product.attributes).map(([key, value]) => `**${key}:** ${value}`).join("\n") : "No attributes available."}
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
              text: `Error fetching product details: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  },
  
  {
    name: "recommend-products",
    description: "Recommend products based on user preferences or needs",
    parameters: {
      type: "object",
      properties: {
        breedType: { type: "string", description: "Type of dog breed (e.g., bulldog, retriever)" },
        purpose: { type: "string", description: "Purpose of the products (e.g., whelping, training, health)" },
        budget: { type: "number", description: "Maximum budget in dollars" }
      },
      required: ["breedType"]
    },
    handler: async ({ breedType, purpose, budget }) => {
      try {
        // Fetch all products
        const allProducts = await marketplaceQueries.getAllProducts();
        
        // Filter products based on parameters
        let filteredProducts = [...allProducts];
        
        // Apply budget filter if provided
        if (budget) {
          filteredProducts = filteredProducts.filter(product => 
            (product.salePrice || product.price) <= budget
          );
        }
        
        // Sort products by relevance to breed type and purpose
        filteredProducts.sort((a, b) => {
          let scoreA = 0;
          let scoreB = 0;
          
          // Check product name and description for breed type
          if (a.name.toLowerCase().includes(breedType.toLowerCase()) || 
              (a.description && a.description.toLowerCase().includes(breedType.toLowerCase()))) {
            scoreA += 2;
          }
          
          if (b.name.toLowerCase().includes(breedType.toLowerCase()) || 
              (b.description && b.description.toLowerCase().includes(breedType.toLowerCase()))) {
            scoreB += 2;
          }
          
          // Check for purpose if provided
          if (purpose) {
            if (a.name.toLowerCase().includes(purpose.toLowerCase()) || 
                (a.description && a.description.toLowerCase().includes(purpose.toLowerCase())) ||
                (a.category && a.category.name.toLowerCase().includes(purpose.toLowerCase()))) {
              scoreA += 3;
            }
            
            if (b.name.toLowerCase().includes(purpose.toLowerCase()) || 
                (b.description && b.description.toLowerCase().includes(purpose.toLowerCase())) ||
                (b.category && b.category.name.toLowerCase().includes(purpose.toLowerCase()))) {
              scoreB += 3;
            }
          }
          
          // Featured products get a boost
          if (a.featured) scoreA += 1;
          if (b.featured) scoreB += 1;
          
          return scoreB - scoreA;
        });
        
        // Take top 5 recommendations
        const recommendations = filteredProducts.slice(0, 5);
        
        // Format the response
        const formattedResponse = `
          # Product Recommendations
          
          Based on your criteria:
          - Breed Type: ${breedType}
          ${purpose ? `- Purpose: ${purpose}` : ""}
          ${budget ? `- Budget: $${budget.toFixed(2)}` : ""}
          
          ## Top Recommendations
          
          ${recommendations.map((product, index) => `
          ### ${index + 1}. ${product.name}
          **Price:** $${(product.salePrice || product.price).toFixed(2)}
          **Category:** ${product.category?.name || "Uncategorized"}
          ${product.description ? `**Description:** ${product.description.substring(0, 100)}${product.description.length > 100 ? "..." : ""}` : ""}
          `).join("\n")}
          
          ${recommendations.length === 0 ? "No products found matching your criteria. Try broadening your search parameters." : ""}
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
              text: `Error recommending products: ${error.message}`
            }
          ],
          isError: true
        };
      }
    }
  }
];
