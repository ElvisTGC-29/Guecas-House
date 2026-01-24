#!/usr/bin/env python3
"""
Servidor local para o tema Stardew Valley no OBS
Desenvolvido para @RasgadoGames
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from pathlib import Path

# Configurações
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Adicionar headers para evitar cache
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Customizar log
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), format%args))

def start_server():
    """Iniciar o servidor"""
    handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("=" * 60)
        print("🌾 Stardew Valley Theme - Servidor Local")
        print("=" * 60)
        print(f"\n✓ Servidor iniciado com sucesso!")
        print(f"\n📍 URL Local: http://localhost:{PORT}/app.html")
        print(f"📁 Diretório: {DIRECTORY}")
        print(f"\n🎮 Para usar no OBS:")
        print("  1. Abra: http://localhost:{PORT}/app.html")
        print("  2. No OBS, adicione: Window Capture")
        print("  3. Selecione a janela do navegador")
        print("  4. Pressione F para fullscreen")
        print(f"\n⌨️  Atalhos:")
        print("  F - Fullscreen")
        print("  R - Recarregar")
        print("  H - Esconder controles")
        print("  ESC - Sair")
        print("\n⚠️  Pressione Ctrl+C para parar o servidor")
        print("=" * 60 + "\n")
        
        try:
            # Tentar abrir no navegador
            webbrowser.open(f'http://localhost:{PORT}/app.html')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Servidor encerrado. Até logo!")
            sys.exit(0)

if __name__ == "__main__":
    start_server()
