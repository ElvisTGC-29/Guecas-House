# Checklist mestre de SEO — Guecas House

Atualizado em: 16/08/2026  
Projeto: `guecas-site`  
Domínio: `https://www.guecashouse.com.br/`

## Objetivo

Organizar as melhorias de SEO técnico, desempenho, conteúdo, autoridade e monitoramento da Guecas House. Este checklist melhora a capacidade de rastreamento, a experiência do usuário e os sinais de relevância do site, mas não representa garantia de posição específica no Google.

## Legenda

- `[x]` Concluído e validado.
- `[ ]` Pendente.
- **P0 — imediato:** descoberta, indexação ou erro crítico.
- **P1 — alto impacto:** velocidade, arquitetura e confiança.
- **P2 — crescimento:** conteúdo e autoridade.
- **P3 — opcional:** refinamento ou expansão futura.

---

## 1. Base de SEO já concluída

- [x] Propriedade de domínio `guecashouse.com.br` verificada no Google Search Console.
- [x] Registro TXT de verificação publicado no DNS do Registro.br.
- [x] Títulos exclusivos nas 9 páginas públicas.
- [x] Meta descriptions exclusivas nas 9 páginas públicas.
- [x] URLs canônicas absolutas e sem duplicidade.
- [x] Regras `robots` de indexação e prévias ampliadas nas páginas públicas.
- [x] Open Graph configurado.
- [x] Twitter Cards configuradas.
- [x] Dados estruturados de organização e site na página inicial.
- [x] Dados estruturados de coleções e listas de títulos.
- [x] Dados estruturados de livro e produto em `O Peso Invisível`.
- [x] Dados estruturados de livro na fanfic.
- [x] Breadcrumbs em JSON-LD nas páginas relevantes.
- [x] Exatamente um `H1` em cada página pública.
- [x] Páginas utilitárias e modelos marcados como `noindex`.
- [x] URLs antigas vazias convertidas em encaminhamentos para páginas válidas.
- [x] `robots.txt` criado.
- [x] `sitemap.xml` criado com 9 URLs canônicas.
- [x] SEO transferido para o projeto principal e publicado.
- [x] Homepage pública exibindo o novo título SEO.

---

## 2. Descoberta e indexação no Google

Prioridade: **P0 — imediato**

- [x] Confirmar que `https://www.guecashouse.com.br/robots.txt` retorna HTTP 200 — validado em 16/08/2026.
- [x] Confirmar que `https://www.guecashouse.com.br/sitemap.xml` está acessível e contém XML válido (processado pelo Google, 9 páginas encontradas).
- [x] Enviar `sitemap.xml` em Search Console → Indexação → Sitemaps.
- [x] Inspecionar a URL `https://www.guecashouse.com.br/`.
- [x] Executar o teste da URL publicada — resultado: URL disponível para o Google e indexação permitida.
- [x] Solicitar indexação da página inicial — adicionada à fila de rastreamento prioritário em 16/08/2026.
- [x] Inspecionar as 6 páginas prioritárias — todas detectadas pelo sitemap e ainda não indexadas.
- [x] Solicitar indexação das páginas prioritárias — todas adicionadas à fila em 16/08/2026:
  - [x] `/colecoes.html`
  - [x] `/a-era-da-mente-cansada.html`
  - [x] `/paginas-detalhes/detalhes-o-peso-invisivel.html`
  - [x] `/fanfics.html`
  - [x] `/paginas-detalhes/detalhes-alvo-dumbledore-e-as-memorias-ancestrais.html`
  - [x] `/sobre.html`
- [x] Conferir em Search Console se existem ações manuais — nenhum problema detectado.
- [x] Conferir o relatório de problemas de segurança — nenhum problema detectado.
- [ ] Aguardar pelo menos 7 dias antes de considerar a ausência no índice um erro.
- [x] Registrar a situação inicial das pesquisas em 16/08/2026 — ainda sem resultados oficiais do domínio:
  - [x] `site:guecashouse.com.br`
  - [x] `"Guecas House"`
  - [x] `Guecas House ebooks`

### Critério de conclusão

- Sitemap com status **Sucesso** no Search Console.
- Homepage e páginas prioritárias reconhecidas pelo inspetor de URLs.
- Nenhuma ação manual ou problema de segurança ativo.

---

## 3. Velocidade e Core Web Vitals

Prioridade: **P1 — alto impacto**

### Diagnóstico atual

- 87 elementos `<img>` sem `width` e `height` explícitos.
- 87 elementos `<img>` sem estratégia de carregamento definida.
- Capas e imagens entre aproximadamente 1 MB e 8,36 MB.
- Banner desktop em vídeo com aproximadamente 4,61 MB.
- Banner mobile em vídeo com aproximadamente 1,41 MB.
- Capa de `O Peso Invisível` com aproximadamente 2,77 MB.
- Capa da fanfic com aproximadamente 2,29 MB.

