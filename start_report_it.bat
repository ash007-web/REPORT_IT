@echo off
setlocal EnableDelayedExpansion

:: Generate ESC character for ANSI escape codes
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"

set "CYAN=%ESC%[36m"
set "ORANGE=%ESC%[33m"
set "WHITE=%ESC%[97m"
set "RESET=%ESC%[0m"

echo %CYAN%===========================================================%RESET%
echo %ORANGE%
echo    ____  ____  ____  ____  ____  ______   ___  ______ 
echo   / __ \/ __ \/ __ \/ __ \/ __ \/_  __/  /  / /_  __/ 
echo  / /_/ / /_/ / /_/ / / / / /_/ / / /    / /    / /    
echo / _, _/ ____/ ____/ /_/ / _, _/ / /    / /    / /     
echo /_/ ^|_/_/   /_/    \____/_/ ^|_^| /_/    /___/  /_/     
echo %RESET%
echo %CYAN%===========================================================%RESET%
echo %WHITE%SYSTEM BOOT SEQUENCE INITIATED...%RESET%
echo %CYAN%[RADAR_SYS] Verifying required modules...%RESET%

if not exist "node_modules\" (
    echo %ORANGE%[WARNING] Node modules not found. Initiating installation sequence...%RESET%
    call npm install
    if errorlevel 1 (
        echo %ORANGE%[ERROR] Installation failed. System halted.%RESET%
        pause
        exit /b 1
    )
    echo %CYAN%[RADAR_SYS] Modules installed successfully.%RESET%
) else (
    echo %CYAN%[RADAR_SYS] Modules verified.%RESET%
)

echo.
echo %ORANGE%***********************************************************%RESET%
echo %WHITE%[CRITICAL REMINDER]%RESET%
echo %CYAN%Ensure your local RDBMS (PostgreSQL/MySQL) service is online.%RESET%
echo %ORANGE%***********************************************************%RESET%
echo.

echo %CYAN%[RADAR_SYS] Engaging web interface and radar scanners...%RESET%
echo %WHITE%Opening browser...%RESET%
start http://localhost:5173

echo %CYAN%[RADAR_SYS] Starting development server...%RESET%
call npm run dev

if errorlevel 1 (
    echo %ORANGE%[ERROR] Radar server crashed. System halted.%RESET%
    pause
    exit /b 1
)
