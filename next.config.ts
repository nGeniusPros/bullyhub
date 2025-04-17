import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

// Import the Netlify plugin
try {
  require("@netlify/plugin-nextjs/lib/templates/dependencies");
} catch (error) {
  console.warn("Could not load @netlify/plugin-nextjs dependencies");
}

// Load environment variables from .env.local and .env files
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly set environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  // Configure for Netlify deployment
  // output: "export", // Disabled to allow middleware and image optimization
  // Enable image optimization for Netlify
  images: {
    domains: ["localhost", "app.bullyhub.com", "bullyhub.netlify.app"],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Ensure static assets are copied to the output directory
  distDir: ".next",
  // Ensure trailing slashes are handled properly
  trailingSlash: false,
};

export default nextConfig;
