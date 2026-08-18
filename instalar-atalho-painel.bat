@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0admin-local\instalar-atalho-painel.ps1"
if errorlevel 1 pause
