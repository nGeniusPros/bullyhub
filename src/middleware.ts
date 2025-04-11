import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to extract subdomain from hostname
function getSubdomain(hostname: string): string | null {
  // For local development
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    // Check if using a test subdomain pattern like 'mykennel.localhost:3000'
    const localParts = hostname.split('.');
    if (localParts.length > 1 && !localParts[0].includes('127')) {
      return localParts[0];
    }
    return null;
  }

  // For production
  const rootDomain = process.env.ROOT_DOMAIN || 'petpals.com';
  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return null; // Main domain, not a subdomain
  }

  // Extract subdomain from hostname
  if (hostname.endsWith(`.${rootDomain}`)) {
    return hostname.replace(`.${rootDomain}`, '');
  }

  return null;
}

export async function middleware(request: NextRequest) {
  // Extract hostname and check for subdomain
  const hostname = request.headers.get('host') || '';
  const subdomain = getSubdomain(hostname);
  const url = request.nextUrl.clone();

  // If this is a kennel subdomain request, handle it
  if (subdomain) {
    // Clone the request headers to add the subdomain
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-subdomain', subdomain);

    // For API routes that need to know the subdomain
    if (url.pathname.startsWith('/api/')) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    // For non-dashboard routes, we'll render the public kennel site
    // Skip authentication for public kennel sites
    if (!url.pathname.startsWith('/dashboard') &&
        !url.pathname.startsWith('/login') &&
        !url.pathname.startsWith('/register')) {
      // Rewrite the URL to the kennel-site catch-all route
      url.pathname = `/kennel-site${url.pathname}`;

      // Pass the subdomain in the request headers
      return NextResponse.rewrite(url, {
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  // DEVELOPMENT MODE - Authentication bypass
  const DEVELOPMENT_MODE = true; // Set to true to bypass authentication

  // If in development mode, skip authentication checks
  if (DEVELOPMENT_MODE) {
    return NextResponse.next();
  }

  // AUTHENTICATION ENABLED
  // This middleware enforces authentication for protected routes
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If the user is not signed in and the route is protected, redirect to login
  // (This check is skipped in development mode)
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
