import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Get health clearance" });
}

export async function PUT(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Update health clearance" });
}

export async function DELETE(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Delete health clearance" });
}
