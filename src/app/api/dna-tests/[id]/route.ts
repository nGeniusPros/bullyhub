import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Get DNA test" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Delete DNA test" });
}