### Medição inicial

- [x] Executar PageSpeed Insights mobile na homepage — desempenho 62; FCP 2,6 s; LCP 22,6 s; TBT 0 ms; CLS 0; 7.905 KiB.
- [x] Executar PageSpeed Insights desktop na homepage — desempenho 76; FCP 0,7 s; LCP 3,7 s; TBT 0 ms; CLS 0,002; 11.191 KiB.
- [x] Executar PageSpeed Insights mobile na página de `O Peso Invisível` — desempenho 43; FCP 2,7 s; LCP 22,2 s; TBT 0 ms; CLS 0,523; 4.194 KiB.
- [x] Registrar LCP, CLS, peso transferido e observações antes das mudanças em 16/08/2026. Ainda não há dados reais de usuários suficientes para informar INP.

### Imagens

- [x] Identificar quais arquivos grandes realmente estão em uso.
- [x] Confirmar que `arquivos/Imagens/2.png` e `3.png` não são carregados por nenhuma página pública.
- [x] Gerar versões WebP de 400 px e 800 px das capas utilizadas.
- [x] Criar miniaturas menores para os cards do acervo.
- [x] Não carregar a imagem original de alta resolução em cards pequenos.
- [x] Adicionar `width` e `height` nas 87 imagens das páginas públicas.
- [x] Usar `loading="lazy"` nas 67 imagens abaixo da primeira tela.
- [x] Manter carregamento imediato somente nas capas principais e nos pequenos logotipos do cabeçalho.
- [x] Usar `fetchpriority="high"` somente nas capas principais das páginas de detalhes.
- [x] Adicionar `decoding="async"` nas imagens.
- [x] Criar `srcset` e `sizes` para as capas principais responsivas.
- [x] Substituir a imagem externa do Instagram por um SVG local de 0,7 KiB.
- [x] Conferir textos alternativos; logotipos decorativos usam `alt=""` para evitar redundância.

### Vídeo e scripts

- [ ] Comprimir novamente os banners desktop e mobile.
- [x] Definir uma imagem `poster` leve para o banner.
- [x] Trocar `preload="auto"` por `preload="none"` e iniciar o vídeo somente quando o navegador estiver ocioso.
- [x] Impedir o download simultâneo das versões desktop e mobile.
- [x] Carregar PDF.js sob demanda, somente quando o usuário abre a prévia.
- [ ] Auditar CSS e JavaScript não utilizados.
- [x] Remover o `@import` encadeado das fontes e antecipar as conexões com o Google Fonts.
- [x] Adiar scripts não críticos da homepage com `defer`.
- [x] Verificar erros e avisos no console do navegador — nenhum erro no teste local.

### Metas técnicas

- [ ] LCP igual ou inferior a 2,5 segundos.
- [ ] INP inferior a 200 milissegundos.
- [ ] CLS igual ou inferior a 0,1.
- [ ] Nenhuma mudança visual inesperada causada por imagens sem dimensões.

---

## 4. Links, navegação e arquitetura

Prioridade: **P1 — alto impacto**

### Diagnóstico atual

- Foram encontradas 41 ocorrências de `href="#"`.
- A maior parte representa títulos ainda não publicados ou botões provisórios.

### Correções

- [ ] Substituir cards “Em breve” sem destino por elementos não clicáveis.
- [ ] Usar `<button>` para ações controladas por JavaScript.
- [ ] Usar `<a>` somente quando existir uma URL navegável real.
- [ ] Remover `target="_blank"` de links provisórios.
- [ ] Criar páginas individuais apenas quando houver conteúdo original suficiente.
- [ ] Não criar páginas vazias ou muito superficiais somente para ocupar palavras-chave.
- [ ] Garantir que cada página indexável receba pelo menos um link interno contextual.
- [ ] Adicionar links contextuais entre:
  - [ ] Homepage e coleções.
  - [ ] Coleções e livros publicados.
  - [ ] Artigos e ebooks relacionados.
  - [ ] Página do autor e publicações.
- [ ] Adicionar breadcrumbs visíveis nas páginas de detalhes.
- [ ] Criar uma página `404.html` útil, com links para início, acervo, fanfics e contato.
- [ ] Testar todos os links internos após cada publicação.
- [ ] Confirmar redirecionamento consistente entre domínio com e sem `www`.
- [ ] Confirmar que HTTP redireciona para HTTPS.

### Critério de conclusão

- Nenhum `href="#"` usado como substituto de página.
- Nenhum link interno quebrado.
- Todas as páginas prioritárias acessíveis pela navegação ou por links contextuais.

---

## 5. Autoria, confiança e política editorial

Prioridade: **P1 — alto impacto**

