import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  return NextResponse.json({ id: params.id, message: "Get dog pedigree" });
}
