# Creator Hub Integration

This document explains how to use the Creator Hub integration in your Rangmanch Dashboard.

## Overview

The Creator Hub is a separate Next.js application that has been integrated into your main dashboard. You can access it through the sidebar navigation under "Creator Hub". **Authentication has been removed** from the Creator Hub to make it work seamlessly within your main dashboard.

## Recent Updates

✅ **Clerk Authentication Removed**
- All Clerk authentication dependencies have been removed
- No sign-in/sign-up required for Creator Hub
- Direct access to all features
- Mock user data is used for database operations

✅ **Standalone Operation**
- Creator Hub now operates independently of external authentication
- All features work without authentication barriers
- Simplified user experience

## ✅ Quick Start

**The easiest way to get started:**

1. Run the PowerShell script:
   ```powershell
   .\start-with-creator-hub.ps1
   ```

   Or run the batch file:
   ```bash
   start-with-creator-hub.bat
   ```

2. Wait for both servers to start
3. Navigate to Creator Hub from the sidebar in your dashboard

## Setup Instructions

### Method 1: Using the Startup Scripts (Recommended)

1. **For Windows Batch Script:**
   ```bash
   start-with-creator-hub.bat
   ```

2. **For PowerShell:**
   ```powershell
   .\start-with-creator-hub.ps1
   ```

### Method 2: Manual Setup

1. **Start Creator Hub:**
   ```bash
   cd "Creator Hub"
   npm install --legacy-peer-deps
   npm run dev
   ```

2. **Start Main Dashboard (in a new terminal):**
   ```bash
   cd ..
   npm install
   npm start
   ```

## How It Works

1. **Creator Hub** runs on `http://localhost:3001`
2. **Main Dashboard** runs on `http://localhost:3000`
3. The Creator Hub is embedded in the main dashboard using an iframe
4. You can navigate between the main dashboard and Creator Hub seamlessly

## Features

- **Seamless Integration**: Creator Hub appears as a native part of your dashboard
- **Full Functionality**: All Creator Hub features work within the dashboard
- **External Access**: You can also open Creator Hub in a new tab if needed
- **Auto-Setup**: The integration handles dependency installation automatically

## Troubleshooting

### Creator Hub Not Loading

1. Make sure Creator Hub is running on port 3001
2. Check that both projects have their dependencies installed
3. Use the "Retry" button in the Creator Hub interface
4. Try opening Creator Hub in a new tab using the "Open in New Tab" button

### Port Conflicts

If port 3001 is already in use:
1. Stop any other applications using port 3001
2. Or modify the port in `Creator Hub/package.json` and update the `creatorHubUrl` in `src/components/CreatorHub.tsx`

### Dependencies Issues

Run the following commands in both the main directory and Creator Hub directory:
```bash
# For Creator Hub
npm install --legacy-peer-deps

# For main project
npm install
```

## File Structure

```
├── Creator Hub/                 # Next.js Creator Hub application
│   ├── package.json            # Modified to use port 3001
│   └── ...                     # All Creator Hub files
├── src/components/CreatorHub.tsx # Integration component
├── start-with-creator-hub.bat   # Windows batch startup script
├── start-with-creator-hub.ps1   # PowerShell startup script
└── CREATOR_HUB_INTEGRATION.md   # This file
```

## Notes

- The Creator Hub integration uses an iframe to embed the Next.js application
- All Creator Hub functionality is preserved and works as expected
- The integration includes error handling and setup instructions
- You can customize the integration by modifying `src/components/CreatorHub.tsx`