Os temas de cansaço emocional e bem-estar exigem cuidado adicional com autoria, fontes e limites do conteúdo.

- [ ] Criar página do autor Elvis T. G. Castro.
- [ ] Definir biografia pública aprovada pelo autor.
- [ ] Informar experiência, relação com os temas e proposta editorial sem inventar credenciais.
- [ ] Adicionar foto ou identidade visual do autor, caso desejado.
- [ ] Adicionar assinatura de autoria nas páginas de livros e artigos.
- [ ] Fazer a assinatura apontar para a página do autor.
- [ ] Adicionar data real de publicação.
- [ ] Adicionar data de atualização somente quando houver mudança material.
- [ ] Criar política editorial da Guecas House.
- [ ] Explicar como os temas são pesquisados e revisados.
- [ ] Adicionar referências bibliográficas quando houver afirmações de psicologia ou neurociência.
- [ ] Priorizar fontes primárias, universidades, órgãos de saúde e artigos científicos.
- [ ] Criar aviso de conteúdo informativo.
- [ ] Informar que os ebooks não substituem avaliação ou acompanhamento profissional.
- [ ] Revisar qualquer afirmação que possa soar como diagnóstico, tratamento ou promessa de resultado.
- [ ] Criar página de política de privacidade.
- [ ] Criar termos de uso e informações sobre entrega digital.
- [ ] Publicar política de reembolso compatível com a venda realizada pela Kiwify.
- [ ] Informar no formulário de contato como os dados enviados são utilizados.

---

## 6. Dados estruturados — próxima etapa

Prioridade: **P1/P2**

- [ ] Criar marcação `Person` para o autor após aprovação da biografia.
- [ ] Relacionar `Person` aos livros e artigos usando `author`.
- [ ] Validar todo JSON-LD no Schema Markup Validator.
- [ ] Validar o produto no Rich Results Test.
- [ ] Corrigir erros obrigatórios encontrados pelos validadores.
- [ ] Avaliar avisos recomendados sem inventar dados inexistentes.
- [ ] Manter preço e disponibilidade do produto sincronizados com a página.
- [ ] Adicionar ISBN apenas se houver um ISBN oficial.
- [ ] Nunca publicar avaliações ou notas agregadas fictícias.
- [ ] Usar `Article` nos futuros conteúdos editoriais.
- [ ] Manter dados estruturados compatíveis com o texto visível na página.

---

## 7. Conteúdo para crescimento orgânico

Prioridade: **P2 — crescimento**

### Estrutura editorial

- [ ] Criar uma área de artigos ou reflexões.
- [ ] Definir categorias editoriais coerentes com o catálogo.
- [ ] Criar uma página índice para os artigos.
- [ ] Adicionar os artigos publicados ao sitemap.
- [ ] Criar título, descrição, canonical, Open Graph e `Article` em cada artigo.
- [ ] Incluir autor, data, referências e links internos.
- [ ] Produzir conteúdo original e útil, sem texto criado apenas para alcançar uma quantidade de palavras.
- [ ] Evitar dezenas de páginas muito parecidas para variações da mesma pesquisa.

### Primeiros temas sugeridos

- [ ] Por que acordo cansado mesmo depois de dormir?
- [ ] Cansaço emocional ou físico: como reconhecer as diferenças?
- [ ] Como a vida digital fragmenta a atenção.
- [ ] Por que descansar pode provocar culpa?
- [ ] O que é fadiga emocional e quando buscar ajuda?
- [ ] Mente acelerada à noite: hábitos que podem estar contribuindo.
- [ ] Produtividade tóxica: quando produzir deixa de ser saudável.
- [ ] Solidão conectada: por que estar online nem sempre aproxima.

### Critério de qualidade para cada conteúdo

- [ ] Responde claramente a uma necessidade real do leitor.
- [ ] Apresenta ponto de vista ou experiência original.
- [ ] Não promete cura, diagnóstico ou resultado garantido.
- [ ] Cita fontes para afirmações verificáveis.
- [ ] Tem autoria e responsabilidade editorial claras.
- [ ] Conecta-se naturalmente a outra página útil do site.
- [ ] Possui imagem original ou licenciada e otimizada.

---

## 8. Imagens sociais e SEO de imagens

Prioridade: **P2 — crescimento**

- [ ] Criar imagem social 1200 × 630 para a Guecas House.
- [ ] Criar imagem social 1200 × 630 para `A Era da Mente Cansada`.
- [ ] Criar imagem social 1200 × 630 para `Felicidade Realista`.
- [ ] Criar imagem social 1200 × 630 para o acervo fanfic.
- [ ] Criar imagem social para cada ebook efetivamente publicado.
- [ ] Não usar a capa de uma coleção para representar outra coleção.
- [ ] Adicionar `twitter:image:alt` nas páginas públicas.
- [ ] Usar nomes de arquivo descritivos.
- [ ] Manter a imagem próxima do texto ao qual ela se refere.
- [ ] Testar prévias em compartilhamentos após a publicação.

