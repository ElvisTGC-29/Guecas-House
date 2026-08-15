# Área de membros Kiwify — A Era da Mente Cansada

https://membros.guecashouse.com.br — mesma identidade do site: navy `#1B3A57`,
dourado `#D0BB6C`, títulos em **Cinzel** e texto em **Alegreya**.

---

## Como a área está montada

| Nível | O que é | Nome hoje |
|---|---|---|
| Área de membros | a **série** | A Era da Mente Cansada |
| Curso | um **livro** da série | O Peso Invisível |
| Módulo | agrupa o conteúdo do livro | O Peso Invisível |
| Aula | o conteúdo | O Peso Invisível (PDF) |

Livro 2 entra como **um curso novo**, não como módulo. Em *Configurações →
Cursos* está ligado **"Exibir todos os cursos que o aluno tiver acesso"**, então
ele aparece sozinho na prateleira "Seus ebooks" — sem mexer no tema.

**Seções da home:** Banner → Cursos ("Seus ebooks") → Continuar lendo.
A seção *Módulos* foi removida: com um livro só, ela mostrava o mesmo conteúdo
que "Seus ebooks", com dois nomes diferentes.

### O que a busca do livro procura (testado)

O campo **"Buscar..."** que aparece dentro do livro casa **só com nome de
módulo**. Testado na área no ar: com o módulo chamado "Livro completo",
digitar `peso` respondia `"peso" não encontrado` — mesmo o curso e a aula se
chamando "O Peso Invisível". Ele não procura em título de aula nem em nome de
curso, e nunca sai do livro em que você já está.

Também não existe busca global na área: a home não tem nenhum `<input>`. Quem
escolhe o livro é a prateleira "Seus ebooks", pela capa.

Por isso o módulo leva o nome do livro — é o único campo que aquela busca
enxerga. O efeito colateral era o topo da página repetir "O Peso Invisível"
três vezes (nome do módulo, título da aula e título do curso); os dois
primeiros foram escondidos por CSS (item 4 da tabela abaixo).

---

## O que está rodando no tema

Dois blocos colados no **topo** de `sections/banner.liquid`, sem remover nada do
código original da Kiwify:

1. **`APLICADO-identidade.liquid`** — a repintura geral (fundo, fontes, cards,
   barra de progresso, menu lateral, scrollbar).
2. **Bloco de rótulos do app** — troca dois textos que a Kiwify escreve por
   conta própria (detalhes abaixo).

O mesmo bloco de identidade também está no topo de `sections/login.liquid`.

> A home (`index.json`) é renderizada em **todas** as rotas da área — a página
> do livro abre como modal por cima dela. Por isso o CSS colado no
> `banner.liquid` vale para a área inteira. Se a seção **Banner** for removida
> da home, a estilização sai junto: nesse caso, cole o mesmo bloco no topo de
> `courses.liquid`.

### Rótulos que vêm do app, não do tema

Nem o painel nem os arquivos de `locales/` alcançam estes dois. Eles são
trocados por CSS: o texto original vira `font-size: 0` e o novo entra num
`::after`.

| # | Onde | Antes | Depois |
|---|---|---|---|
| 1 | Menu lateral | Continuar assistindo | **Continuar lendo** — o campo do item aparece `disabled` no painel *Menu* |
| 2 | Página do livro | 1 módulo • 1 aula | **A ERA DA MENTE CANSADA** (`.course header`) |
| 3 | Seletor de módulos | Nome + "1 aula" | só o nome — "aula" não é o vocabulário da editora |
| 4 | Topo do livro | nome do módulo + título da aula | ambos escondidos — repetiam o que já aparece logo abaixo e cobriam a arte |
| 5 | Botão Começar/Retomar | preto, ícone de play | **dourado, livro aberto, "Ler"** |
| 6 | Bloco de texto do topo | largura total | `max-width: 52%` no desktop, para não atravessar a arte |

A linha da série (item 2) ficou **sem o número do livro** de propósito: o CSS é
o mesmo para todos os cursos, então "Livro 1" ficaria errado no dia que entrar
o livro 2. Quem carrega o número do livro é a arte da capa.

O ícone do botão (item 5) entra como `mask` a partir de um SVG em `data:` URI
com `%3C`/`%3E` no lugar dos sinais de menor e maior — ver a armadilha 1 logo
abaixo.

### Três armadilhas da plataforma (descobertas na prática)

