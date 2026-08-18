from __future__ import annotations

import argparse
import base64
import getpass
import hashlib
import hmac
import html
import json
import mimetypes
import os
import re
import secrets
import shutil
import smtplib
import sqlite3
import subprocess
import sys
import threading
import time
import urllib.parse
import webbrowser
import zipfile
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from email.parser import BytesParser
from email.policy import default as email_policy
from http import cookies
from http.server import BaseHTTPRequestHandler, SimpleHTTPRequestHandler, ThreadingHTTPServer
from html.parser import HTMLParser
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None


APP_DIR = Path(__file__).resolve().parent
SITE_ROOT = APP_DIR.parent
DATA_DIR = APP_DIR / "data"
BACKUP_DIR = DATA_DIR / "backups"
MASTER_DIR = DATA_DIR / "media-masters"
DB_PATH = DATA_DIR / "admin.db"
ENV_PATH = APP_DIR / ".env"
CATALOG_PATH = SITE_ROOT / "dados" / "catalogo.json"
INSTITUTIONAL_PATH = SITE_ROOT / "dados" / "institucional.json"
POSTS_PATH = SITE_ROOT / "dados" / "posts.json"
FANFICS_PATH = SITE_ROOT / "dados" / "fanfics.json"
ADMIN_HOST = "127.0.0.1"
ADMIN_PORT = 8765
PREVIEW_PORT = 8766
SESSION_HOURS = 8
RESET_MINUTES = 30
MAX_BODY = 2 * 1024 * 1024
MAX_UPLOAD = 20 * 1024 * 1024
LOGIN_ATTEMPTS: dict[str, list[float]] = {}
TEXT_EXTENSIONS = {".html", ".css", ".js", ".json", ".md", ".xml", ".txt", ".liquid"}
EDITABLE_ROOT_FILES = {
    "index.html", "sobre.html", "contato.html", "colecoes.html", "fanfics.html",
    "a-era-da-mente-cansada.html", "felicidade-sob-pressao.html", "SEO-CHECKLIST.md",
    "robots.txt", "sitemap.xml", "404.html"
}

STATUS_LABELS = {
    "in-development": "Em desenvolvimento",
    "review": "Em revisão",
    "ready": "Pronto para publicar",
    "published": "Publicado",
    "draft": "Rascunho",
    "writing": "Em escrita",
    "paused": "Pausada",
}

ACTION_LABELS = {
    "setup": "Primeiro acesso",
    "login": "Entrada no painel",
    "logout": "Saída do painel",
    "password_reset_requested": "Recuperação solicitada",
    "password_reset": "Senha redefinida",
    "password_changed": "Senha alterada",
    "offline_password_reset": "Senha redefinida localmente",
    "book_saved": "Ebook salvo",
    "cover_uploaded": "Capa de ebook atualizada",
    "post_saved": "Postagem salva",
    "fanfic_saved": "Fanfic salva",
    "fanfic_cover_uploaded": "Capa de fanfic atualizada",
    "institutional_saved": "Autoria e políticas salvas",
    "file_saved": "Arquivo salvo",
    "audit": "Auditoria executada",
    "backup": "Backup criado",
    "publish": "Publicação pelo Git",
    "email_config_saved": "Recuperação por e-mail configurada",
}


def status_label(value: str | None) -> str:
    return STATUS_LABELS.get(value or "", value or "Sem situação")


def action_label(value: str | None) -> str:
    return ACTION_LABELS.get(value or "", value or "Ação")


def now_ts() -> int:
    return int(time.time())


def load_env() -> dict[str, str]:
    values = dict(os.environ)
    if ENV_PATH.exists():
        for raw in ENV_PATH.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            values.setdefault(key.strip(), value.strip().strip('"').strip("'"))
    return values


def save_env_settings(settings: dict[str, str]) -> None:
    """Atualiza somente as chaves informadas, preservando as demais configurações locais."""
    existing: dict[str, str] = {}
    order: list[str] = []
    if ENV_PATH.exists():
        for raw in ENV_PATH.read_text(encoding="utf-8").splitlines():
            line = raw.strip()
            if line and not line.startswith("#") and "=" in line:
                key, value = line.split("=", 1)
                key = key.strip()
                existing[key] = value.strip()
                order.append(key)
    for key, value in settings.items():
        existing[key] = value.replace("\r", "").replace("\n", "")
        if key not in order:
            order.append(key)
    ENV_PATH.write_text("\n".join(f"{key}={existing[key]}" for key in order) + "\n", encoding="utf-8")
    ENV.clear()
    ENV.update(load_env())


ENV = load_env()
ADMIN_EMAIL = ENV.get("ADMIN_EMAIL", "guecashouse@gmail.com").lower()


