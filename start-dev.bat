@echo off
echo Starting development environment...

REM Create static files if they don't exist
if not exist public\assets\css\layout.css (
    echo Creating missing static files...

    REM Create directories if they don't exist
    if not exist public\assets\css mkdir public\assets\css
    if not exist public\assets\js mkdir public\assets\js

    REM Create layout.css
    echo /* layout.css - Main layout styles for PetPals */ > public\assets\css\layout.css
    echo body { margin: 0; padding: 0; } >> public\assets\css\layout.css

    REM Create main-app.js
    echo // main-app.js - Main JavaScript functionality > public\assets\js\main-app.js
    echo console.log('PetPals application initialized'); >> public\assets\js\main-app.js

    REM Create app-pages-internals.js
    echo // app-pages-internals.js - Page-specific JavaScript > public\assets\js\app-pages-internals.js
    echo console.log('Page initialized'); >> public\assets\js\app-pages-internals.js

    echo Created missing static files
)

REM Start Next.js in a separate window
echo Starting Next.js server on port 3000...
start cmd /k "set NETLIFY_FUNCTIONS_URL=http://localhost:9999/.netlify/functions && npx next dev"

REM Wait a moment for Next.js to start
echo Waiting for Next.js to start...
timeout /t 5 /nobreak > nul

REM Start Netlify Functions
echo Starting Netlify Functions server...
netlify functions:serve

echo.
echo Development environment is running:
echo - Next.js: http://localhost:3000
echo - Netlify Functions: http://localhost:9999/.netlify/functions/
echo - Example function: http://localhost:9999/.netlify/functions/hello-world
echo.
echo API Proxy Configuration:
echo - API requests to http://localhost:3000/api/* will be proxied to http://localhost:9999/.netlify/functions/*
echo - This allows your frontend to use /api/dna-tests and other API routes seamlessly
echo.
echo Press Ctrl+C to stop the Netlify Functions server
echo You'll need to close the Next.js window separately
echo.
echo The static files have been created in the public directory
