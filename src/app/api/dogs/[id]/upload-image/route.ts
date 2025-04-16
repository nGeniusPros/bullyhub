import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Upload dog image" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Delete dog image" });
}
