import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Get gallery collection" });
}

export async function PUT(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Update gallery collection" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Delete gallery collection" });
}
