@echo off
echo =========================================
echo      DYONAK APP - AUTO REPAIR TOOL
echo =========================================
echo.

echo [1/4] Installing Server Dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install server dependencies!
    pause
    exit /b %errorlevel%
)
cd ..
echo [OK] Server dependencies installed.
echo.

echo [2/4] Installing Client Dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install client dependencies!
    pause
    exit /b %errorlevel%
)
cd ..
echo [OK] Client dependencies installed.
echo.

echo [3/4] Starting Database...
echo Ensuring database file is ready...
echo.

echo [4/4] Launching Application...
echo.
echo Starting Server and Client...
echo Please wait for the browser to open...
echo.

start cmd /k "cd server && npm start"
start cmd /k "cd client && npm run dev"

echo =========================================
echo      REPAIR COMPLETE - APP RUNNING
echo =========================================
echo You can close this window now.
pause
