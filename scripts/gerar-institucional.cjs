const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "dados", "institucional.json"), "utf8"));

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function header() {
  return `<header><div class="wrapper navbar"><a href="/" class="brand"><span class="brand-logo"><img class="brand-logo-dark" src="arquivos/assets/logo-2b-icon-outline-64.webp" alt="" aria-hidden="true" width="32" height="32"><img class="brand-logo-light" src="arquivos/assets/logo-2-icon-filled-64.webp" alt="" aria-hidden="true" width="32" height="32"></span><span>Guecas House</span><span style="font-weight:400;font-size:.7rem">Editora Digital</span></a><nav><button class="nav-toggle" aria-label="Abrir menu"><svg class="nav-toggle-icon" viewBox="0 0 19 18" aria-hidden="true"><rect class="nav-toggle-bar bar-top" width="19" height="2" rx="1"></rect><rect class="nav-toggle-bar bar-mid" x="3" y="8" width="13" height="2" rx="1"></rect><rect class="nav-toggle-bar bar-bottom" y="16" width="19" height="2" rx="1"></rect></svg></button><ul class="nav-links"><button class="nav-close" type="button" aria-label="Fechar menu">×</button><li><a href="/">Início</a></li><li><a href="sobre.html">Sobre</a></li><li><a href="artigos.html">Artigos</a></li><li><a href="colecoes.html">Acervo</a></li><li><a href="fanfics.html">Fanfics</a></li><li><a href="contato.html">Contato</a></li></ul></nav></div></header>`;
}

function footer() {
  return `<footer><div class="footer-inner"><div class="footer-brand"><span>© Guecas House — Editora Digital.</span><span>Todos os direitos reservados.</span></div><div class="footer-links"><a href="colecoes.html">Acervo</a><a href="artigos.html">Artigos</a><a href="autor.html">Autor</a><a href="politica-editorial.html">Política editorial</a><a href="politica-privacidade.html">Privacidade</a><a href="termos-de-uso.html">Termos</a><a href="reembolso.html">Reembolso</a><a href="contato.html">Contato</a></div></div></footer>`;
}

function render(page) {
  const canonical = `https://www.guecashouse.com.br/${page.slug}.html`;
  const sections = page.sections.map((section) => `<section class="institutional-section"><h2>${esc(section.heading)}</h2>${section.paragraphs.map((text) => `<p>${esc(text)}</p>`).join("")}</section>`).join("");
  const links = (page.links || []).map((link) => `<a class="btn ${link.external ? "btn-outline on-light" : "btn-primary"}" href="${esc(link.href)}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(link.label)}</a>`).join("");
  const side = page.kind === "author" ? `<aside class="author-card"><img src="arquivos/assets/logo-2b-icon-outline.png" alt="Identidade visual da Guecas House" width="80" height="80"><strong>Elvis T. G. Castro</strong><span>Autor e responsável editorial</span><span>guecashouse@gmail.com</span></aside>` : `<aside class="author-card"><img src="arquivos/assets/logo-2b-icon-outline.png" alt="" aria-hidden="true" width="80" height="80"><strong>Guecas House</strong><span>Editora digital independente</span><span>Atualizado em 16/08/2026</span></aside>`;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="${esc(page.robots)}"><meta name="theme-color" content="#111827"><link rel="canonical" href="${canonical}"><meta property="og:locale" content="pt_BR"><meta property="og:type" content="website"><meta property="og:site_name" content="Guecas House"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canonical}"><link rel="icon" href="arquivos/assets/favicon-32.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Alegreya:ital,wght@0,400;0,500;0,600;1,400&display=swap"><link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/13-institucional.css"></head><body>${header()}<main><section class="institutional-hero"><div class="wrapper"><div class="section-header"><div class="section-kicker">${esc(page.kicker)}</div><h1 class="section-title">${esc(page.heading)}</h1><p class="section-subtitle">${esc(page.lead)}</p></div></div></section><section class="institutional-content"><div class="wrapper institutional-grid"><article class="institutional-article">${sections}${page.notice ? `<div class="institutional-notice">${esc(page.notice)}</div>` : ""}<div class="institutional-actions">${links}</div></article>${side}</div></section></main>${footer()}<script src="script.js"></script></body></html>`;
}

for (const page of data.pages) {
  fs.writeFileSync(path.join(root, `${page.slug}.html`), render(page), "utf8");
}

console.log(`Páginas institucionais geradas: ${data.pages.length}`);
