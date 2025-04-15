import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ id: params.id, message: "Add dogs to breeding program" });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ id: params.id, message: "Remove dog from breeding program" });
}
