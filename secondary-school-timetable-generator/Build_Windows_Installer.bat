@echo off
:: TimeTable Pro - 1-Click Windows Installer Compiler
:: This script will automatically download the required tools and package the app into a standalone Windows .exe Installer!

TITLE TimeTable Pro - Windows Installer Compiler
COLOR 0B
cls

echo =====================================================================
echo               TIMETABLE PRO - WINDOWS INSTALLER COMPILER
echo =====================================================================
echo.
echo This script will package your school timetable generator into a 
echo standard Windows installation file (.exe) that you can distribute 
echo to any computer via a USB drive.
echo.
echo PREREQUISITES:
echo You must have Node.js installed on this PC. If you don't have it, 
echo download it from: https://nodejs.org/ (LTS Version)
echo.
echo Press any key to start the compilation process...
pause > nul

echo.
echo [1/5] Checking if Node.js is installed...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Node.js was not found on your system!
    echo Please install Node.js from https://nodejs.org/ and run this script again.
    echo.
    pause
    exit /b
)
echo Node.js is installed! Proceeding...

echo.
echo [2/5] Cleaning up old installation folders...
if exist dist rmdir /s /q dist
if exist dist_electron rmdir /s /q dist_electron
if exist build_electron rmdir /s /q build_electron
echo Done cleaning!

echo.
echo [3/5] Installing project dependencies (React, Tailwind, Electron)...
echo This might take 1-2 minutes depending on your internet speed. Please wait...
call npm install --silent
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Failed to install project dependencies. Please check your internet connection.
    pause
    exit /b
)
echo Dependencies installed successfully!

echo.
echo [4/5] Compiling the web application...
call npm run build
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Failed to build the React application.
    pause
    exit /b
)
echo Web app compiled successfully into the 'dist' folder!

echo.
echo [5/5] Packaging into a native Windows Setup (.exe)...
echo Building the Electron wrapper and generating the installer wizard...
echo This will take about 1 minute.
echo.

:: Adding required electron configurations temporarily if not in package.json
if not exist electron-builder.yml (
    (
    echo appId: com.timetablepro.app
    echo productName: TimeTable Pro
    echo copyright: Copyright © 2026 TimeTable Pro
    echo directories:
    echo   output: dist_electron
    echo files:
    echo   - "dist/**/*"
    echo   - "electron-main.js"
    echo   - "package.json"
    echo win:
    echo   target: nsis
    echo nsis:
    echo   oneClick: false
    echo   allowToChangeInstallationDirectory: true
    echo   createDesktopShortcut: true
    echo   createStartMenuShortcut: true
    echo   shortcutName: "TimeTable Pro"
    ) > electron-builder.yml
)

:: Run electron builder
call npx electron-builder --config electron-builder.yml --windows
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo ERROR: Failed to package the application with Electron.
    pause
    exit /b
)

echo.
echo =====================================================================
echo SUCCESS! THE WINDOWS INSTALLER HAS BEEN GENERATED SUCCESSFULLY!
echo =====================================================================
echo.
color 0A
echo You can find your ready-to-install setup file at:
echo 📂 %~dp0dist_electron\TimeTable Pro Setup 1.0.0.exe
echo.
echo You can now copy this file to a USB thumb drive and run it on ANY 
echo Windows computer!
echo.
echo Opening the folder for you now...
explorer "%~dp0dist_electron"
echo.
pause
