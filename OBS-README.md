# 🌾 Stardew Valley Theme para OBS - @RasgadoGames

Um tema profissional inspirado em **Stardew Valley** para usar como overlay/fonte no OBS Studio durante suas lives!

## 🎮 O que é?

Este projeto converte o tema CSS de Stardew Valley em uma **aplicação web fullscreen** que funciona perfeitamente como fonte no OBS, sem necessidade de extensões ou configurações complexas.

## 📦 Arquivos Inclusos

- **app.html** - Aplicação web completa (UI + controles)
- **stardew-theme.css** - Arquivo de estilos do tema
- **server.py** - Servidor local Python (opcional, mas recomendado)
- **README.md** - Este arquivo

## ⚡ Quick Start

### Opção 1: Arquivo Local (Mais Simples)

1. Abra `app.html` diretamente no seu navegador
2. No OBS, adicione uma nova fonte: **Window Capture**
3. Selecione a janela do navegador
4. Pronto! 🎉

### Opção 2: Servidor Local (Recomendado)

1. Abra o PowerShell ou Prompt de Comando
2. Navegue até a pasta do projeto
3. Execute:
```bash
python server.py
```
4. O navegador abrirá automaticamente em `http://localhost:8000/app.html`
5. No OBS, configure como **Window Capture** normalmente

## 🎯 Como Usar no OBS

### Passo 1: Preparar o Navegador
1. Abra `app.html` (ou `http://localhost:8000/app.html`)
2. Pressione **F** para ativar fullscreen (recomendado)

### Passo 2: Adicionar Fonte no OBS
1. Na sua cena, clique em **+** em "Fontes"
2. Selecione **Window Capture** (não "Browser")
3. Escolha a janela do seu navegador na lista
4. Clique em **OK**

### Passo 3: Ajustar Tamanho e Posição
1. Redimensione conforme necessário
2. Posicione onde desejar em sua cena

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|-------|------|
| **F** | Alternar Fullscreen |
| **R** | Recarregar página |
| **H** | Esconder/mostrar controles |
| **ESC** | Sair do fullscreen |

## 🎨 Paleta de Cores

O tema utiliza cores inspiradas em Stardew Valley:

- **Verde Escuro**: `#2d5016`
- **Verde Floresta**: `#3d6b1f`
- **Verde Claro**: `#6ba547`
- **Verde Pálido**: `#a8d17f`
- **Marrom Terra**: `#8b6f47`
- **Marrom Claro**: `#d4a574`
- **Laranja**: `#ff8c42`
- **Roxo**: `#9370db`
- **Ouro**: `#ffd700`

## 📱 Componentes Disponíveis

A aplicação inclui vários componentes que você pode customizar:

### Cards
```html
<div class="card">
    <div class="card-title">Título</div>
    <p>Conteúdo</p>
</div>
```

### Alertas
```html
<div class="alert alert-success">✓ Sucesso!</div>
<div class="alert alert-info">ℹ️ Informação</div>
<div class="alert alert-warning">⚠️ Aviso</div>
<div class="alert alert-danger">❌ Erro</div>
```

### Badges
```html
<span class="badge">Live</span>
<span class="badge badge-primary">Streaming</span>
<span class="badge badge-success">Online</span>
```

## 🔧 Personalizando

### Mudar cores
Edite as variáveis CSS em `stardew-theme.css`:

```css
:root {
  --sv-dark-green: #2d5016;
  --sv-forest-green: #3d6b1f;
  /* ... mais cores */
}
```

### Adicionar conteúdo
Edite a seção `<main>` em `app.html` para adicionar seus próprios textos, links e componentes.

### Modificar layout
O arquivo `app.html` está estruturado em seções que você pode reorganizar:
- `#home` - Página inicial
- `#sobre` - Sobre o tema
- `#recursos` - Componentes
- `#contato` - Links e redes sociais

## 🚀 Dicas para OBS

### Melhor desempenho:
1. Use **Window Capture** em vez de **Browser Source**
2. Ajuste a resolução da janela conforme sua cena
3. Use fullscreen (F) para melhor qualidade

### Visibilidade:
1. Se os controles atrapalham, pressione **H** para ocultá-los
2. Você pode reposicionar a fonte sobre outros elementos
3. Experimente diferentes tamanhos de janela

### Live:
1. Mantenha o servidor rodando (se usar `server.py`)
2. Deixe o navegador em segundo plano enquanto transmite
3. Use os atalhos para mudar conteúdo em tempo real

## 📋 Requisitos

- **Navegador moderno**: Chrome, Firefox, Edge, Safari
- **OBS Studio** (versão 25 ou superior)
- **Python 3.6+** (apenas se usar `server.py`)

## ❓ Troubleshooting

### Página em branco no OBS
- Verifique se a janela está sendo capturada
- Tente maximizar a janela do navegador
- Recarregue com R

### Fullscreen não funciona
- Alguns navegadores bloqueiam fullscreen
- Tente abrir via `server.py` em vez de arquivo local
- Use o botão "Fullscreen" na interface

### Servidor não inicia
- Verifique se a porta 8000 está livre
- Use `python server.py` no diretório correto
- Teste com `http://localhost:8000/app.html`

### Cor errada / Layout quebrado
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Certifique-se de que `stardew-theme.css` está no mesmo diretório
- Recarregue com R

## 🎬 Para criadores de conteúdo

Este tema é ideal para:
- ✅ Lives de Stardew Valley
- ✅ Lives de outros games (adaptável)
- ✅ Streams educacionais
- ✅ Conteúdo temático
- ✅ Overlays informativos
- ✅ Marcadores de progresso
- ✅ Avisos e notificações

## 📝 Licença

Criado com ❤️ para @RasgadoGames

## 🤝 Suporte

Dúvidas? Teste os atalhos e controles!

---

**🌾 Aproveite seu novo tema e feliz streaming! 🎮**
