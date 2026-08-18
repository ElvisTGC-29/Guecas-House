const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const catalog = JSON.parse(fs.readFileSync(path.join(root, "dados", "catalogo.json"), "utf8"));
const seriesById = Object.fromEntries(catalog.series.map((item) => [item.id, item]));

// Paletas extraídas das próprias capas. Elas contextualizam cada página sem
// alterar a arte original ou quebrar o modelo editorial compartilhado.
const coverThemes = {
  "o-peso-invisivel": { deep: "#091824", mid: "#394449", accent: "#d0bb6c" },
  "a-mente-fragmentada": { deep: "#0a0d17", mid: "#3a383e", accent: "#d1a85b" },
  "a-solidao-conectada": { deep: "#07111a", mid: "#44494a", accent: "#c5a15e" },
  "o-corpo-que-pede-socorro": { deep: "#16100e", mid: "#5c4638", accent: "#d29b56" },
  "a-geracao-do-silencio-interno": { deep: "#181219", mid: "#896661", accent: "#d3a7a1" },
  "o-culto-da-produtividade": { deep: "#171414", mid: "#564a3d", accent: "#cb8f59" },
  "o-espelho-da-comparacao": { deep: "#0a1215", mid: "#4f5046", accent: "#c6a263" },
  "a-ansiedade-da-escolha": { deep: "#05101b", mid: "#5e523d", accent: "#d1ae68" },
  "o-vazio-da-performance": { deep: "#0a080a", mid: "#4e473f", accent: "#c79565" },
  "a-esperanca-cansada": { deep: "#1e2028", mid: "#564a49", accent: "#d6aa72" },
  "a-arte-de-viver-devagar": { deep: "#232822", mid: "#7f725d", accent: "#d2b176" },
  "gratidao-lucida": { deep: "#1c1418", mid: "#775842", accent: "#d7ab8f" },
  "o-proposito-silencioso": { deep: "#13120f", mid: "#524834", accent: "#ceb174" },
  "a-serenidade-do-corpo": { deep: "#212b2a", mid: "#535850", accent: "#c7b27f" },
  "alegria-de-coisas-simples": { deep: "#29271e", mid: "#6d5e44", accent: "#d5b27d" },
  "o-poder-das-pequenas-vitorias": { deep: "#0c1827", mid: "#5f4e47", accent: "#d8ad6c" },
  "viver-com-proposito-nao-com-pressa": { deep: "#07141e", mid: "#5d5545", accent: "#d4a960" },
  "a-mente-que-descansa": { deep: "#0d1521", mid: "#605a6b", accent: "#d0c5a5" },
  "a-coragem-de-ser-imperfeito": { deep: "#191312", mid: "#846651", accent: "#d6aa79" },
  "o-caminho-da-serenidade": { deep: "#0d252e", mid: "#3a4e49", accent: "#d1b06e" }
};

for (const book of catalog.books) {
  if (coverThemes[book.slug]) book.theme = coverThemes[book.slug];
}

