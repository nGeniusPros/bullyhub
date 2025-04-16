import { NextRequest, NextResponse } from "next/server";

export interface BreedingProgramDogsParams {
  params: {
    id: string;
  };
}

export async function POST(
  request: NextRequest,
  context: BreedingProgramDogsParams
) {
  const { id } = context.params;
  return NextResponse.json({ id, message: "Add dogs to breeding program" });
}

export async function DELETE(
  request: NextRequest,
  context: BreedingProgramDogsParams
) {
  const { id } = context.params;
  return NextResponse.json({ id, message: "Remove dog from breeding program" });
}
