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
- `scripts/gerar-paginas-catalogo.cjs`: recria as páginas editoriais, os grids e a busca.

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
