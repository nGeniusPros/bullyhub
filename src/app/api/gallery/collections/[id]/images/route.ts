import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Get collection images" });
}

export async function POST(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Add images to collection" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Remove image from collection" });
}