1. **A Kiwify escapa o sinal de maior dentro da seção.** Um seletor com
   combinador filho vira `&gt;` no HTML e o navegador **descarta a regra
   inteira** — confirmado lendo `style.sheet.cssRules` na página no ar, que
   voltou vazio. Todos os seletores aqui são descendentes.
2. **O editor de código não permite criar arquivos novos** — só editar os 12 que
   já existem. Por isso o CSS mora dentro de arquivos existentes.
3. **Tags `<link>` aparecem como texto visível** na tela. As fontes entram por
   `@import` dentro do `<style>`.

A limitação 2 torna as seções `guecas-*.liquid` deste repositório
**inaplicáveis do jeito que foram escritas** (elas pressupõem arquivos novos).
Ficam como referência de design, caso a Kiwify passe a permitir.

4. **Não renomeie módulo nem aula pela linha da lista** (aquele campo com
   sublinhado pontilhado em *Cursos*). Editando ali o nome do módulo e o da
   aula saíram trocados. Use o ⋮ → *Editar módulo* e o ✎ → *Editar conteúdo*,
   que salvam certo.

### Textos em `locales/pt.default.json`

```json
{
  "login":   { "title": "Acessar sua biblioteca" },
  "content": { "expired": "Esse conteúdo já expirou",
               "upcoming": "Liberação em {{date}}",
               "locked": "Conteúdo não disponível" },
  "continue_watching": { "title": "Continuar lendo",
                         "fake_lesson": "Meu primeiro capítulo" }
}
```

### Links do menu lateral

| Item | Destino |
|---|---|
| Instagram | `https://www.instagram.com/guecashouse/` |
| Suporte | `https://guecashouse.com.br/contato.html` |

---

## Imagens

```bash
python kiwify-area-membros/gerar-imagens.py
```

Gera tudo em `arquivos/assets/banners-membros/`. Precisa de Pillow e das fontes
Cinzel/Alegreya instaladas (as mesmas do site).

| Arquivo | Onde entra na Kiwify |
|---|---|
| `banner-serie-desktop.jpg` (1920×640) | Editor → Início → Banner → Slide → **Imagem Desktop** |
| `banner-serie-mobile.jpg` (900×900) | mesma tela → **Imagem Mobile** |
| `capa-social-1200x630.jpg` | Editor → Configurações → imagem de compartilhamento |
| `capa-area-640x360.jpg` | Editor → Configurações → **Imagem de capa** |
| `capa-curso-o-peso-invisivel.jpg` (800×1200) | Cursos → O Peso Invisível → ⚙ → Layout → **Capa do curso** |
| `capa-modulo-o-livro.jpg` (800×1200) | Cursos → ⋮ do módulo → Editar módulo → **Imagem** |
| `capa-aula-peso-invisivel.jpg` (1280×720) | Cursos → aula → ✎ → **Thumbnail** |
| `arquivos/assets/favicon-64.png` | Editor → Configurações → **Favicon** |

**Duas regras de composição** que valem para qualquer livro novo:

- Nos cards **2:3** e **16:9**, a Kiwify escreve o título por cima do canto
  inferior esquerdo. A silhueta sangra pela base justamente para deixar preto
  ali — texto branco sobre preto continua legível.
- A arte **não repete** o nome do livro nem "livro completo": esses textos a
  Kiwify já escreve por cima, no card e no topo da página do livro. A arte
  carrega só a série e o número do livro.

A silhueta sai da própria capa (`arquivos/Imagens/capa-o-peso-invisivel.png`),
recortada entre 33% e 86% da altura e dissolvida nas bordas com máscara
desfocada — por isso ela nasce do fundo sem emenda visível.

---

## Arquivos deste diretório

```
kiwify-area-membros/
├── gerar-imagens.py              ← gera todas as artes da área
├── APLICADO-identidade.liquid    ← o bloco de repintura que está em produção
├── sections/guecas-*.liquid      ← referência de design (exigem criar arquivos)
├── snippets/guecas-base.liquid   ← base das seções acima
└── templates/*.EXEMPLO.json      ← só referência de formato, não colar direto
```

**Não substitua `templates/index.json`.** O tema padrão já traz `banner`,
`courses`, `modules`, `lessons` e `continue_watching` — trocar o arquivo inteiro
apagaria todas elas e o que já foi configurado. Os `*.EXEMPLO.json` servem só
para ver o formato.

**O botão de login não pode ser trocado.** Em `guecas-login.liquid` a linha
`{% render 'auth-button' %}` é o componente oficial da Kiwify — é ele que
autentica o aluno. Se sair, ninguém entra.
