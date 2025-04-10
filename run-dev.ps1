# Bully Hub Development Script - Simplified Version (No Auth)
Write-Host "🐶 Starting Bully Hub Development Environment..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "⚠️ .env.local file not found. Creating from template..." -ForegroundColor Yellow

    if (Test-Path .env.local.example) {
        Copy-Item .env.local.example .env.local
        Write-Host "✅ Created .env.local from template." -ForegroundColor Green
    } else {
        Write-Host "❌ Template file .env.local.example not found." -ForegroundColor Red
        exit 1
    }
}

# Check if node_modules exists
if (-not (Test-Path node_modules)) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install

    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies. Please check the error messages above." -ForegroundColor Red
        exit 1
    }

    Write-Host "✅ Dependencies installed successfully." -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed." -ForegroundColor Green
}

# Skip all verification and testing
Write-Host "⏩ Skipping environment and database verification (Auth disabled)" -ForegroundColor Yellow

# Start the development server
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "📝 The application will be available at http://localhost:8888" -ForegroundColor Cyan
Write-Host "💻 Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""

# Use Netlify dev for local development
Write-Host "Using Netlify development server" -ForegroundColor Yellow
npm run dev
