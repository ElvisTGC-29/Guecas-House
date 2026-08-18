@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$app=[IO.Path]::GetFullPath('%~dp0admin-local\app.py'); Get-CimInstance Win32_Process -Filter \"Name = 'python.exe'\" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($app) } | ForEach-Object { Stop-Process -Id $_.ProcessId }"
echo Painel Guecas House encerrado.
timeout /t 3 /nobreak >nul
endlocal
