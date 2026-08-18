@echo off
setlocal
cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" "admin-local\app.py"
) else (
  py -3 "admin-local\app.py"
)

if errorlevel 1 pause
endlocal
