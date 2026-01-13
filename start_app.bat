@echo off
echo Starting Dyonak Web App...

echo Installing Server Dependencies...
start "Dyonak Server" cmd /k "cd server && npm install && node index.js"

echo Installing Client Dependencies and Starting Frontend...
start "Dyonak Client" cmd /k "cd client && npm install && npm run dev"

echo Done! The app should open in your browser soon.
pause
