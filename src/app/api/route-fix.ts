// This file provides simplified route handler types for Next.js 15
// It removes explicit type annotations that cause type errors in the generated files

import { NextRequest, NextResponse } from 'next/server';

// Simple route handler without explicit type annotations
export function createRouteHandler(handler: Function) {
  return async function(request: any, context: any) {
    return handler(request, context);
  };
}

// Helper functions for common responses
export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}
