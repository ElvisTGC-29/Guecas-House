@echo off
setlocal
cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
  ".venv\Scripts\python.exe" "admin-local\app.py" --reset-password
) else (
  py -3 "admin-local\app.py" --reset-password
)

pause
endlocal
