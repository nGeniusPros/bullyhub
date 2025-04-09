import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";
import { NutritionGuide } from "@/types";

// Mock data for nutrition guides
const mockNutritionGuides: NutritionGuide[] = [
  {
    id: "1",
    title: "Bulldog Nutrition Basics",
    description: "Essential nutrition information for Bulldog owners",
    content: `
# Bulldog Nutrition Basics

Bulldogs have specific nutritional needs that differ from other breeds due to their unique physiology and common health concerns.

## Key Nutritional Requirements

### Protein
- **Requirement**: 18-25% for adult Bulldogs, 22-28% for puppies
- **Sources**: High-quality animal proteins like chicken, beef, fish
- **Benefits**: Supports muscle maintenance and growth

### Fats
- **Requirement**: 12-15% for adults, 15-18% for puppies
- **Sources**: Fish oil, flaxseed, chicken fat
- **Benefits**: Energy, coat health, inflammation reduction

### Carbohydrates
- **Requirement**: Limited amounts, focus on complex carbs
- **Sources**: Sweet potatoes, brown rice, oats
- **Benefits**: Energy, fiber for digestion

## Feeding Guidelines

- Feed adult Bulldogs 2 meals per day
- Measure portions carefully to prevent obesity
- Adjust portions based on activity level and weight goals
- Use elevated food bowls to aid digestion
- Avoid exercise immediately before or after meals

## Common Nutritional Issues

- **Obesity**: Monitor caloric intake carefully
- **Food Allergies**: Watch for signs of skin irritation or digestive upset
- **Flatulence**: May be reduced with high-quality, easily digestible foods
- **Joint Issues**: Consider supplements like glucosamine and chondroitin
    `,
    category: "general",
    tags: ["basics", "bulldogs", "nutrition", "feeding guidelines"],
    createdAt: "2023-08-15T10:00:00Z",
  },
  {
    id: "2",
    title: "Puppy Nutrition for Bulldogs",
    description: "Specialized nutrition guide for Bulldog puppies",
    content: `
# Puppy Nutrition for Bulldogs

Proper nutrition during the puppy stage is crucial for your Bulldog's development and long-term health.

## Growth Stages and Nutritional Needs

### 8-12 Weeks
- **Calories**: 20-25 calories per pound of body weight
- **Protein**: 26-28% from high-quality sources
- **Fat**: 15-18% for brain and body development
- **Feeding Schedule**: 3-4 small meals daily

### 3-6 Months
- **Calories**: 20 calories per pound of body weight
- **Protein**: 24-26% from high-quality sources
- **Fat**: 14-16% for continued development
- **Feeding Schedule**: 3 meals daily

### 6-12 Months
- **Calories**: 18 calories per pound of body weight
- **Protein**: 22-24% from high-quality sources
- **Fat**: 12-15% for maintenance and growth
- **Feeding Schedule**: 2-3 meals daily

## Essential Nutrients for Puppies

- **DHA**: Supports brain and eye development
- **Calcium and Phosphorus**: Critical for proper bone development (balanced ratio is essential)
- **Vitamins A, D, E**: Support immune function and overall growth
- **Probiotics**: Support digestive health

## Growth Rate Considerations

Bulldog puppies should grow steadily but not too rapidly. Excessive growth can contribute to joint problems. Monitor weight and body condition regularly.

## Transitioning to Adult Food

Begin transitioning to adult food around 12 months of age. Make the transition gradually over 7-10 days to prevent digestive upset.
    `,
    category: "puppy",
    tags: ["puppies", "growth", "development", "feeding schedule"],
    createdAt: "2023-09-01T14:30:00Z",
  },
  {
    id: "3",
    title: "Senior Bulldog Nutrition",
    description: "Nutritional guidance for aging Bulldogs",
    content: `
# Senior Bulldog Nutrition

As Bulldogs age, their nutritional needs change. Proper nutrition can help manage age-related conditions and maintain quality of life.

## When is a Bulldog Considered Senior?

Bulldogs typically enter their senior years around 7-8 years of age. However, this can vary based on individual health status and genetics.

## Key Nutritional Adjustments

### Calories
- **Requirement**: Typically 20-30% fewer calories than adult maintenance
- **Reason**: Decreased activity level and metabolism
- **Implementation**: Monitor weight closely and adjust as needed

### Protein
- **Requirement**: Moderate to high-quality protein (20-25%)
- **Reason**: Maintains muscle mass while being gentle on kidneys
- **Sources**: Easily digestible proteins like chicken, turkey, and fish

### Fat
- **Requirement**: Moderate fat (10-12%)
- **Reason**: Provides essential fatty acids while managing weight
- **Sources**: Fish oil, flaxseed oil (rich in omega-3 fatty acids)

### Fiber
- **Requirement**: Increased fiber
- **Reason**: Supports digestive health and regularity
- **Sources**: Pumpkin, sweet potatoes, brown rice

## Supplements for Senior Bulldogs

- **Glucosamine and Chondroitin**: Supports joint health
- **Omega-3 Fatty Acids**: Reduces inflammation
- **Antioxidants**: Supports immune function and fights cellular aging
- **Probiotics**: Maintains digestive health

## Feeding Considerations

- Feed smaller, more frequent meals if digestive issues arise
- Ensure easy access to fresh water at all times
- Consider food texture if dental issues are present
- Monitor for difficulty eating or decreased appetite

## Health Conditions and Diet

- **Arthritis**: Anti-inflammatory diet with omega-3 supplements
- **Dental Issues**: Softer food or moistened kibble
- **Heart Issues**: Low-sodium diet may be recommended
- **Kidney Issues**: Controlled protein and phosphorus
    `,
    category: "senior",
    tags: ["senior", "aging", "joint health", "weight management"],
    createdAt: "2023-10-10T09:15:00Z",
  },
];

export async function GET(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const searchTerm = url.searchParams.get("search");

    // Filter guides by category and search term if provided
    let filteredGuides = mockNutritionGuides;
    
    if (category && category !== "all") {
      filteredGuides = filteredGuides.filter((guide) => guide.category === category);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredGuides = filteredGuides.filter(
        (guide) =>
          guide.title.toLowerCase().includes(term) ||
          guide.description.toLowerCase().includes(term) ||
          guide.content.toLowerCase().includes(term) ||
          guide.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    return NextResponse.json(filteredGuides);
  } catch (error) {
    console.error("Error fetching nutrition guides:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
