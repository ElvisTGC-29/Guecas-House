@echo off
REM Starter do Servidor Local - Stardew Valley Theme
REM Desenvolvido para @RasgadoGames

color 0A
title Stardew Valley App Server - @RasgadoGames

echo.
echo ============================================================
echo  STARDEW VALLEY THEME - SERVIDOR LOCAL
echo  @RasgadoGames
echo ============================================================
echo.

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ERROR: Python nao foi encontrado!
    echo.
    echo Por favor, instale Python de:
    echo https://www.python.org/downloads/
    echo.
    echo Certifique-se de marcar "Add Python to PATH" durante a instalacao
    echo.
    pause
    exit /b 1
)

echo [OK] Python detectado com sucesso!
echo.
echo Iniciando servidor...
echo.

REM Executar servidor
python "%~dp0server.py"

if errorlevel 1 (
    color 0C
    echo.
    echo ERROR: Falha ao iniciar servidor
    pause
    exit /b 1
)

pause
