# 📚 Guecas House — Estrutura de Páginas

## ✅ Organização Completada

### Pastas Criadas
- **`css/`** — Todos os arquivos CSS organizados

### Estrutura de Arquivos CSS
```
css/
├── styles.css          (Global - Reset, Header, Botões, Footer, Animações)
├── 00-index.css        (Home - Hero e cards iniciais)
├── 01-detalhes.css     (Detalhes dos livros)
├── 02-sucesso.css      (Página de sucesso após contato)
├── 03-contato.css      (Formulário de contato)
├── 04-sobre.css        (Página Sobre)
├── 05-acervo.css       (Grid de cards - livros)
└── 06-colecoes.css     (Grid de cards - coleções)
```

## 📄 Páginas HTML

### Estrutura de Navegação

```
index.html (Home)
    ├── Ver Acervo → colecoes.html
    ├── Botão "Comprar" → https://kiwify.com.br
    └── Cards de livros em preview

colecoes.html (Acervo Principal)
    ├── Card: "A Era da Mente Cansada" com botão "Acervo"
    │   └── Leva para: a-era-da-mente-cansada.html
    ├── Card: "Futura Coleção" (Em Breve)
    └── Card: "Outra Coleção" (Em Breve)

a-era-da-mente-cansada.html (Coleção - Grid de Livros)
    ├── O Peso Invisível
    │   ├── Botão "Detalhes" → detalhes-o-peso-invisivel.html
    │   └── Botão "Comprar" → Kiwify
    ├── O Corpo que Não Desliga
    │   ├── Botão "Detalhes" → [NOVO - usar template]
    │   └── Botão "Comprar" → Kiwify
    └── O Preço da Vigília
        ├── Botão "Detalhes" → [NOVO - usar template]
        └── Botão "Comprar" → Kiwify

detalhes-o-peso-invisivel.html (Página de Detalhes)
    ├── Hero com capa do livro
    ├── Informações técnicas
    ├── Conteúdo (o que está dentro)
    └── Links para outros títulos da série
```

## 🎯 Como Usar o Template

### Para Criar Novas Páginas de Detalhes:

1. **Copie** `template-detalhes.html`
2. **Renomei** como `detalhes-[slug].html`
   - Exemplo: `detalhes-o-corpo-que-nao-desliga.html`
3. **Procure e substitua** os placeholders:

```
[TÍTULO DO EBOOK]               → Ex: O Corpo que Não Desliga
[NOME DA SÉRIE]                 → Ex: A Era da Mente Cansada
[IMAGEM-CAPA]                   → Ex: dd (fica: arquivos/Imagens/dd.jpg)
[SUBTÍTULO OU TAGLINE]          → Ex: Quando o corpo continua em modo alerta
[FRASE DE IMPACTO]              → Ex: Você não está quebrado.
[X] minutos                     → Tempo de leitura
[X] a [Y] páginas               → Número de páginas
R$ [PREÇO]                      → Preço
[SLUG]                          → Slug único para URLs (ex: corpo-nao-desliga)
[TÓPICO 1-8]                    → O que o leitor vai aprender
[LINK-PARA-OUTRO-TITULO]        → Links para outros livros da série
```

### Para Criar Novas Coleções:

1. **Crie uma nova página** `sua-colecao.html` com a estrutura de `a-era-da-mente-cansada.html`
2. **Adicione um novo card** em `colecoes.html` apontando para sua página
3. **Crie uma página CSS** se necessário (exemplo: `07-sua-colecao.css`)

## 🔗 Links Atualizados

Todos os links de navegação foram atualizados:
- ✅ `acervo.html` → `colecoes.html`
- ✅ Todos os footers apontam para `colecoes.html`
- ✅ Index.html tem links corretos

## 📝 Observações Importantes

1. **acervo.html** - Mantido para compatibilidade, mas não é mais usado (era a página antiga)
2. **template-detalhes.html** - Use este como base para novas páginas de livros
3. **Placeholders** - No template, todos os valores entre `[COLCHETES]` devem ser substituídos
4. **Caminhos de imagens** - Coloque as capas em `arquivos/Imagens/`
5. **URLs Kiwify** - Atualize `https://pay.kiwify.com.br/SEU_LINK_[SLUG]` com os links reais

## 🚀 Próximos Passos

Para adicionar um novo livro:
1. Copie `template-detalhes.html` → `detalhes-novo-livro.html`
2. Substitua todos os placeholders
3. Adicione um card em `a-era-da-mente-cansada.html` apontando para a nova página
4. Atualize os links de "Outros títulos" em cada página

---
**Guecas House Editorial Seal** — Estrutura Finalizada ✨
