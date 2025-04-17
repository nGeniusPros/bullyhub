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
  return NextResponse.json({ id: params.id, message: "Get id" });
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  // Note: PUT operations are typically dynamic and might not behave as expected
  // with force-static in a real application without further configuration
  // or switching to dynamic rendering for this specific method if needed.
  return NextResponse.json({ id: params.id, message: "Update id" });
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  // Note: DELETE operations are typically dynamic. See PUT note.
  return NextResponse.json({ id: params.id, message: "Delete id" });
}
