# PowerShell script to start Rangmanch Dashboard with Creator Hub
Write-Host "Starting Rangmanch Dashboard with Creator Hub..." -ForegroundColor Green
Write-Host ""

# Navigate to Creator Hub directory
Set-Location "Creator Hub"

# Check if node_modules exists, if not install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Creator Hub dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

# Start Creator Hub in a new PowerShell window
Write-Host "Starting Creator Hub on port 3001..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev; Read-Host 'Press Enter to close'"

# Wait a moment for the process to start
Start-Sleep -Seconds 2

# Go back to main directory
Set-Location ".."

Write-Host ""
Write-Host "Creator Hub is starting on http://localhost:3001" -ForegroundColor Green
Write-Host "You can now navigate to Creator Hub from your dashboard sidebar!" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to start the main dashboard..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Check if main project node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing main project dependencies..." -ForegroundColor Yellow
    npm install
}

# Start main dashboard
Write-Host "Starting main dashboard..." -ForegroundColor Green
npm start
