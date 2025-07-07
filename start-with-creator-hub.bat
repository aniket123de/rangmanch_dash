@echo off
echo Starting Rangmanch Dashboard with Creator Hub...
echo.

echo Setting up Creator Hub...
cd "Creator Hub"
if not exist "node_modules" (
    echo Installing Creator Hub dependencies...
    call npm install --legacy-peer-deps
)

echo Starting Creator Hub on port 3001...
start cmd /k "npm run dev"

echo.
echo Creator Hub is starting on http://localhost:3001
echo You can now navigate to Creator Hub from your dashboard sidebar!
echo.
echo Press any key to continue...
pause > nul

cd ..
echo Starting main dashboard...
if not exist "node_modules" (
    echo Installing main project dependencies...
    call npm install
)
call npm start
