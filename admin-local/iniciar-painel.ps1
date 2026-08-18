$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path -Parent $PSScriptRoot
$appPath = Join-Path $PSScriptRoot 'app.py'
$pythonPath = Join-Path $siteRoot '.venv\Scripts\python.exe'
$panelUrl = 'http://127.0.0.1:8765/'
$windowProfile = Join-Path $PSScriptRoot 'data\janela-windows'

function Get-PanelBrowser {
  $candidates = @(
    'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
    'C:\Program Files\Google\Chrome\Application\chrome.exe',
    'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe'
  )
  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) { return $candidate }
  }
  return $null
}

function Open-PanelWindow {
  $browser = Get-PanelBrowser
  if (-not $browser) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show('Não foi possível localizar o componente de janela do Windows. O painel será aberto no navegador padrão.', 'Painel Guecas House') | Out-Null
    Start-Process $panelUrl
    return
  }
  New-Item -ItemType Directory -Path $windowProfile -Force | Out-Null
  $arguments = @(
    "--app=$panelUrl",
    "--user-data-dir=$windowProfile",
    '--start-maximized',
    '--no-first-run',
    '--disable-session-crashed-bubble'
  )
  Start-Process -FilePath $browser -ArgumentList $arguments -WorkingDirectory $siteRoot
}

$running = Get-CimInstance Win32_Process -Filter "Name = 'python.exe'" -ErrorAction SilentlyContinue |
  Where-Object { $_.CommandLine -and $_.CommandLine.Contains($appPath) } |
  Select-Object -First 1

if (-not $running) {
  if (-not (Test-Path -LiteralPath $pythonPath)) {
    $launcher = Get-Command py -ErrorAction SilentlyContinue
    if (-not $launcher) {
      Add-Type -AssemblyName PresentationFramework
      [System.Windows.MessageBox]::Show('Python não foi localizado. Execute iniciar-painel.bat para ver o diagnóstico.', 'Painel Guecas House') | Out-Null
      exit 1
    }
    Start-Process -FilePath $launcher.Source -ArgumentList @('-3', $appPath, '--no-browser') -WorkingDirectory $siteRoot -WindowStyle Hidden
  } else {
    Start-Process -FilePath $pythonPath -ArgumentList @($appPath, '--no-browser') -WorkingDirectory $siteRoot -WindowStyle Hidden
  }

  $available = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    try {
      $response = Invoke-WebRequest -Uri $panelUrl -UseBasicParsing -TimeoutSec 1
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        $available = $true
        break
      }
    } catch {
      Start-Sleep -Milliseconds 200
    }
  }
  if (-not $available) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show('O painel não respondeu a tempo. Execute iniciar-painel.bat para ver o diagnóstico.', 'Painel Guecas House') | Out-Null
    exit 1
  }
}

Open-PanelWindow
