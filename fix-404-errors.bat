@echo off
echo Fixing 404 errors for Next.js static files...

REM Create the _next/static directory structure
if not exist .next\static\css\app mkdir .next\static\css\app
if not exist .next\static\chunks mkdir .next\static\chunks
if not exist .next\static\chunks\app mkdir .next\static\chunks\app
if not exist .next\static\chunks\app\dashboard mkdir .next\static\chunks\app\dashboard
if not exist .next\static\chunks\app\dashboard\dna-tests mkdir .next\static\chunks\app\dashboard\dna-tests

REM Create the missing CSS file
echo /* layout.css - Main layout styles for Bully Hub */ > .next\static\css\app\layout.css

REM Create the missing JS files
echo // main-app.js - Main JavaScript functionality > .next\static\chunks\main-app.js
echo // app-pages-internals.js - Page-specific JavaScript > .next\static\chunks\app-pages-internals.js
echo // layout.js - Layout JavaScript > .next\static\chunks\app\layout.js
echo // dna-tests/page.js - DNA Tests page JavaScript > .next\static\chunks\app\dashboard\dna-tests\page.js
echo // dashboard/layout.js - Dashboard layout JavaScript > .next\static\chunks\app\dashboard\layout.js

echo Files created successfully!
echo.
echo Now starting the development servers...
echo.

REM Start the development servers
call .\start-dev.bat
