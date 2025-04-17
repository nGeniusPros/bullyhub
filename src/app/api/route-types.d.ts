import { NextRequest } from 'next/server';

declare global {
  type RouteSegment = string;

  interface RouteHandlerContext<Params extends Record<string, string> = Record<string, string>> {
    params: Params;
  }

  type NextRequestWithParams<Params extends Record<string, string> = Record<string, string>> =
    NextRequest & { params: Params };

  // Fix for Next.js 15 route handler type issues
  namespace NodeJS {
    interface ProcessEnv {
      __NEXT_PRIVATE_PREBUNDLED_REACT: string;
    }
  }
}
