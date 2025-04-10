/**
 * This file proxies requests to the Netlify Functions server
 * for DNA test related operations.
 */

import { NextRequest, NextResponse } from 'next/server';
import { proxyToNetlifyFunction } from '../proxy-netlify';

// This route will be used when the Next.js API route is not found
// It will proxy the request to the corresponding Netlify function
export async function GET(request: NextRequest) {
  return proxyToNetlifyFunction(request, 'dna-test-integration');
}

export async function POST(request: NextRequest) {
  return proxyToNetlifyFunction(request, 'dna-test-integration');
}

export async function PUT(request: NextRequest) {
  return proxyToNetlifyFunction(request, 'dna-test-integration');
}

export async function DELETE(request: NextRequest) {
  return proxyToNetlifyFunction(request, 'dna-test-integration');
}
