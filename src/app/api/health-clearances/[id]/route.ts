import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const { params } = context;
  return NextResponse.json({ id: params.id, message: "Get id" });
}

export async function PUT(request, context) {
  const { params } = context;
  return NextResponse.json({ id: params.id, message: "Update id" });
}

export async function DELETE(request, context) {
  const { params } = context;
  return NextResponse.json({ id: params.id, message: "Delete id" });
}
