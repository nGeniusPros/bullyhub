import { z } from 'zod';
import { NextResponse } from 'next/server';

// Common validation schemas
export const dogSchema = z.object({
  name: z.string().min(1, "Name is required"),
  breed: z.string().min(1, "Breed is required"),
  date_of_birth: z.string().optional(),
  color: z.string().optional(),
  owner_id: z.string().uuid("Invalid owner ID"),
  is_stud: z.boolean().optional().default(false),
  breeding_program_id: z.string().uuid("Invalid breeding program ID").optional(),
});

export const breedingProgramSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  goals: z.array(z.string()).optional(),
  programType: z.enum(["standard", "rare", "specialized"], {
    errorMap: () => ({ message: "Invalid program type" }),
  }),
  colorFocus: z.string().min(1, "Color focus is required"),
  healthProtocols: z.array(
    z.object({
      protocolName: z.string().min(1, "Protocol name is required"),
      description: z.string().optional(),
      required: z.boolean().optional(),
      frequency: z.string().optional(),
    })
  ).optional(),
  costRange: z.object({
    min: z.number().min(0, "Minimum cost must be at least 0"),
    max: z.number().min(0, "Maximum cost must be at least 0"),
  }).optional(),
  specialConsiderations: z.array(z.string()).optional(),
});

export const litterSchema = z.object({
  breeding_program_id: z.string().uuid("Invalid breeding program ID").optional(),
  sire_id: z.string().uuid("Invalid sire ID"),
  dam_id: z.string().uuid("Invalid dam ID"),
  whelping_date: z.string().optional(),
  puppy_count: z.number().int().min(0).optional(),
});

export const puppySchema = z.object({
  litter_id: z.string().uuid("Invalid litter ID"),
  name: z.string().optional(),
  color: z.string().optional(),
  gender: z.string().optional(),
});

export const appointmentSchema = z.object({
  dog_id: z.string().uuid("Invalid dog ID"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  type: z.string().min(1, "Type is required"),
  veterinarian_id: z.string().uuid("Invalid veterinarian ID").optional(),
  notes: z.string().optional(),
  status: z.enum(["confirmed", "pending", "completed", "cancelled"], {
    errorMap: () => ({ message: "Invalid status" }),
  }),
});

export const veterinarianSchema = z.object({
  name: z.string().min(1, "Name is required"),
  clinic: z.string().min(1, "Clinic is required"),
  specialty: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional(),
  notes: z.string().optional(),
});

export const healthRecordSchema = z.object({
  dog_id: z.string().uuid("Invalid dog ID"),
  record_date: z.string().min(1, "Record date is required"),
  record_type: z.string().min(1, "Record type is required"),
  description: z.string().optional(),
  provider: z.string().optional(),
  results: z.string().optional(),
  notes: z.string().optional(),
  documents: z.any().optional(),
});

export const reminderSchema = z.object({
  dog_id: z.string().uuid("Invalid dog ID").optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["high", "medium", "low"], {
    errorMap: () => ({ message: "Invalid priority" }),
  }),
  completed: z.boolean().optional().default(false),
  notify_before: z.number().int().min(0).optional().default(1),
});

// Utility function to validate request body against a schema
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodType<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const formattedErrors = result.error.format();
      return {
        success: false,
        error: NextResponse.json(
          { error: "Validation error", details: formattedErrors },
          { status: 400 }
        ),
      };
    }
    
    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error parsing request body:", error);
    return {
      success: false,
      error: NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      ),
    };
  }
}

// Utility function for consistent error responses
export function createErrorResponse(
  message: string,
  status: number = 500,
  details?: any
) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}
