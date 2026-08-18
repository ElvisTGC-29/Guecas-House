from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "manual-painel-editorial-guecas-house.pdf"
LOGO = ROOT / "admin-local" / "static" / "guecas-painel.png"
W, H = A4

NAVY = "#102D40"
NAVY_2 = "#1B465F"
GOLD = "#C79C50"
PAPER = "#F4F0E7"
WHITE = "#FFFDFA"
INK = "#17242E"
MUTED = "#5C6B75"
GREEN = "#2F7254"
RED = "#A7443D"
LINE = "#D9D2C5"

fonts = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("GH", fonts / "segoeui.ttf"))
pdfmetrics.registerFont(TTFont("GH-Bold", fonts / "segoeuib.ttf"))
pdfmetrics.registerFont(TTFont("GH-Semi", fonts / "seguisb.ttf"))


def color(c, value):
    c.setFillColor(value)


def text(c, value, x, y, size=10, font="GH", fill=INK):
    c.setFont(font, size)
    color(c, fill)
    c.drawString(x, y, value)


def wrap_lines(value, font, size, width):
    lines = []
    for paragraph in value.split("\n"):
        words = paragraph.split()
        current = ""
        for word in words:
            trial = f"{current} {word}".strip()
            if pdfmetrics.stringWidth(trial, font, size) <= width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
        lines.append(current)
    return lines


