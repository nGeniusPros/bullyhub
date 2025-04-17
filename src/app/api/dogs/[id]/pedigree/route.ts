import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Force static generation for this route
export const dynamic = "force-static";

// Define possible parameter values for static generation
export async function generateStaticParams() {
  // Replace with actual logic to fetch dog IDs
  return [{ id: '1' }, { id: '2' }];
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  // Correctly access the id parameter
  return NextResponse.json({ id: params.id, message: "Get pedigree" });
}
