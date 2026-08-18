$ErrorActionPreference = 'Stop'
$siteRoot = Split-Path -Parent $PSScriptRoot
$launcher = Join-Path $PSScriptRoot 'iniciar-painel.ps1'
$icon = Join-Path $PSScriptRoot 'static\guecas-painel.ico'
$shell = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
$startMenu = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'

foreach ($folder in @($desktop, $startMenu)) {
  $shortcutPath = Join-Path $folder 'Painel Guecas House.lnk'
  $shortcut = $shell.CreateShortcut($shortcutPath)
  $shortcut.TargetPath = 'powershell.exe'
  $shortcut.Arguments = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "' + $launcher + '"'
  $shortcut.WorkingDirectory = $siteRoot
  $shortcut.IconLocation = $icon + ',0'
  $shortcut.Description = 'Abrir o painel editorial local da Guecas House'
  $shortcut.Save()
}

Add-Type -AssemblyName PresentationFramework
[System.Windows.MessageBox]::Show('Atalho criado na Área de Trabalho e no menu Iniciar. Clique com o botão direito em “Painel Guecas House” e escolha “Fixar na barra de tarefas”.', 'Atalho instalado') | Out-Null
