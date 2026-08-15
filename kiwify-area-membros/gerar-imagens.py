# -*- coding: utf-8 -*-
"""Gera as imagens da area de membros (A Era da Mente Cansada) na identidade
Guecas House: navy + dourado, Cinzel nos titulos, Alegreya no corpo.

    python kiwify-area-membros/gerar-imagens.py

Sai tudo em arquivos/assets/banners-membros/. Onde cada arquivo entra na Kiwify
esta no README.md desta pasta.

Precisa de Pillow (`pip install Pillow`) e das fontes Cinzel/Alegreya instaladas
em C:\\Windows\\Fonts (as mesmas do site).
"""
import math
import os

from PIL import Image, ImageDraw, ImageFont, ImageFilter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "arquivos", "assets", "banners-membros")
CAPA_LIVRO = os.path.join(RAIZ, "arquivos", "Imagens", "capa-o-peso-invisivel.png")
FONTES = r"C:\Windows\Fonts"

CINZEL_BOLD = os.path.join(FONTES, "Cinzel-Bold.ttf")
CINZEL_SEMI = os.path.join(FONTES, "Cinzel-SemiBold.ttf")
ALEGREYA = os.path.join(FONTES, "Alegreya-VariableFont_wght.ttf")

NAVY_TOPO = (16, 40, 61)      # #10283d
NAVY_MEIO = (27, 58, 87)      # #1b3a57
NAVY_BASE = (13, 31, 48)
OURO = (208, 187, 108)        # #d0bb6c
CREME = (246, 242, 231)       # #f6f2e7

SUBTITULO = "Para entender o próprio cansaço antes de tentar consertá-lo"


