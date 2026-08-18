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

### Medição após publicação — 16/08/2026

- [x] Homepage mobile — desempenho **90**; FCP 2,6 s; LCP 2,7 s; TBT 0 ms; CLS 0; Speed Index 4,7 s.
- [x] Homepage desktop — desempenho **100**; FCP 0,7 s; LCP 0,7 s; TBT 0 ms; CLS 0,002; Speed Index 0,7 s.
- [x] Página de `O Peso Invisível` no mobile — desempenho **93**; FCP 2,6 s; LCP 2,6 s; TBT 0 ms; CLS 0,001; Speed Index 2,6 s.
- [x] Confirmar SEO e Boas Práticas com nota 100 nas páginas medidas.
- [x] Registrar a evolução: homepage mobile de 62 para 90; homepage desktop de 76 para 100; página do ebook no mobile de 43 para 93.
- [x] Confirmar a correção da instabilidade visual da página do ebook: CLS de 0,523 para 0,001.
- [ ] Aguardar dados reais de usuários do Google para validar INP e o relatório de Core Web Vitals. O ciclo normalmente precisa de até 28 dias de tráfego suficiente.

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
- [x] CLS igual ou inferior a 0,1 nas medições de laboratório.
- [x] Nenhuma mudança visual inesperada causada por imagens sem dimensões.

### Situação da etapa

- [x] Primeira rodada de Velocidade e Core Web Vitals concluída e validada em produção.
- O LCP ficou entre 2,6 e 2,7 s no mobile, apenas 0,1–0,2 s acima da meta de 2,5 s; novas otimizações passam a ser incrementais.
- Compressão adicional do vídeo, cache e redução do bloqueio de renderização permanecem como melhorias futuras, sem impedir o encerramento desta rodada.

---

## 4. Links, navegação e arquitetura

Prioridade: **P1 — alto impacto**

### Diagnóstico atual

- Não há mais ocorrências de `href="#"` nas páginas públicas.
- Não foram encontrados links internos quebrados nas páginas públicas.
- As 21 páginas de detalhes possuem breadcrumbs visíveis e dados estruturados correspondentes.
- As páginas auxiliares e os arquivos antigos de compatibilidade permanecem com `noindex`.

### Correções

- [x] Substituir cards “Em breve” sem destino por páginas editoriais reais ou elementos não clicáveis.
- [x] Usar `<button>` para ações controladas por JavaScript.
- [x] Usar `<a>` somente quando existir uma URL navegável real.
- [x] Remover `target="_blank"` de links provisórios.
- [x] Criar páginas individuais apenas quando houver conteúdo original suficiente.
- [x] Não criar páginas vazias ou muito superficiais somente para ocupar palavras-chave.
- [x] Garantir que cada página indexável receba pelo menos um link interno contextual.
- [x] Adicionar links contextuais entre:
  - [x] Homepage e coleções.
  - [x] Coleções e livros publicados.
  - [x] Ebooks relacionados dentro de cada série.
  - [x] Página Sobre e publicações.
  - [x] Fanfics e suas páginas de detalhes.
- [x] Adicionar breadcrumbs visíveis nas páginas de detalhes.
- [x] Criar uma página `404.html` útil, com links para início, acervo, fanfics e contato.
- [x] Testar todos os links internos após cada publicação.
- [x] Confirmar redirecionamento consistente entre domínio com e sem `www`.
- [x] Confirmar que HTTP redireciona para HTTPS.

Verificação externa realizada em 16/08/2026: todas as variações testadas chegam a `https://www.guecashouse.com.br/` em no máximo um redirecionamento.

### Critério de conclusão

- Nenhum `href="#"` usado como substituto de página.
- Nenhum link interno quebrado.
- Todas as páginas prioritárias acessíveis pela navegação ou por links contextuais.

---

## 5. Autoria, confiança e política editorial

Prioridade: **P1 — alto impacto**

Os temas de cansaço emocional e bem-estar exigem cuidado adicional com autoria, fontes e limites do conteúdo.