const focuses = {
  "a-mente-fragmentada": ["Como interrupções constantes remodelam a atenção.", "A relação entre recompensa rápida, dopamina e hábito digital.", "Práticas realistas para reconstruir foco sem abandonar a tecnologia."],
  "a-solidao-conectada": ["Por que quantidade de contatos não substitui intimidade.", "O efeito das relações mediadas por telas sobre presença e escuta.", "Caminhos para recuperar vínculos mais lentos, seguros e verdadeiros."],
  "o-corpo-que-pede-socorro": ["Os sinais físicos mais comuns de um corpo mantido em alerta.", "A ligação entre estresse prolongado, emoção reprimida e dor.", "Formas de escutar o corpo antes que o limite vire colapso."],
  "a-geracao-do-silencio-interno": ["Como reconhecer emoções quando faltam palavras para nomeá-las.", "A diferença entre sentir, reprimir e regular.", "Um vocabulário emocional aplicável à vida cotidiana."],
  "o-culto-da-produtividade": ["Como desempenho e identidade passaram a ocupar o mesmo lugar.", "A culpa associada ao descanso e à improdutividade.", "Novas medidas de valor que não dependem de tarefas concluídas."],
  "o-espelho-da-comparacao": ["Por que comparamos bastidores reais com vitrines editadas.", "Os efeitos da comparação sobre autoestima e pertencimento.", "Como recuperar critérios próprios de sucesso e suficiência."],
  "a-ansiedade-da-escolha": ["O paradoxo de ter muitas opções e sentir menos liberdade.", "Perfeccionismo, arrependimento antecipado e paralisia decisória.", "Critérios simples para escolher com menos culpa."],
  "o-vazio-da-performance": ["A distância entre a pessoa vivida e a personagem apresentada.", "O custo emocional de parecer bem o tempo inteiro.", "Como reconstruir uma identidade que não dependa de aplauso."],
  "a-esperanca-cansada": ["A diferença entre esperança honesta e promessa vazia.", "Como sustentar sentido mesmo quando a energia está baixa.", "Pequenos movimentos de reconstrução depois do esgotamento."],
  "a-arte-de-viver-devagar": ["Lentidão como atenção, discernimento e presença.", "O que muda quando o descanso deixa de ser recompensa.", "Ritmos possíveis para uma vida que não cabe na pressa."],
  "gratidao-lucida": ["Como agradecer sem negar dor, injustiça ou perda.", "A diferença entre presença e positividade tóxica.", "Práticas de gratidão compatíveis com dias difíceis."],
  "o-proposito-silencioso": ["Significado encontrado no cotidiano, não apenas em grandes missões.", "O valor das relações, do cuidado e do trabalho discreto.", "Como perceber progresso sem transformar a vida em competição."],
  "a-serenidade-do-corpo": ["Como o sistema nervoso aprende a permanecer em alerta.", "Respiração, movimento e descanso como sinais de segurança.", "Formas simples de completar o ciclo do estresse."],
  "alegria-de-coisas-simples": ["Como excesso material e emocional ocupa atenção.", "A relação entre simplicidade, tempo e presença.", "Escolhas pequenas que devolvem espaço para respirar."],
  "o-poder-das-pequenas-vitorias": ["Por que tarefas menores ajudam a romper a paralisia.", "Como progresso visível alimenta motivação e confiança.", "Uma forma sustentável de avançar sem exigir heroísmo diário."],
  "viver-com-proposito-nao-com-pressa": ["Como distinguir urgência real de pressão fabricada.", "O papel dos limites na proteção do que importa.", "Dizer não como escolha de presença, coerência e cuidado."],
  "a-mente-que-descansa": ["O efeito da estimulação noturna sobre sono e recuperação.", "Rituais de desligamento possíveis na vida real.", "Como criar uma fronteira entre o dia conectado e a noite."],
  "a-coragem-de-ser-imperfeito": ["A relação entre perfeccionismo, vergonha e comparação.", "Vulnerabilidade como coragem, não como exposição sem limites.", "Como construir valor próprio sem polir cada imperfeição."],
  "o-caminho-da-serenidade": ["Presença e flexibilidade diante de um mundo acelerado.", "Limites, significado e relações como bases do bem-estar.", "Uma síntese prática para viver sem pertencer à pressa."]
};

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function themeStyle(book) {
  const theme = book.theme || coverThemes[book.slug] || coverThemes["o-peso-invisivel"];
  const accent = theme.accent.replace("#", "");
  const rgb = [0, 2, 4].map((offset) => Number.parseInt(accent.slice(offset, offset + 2), 16)).join(", ");
  return `--cover-deep:${theme.deep};--cover-mid:${theme.mid};--cover-accent:${theme.accent};--cover-accent-rgb:${rgb}`;
}

function detailUrl(book) {
  return `paginas-detalhes/detalhes-${book.slug}.html`;
}

function cover(book, prefix = "") {
  if (book.number === 1) return `${prefix}${book.cover400}`;
  return `${prefix}arquivos/capas/ebooks/${book.slug}-400.webp`;
}

function header() {
  return `<header><div class="wrapper navbar"><a href="../" class="brand"><span class="brand-logo"><img class="brand-logo-dark" src="../arquivos/assets/logo-2b-icon-outline-64.webp" alt="" aria-hidden="true" width="32" height="32"><img class="brand-logo-light" src="../arquivos/assets/logo-2-icon-filled-64.webp" alt="" aria-hidden="true" width="32" height="32"></span><span>Guecas House</span><span style="font-weight:400;font-size:.7rem">Editora Digital</span></a><nav><button class="nav-toggle" aria-label="Abrir menu"><svg class="nav-toggle-icon" viewBox="0 0 19 18" aria-hidden="true"><rect class="nav-toggle-bar bar-top" width="19" height="2" rx="1"></rect><rect class="nav-toggle-bar bar-mid" x="3" y="8" width="13" height="2" rx="1"></rect><rect class="nav-toggle-bar bar-bottom" y="16" width="19" height="2" rx="1"></rect></svg></button><ul class="nav-links"><button class="nav-close" type="button" aria-label="Fechar menu">×</button><li><a href="../">Início</a></li><li><a href="../sobre.html">Sobre</a></li><li><a href="../artigos.html">Artigos</a></li><li><a href="../colecoes.html" class="active">Acervo</a></li><li><a href="../fanfics.html">Fanfics</a></li><li><a href="../contato.html">Contato</a></li><li class="nav-search-item"><button class="nav-search-btn" id="nav-search-btn" aria-label="Abrir busca"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg></button></li></ul></nav></div></header>`;
}

