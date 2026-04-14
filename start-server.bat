@echo off
REM start-server.bat — installs dependencies and starts the app from repo root
REM Usage: start-server.bat

cd /d %~dp0
echo Installing dependencies (production)...
npm install --production
echo Starting application...
npm start
