# Área de membros Kiwify — tema Guecas House

Tema da área de membros com a mesma identidade do site: navy `#1B3A57`,
dourado `#D0BB6C`, títulos em **Cinzel** e texto em **Alegreya**.

## Arquivos

```
kiwify-area-membros/
├── snippets/
│   └── guecas-base.liquid      ← fontes + cores da marca (base de tudo)
├── sections/
│   ├── guecas-login.liquid     ← tela de login
│   ├── guecas-hero.liquid      ← faixa de boas-vindas do painel
│   └── guecas-cursos.liquid    ← prateleira de ebooks com progresso
└── templates/
    ├── login.json              ← monta a página de login
    └── index.json              ← monta o painel principal
```

## Como instalar

1. Na Kiwify, abra **Área de membros → Tema**.
2. **Duplique o tema padrão antes de qualquer coisa.** Trabalhe sempre na
   cópia — assim o tema original continua intacto para voltar atrás.
3. Abra o **Editor de Código** da cópia.
4. Crie os arquivos com exatamente estes nomes e cole o conteúdo:
   - `snippets/guecas-base.liquid`
   - `sections/guecas-login.liquid`
   - `sections/guecas-hero.liquid`
   - `sections/guecas-cursos.liquid`
5. Substitua o conteúdo de `templates/login.json` e `templates/index.json`
   pelos arquivos daqui.
6. **Pré-visualize antes de publicar.** Só publique depois de confirmar que
   o login funciona e os ebooks aparecem.

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
