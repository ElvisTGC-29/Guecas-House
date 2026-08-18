# Estrutura do catálogo — Guecas House

## Site público

- `colecoes.html`: entrada dos três acervos.
- `a-era-da-mente-cansada.html`: volumes 1 a 10.
- `felicidade-sob-pressao.html`: volumes 11 a 20.
- `fanfics.html`: publicações de leitura livre.
- `paginas-detalhes/`: página individual de cada publicação.
- `arquivos/capas/ebooks/`: capas WebP prontas para o site.
- `arquivos/capas/acervos/`: artes WebP dos acervos.
- `dados/catalogo.json`: fonte única de títulos, subtítulos, status, links e capas.
- `dados/institucional.json`: fonte das páginas de autoria, confiança e políticas.
- `dados/posts.json`: fonte das postagens editoriais.
- `artigos.html` e `artigos/`: índice e páginas públicas geradas pelo painel.
- `scripts/gerar-paginas-catalogo.cjs`: recria as páginas editoriais, os grids e a busca.

## Painel editorial local

- `iniciar-painel.bat`: inicia o painel em `http://127.0.0.1:8765/` e a prévia em `http://127.0.0.1:8766/`.
- `admin-local/app.py`: autenticação, catálogo, postagens, políticas, auditoria, backup e publicação.
- `admin-local/.env`: configuração privada do envio de recuperação por e-mail; nunca é versionada.
- `admin-local/data/`: banco SQLite, backups e arquivos master locais; nunca é versionada.
- `redefinir-senha-painel.bat`: recuperação local de emergência.

Não existe rota administrativa no site publicado. O painel aceita somente conexões do próprio computador.

## Regra de publicação

Os volumes ainda não lançados possuem páginas completas para edição, porém usam `noindex, follow`. Assim, o Google não indexa sinopses provisórias. Ao publicar um título, devem ser confirmados sinopse, preço, formato, data e link de compra; depois, altere o status no catálogo, revise a página e inclua a URL no `sitemap.xml`.

## Capas

`O Peso Invisível` é a capa oficial e o arquétipo visual da coleção. As capas antigas dos demais ebooks foram desconsideradas. A capa de `Alvo Dumbledore e as Memórias Ancestrais` não pertence a esta edição e permanece inalterada.

As fontes oficiais são Cormorant Garamond para títulos e Antonio para elementos editoriais. O site guarda apenas as versões otimizadas. Os fundos, masters e o template editável ficam no workspace editorial:

`F:\01 - Empresas Clientes\Guecas House Séries\04-Ferramentas\capas-site`

## Fluxo de atualização

1. Edite o registro em `dados/catalogo.json`.
2. Para texto e estrutura, execute `scripts/gerar-paginas-catalogo.cjs`.
3. Para arte, atualize o fundo ou a composição em `04-Ferramentas/capas-site` e renderize novamente.
4. Revise a página, links, imagem, SEO e responsividade antes da publicação.
