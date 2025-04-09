import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body
    const { query, context } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    // Get user's dogs for context
    const { data: dogs, error: dogsError } = await supabase
      .from('dogs')
      .select('*')
      .eq('owner_id', user.id);
    
    if (dogsError) {
      console.error('Error fetching dogs:', dogsError);
      return NextResponse.json({ error: 'Failed to fetch dogs' }, { status: 500 });
    }
    
    // Get user's breeding programs for context if they're a breeder
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    let breedingPrograms = [];
    if (!profileError && profile && profile.role === 'breeder') {
      const { data: programs, error: programsError } = await supabase
        .from('breeding_programs')
        .select('*')
        .eq('breeder_id', user.id);
      
      if (!programsError && programs) {
        breedingPrograms = programs;
      }
    }
    
    // Get breeding plans if context includes a specific plan
    let breedingPlan = null;
    if (context && context.breedingPlanId) {
      const { data: plan, error: planError } = await supabase
        .from('breeding_plans')
        .select(`
          *,
          breeding_program:breeding_programs(id, name, program_type, color_focus, health_protocols),
          sire:dogs!breeding_plans_sire_id_fkey(id, name, breed, color, date_of_birth),
          dam:dogs!breeding_plans_dam_id_fkey(id, name, breed, color, date_of_birth)
        `)
        .eq('id', context.breedingPlanId)
        .single();
      
      if (!planError && plan) {
        breedingPlan = plan;
      }
    }
    
    // Prepare the system message with context about the user's dogs and breeding programs
    let systemMessage = `You are an AI advisor for Bully Hub, a platform for dog breeders and pet owners. 
You specialize in bulldog breeding, genetics, health, and care. 
Provide helpful, accurate, and concise advice based on the user's question and their specific context.`;
    
    if (dogs && dogs.length > 0) {
      systemMessage += `\n\nThe user has the following dogs:`;
      dogs.forEach(dog => {
        systemMessage += `\n- ${dog.name}: ${dog.breed}, ${dog.color || 'unknown color'}${dog.date_of_birth ? `, born ${dog.date_of_birth}` : ''}${dog.is_stud ? ' (stud)' : ''}`;
      });
    }
    
    if (breedingPrograms && breedingPrograms.length > 0) {
      systemMessage += `\n\nThe user has the following breeding programs:`;
      breedingPrograms.forEach(program => {
        systemMessage += `\n- ${program.name}: ${program.program_type}, focusing on ${program.color_focus}`;
        if (program.description) {
          systemMessage += `, ${program.description}`;
        }
      });
    }
    
    if (breedingPlan) {
      systemMessage += `\n\nThe user is asking about a specific breeding plan:`;
      systemMessage += `\n- Plan: ${breedingPlan.name}`;
      systemMessage += `\n- Sire: ${breedingPlan.sire.name} (${breedingPlan.sire.breed}, ${breedingPlan.sire.color})`;
      systemMessage += `\n- Dam: ${breedingPlan.dam.name} (${breedingPlan.dam.breed}, ${breedingPlan.dam.color})`;
      systemMessage += `\n- Program: ${breedingPlan.breeding_program ? breedingPlan.breeding_program.name : 'None'}`;
      systemMessage += `\n- Status: ${breedingPlan.status}`;
      
      if (breedingPlan.compatibility) {
        systemMessage += `\n- Compatibility Score: ${breedingPlan.compatibility.score}/100`;
        
        if (breedingPlan.compatibility.colorPredictions) {
          systemMessage += `\n- Color Predictions: `;
          breedingPlan.compatibility.colorPredictions.forEach(prediction => {
            systemMessage += `${prediction.color} (${prediction.percentage}%), `;
          });
          systemMessage = systemMessage.slice(0, -2); // Remove trailing comma and space
        }
        
        if (breedingPlan.compatibility.healthRisks) {
          systemMessage += `\n- Health Risks: `;
          breedingPlan.compatibility.healthRisks.forEach(risk => {
            systemMessage += `${risk.condition} (${risk.risk} risk), `;
          });
          systemMessage = systemMessage.slice(0, -2); // Remove trailing comma and space
        }
        
        if (breedingPlan.compatibility.coi) {
          systemMessage += `\n- COI: ${breedingPlan.compatibility.coi}%`;
        }
      }
    }
    
    systemMessage += `\n\nWhen answering, provide 2-3 follow-up questions the user might want to ask next.
If the question is about health issues, suggest appropriate reminders the user might want to set.
Always be helpful, accurate, and concise.`;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    // Extract the response text
    const responseText = response.choices[0].message.content;
    
    // Save the conversation to the database
    const { error: conversationError } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: user.id,
        query,
        response: responseText,
        context: {
          breedingPlanId: context?.breedingPlanId,
          dogIds: dogs.map(dog => dog.id),
          breedingProgramIds: breedingPrograms.map(program => program.id)
        }
      });
    
    if (conversationError) {
      console.error('Error saving conversation:', conversationError);
      // Continue even if saving fails
    }
    
    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Error in POST /api/ai/advisor:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
