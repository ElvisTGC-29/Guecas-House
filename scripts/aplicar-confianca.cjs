const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const detailsDir = path.join(root, "paginas-detalhes");

function footerLinks(prefix) {
  return `<div class="footer-links"><a href="${prefix}colecoes.html">Acervo</a><a href="${prefix}artigos.html">Artigos</a><a href="${prefix}autor.html">Autor</a><a href="${prefix}politica-editorial.html">Política editorial</a><a href="${prefix}politica-privacidade.html">Privacidade</a><a href="${prefix}termos-de-uso.html">Termos</a><a href="${prefix}reembolso.html">Reembolso</a><a href="${prefix}contato.html">Contato</a></div>`;
}

function updateFooter(file, prefix) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("footer-links")) return;
  html = html.replace(/<div class="footer-links">[\s\S]*?<\/div>/, footerLinks(prefix));
  fs.writeFileSync(file, html, "utf8");
}

function updateNavigation(file, prefix) {
  let html = fs.readFileSync(file, "utf8");
  const headerEnd = html.indexOf("</header>");
  if (headerEnd < 0) return;
  const header = html.slice(0, headerEnd);
  if (/href=["'][^"']*artigos\.html["']/.test(header)) return;

  const aboutPattern = /(<li>\s*<a href=["'](?:\.\.\/)?sobre\.html["'][^>]*>Sobre<\/a>\s*<\/li>)/;
  if (!aboutPattern.test(header)) return;
  html = html.replace(aboutPattern, `$1<li><a href="${prefix}artigos.html">Artigos</a></li>`);
  fs.writeFileSync(file, html, "utf8");
}

function addBookTrust(file) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes("author-byline")) {
    html = html.replace(
      '<div class="detail-buttons">',
      '<div class="author-byline"><span>Por</span><a href="../autor.html" rel="author">Elvis T. G. Castro</a><small>Responsável editorial da Guecas House</small></div><div class="detail-buttons">'
    );
  }
  if (!html.includes("content-disclaimer")) {
    const disclaimer = '<section class="content-disclaimer"><div class="wrapper wrapper-narrow"><strong>Conteúdo informativo</strong><p>Este conteúdo não substitui avaliação, diagnóstico ou acompanhamento com profissionais habilitados.</p><a href="../politica-editorial.html">Conheça nossa política editorial</a></div></section>';
    html = html.includes("</main>")
      ? html.replace("</main>", `${disclaimer}</main>`)
      : html.replace("<footer>", `${disclaimer}<footer>`);
  }
  fs.writeFileSync(file, html, "utf8");
}

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    const file = path.join(root, entry.name);
    updateNavigation(file, "");
    updateFooter(file, "");
  }
}

for (const entry of fs.readdirSync(detailsDir, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.startsWith("detalhes-") || !entry.name.endsWith(".html") || entry.name.endsWith("-root.html")) continue;
  const file = path.join(detailsDir, entry.name);
  updateNavigation(file, "../");
  addBookTrust(file);
  updateFooter(file, "../");
}

console.log("Autoria, avisos e links institucionais aplicados.");
