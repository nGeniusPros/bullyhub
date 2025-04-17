import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const { params } = context;
  return NextResponse.json({ id: params.images, message: "Get images" });
}

export async function POST(request, context) {
  const { params } = context;
  return NextResponse.json({ id: params.images, message: "Create images" });
}

export async function DELETE(request, context) {
  const { params } = context;
  return NextResponse.json({ id: params.images, message: "Delete images" });
}