# --------------------------------------------------------------- utilitarios
def fundo(w, h):
    """Degrade navy + brilho radial no centro + vinheta nos cantos."""
    base = Image.new("RGB", (w, h))
    px = base.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        if t < 0.55:
            k, a, b = t / 0.55, NAVY_TOPO, NAVY_MEIO
        else:
            k, a, b = (t - 0.55) / 0.45, NAVY_MEIO, NAVY_BASE
        c = tuple(int(a[i] + (b[i] - a[i]) * k) for i in range(3))
        for x in range(w):
            px[x, y] = c

    brilho = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(brilho)
    cx, cy, r = w // 2, int(h * 0.42), int(max(w, h) * 0.42)
    d.ellipse([cx - r, cy - r * 0.72, cx + r, cy + r * 0.72], fill=70)
    brilho = brilho.filter(ImageFilter.GaussianBlur(r // 3))
    base = Image.composite(Image.new("RGB", (w, h), (44, 78, 110)), base, brilho)

    vinheta = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(vinheta)
    m = int(min(w, h) * 0.10)
    d.rectangle([m, m, w - m, h - m], fill=255)
    vinheta = vinheta.filter(ImageFilter.GaussianBlur(int(min(w, h) * 0.16)))
    return Image.composite(base, Image.new("RGB", (w, h), (8, 20, 32)), vinheta)


def texto_espacado(draw, y, texto, fonte, cor, largura, espaco):
    """Texto centrado com espacamento extra entre as letras (o kicker da marca)."""
    larg = [draw.textlength(c, font=fonte) for c in texto]
    x = (largura - (sum(larg) + espaco * (len(texto) - 1))) / 2
    for c, lc in zip(texto, larg):
        draw.text((x, y), c, font=fonte, fill=cor)
        x += lc + espaco


def centrado(draw, y, texto, fonte, cor, largura):
    draw.text(((largura - draw.textlength(texto, font=fonte)) / 2, y),
              texto, font=fonte, fill=cor)


def hexagono(img, cx, cy, raio, espessura):
    """Hexagono vazado com losango solido no centro: o icone da marca.
    Desenhado 4x maior e reduzido depois, senao a linha fina fica serrilhada."""
    ss = 4
    cam = Image.new("RGBA", (img.width * ss, img.height * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(cam)
    pts = []
    for i in range(6):
        a = math.radians(60 * i - 90)
        pts.append(((cx + raio * math.sin(a + math.pi / 2)) * ss,
                    (cy - raio * math.cos(a + math.pi / 2)) * ss))
    d.polygon(pts, outline=OURO + (255,), width=espessura * ss)
    r2 = raio * 0.30
    d.polygon([(cx * ss, (cy - r2) * ss), ((cx + r2) * ss, cy * ss),
               (cx * ss, (cy + r2) * ss), ((cx - r2) * ss, cy * ss)],
              fill=OURO + (255,))
    cam = cam.resize((img.width, img.height), Image.LANCZOS)
    img.paste(cam, (0, 0), cam)


def regua(draw, cx, y, meia):
    draw.rectangle([cx - meia, y, cx + meia, y + 2], fill=OURO)


def silhueta(altura):
    """Recorte da capa com o personagem: do brilho acima da cabeca ate um pouco
    antes da linha de texto do rodape da capa."""
    capa = Image.open(CAPA_LIVRO).convert("RGB")
    cw, ch = capa.size
    r = capa.crop((int(cw * 0.06), int(ch * 0.33), int(cw * 0.94), int(ch * 0.86)))
    return r.resize((int(r.width * altura / r.height), altura), Image.LANCZOS)


def desvanece_topo(mask, altura_fade):
    """Apaga a borda de cima da mascara para o recorte nascer do fundo."""
    w, h = mask.size
    topo = Image.new("L", (w, h), 255)
    td = ImageDraw.Draw(topo)
    for y in range(altura_fade):
        td.line([(0, y), (w, y)], fill=int(255 * (y / altura_fade) ** 0.7))
    return Image.composite(mask, Image.new("L", (w, h), 0), topo)


def salvar(img, arquivo, q=93):
    destino = os.path.join(SAIDA, arquivo)
    img.save(destino, "JPEG", quality=q, optimize=True, progressive=True)
    print(os.path.relpath(destino, RAIZ), img.size)


# ------------------------------------------------------------ paisagem (16:9)
def capa_paisagem(w, h, arquivo, escala=1.0):
    """Bloco unico (hexagono, kicker, titulo, regua, subtitulo) centrado na
    vertical - o mesmo desenho do banner do topo da area."""
    img = fundo(w, h)
    d = ImageDraw.Draw(img)
    e = (h / 630.0) * escala

    f_kicker = ImageFont.truetype(CINZEL_SEMI, max(9, int(19 * e)))
    f_titulo = ImageFont.truetype(CINZEL_BOLD, int(64 * e))
    f_sub = ImageFont.truetype(ALEGREYA, int(27 * e))

    raio, alt_kicker, alt_linha, alt_sub = int(42 * e), int(24 * e), int(74 * e), int(36 * e)
    titulo = "A ERA DA MENTE CANSADA"
    linhas = [titulo] if d.textlength(titulo, font=f_titulo) <= w * 0.86 \
        else ["A ERA DA", "MENTE CANSADA"]

    esp = [int(38 * e), int(26 * e), int(24 * e), int(26 * e)]
    total = (raio * 2 + esp[0] + alt_kicker + esp[1]
             + alt_linha * len(linhas) + esp[2] + 2 + esp[3] + alt_sub)

    y = (h - total) / 2
    hexagono(img, w // 2, int(y + raio), raio, max(1, int(3 * e)))
    d = ImageDraw.Draw(img)
    y += raio * 2 + esp[0]

    texto_espacado(d, y, "GUECAS HOUSE  ·  EDITORA DIGITAL", f_kicker, OURO, w, 6 * e)
    y += alt_kicker + esp[1]
    for ln in linhas:
        centrado(d, y - int(14 * e), ln, f_titulo, CREME, w)
        y += alt_linha
    y += esp[2]
    regua(d, w // 2, int(y), int(96 * e))
    y += 2 + esp[3]
    centrado(d, y, SUBTITULO, f_sub, (224, 232, 240), w)

    salvar(img, arquivo, q=92)


# --------------------------------------------------------- retrato 2:3 (card)
def capa_retrato(kicker, arquivo, corpo=21):
    """Base dos cards: silhueta sangrando pela base, hexagono e linha da serie
    no topo. O rodape fica escuro de proposito - e onde a Kiwify sobrepoe o
    titulo do card."""
    W, H = 800, 1200
    img = fundo(W, H)

    sil = silhueta(880)
    sw, sh = sil.size
    mask = Image.new("L", (sw, sh), 255)
    md = ImageDraw.Draw(mask)
    for x in range(90):                      # dissolve nas duas laterais
        a = int(255 * (x / 90) ** 0.7)
        md.line([(x, 0), (x, sh)], fill=a)
        md.line([(sw - 1 - x, 0), (sw - 1 - x, sh)], fill=a)
    mask = desvanece_topo(mask, 120).filter(ImageFilter.GaussianBlur(6))
    img.paste(sil, ((W - sw) // 2, H - sh), mask)

    hexagono(img, W // 2, 128, 46, 3)
    d = ImageDraw.Draw(img)
    texto_espacado(d, 218, kicker, ImageFont.truetype(CINZEL_SEMI, corpo), OURO, W, 5)
    regua(d, W // 2, 262, 74)

    salvar(img, arquivo)


# ------------------------------------------------- card 16:9 de "Continuar lendo"
def capa_aula(arquivo):
    """Silhueta grande sangrando pela esquerda, texto a direita. A faixa de
    baixo fica escura porque a Kiwify escreve o titulo da aula ali.

    O texto da direita e so a posicao na serie ("Livro 1"): o nome do livro e o
    "livro completo" quem escreve e a propria Kiwify, no card e no topo da
    pagina do curso - repetir aqui dobrava tudo na tela."""
    W, H = 1280, 720
    img = fundo(W, H)

    sil = silhueta(H)
    sw, sh = sil.size
    mask = Image.new("L", (sw, sh), 0)
    mp = mask.load()
    op_ate, fim = int(sw * 0.48), int(sw * 0.96)
    for x in range(sw):
        a = 255 if x <= op_ate else (0 if x >= fim
                                     else int(255 * (1 - (x - op_ate) / (fim - op_ate)) ** 2))
        for y in range(sh):
            mp[x, y] = a
    mask = desvanece_topo(mask, 90).filter(ImageFilter.GaussianBlur(6))
    img.paste(sil, (-40, 0), mask)

    d = ImageDraw.Draw(img)
    f_kicker = ImageFont.truetype(CINZEL_SEMI, 21)
    f_titulo = ImageFont.truetype(CINZEL_BOLD, 74)
    cx = 930

    def col(y, texto, fonte, cor):
        d.text((cx - d.textlength(texto, font=fonte) / 2, y), texto, font=fonte, fill=cor)

    def col_espacado(y, texto, fonte, cor, esp):
        larg = [d.textlength(c, font=fonte) for c in texto]
        x = cx - (sum(larg) + esp * (len(texto) - 1)) / 2
        for c, lc in zip(texto, larg):
            d.text((x, y), c, font=fonte, fill=cor)
            x += lc + esp

    hexagono(img, cx, 232, 40, 3)
    d = ImageDraw.Draw(img)
    col_espacado(310, "A ERA DA MENTE CANSADA", f_kicker, OURO, 5)
    col(352, "LIVRO 1", f_titulo, CREME)
    d.rectangle([cx - 110, 464, cx + 110, 466], fill=OURO)

    salvar(img, arquivo)


def favicon():
    """Selo cheio, em todos os tamanhos que o site e a Kiwify usam.

    A versao antiga era o hexagono navy sobre fundo transparente: em aba de tema
    escuro o navy sumia e sobrava so o losango dourado solto. Aqui o navy vira um
    ladrilho cheio, entao a marca aparece igual em aba clara e escura.
    """
    ss = 4
    L = 512 * ss
    img = Image.new("RGBA", (L, L), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, L - 1, L - 1], radius=int(L * 0.20), fill=NAVY_TOPO + (255,))

    c = L / 2
    raio = L * 0.355
    pts = []
    for i in range(6):
        a = math.radians(60 * i - 90)
        pts.append((c + raio * math.sin(a + math.pi / 2),
                    c - raio * math.cos(a + math.pi / 2)))
    d.polygon(pts, outline=OURO + (255,), width=int(L * 0.045))

    r = L * 0.145
    d.polygon([(c, c - r), (c + r, c), (c, c + r), (c - r, c)], fill=OURO + (255,))

    mestre = img.resize((512, 512), Image.LANCZOS)
    for lado in (512, 180, 64, 48, 32, 16):
        destino = os.path.join(RAIZ, "arquivos", "assets", f"favicon-{lado}.png")
        mestre.resize((lado, lado), Image.LANCZOS).save(destino)
        print(os.path.relpath(destino, RAIZ), (lado, lado))


def logo_membros():
    """Logo do menu da area de membros, na proporcao que a Kiwify entrega.

    O slot dela e 720x128 (5,625:1) e o corte e fit=cover: com a logo original
    (3,8:1) a plataforma cortava em cima e embaixo e comia as pontas do
    hexagono. Aqui a arte entra centrada numa tela ja na proporcao certa.
    """
    origem = os.path.join(RAIZ, "arquivos", "assets", "logo-3-horizontal.png")
    im = Image.open(origem).convert("RGBA")
    conteudo = im.crop(im.getchannel("A").getbbox())   # tira as margens existentes
    cw, ch = conteudo.size

    H = round(ch / 0.92)                               # 4% de folga em cima e embaixo
    W = round(H * (720 / 128))
    tela = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    tela.paste(conteudo, ((W - cw) // 2, (H - ch) // 2), conteudo)

    destino = os.path.join(RAIZ, "arquivos", "assets", "logo-3-horizontal-membros.png")
    tela.save(destino)
    print(os.path.relpath(destino, RAIZ), tela.size)


if __name__ == "__main__":
    os.makedirs(SAIDA, exist_ok=True)
    # escala > 1 nos banners largos: a altura e pequena perto da largura, entao
    # o tipo precisa crescer para o titulo ocupar a faixa
    capa_paisagem(1920, 640, "banner-serie-desktop.jpg", escala=1.35)
    capa_paisagem(900, 900, "banner-serie-mobile.jpg", escala=1.15)
    capa_paisagem(1200, 630, "capa-social-1200x630.jpg")
    capa_paisagem(640, 360, "capa-area-640x360.jpg", escala=1.05)
    capa_retrato("A ERA DA MENTE CANSADA", "capa-modulo-o-livro.jpg")
    capa_retrato("A ERA DA MENTE CANSADA · LIVRO 1",
                 "capa-curso-o-peso-invisivel.jpg", corpo=18)
    capa_aula("capa-aula-peso-invisivel.jpg")
    favicon()
    logo_membros()