function footer() {
  return `<footer><div class="footer-inner"><div class="footer-brand"><span>© Guecas House — Editora Digital.</span><span>Todos os direitos reservados.</span></div><div class="footer-links"><a href="../colecoes.html">Acervo</a><a href="../artigos.html">Artigos</a><a href="../autor.html">Autor</a><a href="../politica-editorial.html">Política editorial</a><a href="../politica-privacidade.html">Privacidade</a><a href="../termos-de-uso.html">Termos</a><a href="../reembolso.html">Reembolso</a><a href="../contato.html">Contato</a></div><div class="footer-social"><a href="https://www.instagram.com/guecashouse/" target="_blank" rel="noopener noreferrer" title="Instagram" class="social-icon instagram"><img src="../arquivos/assets/instagram.svg" alt="Instagram" width="64" height="64" loading="lazy"></a><a href="https://www.kiwify.com.br/guecashouse" target="_blank" rel="noopener noreferrer" title="Kiwify" class="social-icon kiwify"><img src="../arquivos/logos/kiwify-logo.webp" alt="Kiwify" width="400" height="110" loading="lazy"></a></div></div></footer><div class="search-modal" id="search-modal"><div class="search-modal-content"><button class="search-modal-close" aria-label="Fechar busca">×</button><div class="search-input-wrapper"><input type="text" id="search-input" class="search-input" placeholder="Buscar títulos..."></div></div></div><script src="../search.js"></script><script src="../script.js"></script><script src="../protecao-imagens.js"></script>`;
}

function relatedCards(book) {
  return catalog.books
    .filter((item) => item.seriesId === book.seriesId)
    .map((item) => `<a href="detalhes-${item.slug}.html" class="detail-carousel-card book-card"><div class="book-card-cover"><span class="book-badge${item.status === "published" ? "" : " is-free"}">${item.status === "published" ? "Publicado" : "Em desenvolvimento"}</span><img src="../${cover(item)}" alt="Capa de ${esc(item.title)}" width="400" height="640" loading="lazy" decoding="async"></div><div class="book-card-info"><h3 class="book-card-title">${esc(item.title)}</h3></div></a>`)
    .join("");
}

function previewHead(book) {
  return book.previewPdf ? '<link rel="stylesheet" href="../css/17-pdf-preview-tematico.css">' : '';
}

function previewButton(book) {
  return book.previewPdf ? '<button class="btn btn-outline" type="button" data-pdf-preview-open>Ler a prévia</button>' : '';
}

function previewModal(book) {
  if (!book.previewPdf) return '';
  return `<div class="themed-pdf-modal" data-pdf-preview data-pdf-url="../${esc(book.previewPdf)}" role="dialog" aria-modal="true" aria-labelledby="ebook-pdf-title" aria-hidden="true"><div class="themed-pdf-dialog"><div class="themed-pdf-toolbar"><strong class="themed-pdf-title" id="ebook-pdf-title">Prévia — ${esc(book.title)}</strong><div class="themed-pdf-page-controls" aria-label="Navegação da prévia"><button class="themed-pdf-control" type="button" data-pdf-previous aria-label="Página anterior">←</button><span>Página <strong data-pdf-page>1</strong> de <strong data-pdf-total>0</strong></span><button class="themed-pdf-control" type="button" data-pdf-next aria-label="Próxima página">→</button></div><button class="themed-pdf-close" type="button" data-pdf-close aria-label="Fechar prévia">×</button></div><div class="themed-pdf-canvas-wrapper"><div class="themed-pdf-loading">Preparando a página completa…</div><canvas class="themed-pdf-canvas" aria-label="Página da prévia"></canvas></div></div></div>`;
}

function previewScript(book) {
  return book.previewPdf ? '<script src="../ebook-pdf-preview.js"></script>' : '';
}

