/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // Explicitly set environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Configure for Netlify deployment
  output: "standalone",
  // Enable image optimization for Netlify
  images: {
    domains: [
      "localhost",
      "app.bullyhub.com",
      "images.unsplash.com",
      "petpals.com",
      "*.petpals.com" // Support for subdomains
    ],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Add this to ensure proper loading of static assets
  poweredByHeader: false,
  reactStrictMode: true,
  // Enable handling of subdomains
  experimental: {
    // This allows us to access hostname in middleware
    instrumentationHook: true
  }
};

export default nextConfig;
