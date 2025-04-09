import { useState, useEffect, useCallback } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { EducationalContent, ContentTemplate, AIContentPrompt } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useEducationalContent() {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserSupabaseClient();

  // Fetch all educational content
  const fetchContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('educational_content')
        .select('*')
        .order('createdAt', { ascending: false });
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      setContent(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching educational content');
      console.error('Error fetching educational content:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Fetch all content templates
  const fetchTemplates = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('content_templates')
        .select('*')
        .order('name');
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching content templates:', err);
    }
  }, [supabase]);

  // Get a single content item by ID
  const getContentById = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('educational_content')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching educational content item:', err);
      return null;
    }
  }, [supabase]);

  // Get a single template by ID
  const getTemplateById = useCallback(async (id: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('content_templates')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching content template:', err);
      return null;
    }
  }, [supabase]);

  // Create new educational content
  const createContent = useCallback(async (contentData: Partial<EducationalContent>) => {
    try {
      const { data, error: createError } = await supabase
        .from('educational_content')
        .insert({
          ...contentData,
          status: contentData.status || 'draft',
          aiGenerated: contentData.aiGenerated || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (createError) {
        throw new Error(createError.message);
      }
      
      // Update local state
      setContent(prev => [data, ...prev]);
      
      toast({
        title: 'Success',
        description: 'Educational content created successfully',
      });
      
      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create educational content',
        variant: 'destructive',
      });
      console.error('Error creating educational content:', err);
      return null;
    }
  }, [supabase]);

  // Update existing educational content
  const updateContent = useCallback(async (id: string, contentData: Partial<EducationalContent>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('educational_content')
        .update({
          ...contentData,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Update local state
      setContent(prev => 
        prev.map(item => item.id === id ? { ...item, ...data } : item)
      );
      
      toast({
        title: 'Success',
        description: 'Educational content updated successfully',
      });
      
      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update educational content',
        variant: 'destructive',
      });
      console.error('Error updating educational content:', err);
      return null;
    }
  }, [supabase]);

  // Delete educational content
  const deleteContent = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      // Update local state
      setContent(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: 'Success',
        description: 'Educational content deleted successfully',
      });
      
      return true;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete educational content',
        variant: 'destructive',
      });
      console.error('Error deleting educational content:', err);
      return false;
    }
  }, [supabase]);

  // Publish educational content
  const publishContent = useCallback(async (id: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('educational_content')
        .update({
          status: 'published',
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Update local state
      setContent(prev => 
        prev.map(item => item.id === id ? { ...item, ...data } : item)
      );
      
      toast({
        title: 'Success',
        description: 'Educational content published successfully',
      });
      
      return data;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to publish educational content',
        variant: 'destructive',
      });
      console.error('Error publishing educational content:', err);
      return null;
    }
  }, [supabase]);

  // Generate content using AI
  const generateContentWithAI = useCallback(async (prompt: AIContentPrompt) => {
    try {
      // In a real implementation, this would call an API endpoint that interfaces with OpenAI or another AI service
      // For now, we'll simulate the AI response with a mock implementation
      
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI-generated content based on the prompt
      const generatedContent = {
        title: `${prompt.topic} Guide for ${prompt.targetAudience === 'pet_owners' ? 'Pet Owners' : 
                prompt.targetAudience === 'breeders' ? 'Breeders' : 
                prompt.targetAudience === 'veterinarians' ? 'Veterinarians' : 'Everyone'}`,
        content: generateMockContent(prompt),
        readingTime: Math.floor(prompt.wordCount ? prompt.wordCount / 200 : 5),
      };
      
      toast({
        title: 'Content Generated',
        description: 'AI has successfully generated content based on your prompt',
      });
      
      return generatedContent;
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to generate content with AI',
        variant: 'destructive',
      });
      console.error('Error generating content with AI:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load content and templates on component mount
  useEffect(() => {
    fetchContent();
    fetchTemplates();
  }, [fetchContent, fetchTemplates]);

  return {
    content,
    templates,
    loading,
    error,
    fetchContent,
    fetchTemplates,
    getContentById,
    getTemplateById,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    generateContentWithAI,
  };
}

// Helper function to generate mock content
function generateMockContent(prompt: AIContentPrompt): string {
  const { topic, targetAudience, tone, contentType } = prompt;
  
  // Generate different content based on the topic and audience
  if (topic.toLowerCase().includes('nutrition') || topic.toLowerCase().includes('diet')) {
    return `# ${topic}: A Comprehensive Guide

## Introduction
Proper nutrition is one of the most important aspects of dog care, especially for bully breeds. This guide will help you understand the nutritional needs of your dog and how to meet them.

## Understanding Your Dog's Nutritional Needs
Bully breeds have specific nutritional requirements that differ from other breeds. They typically need a diet high in protein to support their muscular build, but balanced with appropriate fats and carbohydrates.

## Key Nutrients for Bully Breeds
- **Protein**: Essential for muscle development and maintenance
- **Fats**: Provides energy and supports skin and coat health
- **Carbohydrates**: Offers energy for daily activities
- **Vitamins and Minerals**: Supports overall health and immune function

## Common Nutritional Issues in Bully Breeds
- Weight management challenges
- Food allergies and sensitivities
- Joint support needs

## Creating a Balanced Diet Plan
When developing a nutrition plan for your bully breed, consider:
1. Age and life stage
2. Activity level
3. Health conditions
4. Weight goals

## Commercial vs. Homemade Diets
Both options have pros and cons. Commercial diets offer convenience and balanced nutrition, while homemade diets allow for customization but require careful planning.

## Feeding Schedule and Portion Control
Most adult bully breeds do well with two meals per day. Portion sizes should be based on your dog's weight, activity level, and the specific food's caloric content.

## Supplements for Bully Breeds
Common beneficial supplements include:
- Glucosamine and chondroitin for joint health
- Omega-3 fatty acids for skin and coat
- Probiotics for digestive health

## Consulting with Professionals
Always work with your veterinarian when making significant changes to your dog's diet, especially if they have health concerns.

${prompt.includeReferences ? `
## References
1. American Kennel Club. "Dog Nutrition: Guide to Dog Food Nutrients." AKC.org
2. Veterinary Medical Center. "Nutrition for Bully Breeds." University of Canine Studies
3. Journal of Veterinary Science. "Nutritional Requirements of Athletic Dog Breeds." Vol 45, 2023
` : ''}`;
  } else if (topic.toLowerCase().includes('training') || topic.toLowerCase().includes('behavior')) {
    return `# ${topic}: Essential Techniques and Tips

## Introduction
Training is a crucial aspect of raising a well-behaved and balanced bully breed. This guide covers effective training methods specifically tailored for these intelligent and sometimes stubborn dogs.

## Understanding Bully Breed Psychology
Bully breeds are typically eager to please but can be independent thinkers. Understanding their psychology is key to successful training.

## Starting with Basic Commands
Every training program should begin with these fundamental commands:
- Sit
- Stay
- Come
- Leave it
- Heel

## Positive Reinforcement Techniques
Bully breeds respond exceptionally well to positive reinforcement. This includes:
- Treats and food rewards
- Verbal praise
- Physical affection
- Play time

## Addressing Common Behavioral Challenges
- Leash pulling
- Jumping on people
- Resource guarding
- Separation anxiety

## Socialization Importance
Proper socialization is critical for bully breeds. This includes exposure to:
- Different people
- Other dogs
- Various environments
- Diverse situations

## Advanced Training Opportunities
Once basic training is mastered, consider:
- Agility training
- Canine Good Citizen certification
- Therapy dog work
- Scent work

## Consistency and Patience
Training success depends on:
1. Consistent rules and commands
2. Regular practice sessions
3. Patience during the learning process
4. Realistic expectations

## When to Seek Professional Help
Consider working with a professional trainer if:
- Basic training isn't progressing
- Serious behavioral issues arise
- You want to pursue specialized training

${prompt.includeReferences ? `
## References
1. Association of Professional Dog Trainers. "Positive Reinforcement Training Methods." APDT.com
2. Journal of Applied Animal Behavior. "Training Techniques for Bully Breeds." Vol 32, 2022
3. Canine Behavioral Institute. "Understanding and Addressing Behavioral Challenges in Bully Breeds." 2023
` : ''}`;
  } else {
    return `# ${topic}: What Every ${targetAudience === 'pet_owners' ? 'Pet Owner' : 
            targetAudience === 'breeders' ? 'Breeder' : 
            targetAudience === 'veterinarians' ? 'Veterinarian' : 'Dog Lover'} Should Know

## Introduction
${topic} is an important aspect of bully breed care and management. This comprehensive guide will provide you with the essential information you need to understand this topic thoroughly.

## Background and Importance
Understanding ${topic} is crucial because it directly impacts the health, wellbeing, and development of bully breeds. Many owners underestimate how significant this aspect is to their dog's overall quality of life.

## Key Considerations
When addressing ${topic}, consider these important factors:
- Breed-specific needs and characteristics
- Age and developmental stage
- Individual temperament and health status
- Environmental and lifestyle factors

## Best Practices
Based on current research and expert recommendations, these approaches have proven most effective:
1. Regular assessment and monitoring
2. Preventative care and maintenance
3. Early intervention when issues arise
4. Consultation with specialists when needed

## Common Misconceptions
There are several myths surrounding ${topic} that need to be addressed:
- Misconception 1: One-size-fits-all approaches work for all bully breeds
- Misconception 2: Problems will resolve themselves without intervention
- Misconception 3: Only show dogs or breeding stock need special attention in this area

## Resources and Tools
These resources can help you better manage ${topic}:
- Professional consultations
- Educational materials
- Specialized products and services
- Community support groups

## Future Developments
The field of ${topic} is constantly evolving. Stay informed about:
- New research findings
- Innovative approaches
- Technological advancements
- Changing best practices

${prompt.includeReferences ? `
## References
1. American Veterinary Medical Association. "Guidelines for ${topic} in Canines." AVMA.org
2. Journal of Canine Science. "Recent Advances in Understanding ${topic}." Vol 28, 2023
3. Bully Breed Health Foundation. "Best Practices for ${topic} Management." 2022
` : ''}`;
  }
}
