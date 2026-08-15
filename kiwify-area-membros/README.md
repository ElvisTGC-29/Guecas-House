# Área de membros Kiwify — tema Guecas House

Tema da área de membros com a mesma identidade do site: navy `#1B3A57`,
dourado `#D0BB6C`, títulos em **Cinzel** e texto em **Alegreya**.

## Arquivos

```
kiwify-area-membros/
├── sections/
│   ├── guecas-identidade.liquid  ← ⭐ repinta o tema inteiro (comece por aqui)
│   ├── guecas-login.liquid       ← tela de login própria (opcional)
│   ├── guecas-hero.liquid        ← faixa de boas-vindas (opcional)
│   └── guecas-cursos.liquid      ← prateleira de ebooks própria (opcional)
├── snippets/
│   └── guecas-base.liquid        ← base usada pelas seções opcionais
└── templates/
    └── *.EXEMPLO.json            ← só referência de formato, não colar direto
```

## Caminho 1 — só a repintura (recomendado começar por aqui)

Aplica a cara do site sobre as seções que já existem, sem trocar nenhuma
delas. É o caminho de menor risco: o arquivo mexe apenas em cor, fonte,
borda e sombra — nunca em `display`, `position` ou tamanho —, então não tem
como quebrar o carrossel nem o funcionamento dos cursos.

1. Na Kiwify, abra **Área de membros → Tema**.
2. **Duplique o tema padrão antes de qualquer coisa** e trabalhe na cópia.
3. No **Editor de Código**, crie `sections/guecas-identidade.liquid` e cole
   o conteúdo do arquivo daqui.
4. Abra `templates/index.json` e **acrescente** (sem apagar nada):
   - no objeto `sections`, a entrada:
     `"identidade": { "type": "guecas-identidade", "settings": {} }`
   - no array `order`, o nome `"identidade"` como **primeiro** item.
5. Repita o mesmo em `templates/login.json`.
6. **Pré-visualize.** Confirme que o login funciona, os cursos aparecem e o
   carrossel gira. Só então publique.

Cores e um campo de CSS extra ficam editáveis pelo Editor de Tema, sem
mexer no código.

## Caminho 2 — seções próprias (opcional, depois)

As outras três seções substituem partes do tema por versões desenhadas do
zero. Dão mais controle visual, mas assumem a lógica no lugar da original —
por isso só valem a pena depois que o Caminho 1 estiver no ar e estável.

1. Crie `snippets/guecas-base.liquid` (as três dependem dele).
2. Crie as seções que quiser usar:
   - `sections/guecas-login.liquid`
   - `sections/guecas-hero.liquid`
   - `sections/guecas-cursos.liquid`
3. **Não substitua os templates.** O tema padrão já traz `banner`,
   `courses`, `modules`, `lessons` e `continue_watching` — trocar o
   `index.json` inteiro apagaria todas elas e o que você já configurou.
   Acrescente as novas entradas ao que já existe; os arquivos
   `templates/*.EXEMPLO.json` servem só de referência do formato.
4. **Pré-visualize antes de publicar.**

## Pontos de atenção

**O botão de login não pode ser trocado.** Em `guecas-login.liquid` a linha
`{% render 'auth-button' %}` é o componente oficial da Kiwify — é ele que
autentica o aluno. O arquivo apenas o repinta com as cores da marca por
fora; se essa linha for removida, ninguém consegue entrar.

**A logo é escolhida no editor**, não no código: abra a seção de login no
Editor de Tema e envie a imagem no campo "Logo". Sugestão de arquivo do
próprio site: `arquivos/assets/logo-1-vertical.png`.

**Nomes de propriedades dos objetos.** As seções usam `all_courses` e, de
cada curso, `name`, `thumbnail`, `url` e `user_data.progress`. Esses nomes
vieram da documentação da Kiwify, mas a documentação pública não lista
todas as propriedades — se alguma capa ou o progresso não aparecer, o mais
provável é que o nome do campo seja outro. Nesse caso dá para inspecionar o
que existe de verdade colando isto temporariamente numa seção:

```liquid
<pre style="color:#fff; font-size:11px; white-space:pre-wrap;">
  {%- for course in all_courses -%}{{ course | json }}{%- endfor -%}
</pre>
```

**Não testado no renderizador da Kiwify.** Este tema foi escrito seguindo a
documentação oficial, mas não há como executá-lo fora da plataforma — por
isso os passos de duplicar o tema e pré-visualizar antes de publicar.

## Personalização

Todas as cores estão em um lugar só: o bloco `:root` no início de
`snippets/guecas-base.liquid`. Mudou lá, mudou em todas as seções.

Textos, imagem de fundo, logo, espaçamentos e largura das capas são
editáveis pelo Editor de Tema, sem mexer no código.