def paragraph(c, value, x, y, width, size=10.2, leading=14.5, font="GH", fill=INK):
    c.setFont(font, size)
    color(c, fill)
    for line in wrap_lines(value, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def header(c, page, kicker, title, subtitle=""):
    color(c, PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    color(c, NAVY)
    c.rect(0, H - 84, W, 84, fill=1, stroke=0)
    if LOGO.exists():
        c.drawImage(str(LOGO), 38, H - 67, 42, 42, mask="auto")
    text(c, "GUECAS HOUSE", 92, H - 44, 12, "GH-Bold", WHITE)
    text(c, "MANUAL DO PAINEL EDITORIAL", 92, H - 61, 7.5, "GH-Semi", "#BFD0DB")
    text(c, f"{page:02d}", W - 65, H - 55, 21, "GH-Bold", GOLD)
    text(c, kicker.upper(), 42, H - 125, 8, "GH-Bold", "#8C6A2F")
    text(c, title, 42, H - 159, 24, "GH-Bold", INK)
    y = H - 181
    if subtitle:
        y = paragraph(c, subtitle, 42, y, W - 84, 10.5, 14.5, "GH", MUTED) - 8
    return y


def footer(c, page):
    color(c, LINE)
    c.rect(42, 35, W - 84, .7, fill=1, stroke=0)
    text(c, "Uso local • guecashouse.com.br", 42, 20, 7.5, "GH", MUTED)
    text(c, f"Página {page} de 12", W - 105, 20, 7.5, "GH", MUTED)


def card(c, x, y, width, title, body, accent=GOLD, height=92):
    color(c, WHITE)
    c.roundRect(x, y - height, width, height, 9, fill=1, stroke=0)
    c.setStrokeColor(LINE)
    c.roundRect(x, y - height, width, height, 9, fill=0, stroke=1)
    color(c, accent)
    c.roundRect(x, y - height, 5, height, 2, fill=1, stroke=0)
    text(c, title, x + 17, y - 23, 11, "GH-Bold", INK)
    paragraph(c, body, x + 17, y - 43, width - 32, 8.7, 12.2, "GH", MUTED)
    return y - height


def step(c, number, title, body, x, y, width=W - 84):
    color(c, NAVY)
    c.circle(x + 15, y - 14, 15, fill=1, stroke=0)
    text(c, str(number), x + 11.2, y - 18, 10, "GH-Bold", WHITE)
    text(c, title, x + 42, y - 7, 10.5, "GH-Bold", INK)
    y2 = paragraph(c, body, x + 42, y - 25, width - 42, 8.8, 12.3, "GH", MUTED)
    return min(y - 54, y2 - 9)


def page_cover(c):
    color(c, NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    color(c, NAVY_2)
    c.circle(W + 20, H - 70, 205, fill=1, stroke=0)
    color(c, GOLD)
    c.circle(W - 20, H - 70, 104, fill=1, stroke=0)
    if LOGO.exists():
        c.drawImage(str(LOGO), 52, H - 152, 75, 75, mask="auto")
    text(c, "GUECAS HOUSE", 52, H - 184, 10, "GH-Bold", "#C9D8E1")
    text(c, "Manual do", 52, H - 286, 29, "GH", WHITE)
    text(c, "Painel Editorial", 52, H - 330, 37, "GH-Bold", WHITE)
    paragraph(c, "Guia prático para editar, revisar, proteger e publicar o conteúdo do site com segurança.", 52, H - 369, 410, 13, 19, "GH", "#CEDAE1")
    color(c, WHITE)
    c.roundRect(52, 115, 330, 92, 12, fill=1, stroke=0)
    text(c, "EDIÇÃO 2026", 72, 177, 8, "GH-Bold", "#8C6A2F")
    text(c, "Painel local • português do Brasil", 72, 151, 12, "GH-Semi", INK)
    text(c, "Autoria, ebooks, fanfics, artigos, SEO e publicação", 72, 132, 8.6, "GH", MUTED)
    text(c, "Elvis T. G. Castro • Guecas House", 52, 58, 9, "GH", "#AFC2CE")


def make_pdf():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4, pageCompression=1)
    c.setTitle("Manual do Painel Editorial Guecas House")
    c.setAuthor("Guecas House")
    c.setSubject("Operação segura do painel editorial local")

    page_cover(c); c.showPage()

    y = header(c, 2, "Começo rápido", "Abrir, fixar e encerrar", "O painel funciona somente neste computador e precisa estar ligado para ser acessado.")
    y = step(c, 1, "Instale o atalho uma única vez", "Execute instalar-atalho-painel.bat. O atalho será criado na Área de Trabalho e no menu Iniciar com a logo oficial.", 42, y)
    y = step(c, 2, "Fixe na barra de tarefas", "Clique com o botão direito em Painel Guecas House e escolha Fixar na barra de tarefas. O clique final é uma exigência do Windows.", 42, y)
    y = step(c, 3, "Abra o painel", "Use o atalho fixado ou iniciar-painel.bat. O endereço administrativo é 127.0.0.1:8765 e a prévia do site usa a porta 8766.", 42, y)
    y = step(c, 4, "Encerre quando terminar", "Execute encerrar-painel.bat. Ele fecha somente o processo associado ao painel da Guecas House.", 42, y)
    card(c, 42, y - 8, W - 84, "IMPORTANTE", "A página administrativa não é pública. Se o computador estiver desligado, o painel não funciona — o site publicado continua funcionando normalmente.", NAVY, 82)
    footer(c, 2); c.showPage()

    y = header(c, 3, "Visão geral", "Mapa do painel", "Cada área tem uma função editorial clara. Use este mapa quando não souber onde realizar uma alteração.")
    card(c, 42, y, 245, "Ebooks", "Título, resumo, situação, preço, SEO, referências e capas.", GOLD, 75)
    card(c, 308, y, 245, "Fanfics", "Texto, transparência de direitos, SEO e página pública.", NAVY_2, 75)
    y -= 92
    card(c, 42, y, 245, "Postagens", "Editor visual, prévia protegida, fontes e publicação.", GREEN, 75)
    card(c, 308, y, 245, "Autoria e políticas", "Biografia, responsabilidade editorial e páginas institucionais.", RED, 75)
    y -= 92
    card(c, 42, y, 245, "Arquivos do site", "Editor avançado com cores para HTML, CSS, JavaScript e JSON.", NAVY_2, 75)
    card(c, 308, y, 245, "Publicação e cópias", "Auditoria, backup, commit e envio ao GitHub.", GOLD, 75)
    y -= 110
    text(c, "Regra simples", 42, y, 13, "GH-Bold", INK)
    paragraph(c, "Edite o conteúdo na área específica. Use Arquivos do site apenas quando souber exatamente qual código precisa mudar. Antes de publicar, execute a auditoria e crie uma cópia de segurança.", 42, y - 25, W - 84, 10, 15, "GH", MUTED)
    footer(c, 3); c.showPage()

    y = header(c, 4, "Catálogo", "Como editar um ebook", "As páginas de detalhe e os carrosséis são regenerados a partir dos dados salvos no catálogo.")
    y = step(c, 1, "Abra Ebooks", "Clique no título do volume que deseja alterar.", 42, y)
    y = step(c, 2, "Preencha conteúdo e SEO", "Revise título, subtítulo, resumo, título SEO e descrição SEO. As referências devem ocupar uma linha cada.", 42, y)
    y = step(c, 3, "Escolha a situação editorial", "Em desenvolvimento → Em revisão → Pronto para publicar → Publicado. Só marque Publicado com data real e conteúdo final.", 42, y)
    y = step(c, 4, "Substitua a capa quando necessário", "Envie PNG ou JPEG vertical 5:8. O painel gera WebP em 400 e 800 pixels e mantém um arquivo mestre local.", 42, y)
    y = step(c, 5, "Salve e confira", "Use Salvar e regenerar páginas; depois abra a prévia local e confira título, capa, links e legibilidade.", 42, y)
    card(c, 42, y - 2, W - 84, "PROTEÇÃO DA CAPA DE ALVO DUMBLEDORE", "A área de fanfics não troca essa capa. Ela permanece exatamente no arquivo oficial já aprovado.", RED, 72)
    footer(c, 4); c.showPage()

    y = header(c, 5, "Narrativas", "Como administrar fanfics", "O módulo separa fanfics do catálogo de ebooks e mantém o aviso de obra transformativa visível.")
    y = step(c, 1, "Abra Fanfics", "Selecione Alvo Dumbledore e as Memórias Ancestrais para editar seus dados editoriais.", 42, y)
    y = step(c, 2, "Atualize a apresentação", "Use o editor visual para sinopse ampliada, contexto da história e informação de desenvolvimento.", 42, y)
    y = step(c, 3, "Preserve a transparência", "Mantenha universo de origem, autoria e aviso de direitos. Não remova a identificação de obra não oficial, gratuita e sem fins comerciais.", 42, y)
    y = step(c, 4, "Escolha a situação", "Em escrita, Em revisão, Pronto para publicar, Publicado ou Pausada.", 42, y)
    y = step(c, 5, "Gere e revise", "Ao salvar, o índice de fanfics e a página de detalhes são atualizados. Use Abrir prévia antes de publicar.", 42, y)
    card(c, 42, y - 5, W - 84, "BOA PRÁTICA", "Evite estimar quantidade de páginas antes da diagramação. Enquanto o texto estiver em produção, use “Em definição durante a escrita”.", GOLD, 75)
    footer(c, 5); c.showPage()

    y = header(c, 6, "Editor visual", "Escrever artigos como em um mini Word", "A barra de ferramentas formata o texto sem exigir Markdown ou HTML.")
    tools = [("P / T2 / T3", "Parágrafo e hierarquia de subtítulos"), ("N / I / S", "Negrito, itálico e sublinhado"), ("• / 1.", "Listas com marcadores ou numeradas"), ("❝ / —", "Citação e linha divisória"), ("Link", "Cria links completos iniciados por https://"), ("Limpar", "Remove formatação excessiva")]
    for i, (name, desc) in enumerate(tools):
        x = 42 if i % 2 == 0 else 308
        yy = y - (i // 2) * 78
        card(c, x, yy, 245, name, desc, NAVY_2, 63)
    y -= 255
    text(c, "Campos profissionais", 42, y, 13, "GH-Bold", INK)
    paragraph(c, "Título • endereço amigável • situação • categoria • imagem de destaque • resumo • conteúdo • datas • título SEO • descrição SEO • referências.", 42, y - 24, W - 84, 10, 15, "GH", MUTED)
    y -= 78
    card(c, 42, y, W - 84, "SALVAR NÃO É PUBLICAR", "Rascunho e Em revisão ficam apenas no painel. A postagem só entra em artigos.html quando você escolhe Publicado, informa uma data real e mantém pelo menos uma referência.", GREEN, 86)
    footer(c, 6); c.showPage()

    y = header(c, 7, "Demonstração", "A postagem profissional de teste", "Use o texto incluído para conhecer o fluxo completo sem publicar conteúdo acidentalmente.")
    card(c, 42, y, W - 84, "DESCANSAR SEM CULPA: POR QUE PAUSAR TAMBÉM FAZ PARTE DO CUIDADO", "Situação inicial: Em revisão. Categoria: Bem-estar realista. A página contém imagem de destaque, subtítulos, citação, lista, aviso responsável e três fontes.", GOLD, 105)
    y -= 130
    y = step(c, 1, "Abra Postagens", "A etiqueta Demonstração profissional identifica o exemplo.", 42, y)
    y = step(c, 2, "Clique em Prévia", "Confira tipografia, imagem, ritmo dos parágrafos, referências e aviso editorial.", 42, y)
    y = step(c, 3, "Edite sem medo", "O exemplo pode ser alterado. Enquanto permanecer Em revisão, ele não aparece no site público.", 42, y)
    y = step(c, 4, "Publique apenas se aprovar", "Defina uma data verdadeira, confirme as fontes e mude a situação para Publicado.", 42, y)
    card(c, 42, y - 5, W - 84, "FONTES DO EXEMPLO", "OMS sobre saúde mental no trabalho; Sonnentag e Fritz sobre experiências de recuperação; Bennett, Bakker e Field sobre recuperação após o trabalho.", NAVY_2, 82)
    footer(c, 7); c.showPage()

    y = header(c, 8, "Encontrabilidade", "SEO, fontes e confiança", "O painel ajuda a organizar sinais para leitores e buscadores; nenhum campo isolado garante posição no Google.")
    y = step(c, 1, "Título SEO", "Escreva uma promessa clara, fiel ao conteúdo e preferencialmente com até 60–65 caracteres.", 42, y)
    y = step(c, 2, "Descrição SEO", "Resuma o benefício real da página em cerca de 150–160 caracteres, sem exageros.", 42, y)
    y = step(c, 3, "Endereço amigável", "Use palavras curtas, minúsculas e separadas por hífen. Evite mudar o endereço depois da publicação.", 42, y)
    y = step(c, 4, "Hierarquia", "Use um único título principal e organize o texto com Título 2 e Título 3. Não use negrito como substituto de subtítulo.", 42, y)
    y = step(c, 5, "Referências", "Uma fonte por linha. Prefira OMS, órgãos oficiais, artigos científicos e documentação primária.", 42, y)
    y = step(c, 6, "Revisão humana", "Confirme fatos, datas, autoria, tom e possíveis promessas de saúde antes de publicar.", 42, y)
    footer(c, 8); c.showPage()

    y = header(c, 9, "Fluxo seguro", "Revisar, validar e publicar", "A publicação deve ser o último passo, depois da prévia e da auditoria.")
    y = step(c, 1, "Salve na área editorial", "Revise a mensagem de confirmação exibida pelo painel.", 42, y)
    y = step(c, 2, "Abra a prévia local", "Teste desktop e celular, links, imagens, acentos e leitura.", 42, y)
    y = step(c, 3, "Execute a auditoria", "O painel procura links locais quebrados e marcadores vazios.", 42, y)
    y = step(c, 4, "Crie uma cópia de segurança", "O arquivo ZIP reúne dados editoriais e páginas importantes antes da publicação.", 42, y)
    y = step(c, 5, "Escreva uma mensagem clara", "Exemplo: “Atualiza artigo sobre descanso e referências”.", 42, y)
    y = step(c, 6, "Envie ao GitHub", "Marque a opção de envio somente quando desejar atualizar o repositório remoto.", 42, y)
    card(c, 42, y - 3, W - 84, "SE A AUDITORIA BLOQUEAR", "Não force a publicação. Abra a mensagem, corrija o arquivo indicado e execute a auditoria novamente.", RED, 72)
    footer(c, 9); c.showPage()

    y = header(c, 10, "Conta", "Configurar recuperação pelo Gmail", "A configuração fica em admin-local/.env e não deve ser adicionada ao GitHub.")
    y = step(c, 1, "Ative a verificação em duas etapas", "Abra a segurança da Conta Google guecashouse@gmail.com.", 42, y)
    y = step(c, 2, "Crie uma senha de app", "Na Conta Google, procure Senhas de app e gere uma chave de 16 caracteres para o Painel Guecas House.", 42, y)
    y = step(c, 3, "Abra Conta e segurança", "Cole a senha de app no formulário. Não use a senha normal do Gmail.", 42, y)
    y = step(c, 4, "Confirme com a senha do painel", "Essa confirmação impede que uma sessão aberta troque a configuração sem autorização.", 42, y)
    y = step(c, 5, "Envie o teste", "O painel salva a configuração e tenta enviar um e-mail. Se falhar, a mensagem informa o motivo.", 42, y)
    card(c, 42, y - 4, W - 84, "EMERGÊNCIA LOCAL", "Se não houver e-mail configurado ou internet, use redefinir-senha-painel.bat no próprio computador. O link recebido por e-mail também só funciona enquanto o painel estiver ligado.", NAVY_2, 88)
    footer(c, 10); c.showPage()

    y = header(c, 11, "Avançado", "Código, cópias e histórico", "Use a edição de código apenas para mudanças que não existem nos formulários editoriais.")
    card(c, 42, y, W - 84, "EDITOR COM CORES", "Comentários aparecem em verde, textos em salmão, palavras-chave em lilás, números em verde-claro e tags em azul. A coloração facilita leitura; o arquivo salvo continua sendo texto normal.", NAVY_2, 92)
    y -= 116
    y = step(c, 1, "Abra o arquivo correto", "Confirme o nome no seletor antes de editar.", 42, y)
    y = step(c, 2, "Faça uma alteração por vez", "Evite mudanças grandes sem uma prévia intermediária.", 42, y)
    y = step(c, 3, "Salve com cópia de segurança", "O painel cria uma cópia antes de substituir o arquivo.", 42, y)
    y = step(c, 4, "Consulte Atividade recente", "Entradas, edições, auditorias e publicações ficam registradas no banco local.", 42, y)
    y = step(c, 5, "Não compartilhe arquivos secretos", "admin-local/.env e admin-local/data/admin.db contêm configuração e acesso local; ambos devem permanecer fora do GitHub.", 42, y)
    footer(c, 11); c.showPage()

    y = header(c, 12, "Referência rápida", "Soluções e checklist final", "Antes de encerrar uma sessão editorial, percorra os itens abaixo.")
    problems = [
        ("O painel não abre", "Execute iniciar-painel.bat para ver o erro. Verifique se as portas 8765 e 8766 já estão ocupadas."),
        ("O e-mail falha", "Confirme verificação em duas etapas, senha de app com 16 caracteres e conexão com a internet."),
        ("A postagem não aparece", "Ela precisa estar Publicada, com data real e pelo menos uma referência."),
        ("As cores do código sumiram", "Atualize a página com Ctrl+F5; admin.js precisa carregar localmente."),
    ]
    for i, (title, body) in enumerate(problems):
        x = 42 if i % 2 == 0 else 308
        yy = y - (i // 2) * 94
        card(c, x, yy, 245, title, body, RED if i < 2 else NAVY_2, 79)
    y -= 212
    text(c, "Checklist de encerramento", 42, y, 13, "GH-Bold", INK)
    checklist = ["Conteúdo revisado em português do Brasil", "Prévia conferida", "Fontes e direitos verificados", "SEO preenchido sem promessas exageradas", "Auditoria concluída", "Cópia de segurança criada", "Situação editorial correta", "Painel encerrado ao terminar"]
    y -= 28
    for item in checklist:
        c.setStrokeColor(GREEN)
        c.rect(43, y - 2, 10, 10, fill=0, stroke=1)
        text(c, item, 63, y, 9.2, "GH", INK)
        y -= 23
    footer(c, 12); c.showPage()

    c.save()
    print(OUT)


if __name__ == "__main__":
    make_pdf()
