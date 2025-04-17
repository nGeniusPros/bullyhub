import type { NextRequest } from 'next/server';

// This file provides type fixes for Next.js 15 route handlers

declare module 'next/dist/server/web/exports/next-request' {
  interface NextRequest {
    // Add any missing properties here
  }
}

declare module 'next/dist/server/web/exports/next-response' {
  interface NextResponse {
    // Add any missing properties here
  }
}

// Override the route handler types
declare module 'next/dist/server/future/route-modules/app-route/module' {
  interface AppRouteRouteModule {
    // Add any missing properties here
  }
}

// Fix for the params type issue
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      __NEXT_PRIVATE_PREBUNDLED_REACT: string;
    }
  }
}
