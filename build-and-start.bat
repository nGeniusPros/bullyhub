@echo off
echo Building and starting the BullyHub application...

REM Build the Next.js application
echo Building Next.js application...
call npm run build

REM Check if build was successful
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! Please check the errors above.
    exit /b %ERRORLEVEL%
)

REM Start the development servers
echo Starting development servers...
call .\start-dev.bat
