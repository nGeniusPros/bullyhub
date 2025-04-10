# Start Bully Hub Development Environment
Write-Host "🚀 Starting development environment..." -ForegroundColor Cyan

# Create the missing static files if they don't exist
if (-not (Test-Path public\css\layout.css)) {
    Write-Host "Creating missing static files..." -ForegroundColor Yellow
    
    # Create directories if they don't exist
    if (-not (Test-Path public\css)) {
        New-Item -ItemType Directory -Path public\css | Out-Null
    }
    if (-not (Test-Path public\js)) {
        New-Item -ItemType Directory -Path public\js | Out-Null
    }
    
    # Create layout.css
    @"
/* 
 * layout.css - Main layout styles for Bully Hub
 * This file contains global layout styles for the application
 */

:root {
  /* PetSmart Blue (#0072bc) */
  --primary: oklch(0.52 0.182 253.395);
  --primary-foreground: oklch(1 0 0);
  /* White for backgrounds */
  --background: oklch(1 0 0);
  /* Dark for text */
  --foreground: oklch(0.2 0 0);
}

/* Basic layout styles */
body {
  margin: 0;
  padding: 0;
  font-family: var(--font-geist-sans, sans-serif);
  background-color: var(--background);
  color: var(--foreground);
}

/* Container styles */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
}
"@ | Out-File -FilePath public\css\layout.css -Encoding utf8
    
    # Create main-app.js
    @"
/**
 * main-app.js - Main JavaScript functionality for Bully Hub
 * This file contains common functionality used across the application
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Bully Hub application initialized');
  
  // Initialize theme handling
  initializeTheme();
  
  // Add event listeners for interactive elements
  setupEventListeners();
});

/**
 * Initialize theme handling (light/dark mode)
 */
function initializeTheme() {
  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Add theme toggle functionality if toggle exists
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
}
"@ | Out-File -FilePath public\js\main-app.js -Encoding utf8
    
    # Create app-pages-internals.js
    @"
/**
 * app-pages-internals.js - Page-specific JavaScript for Bully Hub
 * This file contains functionality specific to individual pages in the application
 */

// Page-specific initializations
const pageInitializers = {
  // Dashboard page
  dashboard: function() {
    console.log('Dashboard page initialized');
    initializeDashboardCharts();
  },
  
  // Profile page
  profile: function() {
    console.log('Profile page initialized');
    setupProfileImageUpload();
  },
  
  // Nutrition page
  nutrition: function() {
    console.log('Nutrition page initialized');
    initializeNutritionCalculator();
  },
  
  // Appointments page
  appointments: function() {
    console.log('Appointments page initialized');
    initializeCalendar();
  }
};

// Initialize page-specific functionality
document.addEventListener('DOMContentLoaded', function() {
  // Determine current page from body data attribute or URL
  const currentPage = document.body.dataset.page || getCurrentPageFromUrl();
  
  // Run page initializer if it exists
  if (currentPage && pageInitializers[currentPage]) {
    pageInitializers[currentPage]();
  }
});

/**
 * Get current page name from URL
 */
function getCurrentPageFromUrl() {
  const path = window.location.pathname;
  const pathSegments = path.split('/').filter(Boolean);
  
  if (pathSegments.length > 0) {
    // Return last segment of URL path
    return pathSegments[pathSegments.length - 1];
  }
  
  return 'home';
}

/**
 * Placeholder for dashboard charts initialization
 */
function initializeDashboardCharts() {
  // This would be implemented with a charting library
  console.log('Dashboard charts would be initialized here');
}

/**
 * Placeholder for profile image upload functionality
 */
function setupProfileImageUpload() {
  // This would handle file uploads
  console.log('Profile image upload would be initialized here');
}

/**
 * Placeholder for nutrition calculator
 */
function initializeNutritionCalculator() {
  // This would implement nutrition calculations
  console.log('Nutrition calculator would be initialized here');
}

/**
 * Placeholder for calendar initialization
 */
function initializeCalendar() {
  // This would initialize a calendar component
  console.log('Calendar would be initialized here');
}
"@ | Out-File -FilePath public\js\app-pages-internals.js -Encoding utf8
    
    Write-Host "✅ Created missing static files" -ForegroundColor Green
}

# Start Next.js in a separate window with environment variables for Netlify Functions
Write-Host "Starting Next.js server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; `$env:NETLIFY_FUNCTIONS_URL='http://localhost:9999/.netlify/functions'; npx next dev"

# Wait a moment for Next.js to start
Write-Host "Waiting for Next.js to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Verify Next.js is running
$nextJsRunning = $false
$retryCount = 0
$maxRetries = 5

while (-not $nextJsRunning -and $retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            $nextJsRunning = $true
            Write-Host "✅ Next.js server is running on http://localhost:3000" -ForegroundColor Green
        }
    } catch {
        $retryCount++
        Write-Host "Waiting for Next.js server to start (attempt $retryCount of $maxRetries)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 3
    }
}

if (-not $nextJsRunning) {
    Write-Host "❌ Failed to start Next.js server. Please check for errors in the Next.js window." -ForegroundColor Red
    Write-Host "You can try running 'npx next dev' manually to see the error." -ForegroundColor Yellow
    exit 1
}

# Start Netlify Functions
Write-Host "Starting Netlify Functions server..." -ForegroundColor Yellow
netlify functions:serve

Write-Host ""
Write-Host "✨ Development environment is running: ✨" -ForegroundColor Green
Write-Host "- Next.js: http://localhost:3000" -ForegroundColor Cyan
Write-Host "- Netlify Functions: http://localhost:9999/.netlify/functions/" -ForegroundColor Cyan
Write-Host "- Example function: http://localhost:9999/.netlify/functions/hello-world" -ForegroundColor Cyan
Write-Host ""
Write-Host "ℹ️ API Proxy Configuration:" -ForegroundColor Magenta
Write-Host "- API requests to http://localhost:3000/api/* will be proxied to http://localhost:9999/.netlify/functions/*" -ForegroundColor Cyan
Write-Host "- This allows your frontend to use /api/dna-tests and other API routes seamlessly" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the Netlify Functions server" -ForegroundColor Yellow
Write-Host "You'll need to close the Next.js window separately" -ForegroundColor Yellow
Write-Host ""
Write-Host "The static files (layout.css, main-app.js, app-pages-internals.js) have been created in the public directory" -ForegroundColor Green
