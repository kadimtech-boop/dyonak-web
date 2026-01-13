@echo off
echo ===================================================
echo     UPDATE BACKEND DEPENDENCIES (Professional)
echo ===================================================
echo.
echo Installing security packages (bcrypt, jwt, helmet)...
cd server
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies.
    echo Please make sure Node.js is installed correctly.
    pause
    exit /b
)
cd ..

echo.
echo [OK] Backend updated successfully!
echo.
echo Restarting Server...
start cmd /k "cd server && npm start"
echo.
echo Server restarted. You should see "Security Level: High" in the server window.
pause
