@echo off
echo Starting Cafe Backend Server...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking MongoDB Atlas connection...
echo Using MongoDB Atlas cluster: cluster0.jupnuhk.mongodb.net
echo.

echo Installing backend dependencies...
cd server
npm install

echo.
echo Creating .env file from template...
if not exist .env (
    copy env.example .env
    echo Created .env file. Please edit it with your configuration.
) else (
    echo .env file already exists.
)

echo.
echo Seeding database with sample data...
npm run seed

echo.
echo Starting backend server...
echo Backend will be available at http://localhost:5000
echo API endpoints at http://localhost:5000/api
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