---

## 9. Autoridade e reconhecimento da marca

Prioridade: **P2 — crescimento contínuo**

- [ ] Usar sempre a grafia exata `Guecas House`.
- [ ] Atualizar a biografia do Instagram com o domínio oficial.
- [ ] Confirmar o domínio oficial no perfil da Kiwify.
- [ ] Fazer perfis do autor apontarem para o site.
- [ ] Divulgar páginas específicas, e não apenas a homepage.
- [ ] Buscar menções editoriais legítimas em sites e perfis relacionados a livros.
- [ ] Participar de entrevistas, resenhas e colaborações reais.
- [ ] Não comprar backlinks ou participar de redes artificiais de links.
- [ ] Monitorar pesquisas que confundem `Guecas` com `cuecas`.
- [ ] Manter identidade, descrição e nome consistentes em todos os canais.

---

## 10. Analytics e acompanhamento

Prioridade: **P2 — necessário para decidir**

- [ ] Definir se será utilizado Google Analytics 4 ou apenas Search Console.
- [ ] Se houver Analytics, implementar consentimento e política de privacidade adequados.
- [ ] Registrar eventos realmente úteis:
  - [ ] Clique em “Comprar”.
  - [ ] Abertura de prévia.
  - [ ] Download de fanfic.
  - [ ] Envio de contato.
  - [ ] Navegação para uma coleção.
- [ ] Criar uma planilha ou relatório mensal de SEO.
- [ ] Acompanhar impressões, cliques, CTR e posição média.
- [ ] Acompanhar consultas relacionadas à marca.
- [ ] Acompanhar páginas indexadas e páginas excluídas.
- [ ] Verificar Core Web Vitals mensalmente.
- [ ] Revisar erros 404 e links quebrados.
- [ ] Atualizar o sitemap sempre que uma página indexável for criada ou removida.
- [ ] Não alterar datas somente para simular conteúdo recente.

---

## 11. Rotina de publicação de cada nova página

- [ ] Definir uma intenção e um público claros.
- [ ] Criar conteúdo completo e original.
- [ ] Escrever um único `H1` descritivo.
- [ ] Criar `<title>` exclusivo.
- [ ] Criar meta description exclusiva.
- [ ] Definir canonical absoluto.
- [ ] Configurar Open Graph e Twitter Card.
- [ ] Criar imagem social 1200 × 630.
- [ ] Otimizar imagens e adicionar dimensões.
- [ ] Adicionar autoria e data real.
- [ ] Adicionar referências quando necessárias.
- [ ] Adicionar links internos contextuais.
- [ ] Adicionar dados estruturados adequados ao conteúdo.
- [ ] Incluir a URL no sitemap.
- [ ] Validar links e JSON-LD.
- [ ] Publicar e confirmar HTTP 200.
- [ ] Inspecionar a URL no Search Console.
- [ ] Solicitar indexação quando a página for prioritária.

---

## 12. Ordem recomendada de execução

### Fase 1 — indexação e medição

- [ ] Concluir todos os itens P0 da seção 2.
- [ ] Registrar PageSpeed e situação inicial no Google.

### Fase 2 — desempenho

- [ ] Otimizar imagens e banner em vídeo.
- [ ] Adicionar dimensões, lazy loading e imagens responsivas.
- [ ] Medir novamente e comparar com a linha de base.

### Fase 3 — arquitetura

- [ ] Corrigir os 41 links provisórios.
- [ ] Criar 404 e breadcrumbs visíveis.
- [ ] Validar todos os links e redirecionamentos.

### Fase 4 — confiança

- [ ] Criar página do autor, política editorial, fontes e avisos.
- [ ] Criar política de privacidade e informações comerciais.

### Fase 5 — crescimento

- [ ] Publicar os primeiros conteúdos editoriais de alta qualidade.
- [ ] Criar imagens sociais próprias.
- [ ] Fortalecer referências externas e consistência da marca.

### Fase 6 — acompanhamento contínuo

- [ ] Revisar Search Console mensalmente.
- [ ] Priorizar melhorias usando consultas e páginas que já recebem impressões.

---

## Referências oficiais

- [Conteúdo útil, confiável e feito para pessoas](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Boas práticas para links rastreáveis](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [SEO para imagens](https://developers.google.com/search/docs/appearance/google-images)
- [Solicitar novo rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Nomes de sites no Google](https://developers.google.com/search/docs/appearance/site-names)

---

## Registro de decisões

Use esta seção durante a análise antes de iniciar cada fase.

| Data | Item | Decisão | Responsável | Observação |
|---|---|---|---|---|
|  |  |  |  |  |
