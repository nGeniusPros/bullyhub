import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Get breeding plan" });
}

export async function PUT(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Update breeding plan" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Delete breeding plan" });
}
