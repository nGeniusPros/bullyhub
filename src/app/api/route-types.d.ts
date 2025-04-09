import { NextRequest } from 'next/server';

declare global {
  type RouteSegment = string;
  
  interface RouteHandlerContext<Params extends Record<string, string> = Record<string, string>> {
    params: Params;
  }
  
  type NextRequestWithParams<Params extends Record<string, string> = Record<string, string>> = 
    NextRequest & { params: Params };
}
