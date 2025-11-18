# 📖 Guia: Como Criar Novas Páginas de Detalhes

## Exemplo Prático: Criando página para "O Corpo que Não Desliga"

### Passo 1: Copiar o Template
```
template-detalhes.html → detalhes-o-corpo-que-nao-desliga.html
```

### Passo 2: Substituições Necessárias

Abra `detalhes-o-corpo-que-nao-desliga.html` e substitua:

| Placeholder | Mudar Para |
|---|---|
| `[TÍTULO DO EBOOK]` | `O Corpo que Não Desliga` |
| `[NOME DA SÉRIE]` | `A Era da Mente Cansada` |
| `[IMAGEM-CAPA]` | `corpo-nao-desliga` (fica: `arquivos/Imagens/corpo-nao-desliga.jpg`) |
| `[SUBTÍTULO OU TAGLINE]` | `Quando o corpo continua em modo alerta mesmo em silêncio` |
| `[FRASE DE IMPACTO]` | `Você não está quebrado.` |
| `[X] minutos` | `20` (exemplo: "Leitura em menos de 20 minutos") |
| `[X] a [Y] páginas` | `45 a 60` |
| `R$ [PREÇO]` | `R$ 19,90` |
| `[SLUG]` | `corpo-nao-desliga` |

### Passo 3: Preencher Conteúdo

**Seção "Quando o cansaço não é só físico":**
```html
<h2>Quando o corpo não consegue desligar.</h2>

<p class="detail-lead">
Você dorme mas não descansa. A mente corre. Os músculos ficam tensos.
O coração palpita do nada. E tudo isso sem nenhuma razão lógica.
O corpo não recebeu o "permissão para relaxar"...
</p>
```

**Lista de tópicos (dentro do ebook):**
```
• Como a ansiedade vira tensão física que persiste mesmo em repouso
• As 3 sistemas nervosos do corpo e como a modernidade os deixou "trancados"
• Por que relaxar virou tão difícil (e não é só preguiça)
• Técnicas práticas para acalmar o corpo em 5 minutos
• Como reconhecer os sinais de alerta do seu próprio corpo
• O ciclo ansiedade → tensão → insônia → mais ansiedade
• Movimentos simples que "desligam" o estado de alerta
• Como falar sobre isso com um terapeuta (linguagem que funciona)
```

### Passo 4: Links de Outros Títulos

Na seção "Outros títulos da série", atualize os links:
```html
<div class="detail-carousel-card">
  <a href="detalhes-o-peso-invisivel.html">
    <img src="arquivos/Imagens/dd.jpg" alt="O Peso Invisível">
  </a>
  <span>O Peso Invisível</span>
</div>

<div class="detail-carousel-card">
  <a href="detalhes-o-corpo-que-nao-desliga.html">
    <img src="arquivos/Imagens/corpo-nao-desliga.jpg" alt="O Corpo que Não Desliga">
  </a>
  <span>O Corpo que Não Desliga</span>
</div>

<div class="detail-carousel-card">
  <a href="detalhes-o-preco-da-vigilia.html">
    <img src="arquivos/Imagens/preco-vigilia.jpg" alt="O Preço da Vigília">
  </a>
  <span>O Preço da Vigília</span>
</div>
```

### Passo 5: Atualizar a Página da Coleção

Em `a-era-da-mente-cansada.html`, atualize o card para "O Corpo que Não Desliga":

```html
<!-- O Corpo que Não Desliga -->
<article class="card">
  <img src="arquivos/Imagens/corpo-nao-desliga.jpg" alt="Capa O Corpo que Não Desliga" />
  <h3 class="card-title">O Corpo que Não Desliga</h3>
  <p class="card-tagline">Quando o corpo continua em modo alerta mesmo em silêncio.</p>
  <p class="card-meta">
    Um olhar para ansiedade física, tensão muscular, insônia e a sensação de nunca realmente desligar.
  </p>
  <div class="card-actions">
    <a href="detalhes-o-corpo-que-nao-desliga.html" class="btn btn-outline">
      Detalhes
    </a>
    <a href="https://pay.kiwify.com.br/SEU_LINK_CORPO_NESSA_SERIE" target="_blank" class="btn btn-primary">
      Comprar
    </a>
  </div>
</article>
```

### Passo 6: Atualize os links no `index.html` (se necessário)

Se quiser colocar este livro em preview na home, adicione um card ao grid de prévia com link para a página de detalhes.

---

## Estrutura Resumida do Template

```
template-detalhes.html
├── Header (igual em todas)
├── HERO DE DETALHES
│   ├── Badge da série
│   ├── Capa do livro
│   ├── Informações principais
│   ├── Preço
│   └── Botões (Ler prévia + Comprar)
├── SEÇÃO DE CONTEÚDO
│   ├── Introdução (por que este livro?)
│   ├── O que você vai aprender (lista com 8 itens)
│   └── Informações técnicas (6 campos)
├── CARROSSEL DE OUTROS TÍTULOS
│   └── 3 cards linkados para outras páginas
└── Footer (igual em todas)
```

---

## Dicas Importantes

1. **Slugs** - Use sempre em minúsculas, com hífens: `o-corpo-que-nao-desliga`
2. **Imagens** - Salve em `arquivos/Imagens/` com o nome do slug
3. **Preços** - Mantenha consistência (sugerir: R$ 9,90 a R$ 29,90)
4. **URLs Kiwify** - Pedir ao Elvis os links corretos para cada livro
5. **Tópicos** - Máximo 8 itens na lista (4 em cada coluna)
6. **Tempo de leitura** - Tipicamente 15-30 minutos para estes ebooks
7. **Páginas** - Tipicamente 30-80 páginas em PDF

---

## Checklist para Cada Nova Página

- [ ] Template copiado e renomeado
- [ ] Título do ebook atualizado
- [ ] Série atualizada
- [ ] Imagem de capa adicionada em `arquivos/Imagens/`
- [ ] Slug único definido
- [ ] Preço adicionado
- [ ] Tempo de leitura atualizado
- [ ] Número de páginas atualizado
- [ ] Descrição/tagline escrita
- [ ] 8 tópicos preenchidos
- [ ] Informações técnicas completas
- [ ] Links para outros títulos corretos
- [ ] Link Kiwify atualizado
- [ ] Card adicionado em `a-era-da-mente-cansada.html`
- [ ] Testado no navegador

---

**Bom trabalho! Dúvidas? Consulte ESTRUTURA.md** ✨