function page(book) {
  const series = seriesById[book.seriesId];
  const canonical = `https://www.guecashouse.com.br/${detailUrl(book)}`;
  const focusCards = (focuses[book.slug] || [book.summary]).map((item, index) => `<article class="editorial-focus-card"><span>${String(index + 1).padStart(2, "0")}</span><p>${esc(item)}</p></article>`).join("");
  const schema = JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Book","name":book.title,"description":book.summary,"inLanguage":"pt-BR","isPartOf":{"@type":"CreativeWorkSeries","name":series.name},"publisher":{"@id":"https://www.guecashouse.com.br/#organization"}},{"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Início","item":"https://www.guecashouse.com.br/"},{"@type":"ListItem","position":2,"name":"Acervo","item":"https://www.guecashouse.com.br/colecoes.html"},{"@type":"ListItem","position":3,"name":series.name,"item":`https://www.guecashouse.com.br/${series.page}`},{"@type":"ListItem","position":4,"name":book.title,"item":canonical}]}]}, null, 2).replaceAll("<", "\\u003c");
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(book.title)} | Guecas House</title><meta name="description" content="${esc(book.summary)}"><meta name="robots" content="noindex, follow"><meta name="theme-color" content="${book.theme.deep}"><link rel="canonical" href="${canonical}"><meta property="og:locale" content="pt_BR"><meta property="og:type" content="book"><meta property="og:site_name" content="Guecas House"><meta property="og:title" content="${esc(book.title)} | Guecas House"><meta property="og:description" content="${esc(book.summary)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.guecashouse.com.br/arquivos/capas/ebooks/${book.slug}-800.webp"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${schema}</script><link rel="icon" href="../arquivos/assets/favicon-32.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Alegreya:ital,wght@0,400;0,500;0,600;1,400&display=swap"><link rel="stylesheet" href="../css/styles.css"><link rel="stylesheet" href="../css/05-acervo.css"><link rel="stylesheet" href="../css/01-detalhes.css"><link rel="stylesheet" href="../css/11-catalogo-editorial.css"><link rel="stylesheet" href="../css/16-capa-contextual.css">${previewHead(book)}</head><body class="ebook-themed" style="${themeStyle(book)}">${header()}<main><section class="detail-hero"><div class="wrapper"><div class="detail-cover"><div class="detail-cover-card"><img src="../arquivos/capas/ebooks/${book.slug}-800.webp" srcset="../arquivos/capas/ebooks/${book.slug}-400.webp 400w, ../arquivos/capas/ebooks/${book.slug}-800.webp 800w" sizes="(max-width:720px) 72vw,360px" alt="Capa de ${esc(book.title)}" width="800" height="1280"></div></div><div class="detail-content"><div class="editorial-kicker">${esc(series.name)} • Livro ${book.number}</div><h1 class="detail-title">${esc(book.title)}</h1><p class="detail-subtitle">${esc(book.subtitle)}</p><p class="detail-highlight">${esc(book.summary)}</p><div class="editorial-status"><strong>Em desenvolvimento editorial</strong></div><p class="detail-meta"><span>Ebook digital</span><span>Guecas House</span><span>Informações de lançamento em definição</span></p><div class="detail-buttons">${previewButton(book)}<a class="btn btn-primary" href="../${series.page}">Ver a série completa</a><a class="btn btn-outline" href="../colecoes.html">Voltar ao acervo</a></div></div></div></section><section class="detail-section"><div class="wrapper wrapper-narrow"><article class="ebook-description"><div class="ebook-description-kicker">Por dentro desta leitura</div><h2>${esc(book.subtitle)}</h2><p class="ebook-description-lead">${esc(book.summary)}</p><p>Este volume está sendo desenvolvido para aprofundar o tema com uma linguagem humana, acessível e sem promessas mágicas — respeitando o ritmo e a experiência real de quem lê.</p></article><section class="editorial-focus" aria-labelledby="focus-${book.slug}"><div class="ebook-description-kicker">Mapa da leitura</div><h2 id="focus-${book.slug}">O que este ebook investiga</h2><div class="editorial-focus-grid">${focusCards}</div><p class="editorial-note">Sinopse, capítulos, extensão, preço e data de lançamento poderão ser atualizados durante a edição.</p></section><div class="detail-tech-block"><dl class="detail-tech-grid"><div class="detail-tech-item"><dt>Série</dt><dd>${esc(series.name)}</dd></div><div class="detail-tech-item"><dt>Volume</dt><dd>${book.number} de 20</dd></div><div class="detail-tech-item"><dt>Formato previsto</dt><dd>Ebook digital</dd></div><div class="detail-tech-item"><dt>Status</dt><dd>Em desenvolvimento</dd></div></dl></div></div></section><section class="detail-carousel"><div class="wrapper wrapper-narrow"><h2>Outros títulos da coleção</h2><div class="carousel-container"><button class="carousel-nav carousel-nav-prev" id="carousel-prev" type="button" aria-label="Título anterior"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button><div class="detail-carousel-row" id="carousel-row">${relatedCards(book)}</div><button class="carousel-nav carousel-nav-next" id="carousel-next" type="button" aria-label="Próximo título"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button></div></div></section>${previewModal(book)}</main>${footer()}${previewScript(book)}</body></html>`;
}

function card(book) {
  const href = detailUrl(book);
  const badge = book.status === "published" ? "Lançamento" : "Em desenvolvimento";
  return `<a href="${href}" class="book-card"><div class="book-card-cover"><span class="book-badge${book.status === "published" ? "" : " is-free"}">${badge}</span><img src="${cover(book)}" alt="Capa de ${esc(book.title)}" width="400" height="640" loading="lazy" decoding="async"></div><div class="book-card-info"><h3 class="book-card-title">${esc(book.title)}</h3></div></a>`;
}

function replaceGrid(file, books) {
  const target = path.join(root, file);
  let html = fs.readFileSync(target, "utf8");
  html = html.replace(/<div class="card-grid card-grid-5">[\s\S]*?<\/div>\s*<div class="shelf-divider"><\/div>/, `<div class="card-grid card-grid-5">${books.map(card).join("")}</div>\n        <div class="shelf-divider"></div>`);
  fs.writeFileSync(target, html, "utf8");
}

function visibleBreadcrumb(book) {
  const series = seriesById[book.seriesId];
  return `<nav class="breadcrumbs" aria-label="Navegação estrutural"><ol><li><a href="../">Início</a></li><li><a href="../colecoes.html">Acervo</a></li><li><a href="../${series.page}">${esc(series.name)}</a></li><li aria-current="page">${esc(book.title)}</li></ol></nav>`;
}

for (const book of catalog.books.filter((item) => item.status !== "published")) {
  book.detailPage = detailUrl(book);
  book.cover400 = `arquivos/capas/ebooks/${book.slug}-400.webp`;
  book.cover800 = `arquivos/capas/ebooks/${book.slug}-800.webp`;
  let html = page(book).replace(
    '<main><section class="detail-hero"><div class="wrapper">',
    `<main><section class="detail-hero"><div class="wrapper">${visibleBreadcrumb(book)}`
  );
  html = html.replace(
    '<div class="detail-buttons">',
    '<div class="author-byline"><span>Por</span><a href="../autor.html" rel="author">Elvis T. G. Castro</a><small>Responsável editorial da Guecas House</small></div><div class="detail-buttons">'
  );
  html = html.replace(
    '</main>',
    '<section class="content-disclaimer"><div class="wrapper wrapper-narrow"><strong>Conteúdo informativo</strong><p>Este ebook não substitui avaliação, diagnóstico ou acompanhamento com profissionais habilitados.</p><a href="../politica-editorial.html">Conheça nossa política editorial</a></div></section></main>'
  );
  fs.writeFileSync(path.join(root, detailUrl(book)), html, "utf8");
}

replaceGrid("a-era-da-mente-cansada.html", catalog.books.filter((item) => item.seriesId === "era-da-mente-cansada"));
replaceGrid("felicidade-sob-pressao.html", catalog.books.filter((item) => item.seriesId === "felicidade-realista"));

const searchEntries = catalog.books.map((book) => `  { id: '${book.slug}', titulo: ${JSON.stringify(book.title)}, tagline: ${JSON.stringify(book.subtitle)}, categoria: '${book.seriesId}', populares: ${book.number <= 3}, imagem: (isDetailPage ? '../' : '') + ${JSON.stringify(cover(book))}, link: isDetailPage ? ${JSON.stringify(path.basename(detailUrl(book)))} : ${JSON.stringify(detailUrl(book))} }`).join(",\n");
const searchFile = path.join(root, "search.js");
let search = fs.readFileSync(searchFile, "utf8");
search = search.replace(/const TITULOS_DATABASE = \[[\s\S]*?\n\];/, `const TITULOS_DATABASE = [\n${searchEntries}\n];`);
fs.writeFileSync(searchFile, search, "utf8");

fs.writeFileSync(path.join(root, "dados", "catalogo.json"), JSON.stringify(catalog, null, 2) + "\n", "utf8");
console.log(`Páginas geradas: ${catalog.books.filter((item) => item.status !== "published").length}`);