- [x] Criar página do autor Elvis T. G. Castro.
- [ ] Definir biografia pública aprovada pelo autor — texto conservador criado como rascunho e aguardando aprovação no painel editorial.
- [x] Informar experiência, relação com os temas e proposta editorial sem inventar credenciais.
- [x] Adicionar foto ou identidade visual do autor, caso desejado — aplicada a identidade visual da Guecas House; foto pessoal permanece opcional.
- [x] Adicionar assinatura de autoria nas páginas de livros e artigos.
- [x] Fazer a assinatura apontar para a página do autor.
- [ ] Adicionar data real de publicação.
- [x] Adicionar data de atualização somente quando houver mudança material — regra documentada e campo específico criado no painel.
- [x] Criar política editorial da Guecas House.
- [x] Explicar como os temas são pesquisados e revisados.
- [ ] Adicionar referências bibliográficas quando houver afirmações de psicologia ou neurociência.
- [x] Priorizar fontes primárias, universidades, órgãos de saúde e artigos científicos — critério incorporado à política editorial e ao fluxo de publicação.
- [x] Criar aviso de conteúdo informativo.
- [x] Informar que os ebooks não substituem avaliação ou acompanhamento profissional.
- [ ] Revisar qualquer afirmação que possa soar como diagnóstico, tratamento ou promessa de resultado.
- [x] Criar página de política de privacidade.
- [x] Criar termos de uso e informações sobre entrega digital.
- [x] Publicar política de reembolso compatível com a venda realizada pela Kiwify.
- [x] Informar no formulário de contato como os dados enviados são utilizados.

### Infraestrutura editorial local

- [x] Criar painel separado do site público, acessível somente em `127.0.0.1`.
- [x] Proteger o painel com senha derivada por `scrypt`, sessão segura, CSRF e limite de tentativas de login.
- [x] Criar recuperação por e-mail com token temporário e alternativa local de emergência.
- [x] Criar fluxo de rascunho, revisão e publicação de artigos.
- [x] Criar controles para catálogo, capas, SEO, referências, autoria e políticas.
- [x] Criar prévia local, auditoria de links, histórico de ações, backups e publicação pelo Git.
- [x] Criar módulo editorial separado para fanfics com transparência de direitos.
- [x] Criar editor visual de postagens em português do Brasil e prévia protegida.
- [x] Adicionar coloração de sintaxe aos editores avançados de código.
- [x] Criar configuração guiada da recuperação por Gmail dentro do painel.
- [x] Criar manual profissional em PDF e atalho do painel com a logo oficial.
- [ ] Configurar a senha de app do Gmail localmente em `admin-local/.env` e testar o envio de recuperação.
- [ ] Revisar e aprovar a biografia pública no painel.

### Pendências editoriais que exigem informação ou revisão humana

- Informar as datas reais de publicação dos títulos já lançados.
- Inserir e conferir as referências bibliográficas dos conteúdos já publicados.
- Fazer a revisão de alegações sensíveis antes de marcar novos conteúdos como publicados.

### Situação da etapa

- [x] Infraestrutura pública de autoria, confiança e transparência concluída.
- [x] Autoria e aviso informativo aplicados às 21 páginas de detalhes.
- [x] Páginas institucionais e fluxo editorial validados em desktop e celular.
- [x] Auditoria técnica concluída sem links internos quebrados ou `href="#"`.
- [ ] Encerramento editorial aguardando aprovação da biografia, datas reais, referências e revisão das alegações sensíveis.
- [ ] Recuperação por e-mail aguardando configuração privada e teste da senha de app do Gmail.

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

- [x] Criar uma área de artigos ou reflexões.
- [ ] Definir categorias editoriais coerentes com o catálogo.
- [x] Criar uma página índice para os artigos.
- [x] Adicionar automaticamente os artigos publicados ao sitemap.
- [x] Gerar título, descrição e canonical para cada artigo.
- [ ] Adicionar Open Graph e dados estruturados `Article` a cada artigo — programado para a etapa 6.
- [x] Incluir autor, data, referências, aviso informativo e links institucionais.
- [ ] Adicionar links internos contextuais para ebooks e outros artigos conforme cada publicação for criada.
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