def db() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def init_storage() -> None:
    for folder in (DATA_DIR, BACKUP_DIR, MASTER_DIR):
        folder.mkdir(parents=True, exist_ok=True)
    with db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY,
              email TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              created_at INTEGER NOT NULL,
              updated_at INTEGER NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
              token_hash TEXT PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              csrf_token TEXT NOT NULL,
              expires_at INTEGER NOT NULL,
              created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_sessions_user_expires ON sessions(user_id, expires_at);
            CREATE TABLE IF NOT EXISTS reset_tokens (
              token_hash TEXT PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              expires_at INTEGER NOT NULL,
              used_at INTEGER
            );
            CREATE INDEX IF NOT EXISTS idx_reset_user_expires ON reset_tokens(user_id, expires_at);
            CREATE TABLE IF NOT EXISTS audit_log (
              id INTEGER PRIMARY KEY,
              user_id INTEGER,
              action TEXT NOT NULL,
              detail TEXT,
              created_at INTEGER NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at DESC);
            """
        )
        connection.execute("DELETE FROM sessions WHERE expires_at < ?", (now_ts(),))
        connection.execute("DELETE FROM reset_tokens WHERE expires_at < ? OR used_at IS NOT NULL", (now_ts(),))
        connection.execute("PRAGMA optimize")
    if not POSTS_PATH.exists():
        POSTS_PATH.write_text(json.dumps({"version": 1, "posts": []}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def password_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=2**14, r=8, p=1, dklen=32)
    return "scrypt$16384$8$1$" + base64.urlsafe_b64encode(salt).decode() + "$" + base64.urlsafe_b64encode(digest).decode()


def password_valid(password: str, stored: str) -> bool:
    try:
        _, n, r, p, salt_text, digest_text = stored.split("$")
        salt = base64.urlsafe_b64decode(salt_text)
        expected = base64.urlsafe_b64decode(digest_text)
        actual = hashlib.scrypt(password.encode("utf-8"), salt=salt, n=int(n), r=int(r), p=int(p), dklen=len(expected))
        return hmac.compare_digest(actual, expected)
    except Exception:
        return False


def valid_new_password(password: str) -> str | None:
    if len(password) < 12:
        return "Use pelo menos 12 caracteres."
    if not re.search(r"[A-Za-zÀ-ÿ]", password) or not re.search(r"\d", password):
        return "A senha precisa conter letras e números."
    return None


def token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def audit(user_id: int | None, action: str, detail: str = "") -> None:
    with db() as connection:
        connection.execute(
            "INSERT INTO audit_log(user_id, action, detail, created_at) VALUES(?,?,?,?)",
            (user_id, action[:120], detail[:1000], now_ts()),
        )


def backup_file(file: Path, label: str = "manual") -> Path | None:
    if not file.exists():
        return None
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    target = BACKUP_DIR / f"{stamp}-{label}-{file.name}"
    shutil.copy2(file, target)
    return target


def safe_json_read(file: Path, fallback: dict) -> dict:
    try:
        return json.loads(file.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return fallback


def safe_json_write(file: Path, value: dict, label: str) -> None:
    backup_file(file, label)
    temporary = file.with_suffix(file.suffix + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    json.loads(temporary.read_text(encoding="utf-8"))
    temporary.replace(file)


def find_executable(name: str) -> str | None:
    configured = ENV.get(f"{name.upper()}_EXE")
    if configured and Path(configured).exists():
        return configured
    found = shutil.which(name)
    if found:
        return found
    home = Path.home()
    candidates = {
        "node": home / ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe",
        "git": home / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/git/cmd/git.exe",
    }
    candidate = candidates.get(name)
    return str(candidate) if candidate and candidate.exists() else None


def run_command(args: list[str], timeout: int = 60) -> tuple[bool, str]:
    try:
        process = subprocess.run(
            args,
            cwd=SITE_ROOT,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=timeout,
            check=False,
        )
        output = (process.stdout + "\n" + process.stderr).strip()
        return process.returncode == 0, output[-12000:]
    except Exception as exc:
        return False, str(exc)


def run_generators() -> tuple[bool, str]:
    node = find_executable("node")
    if not node:
        return False, "Node.js não foi localizado. Configure NODE_EXE em admin-local/.env."
    messages = []
    for script in ("gerar-paginas-catalogo.cjs", "gerar-institucional.cjs", "aplicar-confianca.cjs"):
        file = SITE_ROOT / "scripts" / script
        if not file.exists():
            continue
        ok, output = run_command([node, str(file)])
        messages.append(f"{script}: {'OK' if ok else 'ERRO'}\n{output}")
        if not ok:
            return False, "\n\n".join(messages)
    generate_posts()
    generate_fanfics()
    return True, "\n\n".join(messages) or "Geradores concluídos."


def slugify(value: str) -> str:
    normalized = value.lower()
    replacements = str.maketrans("áàâãéèêíìîóòôõúùûç", "aaaaeeeiiioooouuuc")
    normalized = normalized.translate(replacements)
    normalized = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    return normalized[:80]


def markdown_to_html(source: str) -> str:
    lines = source.replace("\r", "").split("\n")
    out: list[str] = []
    paragraph: list[str] = []
    in_list = False

    def inline(text: str) -> str:
        safe = html.escape(text)
        safe = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", safe)
        safe = re.sub(r"\[(.+?)\]\((https?://[^\s)]+)\)", r'<a href="\2" target="_blank" rel="noopener noreferrer">\1</a>', safe)
        return safe

    def flush_paragraph() -> None:
        nonlocal paragraph
        if paragraph:
            out.append("<p>" + inline(" ".join(paragraph)) + "</p>")
            paragraph = []

    for raw in lines:
        line = raw.strip()
        if line.startswith("## "):
            flush_paragraph()
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<h2>{inline(line[3:])}</h2>")
        elif line.startswith("### "):
            flush_paragraph()
            if in_list:
                out.append("</ul>")
                in_list = False
            out.append(f"<h3>{inline(line[4:])}</h3>")
        elif line.startswith("- "):
            flush_paragraph()
            if not in_list:
                out.append("<ul>")
                in_list = True
            out.append(f"<li>{inline(line[2:])}</li>")
        elif not line:
            flush_paragraph()
            if in_list:
                out.append("</ul>")
                in_list = False
        else:
            paragraph.append(line)
    flush_paragraph()
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


class SafeArticleHTML(HTMLParser):
    allowed_tags = {"p", "h2", "h3", "strong", "em", "u", "ul", "ol", "li", "blockquote", "a", "br", "hr"}
    void_tags = {"br", "hr"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.output: list[str] = []
        self.stack: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in self.allowed_tags:
            return
        safe_attrs = ""
        if tag == "a":
            values = dict(attrs)
            href = (values.get("href") or "").strip()
            if re.match(r"^(https?://|/|\.\.?/|#)", href):
                safe_attrs = f' href="{html.escape(href, quote=True)}"'
                if href.startswith("http"):
                    safe_attrs += ' target="_blank" rel="noopener noreferrer"'
        self.output.append(f"<{tag}{safe_attrs}>")
        if tag not in self.void_tags:
            self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in self.allowed_tags and tag not in self.void_tags and tag in self.stack:
            while self.stack:
                opened = self.stack.pop()
                self.output.append(f"</{opened}>")
                if opened == tag:
                    break

    def handle_data(self, data: str) -> None:
        self.output.append(html.escape(data))

    def close(self) -> None:
        super().close()
        while self.stack:
            self.output.append(f"</{self.stack.pop()}>")


def sanitize_article_html(source: str) -> str:
    parser = SafeArticleHTML()
    parser.feed(source)
    parser.close()
    return "".join(parser.output).strip()


def post_html(post: dict) -> str:
    rich = post.get("contentHtml", "").strip()
    return sanitize_article_html(rich) if rich else markdown_to_html(post.get("content", ""))


def references_html(references: list[str], css_class: str = "article-references") -> str:
    items = []
    for reference in references:
        value = reference.strip()
        if not value:
            continue
        match = re.search(r"https?://[^\s]+", value)
        if match:
            url = match.group(0).rstrip(".,;)")
            label = value.replace(match.group(0), "").strip(" —-|:") or url
            items.append(f'<li><a href="{e(url)}" target="_blank" rel="noopener noreferrer">{e(label)}</a></li>')
        else:
            items.append(f"<li>{e(value)}</li>")
    return f'<section class="{css_class}"><h2>Referências</h2><ol>{"".join(items)}</ol></section>' if items else ""


def public_header(prefix: str = "") -> str:
    return f'''<header><div class="wrapper navbar"><a href="{prefix or '/'}" class="brand"><span class="brand-logo"><img class="brand-logo-dark" src="{prefix}arquivos/assets/logo-2b-icon-outline-64.webp" alt="" aria-hidden="true" width="32" height="32"><img class="brand-logo-light" src="{prefix}arquivos/assets/logo-2-icon-filled-64.webp" alt="" aria-hidden="true" width="32" height="32"></span><span>Guecas House</span><span style="font-weight:400;font-size:.7rem">Editora Digital</span></a><nav><button class="nav-toggle" aria-label="Abrir menu"><svg class="nav-toggle-icon" viewBox="0 0 19 18" aria-hidden="true"><rect class="nav-toggle-bar bar-top" width="19" height="2" rx="1"></rect><rect class="nav-toggle-bar bar-mid" x="3" y="8" width="13" height="2" rx="1"></rect><rect class="nav-toggle-bar bar-bottom" y="16" width="19" height="2" rx="1"></rect></svg></button><ul class="nav-links"><button class="nav-close" type="button" aria-label="Fechar menu">×</button><li><a href="{prefix or '/'}">Início</a></li><li><a href="{prefix}sobre.html">Sobre</a></li><li><a href="{prefix}artigos.html" class="active">Artigos</a></li><li><a href="{prefix}colecoes.html">Acervo</a></li><li><a href="{prefix}fanfics.html">Fanfics</a></li><li><a href="{prefix}contato.html">Contato</a></li></ul></nav></div></header>'''


_PUBLIC_NAV_SECTION = "artigos"
_base_public_header = public_header


def public_header(prefix: str = "") -> str:
    document = _base_public_header(prefix)
    if _PUBLIC_NAV_SECTION == "fanfics":
        document = document.replace(
            f'<a href="{prefix}artigos.html" class="active">Artigos</a>',
            f'<a href="{prefix}artigos.html">Artigos</a>',
        ).replace(
            f'<a href="{prefix}fanfics.html">Fanfics</a>',
            f'<a href="{prefix}fanfics.html" class="active">Fanfics</a>',
        )
    return document


def public_footer(prefix: str = "") -> str:
    links = [
        ("Acervo", "colecoes.html"), ("Artigos", "artigos.html"), ("Autor", "autor.html"),
        ("Política editorial", "politica-editorial.html"),
        ("Privacidade", "politica-privacidade.html"), ("Termos", "termos-de-uso.html"),
        ("Reembolso", "reembolso.html"), ("Contato", "contato.html"),
    ]
    return '<footer><div class="footer-inner"><div class="footer-brand"><span>© Guecas House — Editora Digital.</span><span>Todos os direitos reservados.</span></div><div class="footer-links">' + "".join(f'<a href="{prefix}{href}">{label}</a>' for label, href in links) + "</div></div></footer>"


def update_sitemap_posts(posts: list[dict]) -> None:
    sitemap = SITE_ROOT / "sitemap.xml"
    if not sitemap.exists():
        return
    source = sitemap.read_text(encoding="utf-8")
    source = re.sub(r"\n?\s*<!-- POSTS:START -->[\s\S]*?<!-- POSTS:END -->\s*", "\n", source)
    today = datetime.now().strftime("%Y-%m-%d")
    urls = [("artigos.html", today)]
    for post in posts:
        slug = slugify(post.get("slug") or post.get("title", ""))
        if slug:
            urls.append((f"artigos/{slug}.html", post.get("updatedAt") or post.get("publishedAt") or today))
    entries = ["  <!-- POSTS:START -->"]
    for relative, lastmod in urls:
        entries.extend([
            "  <url>",
            f"    <loc>https://www.guecashouse.com.br/{relative}</loc>",
            f"    <lastmod>{lastmod}</lastmod>",
            "  </url>",
        ])
    entries.append("  <!-- POSTS:END -->")
    source = source.replace("</urlset>", "\n".join(entries) + "\n</urlset>")
    sitemap.write_text(source, encoding="utf-8")


def generate_posts_legacy() -> None:
    data = safe_json_read(POSTS_PATH, {"version": 1, "posts": []})
    posts = [post for post in data.get("posts", []) if post.get("status") == "published"]
    posts.sort(key=lambda item: item.get("publishedAt", ""), reverse=True)
    article_dir = SITE_ROOT / "artigos"
    article_dir.mkdir(exist_ok=True)
    cards = []
    for post in posts:
        slug = slugify(post.get("slug") or post.get("title", ""))
        if not slug:
            continue
        title = html.escape(post.get("title", "Sem título"))
        excerpt = html.escape(post.get("excerpt", ""))
        seo_title = html.escape(post.get("seoTitle") or f"{post.get('title', '')} | Guecas House")
        seo_description = html.escape(post.get("seoDescription") or post.get("excerpt", ""))
        body = markdown_to_html(post.get("content", ""))
        references = [line.strip() for line in post.get("references", []) if line.strip()]
        references_html = ""
        if references:
            references_html = '<section class="article-references"><h2>Referências</h2><ol>' + "".join(f"<li>{html.escape(ref)}</li>" for ref in references) + "</ol></section>"
        canonical = f"https://www.guecashouse.com.br/artigos/{slug}.html"
        published = html.escape(post.get("publishedAt", ""))
        updated = html.escape(post.get("updatedAt", ""))
        date_line = f'<time datetime="{published}">Publicado em {published}</time>' if published else ""
        if updated and updated != published:
            date_line += f' <time datetime="{updated}">• Atualizado em {updated}</time>'
        document = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{seo_title}</title><meta name="description" content="{seo_description}"><meta name="robots" content="index, follow, max-snippet:-1"><link rel="canonical" href="{canonical}"><link rel="stylesheet" href="../css/styles.css"><link rel="stylesheet" href="../css/14-artigos.css"></head><body><header><div class="wrapper navbar"><a href="../" class="brand">Guecas House <span>Editora Digital</span></a><nav><ul class="nav-links"><li><a href="../">Início</a></li><li><a href="../artigos.html" class="active">Artigos</a></li><li><a href="../colecoes.html">Acervo</a></li><li><a href="../autor.html">Autor</a></li></ul></nav></div></header><main><article class="article-page"><div class="wrapper wrapper-narrow"><nav class="article-breadcrumb"><a href="../">Início</a> / <a href="../artigos.html">Artigos</a> / <span>{title}</span></nav><div class="section-kicker">Editorial</div><h1>{title}</h1><p class="article-excerpt">{excerpt}</p><div class="article-byline"><a href="../autor.html" rel="author">Elvis T. G. Castro</a><span>{date_line}</span></div><div class="article-body">{body}</div>{references_html}<aside class="article-disclaimer"><strong>Conteúdo informativo.</strong> Este texto não substitui avaliação ou acompanhamento profissional. <a href="../politica-editorial.html">Política editorial</a>.</aside></div></article></main>{public_footer('../')}<script src="../script.js"></script></body></html>'''
        document = re.sub(r"<header>[\s\S]*?</header>", public_header("../"), document, count=1)
        (article_dir / f"{slug}.html").write_text(document, encoding="utf-8")
        cards.append(f'<article class="article-card"><div class="section-kicker">Editorial</div><h2><a href="artigos/{slug}.html">{title}</a></h2><p>{excerpt}</p><div class="article-card-meta">{date_line}</div></article>')

    index = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Artigos | Guecas House</title><meta name="description" content="Textos editoriais da Guecas House sobre vida digital, cansaço emocional e bem-estar realista."><meta name="robots" content="index, follow"><link rel="canonical" href="https://www.guecashouse.com.br/artigos.html"><link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/14-artigos.css"></head><body><header><div class="wrapper navbar"><a href="/" class="brand">Guecas House <span>Editora Digital</span></a><nav><ul class="nav-links"><li><a href="/">Início</a></li><li><a href="artigos.html" class="active">Artigos</a></li><li><a href="colecoes.html">Acervo</a></li><li><a href="autor.html">Autor</a></li></ul></nav></div></header><main><section class="section"><div class="wrapper"><div class="section-header"><div class="section-kicker">Conteúdo editorial</div><h1 class="section-title">Artigos</h1><p class="section-subtitle">Pesquisa, reflexão e leitura responsável para a vida real.</p></div><div class="article-list">{''.join(cards) if cards else '<div class="article-empty">Os primeiros artigos estão em preparação.</div>'}</div></div></section></main>{public_footer()}<script src="script.js"></script></body></html>'''
    index = re.sub(r"<header>[\s\S]*?</header>", public_header(), index, count=1)
    (SITE_ROOT / "artigos.html").write_text(index, encoding="utf-8")
    update_sitemap_posts(posts)


def generate_posts() -> None:
    global _PUBLIC_NAV_SECTION
    _PUBLIC_NAV_SECTION = "artigos"
    data = safe_json_read(POSTS_PATH, {"version": 1, "posts": []})
    posts = [post for post in data.get("posts", []) if post.get("status") == "published"]
    posts.sort(key=lambda item: item.get("publishedAt", ""), reverse=True)
    article_dir = SITE_ROOT / "artigos"
    article_dir.mkdir(exist_ok=True)
    cards: list[str] = []
    for post in posts:
        slug = slugify(post.get("slug") or post.get("title", ""))
        if not slug:
            continue
        title = e(post.get("title", "Sem título"))
        excerpt = e(post.get("excerpt", ""))
        category = e(post.get("category", "Editorial"))
        seo_title = e(post.get("seoTitle") or f"{post.get('title', '')} | Guecas House")
        seo_description = e(post.get("seoDescription") or post.get("excerpt", ""))
        body = post_html(post)
        refs = references_html(post.get("references", []))
        canonical = f"https://www.guecashouse.com.br/artigos/{slug}.html"
        published = e(post.get("publishedAt", ""))
        updated = e(post.get("updatedAt", ""))
        date_line = f'<time datetime="{published}">Publicado em {published}</time>' if published else ""
        if updated and updated != published:
            date_line += f' <time datetime="{updated}">• Atualizado em {updated}</time>'
        image = post.get("featuredImage", "")
        image_url = f"https://www.guecashouse.com.br/{image.lstrip('/')}" if image else "https://www.guecashouse.com.br/arquivos/assets/banners-membros/capa-social-1200x630.jpg"
        hero = f'<figure class="article-hero"><img src="../{e(image)}" alt="Imagem de destaque do artigo {title}" width="1200" height="630"></figure>' if image else ""
        article_ld = json.dumps({
            "@context": "https://schema.org", "@type": "Article", "headline": post.get("title", ""),
            "description": post.get("seoDescription") or post.get("excerpt", ""), "datePublished": post.get("publishedAt", ""),
            "dateModified": post.get("updatedAt") or post.get("publishedAt", ""), "mainEntityOfPage": canonical,
            "image": image_url, "author": {"@type": "Person", "name": "Elvis T. G. Castro", "url": "https://www.guecashouse.com.br/autor.html"},
            "publisher": {"@type": "Organization", "name": "Guecas House", "url": "https://www.guecashouse.com.br/"}
        }, ensure_ascii=False).replace("</", "<\\/")
        document = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{seo_title}</title><meta name="description" content="{seo_description}"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1"><link rel="canonical" href="{canonical}"><meta property="og:type" content="article"><meta property="og:title" content="{seo_title}"><meta property="og:description" content="{seo_description}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{e(image_url)}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="../css/styles.css"><link rel="stylesheet" href="../css/14-artigos.css"><script type="application/ld+json">{article_ld}</script></head><body>{public_header('../')}<main><article class="article-page"><div class="wrapper wrapper-narrow"><nav class="article-breadcrumb"><a href="../">Início</a> / <a href="../artigos.html">Artigos</a> / <span>{title}</span></nav><div class="section-kicker">{category}</div><h1>{title}</h1><p class="article-excerpt">{excerpt}</p><div class="article-byline"><a href="../autor.html" rel="author">Elvis T. G. Castro</a><span>{date_line}</span></div>{hero}<div class="article-body">{body}</div>{refs}<aside class="article-disclaimer"><strong>Conteúdo informativo.</strong> Este texto não substitui avaliação ou acompanhamento profissional. <a href="../politica-editorial.html">Política editorial</a>.</aside></div></article></main>{public_footer('../')}<script src="../script.js"></script></body></html>'''
        (article_dir / f"{slug}.html").write_text(document, encoding="utf-8")
        cards.append(f'<article class="article-card"><div class="section-kicker">{category}</div><h2><a href="artigos/{slug}.html">{title}</a></h2><p>{excerpt}</p><div class="article-card-meta">{date_line}</div></article>')

    index = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Artigos | Guecas House</title><meta name="description" content="Textos editoriais da Guecas House sobre vida digital, cansaço emocional e bem-estar realista."><meta name="robots" content="index, follow"><link rel="canonical" href="https://www.guecashouse.com.br/artigos.html"><link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/14-artigos.css"></head><body>{public_header()}<main><section class="section"><div class="wrapper"><div class="section-header"><div class="section-kicker">Conteúdo editorial</div><h1 class="section-title">Artigos</h1><p class="section-subtitle">Pesquisa, reflexão e leitura responsável para a vida real.</p></div><div class="article-list">{"".join(cards) if cards else '<div class="article-empty">Os primeiros artigos estão em preparação.</div>'}</div></div></section></main>{public_footer()}<script src="script.js"></script></body></html>'''
    (SITE_ROOT / "artigos.html").write_text(index, encoding="utf-8")
    update_sitemap_posts(posts)


def generate_fanfics() -> None:
    global _PUBLIC_NAV_SECTION
    _PUBLIC_NAV_SECTION = "fanfics"
    data = safe_json_read(FANFICS_PATH, {"version": 1, "fanfics": []})
    cards: list[str] = []
    for fanfic in data.get("fanfics", []):
        slug = slugify(fanfic.get("slug") or fanfic.get("title", ""))
        if not slug:
            continue
        title, subtitle = e(fanfic.get("title", "Sem título")), e(fanfic.get("subtitle", ""))
        summary, status = e(fanfic.get("summary", "")), e(status_label(fanfic.get("status")))
        cover400, cover800 = e(fanfic.get("cover400", "")), e(fanfic.get("cover800", ""))
        detail_path = fanfic.get("detailPage") or f"paginas-detalhes/detalhes-{slug}.html"
        canonical = f"https://www.guecashouse.com.br/{detail_path}"
        content = sanitize_article_html(fanfic.get("contentHtml", ""))
        legal = e(fanfic.get("rightsNotice", "Obra transformativa não oficial, gratuita e sem fins comerciais."))
        refs = references_html(fanfic.get("references", []), "details-references")
        document = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(fanfic.get('seoTitle') or fanfic.get('title'))}</title><meta name="description" content="{e(fanfic.get('seoDescription') or fanfic.get('summary'))}"><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="{canonical}"><link rel="stylesheet" href="../css/styles.css"><link rel="stylesheet" href="../css/01-detalhes.css"></head><body>{public_header('../')}<main><section class="details-hero"><div class="wrapper details-layout"><div class="details-cover"><picture><source media="(max-width:600px)" srcset="../{cover400}"><img src="../{cover800}" alt="Capa de {title}" width="800" height="1280"></picture></div><div class="details-copy"><nav class="details-breadcrumb"><a href="../">Início</a> / <a href="../fanfics.html">Fanfics</a> / <span>{title}</span></nav><div class="section-kicker">Fanfic • {status}</div><h1>{title}</h1><p class="details-subtitle">{subtitle}</p><p>{summary}</p><dl class="details-meta"><div><dt>Autoria</dt><dd>{e(fanfic.get('author', 'Elvis T. G. Castro'))}</dd></div><div><dt>Universo</dt><dd>{e(fanfic.get('universe', 'Obra transformativa'))}</dd></div><div><dt>Formato</dt><dd>{e(fanfic.get('format', 'Ebook digital'))}</dd></div><div><dt>Extensão</dt><dd>{e(fanfic.get('length', 'Em definição'))}</dd></div></dl></div></div></section><section class="section"><div class="wrapper wrapper-narrow"><div class="article-body">{content}</div>{refs}<aside class="article-disclaimer"><strong>Aviso sobre direitos:</strong> {legal}</aside></div></section></main>{public_footer('../')}<script src="../script.js"></script></body></html>'''
        target = SITE_ROOT / detail_path
        target.parent.mkdir(parents=True, exist_ok=True)
        if not (fanfic.get("preserveDetailPage") and target.exists()):
            target.write_text(document, encoding="utf-8")
        cards.append(f'''<article class="collection-card"><a href="{e(detail_path)}"><img src="{cover400}" alt="Capa de {title}" width="400" height="640" loading="lazy"><div><span class="section-kicker">{status}</span><h2>{title}</h2><p>{summary}</p></div></a></article>''')
    index = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fanfics | Guecas House</title><meta name="description" content="Fanfics e narrativas transformativas da Guecas House, apresentadas com transparência editorial."><meta name="robots" content="index, follow, max-image-preview:large"><link rel="canonical" href="https://www.guecashouse.com.br/fanfics.html"><link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/11-catalogo-editorial.css"></head><body>{public_header()}<main><section class="section"><div class="wrapper"><div class="section-header"><div class="section-kicker">Narrativas transformativas</div><h1 class="section-title">Fanfics</h1><p class="section-subtitle">Histórias não oficiais, gratuitas e sem fins comerciais, publicadas com identificação clara de autoria e universo de origem.</p></div><div class="catalog-grid">{"".join(cards) if cards else '<p>Nenhuma fanfic cadastrada.</p>'}</div></div></section></main>{public_footer()}<script src="script.js"></script></body></html>'''
    (SITE_ROOT / "fanfics.html").write_text(index, encoding="utf-8")


def link_audit() -> dict:
    href_pattern = re.compile(r'href\s*=\s*["\']([^"\']+)["\']', re.I)
    broken: list[str] = []
    hashes: list[str] = []
    checked = 0
    for file in SITE_ROOT.rglob("*.html"):
        if any(part in {".git", ".venv", "admin-local", "banners"} for part in file.parts):
            continue
        if file.name.startswith("template-") or file.name.endswith("-root.html"):
            continue
        checked += 1
        source = file.read_text(encoding="utf-8", errors="replace")
        for href in href_pattern.findall(source):
            if href == "#":
                hashes.append(str(file.relative_to(SITE_ROOT)))
                continue
            if re.match(r"^(https?:|mailto:|tel:|javascript:|#)", href):
                continue
            clean = href.split("?", 1)[0].split("#", 1)[0]
            if not clean:
                continue
            target = SITE_ROOT / clean.lstrip("/") if clean.startswith("/") else file.parent / clean
            if clean == "/":
                target = SITE_ROOT / "index.html"
            if not target.resolve().exists():
                broken.append(f"{file.relative_to(SITE_ROOT)} → {href}")
    return {"checked": checked, "broken": broken, "hashes": hashes}


def create_backup() -> Path:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    target = BACKUP_DIR / f"site-conteudo-{stamp}.zip"
    included = ["dados", "css", "scripts", "paginas-detalhes", "artigos"]
    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as archive:
        for name in included:
            base = SITE_ROOT / name
            if not base.exists():
                continue
            for file in base.rglob("*"):
                if file.is_file():
                    archive.write(file, file.relative_to(SITE_ROOT))
        for file in SITE_ROOT.glob("*.html"):
            archive.write(file, file.relative_to(SITE_ROOT))
        for file in (SITE_ROOT / "sitemap.xml", SITE_ROOT / "robots.txt", SITE_ROOT / "SEO-CHECKLIST.md"):
            if file.exists():
                archive.write(file, file.relative_to(SITE_ROOT))
    return target


def smtp_configured() -> bool:
    return bool(ENV.get("SMTP_USER") and ENV.get("SMTP_APP_PASSWORD"))


def send_reset_email(recipient: str, reset_url: str) -> tuple[bool, str]:
    if not smtp_configured():
        return False, "SMTP não configurado."
    message = EmailMessage()
    message["Subject"] = "Redefinição de senha — Painel Guecas House"
    message["From"] = ENV["SMTP_USER"]
    message["To"] = recipient
    message.set_content(
        "Foi solicitada uma redefinição de senha do painel local da Guecas House.\n\n"
        f"Abra este link no mesmo computador, com o painel ligado:\n{reset_url}\n\n"
        f"O link expira em {RESET_MINUTES} minutos. Se você não fez a solicitação, ignore esta mensagem."
    )
    try:
        host = ENV.get("SMTP_HOST", "smtp.gmail.com")
        port = int(ENV.get("SMTP_PORT", "465"))
        with smtplib.SMTP_SSL(host, port, timeout=20) as smtp:
            smtp.login(ENV["SMTP_USER"], ENV["SMTP_APP_PASSWORD"].replace(" ", ""))
            smtp.send_message(message)
        return True, "E-mail enviado."
    except Exception as exc:
        return False, f"Falha ao enviar: {exc}"


def fmt_date(timestamp: int | None) -> str:
    if not timestamp:
        return "—"
    return datetime.fromtimestamp(timestamp).strftime("%d/%m/%Y %H:%M")


def e(value: object) -> str:
    return html.escape(str(value if value is not None else ""), quote=True)


def flash(message: str, kind: str = "info") -> str:
    return f'<div class="flash {e(kind)}">{e(message)}</div>' if message else ""


def layout(title: str, body: str, user: sqlite3.Row | None = None, message: str = "", kind: str = "info") -> str:
    nav = ""
    if user:
        nav = '''<aside class="admin-sidebar"><a class="admin-brand" href="/"><img src="/static/guecas-painel.png" alt="" width="42" height="42"><span class="brand-copy"><strong>Guecas House</strong><small>Painel editorial local</small></span></a><nav><a href="/">Visão geral</a><a href="/catalogo">Ebooks</a><a href="/fanfics-editorial">Fanfics</a><a href="/posts">Postagens</a><a href="/institucional">Autoria e políticas</a><a href="/arquivos">Arquivos do site</a><a href="/ferramentas">Publicação e cópias de segurança</a><a href="/conta">Conta e segurança</a><a href="/manual" target="_blank">Manual do painel</a><a href="http://127.0.0.1:8766/" target="_blank" rel="noopener">Abrir prévia</a></nav><form method="post" action="/logout"><input type="hidden" name="csrf" value="__CSRF__"><button type="submit" class="link-button">Sair</button></form></aside>'''
    page_class = "admin-shell" if user else "auth-shell"
    document = f'''<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex, nofollow, noarchive"><title>{e(title)} | Painel Guecas House</title><link rel="icon" href="/static/guecas-painel.ico"><link rel="stylesheet" href="/static/admin.css"><script src="/static/admin.js" defer></script></head><body class="{page_class}">{nav}<main class="admin-main">{flash(message, kind)}{body}</main></body></html>'''
    return document


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(SITE_ROOT), **kwargs)

    def log_message(self, *_args) -> None:
        pass


class AdminHandler(BaseHTTPRequestHandler):
    server_version = "GuecasAdmin/1.0"

    def log_message(self, fmt: str, *args) -> None:
        print(f"[{self.log_date_time_string()}] {fmt % args}")

    def security_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")

    def send_html(self, document: str, status: int = 200, cookie: str | None = None) -> None:
        payload = document.encode("utf-8")
        self.send_response(status)
        self.security_headers()
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def redirect(self, location: str, cookie: str | None = None) -> None:
        self.send_response(303)
        self.security_headers()
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Location", location)
        self.end_headers()

    def send_static(self, file: Path) -> None:
        if not file.exists() or not file.is_file():
            self.send_error(404)
            return
        payload = file.read_bytes()
        self.send_response(200)
        self.security_headers()
        self.send_header("Content-Type", mimetypes.guess_type(file.name)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def parse_form(self, limit: int = MAX_BODY) -> dict[str, str]:
        length = int(self.headers.get("Content-Length", "0"))
        if length > limit:
            raise ValueError("Requisição muito grande.")
        body = self.rfile.read(length).decode("utf-8", errors="replace")
        parsed = urllib.parse.parse_qs(body, keep_blank_values=True)
        return {key: values[-1] for key, values in parsed.items()}

    def current_session(self) -> tuple[sqlite3.Row | None, str | None]:
        raw = self.headers.get("Cookie", "")
        jar = cookies.SimpleCookie()
        try:
            jar.load(raw)
            token = jar.get("guecas_session").value if jar.get("guecas_session") else None
        except cookies.CookieError:
            token = None
        if not token:
            return None, None
        with db() as connection:
            row = connection.execute(
                "SELECT users.*, sessions.csrf_token FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.token_hash=? AND sessions.expires_at>?",
                (token_hash(token), now_ts()),
            ).fetchone()
        return row, token

    def require_user(self) -> sqlite3.Row | None:
        user, _ = self.current_session()
        if not user:
            self.redirect("/login")
            return None
        return user

    def require_csrf(self, user: sqlite3.Row, form: dict[str, str]) -> bool:
        if not hmac.compare_digest(form.get("csrf", ""), user["csrf_token"]):
            self.send_html(layout("Acesso negado", "<h1>Solicitação inválida</h1><p>Atualize a página e tente novamente.</p>", user), 403)
            return False
        return True

    def with_csrf(self, document: str, user: sqlite3.Row) -> str:
        return document.replace("__CSRF__", e(user["csrf_token"]))

    def do_GET(self) -> None:
        parsed = urllib.parse.urlparse(self.path)
        route = parsed.path
        query = urllib.parse.parse_qs(parsed.query)
        message = query.get("msg", [""])[0]
        kind = query.get("kind", ["info"])[0]

        if route.startswith("/static/"):
            name = Path(route.removeprefix("/static/")).name
            self.send_static(APP_DIR / "static" / name)
            return

        with db() as connection:
            user_count = connection.execute("SELECT COUNT(*) FROM users").fetchone()[0]
        if user_count == 0 and route != "/setup":
            self.redirect("/setup")
            return

        if route == "/setup":
            if user_count:
                self.redirect("/login")
                return
            body = f'''<section class="auth-card"><div class="auth-mark">GH</div><h1>Primeiro acesso</h1><p>Crie a conta exclusiva do painel local.</p><form method="post" action="/setup"><label>E-mail<input type="email" name="email" value="{e(ADMIN_EMAIL)}" readonly></label><label>Senha<input type="password" name="password" minlength="12" required autocomplete="new-password"></label><label>Confirmar senha<input type="password" name="confirm" minlength="12" required autocomplete="new-password"></label><button class="primary" type="submit">Criar conta segura</button></form><small>A senha é criptografada e permanece somente neste computador.</small></section>'''
            self.send_html(layout("Primeiro acesso", body, message=message, kind=kind))
            return
        if route == "/login":
            body = '''<section class="auth-card"><div class="auth-mark">GH</div><h1>Entrar no painel</h1><p>Acesso local exclusivo da Guecas House.</p><form method="post" action="/login"><label>E-mail<input type="email" name="email" required autocomplete="username"></label><label>Senha<input type="password" name="password" required autocomplete="current-password"></label><button class="primary" type="submit">Entrar</button></form><a class="auth-link" href="/forgot">Esqueci minha senha</a></section>'''
            self.send_html(layout("Login", body, message=message, kind=kind))
            return
        if route == "/forgot":
            body = f'''<section class="auth-card"><div class="auth-mark">GH</div><h1>Recuperar senha</h1><p>Enviaremos um link para o e-mail administrativo.</p><form method="post" action="/forgot"><label>E-mail<input type="email" name="email" value="{e(ADMIN_EMAIL)}" required></label><button class="primary" type="submit">Enviar link</button></form><a class="auth-link" href="/login">Voltar ao login</a></section>'''
            self.send_html(layout("Recuperar senha", body, message=message, kind=kind))
            return
        if route == "/reset":
            token = query.get("token", [""])[0]
            body = f'''<section class="auth-card"><div class="auth-mark">GH</div><h1>Nova senha</h1><form method="post" action="/reset"><input type="hidden" name="token" value="{e(token)}"><label>Nova senha<input type="password" name="password" minlength="12" required></label><label>Confirmar senha<input type="password" name="confirm" minlength="12" required></label><button class="primary" type="submit">Salvar nova senha</button></form></section>'''
            self.send_html(layout("Nova senha", body, message=message, kind=kind))
            return

        user = self.require_user()
        if not user:
            return

        if route == "/manual":
            self.send_static(SITE_ROOT / "output" / "pdf" / "manual-painel-editorial-guecas-house.pdf")
            return

        if route == "/":
            catalog = safe_json_read(CATALOG_PATH, {"books": []})
            posts = safe_json_read(POSTS_PATH, {"posts": []})
            counts: dict[str, int] = {}
            for book in catalog.get("books", []):
                counts[book.get("status", "sem status")] = counts.get(book.get("status", "sem status"), 0) + 1
            with db() as connection:
                logs = connection.execute("SELECT action, detail, created_at FROM audit_log ORDER BY id DESC LIMIT 8").fetchall()
            status_cards = "".join(f'<div class="metric"><strong>{count}</strong><span>{e(status_label(status))}</span></div>' for status, count in sorted(counts.items()))
            log_rows = "".join(f'<tr><td>{e(fmt_date(row["created_at"]))}</td><td>{e(action_label(row["action"]))}</td><td>{e(row["detail"])}</td></tr>' for row in logs) or '<tr><td colspan="3">Nenhuma atividade registrada.</td></tr>'
            body = f'''<div class="page-head"><div><span class="eyebrow">Visão geral</span><h1>Painel editorial</h1><p>Conteúdo, confiança, revisão e publicação em um só lugar.</p></div><a class="primary button" href="http://127.0.0.1:{PREVIEW_PORT}/" target="_blank" rel="noopener">Abrir site local</a></div><section class="metrics">{status_cards}<div class="metric"><strong>{len(posts.get('posts', []))}</strong><span>postagens</span></div><div class="metric"><strong>{'Ativa' if smtp_configured() else 'Pendente'}</strong><span>recuperação por e-mail</span></div></section><section class="panel-grid"><article class="panel"><h2>Atalhos</h2><div class="quick-actions"><a href="/posts">Criar postagem</a><a href="/catalogo">Editar ebook</a><a href="/fanfics-editorial">Editar fanfic</a><a href="/institucional">Revisar autoria e políticas</a><a href="/ferramentas">Validar e publicar</a><a href="/manual" target="_blank">Consultar manual</a></div></article><article class="panel"><h2>Segurança</h2><p>O painel aceita conexões somente deste computador em <code>127.0.0.1</code>.</p><p>Envio de e-mail: <strong>{'configurado' if smtp_configured() else 'a configurar'}</strong></p></article></section><section class="panel"><h2>Atividade recente</h2><div class="table-wrap"><table><thead><tr><th>Data</th><th>Ação</th><th>Detalhe</th></tr></thead><tbody>{log_rows}</tbody></table></div></section>'''
            self.send_html(self.with_csrf(layout("Visão geral", body, user, message, kind), user))
            return
        if route == "/catalogo":
            catalog = safe_json_read(CATALOG_PATH, {"books": []})
            rows = "".join(f'<tr><td>{book.get("number", "")}</td><td><a href="/livro?slug={urllib.parse.quote(book.get("slug", ""))}">{e(book.get("title"))}</a></td><td><span class="status {e(book.get("status"))}">{e(status_label(book.get("status")))}</span></td><td>{e(book.get("publishedAt", "—"))}</td></tr>' for book in catalog.get("books", []))
            body = f'''<div class="page-head"><div><span class="eyebrow">Catálogo</span><h1>Ebooks</h1><p>Edite conteúdo, SEO, situação editorial, referências e capa.</p></div></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>#</th><th>Título</th><th>Situação</th><th>Publicação</th></tr></thead><tbody>{rows}</tbody></table></div></section>'''
            self.send_html(self.with_csrf(layout("Ebooks", body, user, message, kind), user))
            return
        if route == "/livro":
            slug = query.get("slug", [""])[0]
            catalog = safe_json_read(CATALOG_PATH, {"books": []})
            book = next((item for item in catalog.get("books", []) if item.get("slug") == slug), None)
            if not book:
                self.send_html(self.with_csrf(layout("Livro", "<h1>Livro não encontrado</h1>", user), user), 404)
                return
            refs = "\n".join(book.get("references", []))
            body = f'''<div class="page-head"><div><span class="eyebrow">Volume {e(book.get('number'))}</span><h1>{e(book.get('title'))}</h1><p>{e(book.get('seriesId'))}</p></div><a class="button secondary" href="/catalogo">Voltar</a></div><form class="panel form-grid" method="post" action="/livro/salvar"><input type="hidden" name="csrf" value="__CSRF__"><input type="hidden" name="slug" value="{e(slug)}"><label>Título<input name="title" value="{e(book.get('title'))}" required></label><label>Subtítulo<input name="subtitle" value="{e(book.get('subtitle'))}"></label><label class="wide">Resumo<textarea name="summary" rows="4">{e(book.get('summary'))}</textarea></label><label>Situação<select name="status">{''.join(f'<option value="{s}"{" selected" if book.get("status")==s else ""}>{status_label(s)}</option>' for s in ('in-development','review','ready','published'))}</select></label><label>Data de publicação<input type="date" name="publishedAt" value="{e(book.get('publishedAt'))}"></label><label>Data de atualização<input type="date" name="updatedAt" value="{e(book.get('updatedAt'))}"></label><label>Preço<input name="price" value="{e(book.get('price'))}" placeholder="R$ 00,00"></label><label class="wide">Link de compra<input type="url" name="purchaseUrl" value="{e(book.get('purchaseUrl'))}"></label><label class="wide">Título SEO<input name="seoTitle" value="{e(book.get('seoTitle'))}" maxlength="65"></label><label class="wide">Descrição SEO<textarea name="seoDescription" rows="3" maxlength="170">{e(book.get('seoDescription'))}</textarea></label><label class="wide">Referências — uma por linha<textarea name="references" rows="8">{e(refs)}</textarea></label><div class="wide form-actions"><button class="primary" type="submit">Salvar e regenerar páginas</button></div></form><form class="panel" method="post" action="/capa" enctype="multipart/form-data"><input type="hidden" name="csrf" value="__CSRF__"><input type="hidden" name="slug" value="{e(slug)}"><h2>Substituir capa</h2><p>Envie um PNG ou JPEG vertical na proporção 5:8. O painel cria automaticamente as versões WebP.</p><input type="file" name="cover" accept="image/png,image/jpeg" required><button class="secondary" type="submit">Processar nova capa</button></form>'''
            self.send_html(self.with_csrf(layout(book.get("title", "Livro"), body, user, message, kind), user))
            return
        if route == "/fanfics-editorial":
            data = safe_json_read(FANFICS_PATH, {"fanfics": []})
            rows = "".join(f'<tr><td><a href="/fanfic?slug={urllib.parse.quote(item.get("slug", ""))}">{e(item.get("title", "Sem título"))}</a></td><td><span class="status {e(item.get("status"))}">{e(status_label(item.get("status")))}</span></td><td>{e(item.get("updatedAt", "—"))}</td></tr>' for item in data.get("fanfics", []))
            body = f'''<div class="page-head"><div><span class="eyebrow">Narrativas transformativas</span><h1>Fanfics</h1><p>Controle editorial, transparência de direitos, SEO e página pública.</p></div><a class="button secondary" href="http://127.0.0.1:{PREVIEW_PORT}/fanfics.html" target="_blank" rel="noopener">Abrir página pública</a></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>Título</th><th>Situação</th><th>Atualização</th></tr></thead><tbody>{rows or '<tr><td colspan="3">Nenhuma fanfic cadastrada.</td></tr>'}</tbody></table></div></section>'''
            self.send_html(self.with_csrf(layout("Fanfics", body, user, message, kind), user))
            return
        if route == "/fanfic":
            slug = query.get("slug", [""])[0]
            data = safe_json_read(FANFICS_PATH, {"fanfics": []})
            item = next((entry for entry in data.get("fanfics", []) if entry.get("slug") == slug), None)
            if not item:
                self.send_html(self.with_csrf(layout("Fanfic", "<h1>Fanfic não encontrada</h1>", user), user), 404)
                return
            refs = "\n".join(item.get("references", []))
            body = f'''<div class="page-head"><div><span class="eyebrow">Fanfic</span><h1>{e(item.get('title'))}</h1><p>A capa oficial de Alvo Dumbledore permanece protegida e não é alterada neste editor.</p></div><div class="head-actions"><a class="button secondary" href="/fanfics-editorial">Voltar</a><a class="button secondary" href="http://127.0.0.1:{PREVIEW_PORT}/{e(item.get('detailPage'))}" target="_blank" rel="noopener">Abrir prévia</a></div></div><form class="panel form-grid" method="post" action="/fanfic/salvar"><input type="hidden" name="csrf" value="__CSRF__"><input type="hidden" name="slug" value="{e(slug)}"><label class="wide">Título<input name="title" value="{e(item.get('title'))}" required></label><label class="wide">Subtítulo<input name="subtitle" value="{e(item.get('subtitle'))}"></label><label class="wide">Resumo<textarea name="summary" rows="4" required>{e(item.get('summary'))}</textarea></label><label>Situação<select name="status">{''.join(f'<option value="{s}"{" selected" if item.get("status")==s else ""}>{status_label(s)}</option>' for s in ('writing','review','ready','published','paused'))}</select></label><label>Data de atualização<input type="date" name="updatedAt" value="{e(item.get('updatedAt'))}"></label><label class="wide">Universo de origem<input name="universe" value="{e(item.get('universe'))}"></label><label>Formato<input name="format" value="{e(item.get('format'))}"></label><label>Extensão<input name="length" value="{e(item.get('length'))}"></label><label class="wide">Aviso sobre direitos<textarea name="rightsNotice" rows="3" required>{e(item.get('rightsNotice'))}</textarea></label><label class="wide">Apresentação editorial<div class="rich-editor-wrap" data-rich-editor><div class="rich-toolbar" role="toolbar" aria-label="Ferramentas de edição"></div><div class="rich-editor" contenteditable="true" role="textbox" aria-multiline="true">{sanitize_article_html(item.get('contentHtml', ''))}</div><textarea class="rich-source" name="contentHtml" hidden>{e(item.get('contentHtml'))}</textarea><div class="editor-counter" aria-live="polite"></div></div></label><label class="wide">Título SEO<input name="seoTitle" maxlength="65" value="{e(item.get('seoTitle'))}"></label><label class="wide">Descrição SEO<textarea name="seoDescription" maxlength="170" rows="3">{e(item.get('seoDescription'))}</textarea></label><label class="wide">Referências — uma por linha<textarea name="references" rows="6">{e(refs)}</textarea></label><div class="wide form-actions"><button class="primary" type="submit">Salvar e gerar páginas</button></div></form>'''
            self.send_html(self.with_csrf(layout(item.get("title", "Fanfic"), body, user, message, kind), user))
            return
        if route == "/posts":
            data = safe_json_read(POSTS_PATH, {"posts": []})
            rows = "".join(f'<tr><td><a href="/post?id={urllib.parse.quote(str(post.get("id", "")))}">{e(post.get("title", "Sem título"))}</a><a class="row-action" href="/post/preview?id={urllib.parse.quote(str(post.get("id", "")))}">Prévia</a>{"<span class=\"demo-tag\">Demonstração profissional</span>" if post.get("isDemo") else ""}</td><td><span class="status {e(post.get("status"))}">{e(status_label(post.get("status")))}</span></td><td>{e(post.get("publishedAt", "—"))}</td></tr>' for post in data.get("posts", []))
            body = f'''<div class="page-head"><div><span class="eyebrow">Conteúdo</span><h1>Postagens</h1><p>Fluxo profissional de rascunho, revisão e publicação com fontes.</p></div><a class="primary button" href="/post">Nova postagem</a></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>Título</th><th>Situação</th><th>Publicação</th></tr></thead><tbody>{rows or '<tr><td colspan="3">Nenhuma postagem criada.</td></tr>'}</tbody></table></div></section>'''
            self.send_html(self.with_csrf(layout("Postagens", body, user, message, kind), user))
            return
        if route == "/post/preview":
            post_id = query.get("id", [""])[0]
            data = safe_json_read(POSTS_PATH, {"posts": []})
            post = next((item for item in data.get("posts", []) if str(item.get("id")) == post_id), None)
            if not post:
                self.send_html(self.with_csrf(layout("Prévia", "<h1>Postagem não encontrada</h1>", user), user), 404)
                return
            references = post.get("references", [])
            refs_html = ""
            if references:
                refs_html = '<section class="preview-references"><h2>Referências</h2><ol>' + "".join(f"<li>{e(item)}</li>" for item in references) + "</ol></section>"
            image = post.get("featuredImage", "")
            image_html = f'<img class="preview-hero" src="http://127.0.0.1:{PREVIEW_PORT}/{e(image)}" alt="Imagem de destaque" width="1200" height="630">' if image else ""
            body = f'''<div class="page-head"><div><span class="eyebrow">Prévia protegida</span><h1>{e(post.get('title'))}</h1><p>{e(post.get('excerpt'))}</p></div><a class="button secondary" href="/post?id={urllib.parse.quote(post_id)}">Voltar ao editor</a></div><article class="panel post-preview"><div class="preview-meta"><strong>Elvis T. G. Castro</strong><span>Situação: {e(status_label(post.get('status', 'draft')))}</span><span>{e(post.get('publishedAt', 'Sem data pública'))}</span></div>{image_html}<div class="preview-body">{post_html(post)}</div>{refs_html}</article>'''
            self.send_html(self.with_csrf(layout("Prévia da postagem", body, user, message, kind), user))
            return
        if route == "/post":
            post_id = query.get("id", [""])[0]
            data = safe_json_read(POSTS_PATH, {"posts": []})
            post = next((item for item in data.get("posts", []) if str(item.get("id")) == post_id), None) if post_id else {}
            if post_id and not post:
                self.send_html(self.with_csrf(layout("Postagem", "<h1>Postagem não encontrada</h1>", user), user), 404)
                return
            refs = "\n".join(post.get("references", []))
            rich_content = post.get("contentHtml") or markdown_to_html(post.get("content", ""))
            body = f'''<div class="page-head"><div><span class="eyebrow">Editor visual</span><h1>{e(post.get('title') or 'Nova postagem')}</h1><p>Escreva e formate como em um mini Word. O conteúdo é higienizado antes de ser salvo.</p></div><a class="button secondary" href="/posts">Voltar</a></div><form class="panel form-grid" method="post" action="/post/salvar"><input type="hidden" name="csrf" value="__CSRF__"><input type="hidden" name="id" value="{e(post.get('id'))}"><label class="wide">Título<input name="title" value="{e(post.get('title'))}" required></label><label>Endereço amigável (slug)<input name="slug" value="{e(post.get('slug'))}" placeholder="gerado automaticamente"></label><label>Situação<select name="status">{''.join(f'<option value="{s}"{" selected" if post.get("status", "draft")==s else ""}>{status_label(s)}</option>' for s in ('draft','review','published'))}</select></label><label>Categoria<input name="category" value="{e(post.get('category'))}" placeholder="Bem-estar realista"></label><label>Imagem de destaque<input name="featuredImage" value="{e(post.get('featuredImage'))}" placeholder="arquivos/assets/..."></label><label class="wide">Resumo<textarea name="excerpt" rows="3" required>{e(post.get('excerpt'))}</textarea></label><label class="wide">Conteúdo<div class="rich-editor-wrap" data-rich-editor><div class="rich-toolbar" role="toolbar" aria-label="Ferramentas de edição"></div><div class="rich-editor" contenteditable="true" role="textbox" aria-multiline="true">{sanitize_article_html(rich_content)}</div><textarea class="rich-source" name="contentHtml" hidden>{e(rich_content)}</textarea><div class="editor-counter" aria-live="polite"></div></div></label><label>Publicação<input type="date" name="publishedAt" value="{e(post.get('publishedAt'))}"></label><label>Atualização material<input type="date" name="updatedAt" value="{e(post.get('updatedAt'))}"></label><label class="wide">Título SEO<input name="seoTitle" maxlength="65" value="{e(post.get('seoTitle'))}"></label><label class="wide">Descrição SEO<textarea name="seoDescription" maxlength="170" rows="3">{e(post.get('seoDescription'))}</textarea></label><label class="wide">Referências — uma por linha<textarea name="references" rows="8">{e(refs)}</textarea></label><div class="wide form-actions"><button class="primary" type="submit">Salvar postagem</button>{f'<a class="button secondary" href="/post/preview?id={urllib.parse.quote(str(post.get("id")))}">Abrir prévia</a>' if post.get('id') else ''}</div></form>'''
            self.send_html(self.with_csrf(layout("Editor de postagem", body, user, message, kind), user))
            return
        if route == "/institucional":
            value = INSTITUTIONAL_PATH.read_text(encoding="utf-8") if INSTITUTIONAL_PATH.exists() else "{}"
            data = safe_json_read(INSTITUTIONAL_PATH, {})
            approved = bool(data.get("authorApproved"))
            body = f'''<div class="page-head"><div><span class="eyebrow">Confiança</span><h1>Autoria e políticas</h1><p>Revise a biografia antes de marcar como aprovada.</p></div></div><section class="panel"><div class="approval {'ok' if approved else 'pending'}"><strong>Biografia pública: {'aprovada' if approved else 'aguardando aprovação'}</strong></div><form method="post" action="/institucional/salvar"><input type="hidden" name="csrf" value="__CSRF__"><label class="check"><input type="checkbox" name="authorApproved" value="1"{' checked' if approved else ''}> Confirmo que revisei e aprovo a biografia pública</label><label>Código institucional (JSON)<textarea class="editor code-source" data-language="json" name="content" rows="28">{e(value)}</textarea></label><button class="primary" type="submit">Validar, salvar e gerar páginas</button></form></section>'''
            self.send_html(self.with_csrf(layout("Autoria e políticas", body, user, message, kind), user))
            return
        if route == "/arquivos":
            requested = query.get("path", [""])[0]
            files = []
            for file in SITE_ROOT.rglob("*"):
                if not file.is_file() or file.suffix.lower() not in TEXT_EXTENSIONS:
                    continue
                relative = file.relative_to(SITE_ROOT)
                if any(part in {".git", ".venv", "admin-local", "banners", "kiwify-area-membros"} for part in relative.parts):
                    continue
                if len(relative.parts) == 1 and file.name not in EDITABLE_ROOT_FILES:
                    continue
                files.append(str(relative).replace("\\", "/"))
            files.sort()
            options = "".join(f'<option value="{e(item)}"{" selected" if requested==item else ""}>{e(item)}</option>' for item in files)
            editor = ""
            if requested in files:
                content = (SITE_ROOT / requested).read_text(encoding="utf-8", errors="replace")
                language = Path(requested).suffix.lower().lstrip(".") or "text"
                editor = f'''<form class="panel" method="post" action="/arquivo/salvar"><input type="hidden" name="csrf" value="__CSRF__"><input type="hidden" name="path" value="{e(requested)}"><label>Código de {e(requested)}<textarea class="editor code-source" data-language="{e(language)}" name="content" rows="30">{e(content)}</textarea></label><button class="primary" type="submit">Salvar com cópia de segurança</button></form>'''
            body = f'''<div class="page-head"><div><span class="eyebrow">Avançado</span><h1>Arquivos do site</h1><p>Editor restrito a arquivos de texto permitidos. Um backup é criado antes de cada alteração.</p></div></div><form class="panel inline-form" method="get" action="/arquivos"><label>Escolha um arquivo<select name="path">{options}</select></label><button class="secondary" type="submit">Abrir</button></form>{editor}'''
            self.send_html(self.with_csrf(layout("Arquivos", body, user, message, kind), user))
            return
        if route == "/ferramentas":
            git = find_executable("git")
            status = "Git não localizado."
            if git:
                _, status = run_command([git, "status", "--short"])
            backups = sorted(BACKUP_DIR.glob("*.zip"), reverse=True)[:6]
            backup_list = "".join(f"<li>{e(file.name)} <span>{file.stat().st_size / 1024 / 1024:.1f} MB</span></li>" for file in backups) or "<li>Nenhum backup completo.</li>"
            body = f'''<div class="page-head"><div><span class="eyebrow">Operação</span><h1>Validar e publicar</h1><p>Faça backup e auditoria antes de enviar alterações ao GitHub.</p></div></div><section class="panel-grid"><form class="panel" method="post" action="/ferramentas/auditar"><input type="hidden" name="csrf" value="__CSRF__"><h2>Auditoria</h2><p>Verifica links locais, placeholders e páginas geradas.</p><button class="secondary" type="submit">Executar auditoria</button></form><form class="panel" method="post" action="/ferramentas/backup"><input type="hidden" name="csrf" value="__CSRF__"><h2>Backup</h2><p>Cria um arquivo ZIP do conteúdo editorial e páginas.</p><button class="secondary" type="submit">Criar backup</button></form></section><section class="panel"><h2>Publicar pelo Git</h2><pre>{e(status or 'Nenhuma alteração pendente.')}</pre><form method="post" action="/ferramentas/publicar"><input type="hidden" name="csrf" value="__CSRF__"><label>Mensagem da publicação<input name="message" required maxlength="120" placeholder="Atualiza artigo e catálogo"></label><label class="check"><input type="checkbox" name="push" value="1"> Enviar ao GitHub após criar o commit</label><button class="danger" type="submit">Validar, criar backup e publicar</button></form></section><section class="panel"><h2>Backups recentes</h2><ul class="backup-list">{backup_list}</ul></section>'''
            self.send_html(self.with_csrf(layout("Publicação", body, user, message, kind), user))
            return
        if route == "/conta":
            body = f'''<div class="page-head"><div><span class="eyebrow">Segurança</span><h1>Conta</h1><p>{e(user['email'])}</p></div></div><section class="panel-grid"><form class="panel" method="post" action="/conta/senha"><input type="hidden" name="csrf" value="__CSRF__"><h2>Alterar senha</h2><label>Senha atual<input type="password" name="current" required autocomplete="current-password"></label><label>Nova senha<input type="password" name="password" minlength="12" required autocomplete="new-password"></label><label>Confirmar<input type="password" name="confirm" minlength="12" required autocomplete="new-password"></label><button class="primary" type="submit">Alterar senha</button></form><form class="panel email-setup" method="post" action="/conta/email-config"><input type="hidden" name="csrf" value="__CSRF__"><h2>Recuperação por e-mail</h2><p class="setup-status {'ok' if smtp_configured() else 'pending'}">Situação: <strong>{'configurada' if smtp_configured() else 'pendente'}</strong></p><ol class="setup-steps"><li>Ative a verificação em duas etapas da sua Conta Google.</li><li><a href="https://support.google.com/accounts/answer/185833?hl=pt" target="_blank" rel="noopener noreferrer">Crie uma senha de app de 16 caracteres</a>.</li><li>Cole essa senha abaixo. Ela ficará somente neste computador.</li></ol><label>E-mail do Gmail<input type="email" name="smtpUser" value="{e(user['email'])}" required></label><label>Senha de app do Google<input type="password" name="appPassword" minlength="16" maxlength="19" placeholder="16 caracteres" required autocomplete="off"></label><label>Senha atual do painel<input type="password" name="current" required autocomplete="current-password"></label><label class="check"><input type="checkbox" name="sendTest" value="1" checked> Salvar e enviar um e-mail de teste</label><button class="primary" type="submit">Configurar recuperação</button><small>Nunca use sua senha normal do Gmail neste campo.</small>{'<p><a href="/forgot">Testar o fluxo de recuperação</a></p>' if smtp_configured() else ''}</form></section>'''
            self.send_html(self.with_csrf(layout("Conta", body, user, message, kind), user))
            return

        self.send_html(self.with_csrf(layout("Não encontrado", "<h1>Página não encontrada</h1>", user), user), 404)

    def do_POST(self) -> None:
        route = urllib.parse.urlparse(self.path).path
        with db() as connection:
            user_count = connection.execute("SELECT COUNT(*) FROM users").fetchone()[0]

        if route == "/setup" and user_count == 0:
            form = self.parse_form()
            email_value = form.get("email", "").lower()
            password = form.get("password", "")
            error = valid_new_password(password)
            if email_value != ADMIN_EMAIL or password != form.get("confirm") or error:
                message = error or "E-mail ou confirmação de senha inválidos."
                self.redirect("/setup?kind=error&msg=" + urllib.parse.quote(message))
                return
            with db() as connection:
                connection.execute("INSERT INTO users(email,password_hash,created_at,updated_at) VALUES(?,?,?,?)", (email_value, password_hash(password), now_ts(), now_ts()))
            audit(None, "setup", "Conta administrativa criada")
            self.redirect("/login?msg=" + urllib.parse.quote("Conta criada. Faça login."))
            return
        if route == "/login":
            form = self.parse_form()
            ip = self.client_address[0]
            recent = [stamp for stamp in LOGIN_ATTEMPTS.get(ip, []) if stamp > time.time() - 900]
            LOGIN_ATTEMPTS[ip] = recent
            if len(recent) >= 5:
                self.redirect("/login?kind=error&msg=" + urllib.parse.quote("Muitas tentativas. Aguarde 15 minutos."))
                return
            with db() as connection:
                user = connection.execute("SELECT * FROM users WHERE email=?", (form.get("email", "").lower(),)).fetchone()
            if not user or not password_valid(form.get("password", ""), user["password_hash"]):
                LOGIN_ATTEMPTS[ip].append(time.time())
                time.sleep(0.35)
                self.redirect("/login?kind=error&msg=" + urllib.parse.quote("E-mail ou senha inválidos."))
                return
            LOGIN_ATTEMPTS[ip] = []
            token = secrets.token_urlsafe(32)
            csrf = secrets.token_urlsafe(24)
            with db() as connection:
                connection.execute("INSERT INTO sessions(token_hash,user_id,csrf_token,expires_at,created_at) VALUES(?,?,?,?,?)", (token_hash(token), user["id"], csrf, now_ts() + SESSION_HOURS * 3600, now_ts()))
            audit(user["id"], "login", "Sessão iniciada")
            cookie = f"guecas_session={token}; Path=/; HttpOnly; SameSite=Strict; Max-Age={SESSION_HOURS * 3600}"
            self.redirect("/", cookie)
            return
        if route == "/forgot":
            form = self.parse_form()
            email_value = form.get("email", "").lower()
            with db() as connection:
                user = connection.execute("SELECT * FROM users WHERE email=?", (email_value,)).fetchone()
            if user:
                token = secrets.token_urlsafe(32)
                with db() as connection:
                    connection.execute("DELETE FROM reset_tokens WHERE user_id=?", (user["id"],))
                    connection.execute("INSERT INTO reset_tokens(token_hash,user_id,expires_at) VALUES(?,?,?)", (token_hash(token), user["id"], now_ts() + RESET_MINUTES * 60))
                ok, detail = send_reset_email(email_value, f"http://{ADMIN_HOST}:{ADMIN_PORT}/reset?token={urllib.parse.quote(token)}")
                audit(user["id"], "password_reset_requested", detail)
                if not ok:
                    self.redirect("/forgot?kind=error&msg=" + urllib.parse.quote("O envio ainda não está configurado. Consulte Conta e segurança ou use redefinir-senha.bat."))
                    return
            self.redirect("/login?msg=" + urllib.parse.quote("Se o e-mail estiver cadastrado e o envio configurado, o link será enviado."))
            return
        if route == "/reset":
            form = self.parse_form()
            password = form.get("password", "")
            error = valid_new_password(password)
            if error or password != form.get("confirm"):
                self.redirect("/reset?kind=error&msg=" + urllib.parse.quote(error or "As senhas não coincidem.") + "&token=" + urllib.parse.quote(form.get("token", "")))
                return
            with db() as connection:
                row = connection.execute("SELECT * FROM reset_tokens WHERE token_hash=? AND expires_at>? AND used_at IS NULL", (token_hash(form.get("token", "")), now_ts())).fetchone()
                if not row:
                    self.redirect("/forgot?kind=error&msg=" + urllib.parse.quote("Link inválido ou expirado."))
                    return
                connection.execute("UPDATE users SET password_hash=?,updated_at=? WHERE id=?", (password_hash(password), now_ts(), row["user_id"]))
                connection.execute("UPDATE reset_tokens SET used_at=? WHERE token_hash=?", (now_ts(), row["token_hash"]))
                connection.execute("DELETE FROM sessions WHERE user_id=?", (row["user_id"],))
            audit(row["user_id"], "password_reset", "Senha redefinida por e-mail")
            self.redirect("/login?msg=" + urllib.parse.quote("Senha redefinida."))
            return

        user = self.require_user()
        if not user:
            return

        if route == "/capa":
            self.handle_cover_upload(user)
            return

        try:
            form = self.parse_form()
        except ValueError as exc:
            self.send_html(self.with_csrf(layout("Erro", f"<h1>{e(exc)}</h1>", user), user), 413)
            return
        if not self.require_csrf(user, form):
            return

        if route == "/logout":
            _, token = self.current_session()
            if token:
                with db() as connection:
                    connection.execute("DELETE FROM sessions WHERE token_hash=?", (token_hash(token),))
            audit(user["id"], "logout", "Sessão encerrada")
            self.redirect("/login", "guecas_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0")
            return
        if route == "/livro/salvar":
            catalog = safe_json_read(CATALOG_PATH, {"books": []})
            book = next((item for item in catalog.get("books", []) if item.get("slug") == form.get("slug")), None)
            if not book:
                self.redirect("/catalogo?kind=error&msg=" + urllib.parse.quote("Livro não encontrado."))
                return
            old_status = book.get("status")
            for key in ("title", "subtitle", "summary", "status", "publishedAt", "updatedAt", "price", "purchaseUrl", "seoTitle", "seoDescription"):
                value = form.get(key, "").strip()
                if value:
                    book[key] = value
                else:
                    book.pop(key, None)
            book["references"] = [line.strip() for line in form.get("references", "").splitlines() if line.strip()]
            if book.get("status") == "published" and (not book.get("publishedAt") or not book.get("summary")):
                self.redirect("/livro?slug=" + urllib.parse.quote(book["slug"]) + "&kind=error&msg=" + urllib.parse.quote("Para publicar, informe a data real e o resumo."))
                return
            safe_json_write(CATALOG_PATH, catalog, "catalogo")
            ok, output = run_generators()
            audit(user["id"], "book_saved", f"{book['slug']}: {old_status} → {book.get('status')}")
            self.redirect("/livro?slug=" + urllib.parse.quote(book["slug"]) + "&kind=" + ("info" if ok else "error") + "&msg=" + urllib.parse.quote("Livro salvo e páginas regeneradas." if ok else output))
            return
        if route == "/fanfic/salvar":
            data = safe_json_read(FANFICS_PATH, {"version": 1, "fanfics": []})
            item = next((entry for entry in data.get("fanfics", []) if entry.get("slug") == form.get("slug")), None)
            if not item:
                self.redirect("/fanfics-editorial?kind=error&msg=" + urllib.parse.quote("Fanfic não encontrada."))
                return
            for key in ("title", "subtitle", "summary", "status", "updatedAt", "universe", "format", "length", "rightsNotice", "seoTitle", "seoDescription"):
                item[key] = form.get(key, "").strip()
            item["contentHtml"] = sanitize_article_html(form.get("contentHtml", ""))
            item["references"] = [line.strip() for line in form.get("references", "").splitlines() if line.strip()]
            if item.get("status") == "published" and (not item.get("rightsNotice") or not item.get("summary")):
                self.redirect("/fanfic?slug=" + urllib.parse.quote(item["slug"]) + "&kind=error&msg=" + urllib.parse.quote("Para publicar, informe resumo e aviso sobre direitos."))
                return
            safe_json_write(FANFICS_PATH, data, "fanfics")
            generate_fanfics()
            audit(user["id"], "fanfic_saved", f"{item['slug']}: {item.get('status')}")
            self.redirect("/fanfic?slug=" + urllib.parse.quote(item["slug"]) + "&msg=" + urllib.parse.quote("Fanfic salva e páginas atualizadas."))
            return
        if route == "/post/salvar":
            data = safe_json_read(POSTS_PATH, {"version": 1, "posts": []})
            post_id = form.get("id") or secrets.token_hex(6)
            post = next((item for item in data.get("posts", []) if str(item.get("id")) == post_id), None)
            if not post:
                post = {"id": post_id}
                data.setdefault("posts", []).append(post)
            title = form.get("title", "").strip()
            slug = slugify(form.get("slug") or title)
            status = form.get("status", "draft")
            references = [line.strip() for line in form.get("references", "").splitlines() if line.strip()]
            if status == "published" and (not form.get("publishedAt") or not references):
                self.redirect("/post?id=" + urllib.parse.quote(post_id) + "&kind=error&msg=" + urllib.parse.quote("Para publicar, informe data real e pelo menos uma referência."))
                return
            post.update({
                "title": title, "slug": slug, "excerpt": form.get("excerpt", "").strip(),
                "contentHtml": sanitize_article_html(form.get("contentHtml", "")), "status": status,
                "publishedAt": form.get("publishedAt", ""), "updatedAt": form.get("updatedAt", ""),
                "seoTitle": form.get("seoTitle", "").strip(), "seoDescription": form.get("seoDescription", "").strip(),
                "category": form.get("category", "").strip(), "featuredImage": form.get("featuredImage", "").strip(),
                "references": references, "author": "Elvis T. G. Castro",
            })
            safe_json_write(POSTS_PATH, data, "posts")
            generate_posts()
            audit(user["id"], "post_saved", f"{slug}: {status}")
            self.redirect("/post?id=" + urllib.parse.quote(post_id) + "&msg=" + urllib.parse.quote("Postagem salva."))
            return
        if route == "/institucional/salvar":
            try:
                value = json.loads(form.get("content", "{}"))
                value["authorApproved"] = form.get("authorApproved") == "1"
                if not isinstance(value.get("pages"), list):
                    raise ValueError("O campo pages precisa ser uma lista.")
                safe_json_write(INSTITUTIONAL_PATH, value, "institucional")
                ok, output = run_generators()
                audit(user["id"], "institutional_saved", f"authorApproved={value['authorApproved']}")
                self.redirect("/institucional?kind=" + ("info" if ok else "error") + "&msg=" + urllib.parse.quote("Conteúdo institucional salvo." if ok else output))
            except Exception as exc:
                self.redirect("/institucional?kind=error&msg=" + urllib.parse.quote(f"JSON inválido: {exc}"))
            return
        if route == "/arquivo/salvar":
            relative = Path(form.get("path", ""))
            candidate = (SITE_ROOT / relative).resolve()
            try:
                candidate.relative_to(SITE_ROOT.resolve())
            except ValueError:
                self.send_html(self.with_csrf(layout("Erro", "<h1>Caminho não permitido.</h1>", user), user), 403)
                return
            if candidate.suffix.lower() not in TEXT_EXTENSIONS or any(part in {".git", ".venv", "admin-local"} for part in relative.parts):
                self.send_html(self.with_csrf(layout("Erro", "<h1>Arquivo não permitido.</h1>", user), user), 403)
                return
            backup_file(candidate, "arquivo")
            candidate.write_text(form.get("content", ""), encoding="utf-8")
            audit(user["id"], "file_saved", str(relative))
            self.redirect("/arquivos?path=" + urllib.parse.quote(str(relative).replace("\\", "/")) + "&msg=" + urllib.parse.quote("Arquivo salvo com backup."))
            return
        if route == "/ferramentas/auditar":
            result = link_audit()
            detail = f"{result['checked']} páginas, {len(result['broken'])} quebrados, {len(result['hashes'])} placeholders"
            audit(user["id"], "audit", detail)
            problems = result["broken"] + [f"href=# em {item}" for item in result["hashes"]]
            self.redirect("/ferramentas?kind=" + ("error" if problems else "info") + "&msg=" + urllib.parse.quote(detail + (" — " + " | ".join(problems[:5]) if problems else "")))
            return
        if route == "/ferramentas/backup":
            target = create_backup()
            audit(user["id"], "backup", target.name)
            self.redirect("/ferramentas?msg=" + urllib.parse.quote(f"Backup criado: {target.name}"))
            return
        if route == "/ferramentas/publicar":
            result = link_audit()
            if result["broken"] or result["hashes"]:
                self.redirect("/ferramentas?kind=error&msg=" + urllib.parse.quote("Publicação bloqueada: corrija os links indicados pela auditoria."))
                return
            backup = create_backup()
            ok, output = run_generators()
            if not ok:
                self.redirect("/ferramentas?kind=error&msg=" + urllib.parse.quote(output))
                return
            git = find_executable("git")
            if not git:
                self.redirect("/ferramentas?kind=error&msg=" + urllib.parse.quote("Git não localizado."))
                return
            message_value = form.get("message", "").strip()[:120]
            steps = [([git, "add", "-A"], "preparar"), ([git, "commit", "-m", message_value], "commit")]
            for command, label in steps:
                ok, output = run_command(command, 120)
                if not ok:
                    self.redirect("/ferramentas?kind=error&msg=" + urllib.parse.quote(f"Falha ao {label}: {output}"))
                    return
            if form.get("push") == "1":
                ok, output = run_command([git, "push", "origin", "HEAD"], 180)
                if not ok:
                    self.redirect("/ferramentas?kind=error&msg=" + urllib.parse.quote(f"Commit criado, mas o envio falhou: {output}"))
                    return
            audit(user["id"], "publish", f"{message_value}; backup={backup.name}; push={form.get('push') == '1'}")
            self.redirect("/ferramentas?msg=" + urllib.parse.quote("Publicação concluída com segurança."))
            return
        if route == "/conta/senha":
            if not password_valid(form.get("current", ""), user["password_hash"]):
                self.redirect("/conta?kind=error&msg=" + urllib.parse.quote("Senha atual incorreta."))
                return
            password = form.get("password", "")
            error = valid_new_password(password)
            if error or password != form.get("confirm"):
                self.redirect("/conta?kind=error&msg=" + urllib.parse.quote(error or "As senhas não coincidem."))
                return
            with db() as connection:
                connection.execute("UPDATE users SET password_hash=?,updated_at=? WHERE id=?", (password_hash(password), now_ts(), user["id"]))
                connection.execute("DELETE FROM sessions WHERE user_id=?", (user["id"],))
            audit(user["id"], "password_changed", "Senha alterada pelo painel")
            self.redirect("/login?msg=" + urllib.parse.quote("Senha alterada. Entre novamente."), "guecas_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0")
            return
        if route == "/conta/email-config":
            if not password_valid(form.get("current", ""), user["password_hash"]):
                self.redirect("/conta?kind=error&msg=" + urllib.parse.quote("Senha atual do painel incorreta."))
                return
            smtp_user = form.get("smtpUser", "").strip().lower()
            app_password = re.sub(r"\s+", "", form.get("appPassword", ""))
            if smtp_user != user["email"].lower() or len(app_password) != 16 or not app_password.isalnum():
                self.redirect("/conta?kind=error&msg=" + urllib.parse.quote("Informe o e-mail administrativo e uma senha de app válida com 16 caracteres."))
                return
            previous_env = ENV_PATH.read_bytes() if ENV_PATH.exists() else None
            save_env_settings({
                "ADMIN_EMAIL": smtp_user, "SMTP_HOST": "smtp.gmail.com", "SMTP_PORT": "465",
                "SMTP_USER": smtp_user, "SMTP_APP_PASSWORD": app_password,
            })
            if form.get("sendTest") == "1":
                ok, detail = send_reset_email(smtp_user, f"http://{ADMIN_HOST}:{ADMIN_PORT}/login")
                if not ok:
                    if previous_env is None:
                        ENV_PATH.unlink(missing_ok=True)
                    else:
                        ENV_PATH.write_bytes(previous_env)
                    ENV.clear()
                    ENV.update(load_env())
                    self.redirect("/conta?kind=error&msg=" + urllib.parse.quote("O teste falhou e a configuração não foi mantida: " + detail))
                    return
            audit(user["id"], "email_config_saved", "Gmail configurado e testado" if form.get("sendTest") == "1" else "Gmail configurado")
            self.redirect("/conta?msg=" + urllib.parse.quote("Recuperação por e-mail configurada com sucesso."))
            return

        self.send_html(self.with_csrf(layout("Não encontrado", "<h1>Ação não encontrada</h1>", user), user), 404)

    def handle_cover_upload(self, user: sqlite3.Row) -> None:
        if Image is None:
            self.redirect("/catalogo?kind=error&msg=" + urllib.parse.quote("Pillow não está instalado no ambiente Python."))
            return
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > MAX_UPLOAD:
            self.send_html(self.with_csrf(layout("Upload", "<h1>Arquivo inválido ou maior que 20 MB.</h1>", user), user), 413)
            return
        content_type = self.headers.get("Content-Type", "")
        raw = self.rfile.read(length)
        message = BytesParser(policy=email_policy).parsebytes(f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode() + raw)
        fields: dict[str, str] = {}
        uploaded = None
        for part in message.iter_parts():
            name = part.get_param("name", header="content-disposition")
            filename = part.get_filename()
            payload = part.get_payload(decode=True) or b""
            if filename and name == "cover":
                uploaded = payload
            elif name:
                fields[name] = payload.decode(part.get_content_charset() or "utf-8", errors="replace")
        if not hmac.compare_digest(fields.get("csrf", ""), user["csrf_token"]):
            self.send_html(self.with_csrf(layout("Upload", "<h1>Solicitação inválida.</h1>", user), user), 403)
            return
        slug = fields.get("slug", "")
        catalog = safe_json_read(CATALOG_PATH, {"books": []})
        book = next((item for item in catalog.get("books", []) if item.get("slug") == slug), None)
        if not book or not uploaded:
            self.redirect("/catalogo?kind=error&msg=" + urllib.parse.quote("Livro ou imagem inválidos."))
            return
        import io
        try:
            image = Image.open(io.BytesIO(uploaded)).convert("RGB")
            ratio = image.width / image.height
            if abs(ratio - 0.625) > 0.025:
                raise ValueError("A capa precisa estar na proporção vertical 5:8.")
            master = image.resize((1600, 2560), Image.Resampling.LANCZOS)
            master_path = MASTER_DIR / f"{slug}.png"
            if master_path.exists():
                backup_file(master_path, "capa-master")
            master.save(master_path, "PNG", optimize=True)
            cover400 = book.get("cover400") or f"arquivos/capas/ebooks/{slug}-400.webp"
            cover800 = book.get("cover800") or f"arquivos/capas/ebooks/{slug}-800.webp"
            for size, relative in ((400, cover400), (800, cover800)):
                target = SITE_ROOT / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                backup_file(target, "capa-web")
                resized = master.resize((size, int(size * 1.6)), Image.Resampling.LANCZOS)
                resized.save(target, "WEBP", quality=84 if size == 400 else 86, method=6)
            if book.get("renderCover") is False:
                png_path = (SITE_ROOT / cover800).with_name("capa-o-peso-invisivel.png")
                backup_file(png_path, "capa-png")
                master.save(png_path, "PNG", optimize=True)
            book["cover400"], book["cover800"] = cover400, cover800
            safe_json_write(CATALOG_PATH, catalog, "capa-catalogo")
            audit(user["id"], "cover_uploaded", slug)
            self.redirect("/livro?slug=" + urllib.parse.quote(slug) + "&msg=" + urllib.parse.quote("Capa processada em 400, 800 e master local."))
        except Exception as exc:
            self.redirect("/livro?slug=" + urllib.parse.quote(slug) + "&kind=error&msg=" + urllib.parse.quote(f"Não foi possível processar: {exc}"))


def offline_reset() -> None:
    init_storage()
    with db() as connection:
        user = connection.execute("SELECT * FROM users WHERE email=?", (ADMIN_EMAIL,)).fetchone()
    if not user:
        print("A conta ainda não foi criada. Inicie o painel e conclua o primeiro acesso.")
        return
    password = getpass.getpass("Nova senha: ")
    confirm = getpass.getpass("Confirmar nova senha: ")
    error = valid_new_password(password)
    if error or password != confirm:
        print(error or "As senhas não coincidem.")
        return
    with db() as connection:
        connection.execute("UPDATE users SET password_hash=?,updated_at=? WHERE id=?", (password_hash(password), now_ts(), user["id"]))
        connection.execute("DELETE FROM sessions WHERE user_id=?", (user["id"],))
    audit(user["id"], "offline_password_reset", "Redefinição local de emergência")
    print("Senha redefinida.")


def self_check() -> int:
    init_storage()
    required = [
        CATALOG_PATH, INSTITUTIONAL_PATH, POSTS_PATH, FANFICS_PATH,
        APP_DIR / "static/admin.css", APP_DIR / "static/admin.js",
        APP_DIR / "static/guecas-painel.ico",
        SITE_ROOT / "output/pdf/manual-painel-editorial-guecas-house.pdf",
    ]
    missing = [str(file) for file in required if not file.exists()]
    print(f"SITE_ROOT={SITE_ROOT}")
    print(f"DB_OK={DB_PATH.exists()}")
    print(f"SMTP_CONFIGURED={smtp_configured()}")
    print(f"NODE={find_executable('node') or 'missing'}")
    print(f"GIT={find_executable('git') or 'missing'}")
    print(f"MISSING={len(missing)}")
    for item in missing:
        print(item)
    return 1 if missing else 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Painel editorial local da Guecas House")
    parser.add_argument("--reset-password", action="store_true")
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()
    if args.reset_password:
        offline_reset()
        return
    if args.check:
        raise SystemExit(self_check())
    init_storage()
    preview = ThreadingHTTPServer((ADMIN_HOST, PREVIEW_PORT), PreviewHandler)
    threading.Thread(target=preview.serve_forever, daemon=True).start()
    server = ThreadingHTTPServer((ADMIN_HOST, ADMIN_PORT), AdminHandler)
    print(f"Painel:  http://{ADMIN_HOST}:{ADMIN_PORT}/")
    print(f"Prévia:  http://{ADMIN_HOST}:{PREVIEW_PORT}/")
    print("Pressione Ctrl+C para encerrar.")
    if not args.no_browser:
        threading.Timer(0.8, lambda: webbrowser.open(f"http://{ADMIN_HOST}:{ADMIN_PORT}/")).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        preview.shutdown()
        preview.server_close()


if __name__ == "__main__":
    main()
