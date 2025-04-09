// netlify/headers.js
// This file is used by the Netlify plugin to generate custom headers for the site

module.exports = {
  // Cache static assets for 1 year
  '/*.{js,css,png,jpg,jpeg,gif,webp,svg,woff,woff2,ttf,eot}': {
    'Cache-Control': 'public, max-age=31536000, immutable'
  },
  
  // Cache HTML and JSON for 1 hour
  '/*.{html,json}': {
    'Cache-Control': 'public, max-age=3600, must-revalidate'
  },
  
  // Security headers for all pages
  '/*': {
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.openai.com; frame-src 'self'; object-src 'none'"
  },
  
  // Headers for API routes
  '/api/*': {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  },
  
  // Headers for Netlify functions
  '/.netlify/functions/*': {
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  }
};
