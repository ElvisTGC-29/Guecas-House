// ========= SISTEMA DE BUSCA GLOBAL =========

// Detectar se estamos em uma página de detalhes para ajustar caminhos
const isDetailPage = window.location.pathname.includes('paginas-detalhes');
const imagePath = isDetailPage ? '../arquivos/Imagens/' : 'arquivos/Imagens/';

// Base de dados de títulos
const TITULOS_DATABASE = [
  { id: 'o-peso-invisivel', titulo: "O Peso Invisível", tagline: "Por que o seu cansaço não é uma falha sua", categoria: 'era-da-mente-cansada', populares: true, imagem: (isDetailPage ? '../' : '') + "arquivos/Imagens/capa-o-peso-invisivel-400.webp", link: isDetailPage ? "detalhes-o-peso-invisivel.html" : "paginas-detalhes/detalhes-o-peso-invisivel.html" },
  { id: 'a-mente-fragmentada', titulo: "A Mente Fragmentada", tagline: "Como a tecnologia sequestrou o foco", categoria: 'era-da-mente-cansada', populares: true, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-mente-fragmentada-400.webp", link: isDetailPage ? "detalhes-a-mente-fragmentada.html" : "paginas-detalhes/detalhes-a-mente-fragmentada.html" },
  { id: 'a-solidao-conectada', titulo: "A Solidão Conectada", tagline: "Quando muitos contatos não formam um vínculo", categoria: 'era-da-mente-cansada', populares: true, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-solidao-conectada-400.webp", link: isDetailPage ? "detalhes-a-solidao-conectada.html" : "paginas-detalhes/detalhes-a-solidao-conectada.html" },
  { id: 'o-corpo-que-pede-socorro', titulo: "O Corpo que Pede Socorro", tagline: "Quando a mente cala, o corpo envia sinais", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-corpo-que-pede-socorro-400.webp", link: isDetailPage ? "detalhes-o-corpo-que-pede-socorro.html" : "paginas-detalhes/detalhes-o-corpo-que-pede-socorro.html" },
  { id: 'a-geracao-do-silencio-interno', titulo: "A Geração do Silêncio Interno", tagline: "Dar nome ao que se sente", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-geracao-do-silencio-interno-400.webp", link: isDetailPage ? "detalhes-a-geracao-do-silencio-interno.html" : "paginas-detalhes/detalhes-a-geracao-do-silencio-interno.html" },
  { id: 'o-culto-da-produtividade', titulo: "O Culto da Produtividade", tagline: "Seu valor não cabe numa lista de tarefas", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-culto-da-produtividade-400.webp", link: isDetailPage ? "detalhes-o-culto-da-produtividade.html" : "paginas-detalhes/detalhes-o-culto-da-produtividade.html" },
  { id: 'o-espelho-da-comparacao', titulo: "O Espelho da Comparação", tagline: "A vida real por trás das fachadas", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-espelho-da-comparacao-400.webp", link: isDetailPage ? "detalhes-o-espelho-da-comparacao.html" : "paginas-detalhes/detalhes-o-espelho-da-comparacao.html" },
  { id: 'a-ansiedade-da-escolha', titulo: "A Ansiedade da Escolha", tagline: "Quando mais opções produzem menos liberdade", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-ansiedade-da-escolha-400.webp", link: isDetailPage ? "detalhes-a-ansiedade-da-escolha.html" : "paginas-detalhes/detalhes-a-ansiedade-da-escolha.html" },
  { id: 'o-vazio-da-performance', titulo: "O Vazio da Performance", tagline: "Quem sobra quando a apresentação termina?", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-vazio-da-performance-400.webp", link: isDetailPage ? "detalhes-o-vazio-da-performance.html" : "paginas-detalhes/detalhes-o-vazio-da-performance.html" },
  { id: 'a-esperanca-cansada', titulo: "A Esperança Cansada", tagline: "Reconstruir sentido sem negar o desgaste", categoria: 'era-da-mente-cansada', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-esperanca-cansada-400.webp", link: isDetailPage ? "detalhes-a-esperanca-cansada.html" : "paginas-detalhes/detalhes-a-esperanca-cansada.html" },
  { id: 'a-arte-de-viver-devagar', titulo: "A Arte de Viver Devagar", tagline: "Lentidão também é inteligência", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-arte-de-viver-devagar-400.webp", link: isDetailPage ? "detalhes-a-arte-de-viver-devagar.html" : "paginas-detalhes/detalhes-a-arte-de-viver-devagar.html" },
  { id: 'gratidao-lucida', titulo: "Gratidão Lúcida", tagline: "A dor e a gratidão podem existir juntas", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/gratidao-lucida-400.webp", link: isDetailPage ? "detalhes-gratidao-lucida.html" : "paginas-detalhes/detalhes-gratidao-lucida.html" },
  { id: 'o-proposito-silencioso', titulo: "O Propósito Silencioso", tagline: "A beleza de uma rotina bem cuidada", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-proposito-silencioso-400.webp", link: isDetailPage ? "detalhes-o-proposito-silencioso.html" : "paginas-detalhes/detalhes-o-proposito-silencioso.html" },
  { id: 'a-serenidade-do-corpo', titulo: "A Serenidade do Corpo", tagline: "Práticas para ensinar o corpo a sair do alerta", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-serenidade-do-corpo-400.webp", link: isDetailPage ? "detalhes-a-serenidade-do-corpo.html" : "paginas-detalhes/detalhes-a-serenidade-do-corpo.html" },
  { id: 'alegria-de-coisas-simples', titulo: "Alegria de Coisas Simples", tagline: "Menos excesso, mais espaço para respirar", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/alegria-de-coisas-simples-400.webp", link: isDetailPage ? "detalhes-alegria-de-coisas-simples.html" : "paginas-detalhes/detalhes-alegria-de-coisas-simples.html" },
  { id: 'o-poder-das-pequenas-vitorias', titulo: "O Poder das Pequenas Vitórias", tagline: "O esmagador também pode ser dividido", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-poder-das-pequenas-vitorias-400.webp", link: isDetailPage ? "detalhes-o-poder-das-pequenas-vitorias.html" : "paginas-detalhes/detalhes-o-poder-das-pequenas-vitorias.html" },
  { id: 'viver-com-proposito-nao-com-pressa', titulo: "Viver com Propósito, Não com Pressa", tagline: "Dizer não também protege o que importa", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/viver-com-proposito-nao-com-pressa-400.webp", link: isDetailPage ? "detalhes-viver-com-proposito-nao-com-pressa.html" : "paginas-detalhes/detalhes-viver-com-proposito-nao-com-pressa.html" },
  { id: 'a-mente-que-descansa', titulo: "A Mente que Descansa", tagline: "Rituais para apagar as luzes por dentro", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-mente-que-descansa-400.webp", link: isDetailPage ? "detalhes-a-mente-que-descansa.html" : "paginas-detalhes/detalhes-a-mente-que-descansa.html" },
  { id: 'a-coragem-de-ser-imperfeito', titulo: "A Coragem de Ser Imperfeito", tagline: "A vulnerabilidade como saída da vergonha", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/a-coragem-de-ser-imperfeito-400.webp", link: isDetailPage ? "detalhes-a-coragem-de-ser-imperfeito.html" : "paginas-detalhes/detalhes-a-coragem-de-ser-imperfeito.html" },
  { id: 'o-caminho-da-serenidade', titulo: "O Caminho da Serenidade", tagline: "Viver no mundo acelerado sem pertencer à pressa", categoria: 'felicidade-realista', populares: false, imagem: (isDetailPage ? '../' : '') + "arquivos/capas/ebooks/o-caminho-da-serenidade-400.webp", link: isDetailPage ? "detalhes-o-caminho-da-serenidade.html" : "paginas-detalhes/detalhes-o-caminho-da-serenidade.html" }
];

// Ícones SVG usados nos símbolos flutuantes do modal de busca
const FLOATING_ICONS = {
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5c2-1 5-1 7 0v13c-2-1-5-1-7 0V5z"/><path d="M22 5c-2-1-5-1-7 0v13c2-1 5-1 7 0V5z"/></svg>',
  page: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l5 5v15H6V2z"/><path d="M14 2v6h6"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>',
  quill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-6 0-14 4-16 12 2 2 4 3 6 3 8-2 12-10 12-15z"/><line x1="4" y1="20" x2="10" y2="14"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z"/></svg>'
};

// Símbolos para diferentes páginas - relacionados a leitura
const PAGE_SYMBOLS = {
  index: ['book', 'page', 'bookmark', 'sparkle', 'quill'],
  sobre: ['book', 'quill', 'page', 'sparkle', 'bookmark'],
  acervo: ['book', 'bookmark', 'page', 'sparkle', 'quill'],
  colecoes: ['book', 'page', 'bookmark', 'quill', 'sparkle'],
  contato: ['page', 'quill', 'bookmark', 'sparkle', 'book'],
  detalhes: ['book', 'page', 'bookmark', 'quill', 'sparkle']
};

// Detectar página atual
function getCurrentPageType() {
  const pathname = window.location.pathname;
  if (pathname.includes('sobre')) return 'sobre';
  if (pathname.includes('acervo')) return 'acervo';
  if (pathname.includes('colecoes')) return 'colecoes';
  if (pathname.includes('contato-sucesso')) return 'contato';
  if (pathname.includes('contato')) return 'contato';
  if (pathname.includes('detalhes') || pathname.includes('paginas-detalhes')) return 'detalhes';
  if (pathname.includes('a-era-da-mente-cansada')) return 'colecoes';
  return 'index';
}

// Criar e gerenciar símbolos flutuantes (ficam dentro do modal, atrás do campo de busca)
function createFloatingSymbols() {
  const modal = document.getElementById('search-modal');
  if (!modal) return null;

  const container = document.createElement('div');
  container.className = 'floating-symbols';
  container.id = 'floating-symbols-container';
  modal.prepend(container);

  const pageType = getCurrentPageType();
  const symbols = PAGE_SYMBOLS[pageType] || PAGE_SYMBOLS.index;
  const numSymbols = 5;

  for (let i = 0; i < numSymbols; i++) {
    const symbol = document.createElement('div');
    symbol.className = `floating-symbol symbol-${(i % 5) + 1}`;
    const iconKey = symbols[i % symbols.length];
    symbol.innerHTML = FLOATING_ICONS[iconKey] || FLOATING_ICONS.book;

    const randomLeft = Math.random() * 100;
    const randomDelay = -Math.random() * 10;

    symbol.style.left = randomLeft + '%';
    symbol.style.animationDelay = randomDelay + 's';

    container.appendChild(symbol);
  }

  return container;
}

// Remover símbolos flutuantes
function removeFloatingSymbols() {
  const container = document.getElementById('floating-symbols-container');
  if (container) {
    container.remove();
  }
}

// Inicializar busca quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  initNavSearch();
});

// ========= BUSCA NA NAVBAR =========
function initNavSearch() {
  const navSearchBtn = document.getElementById('nav-search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchModalClose = document.querySelector('.search-modal-close');
  const searchInput = document.getElementById('search-input');

  // Verificar se elementos existem
  if (!navSearchBtn) {
    console.warn('nav-search-btn não encontrado');
    return;
  }

  if (!searchModal) {
    console.warn('search-modal não encontrado');
    return;
  }

  // Adicionar ícone de lupa dentro do campo, se ainda não existir
  const inputWrapper = searchModal.querySelector('.search-input-wrapper');
  if (inputWrapper && !inputWrapper.querySelector('.search-input-icon')) {
    const icon = document.createElement('span');
    icon.className = 'search-input-icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>';
    inputWrapper.prepend(icon);
  }

  // Criar container de resultados se não existir
  let resultsContainer = searchModal.querySelector('.search-results');
  if (!resultsContainer) {
    resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    searchModal.querySelector('.search-modal-content')?.appendChild(resultsContainer);
  }

  // Abrir modal
  navSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    searchModal.classList.add('active');
    createFloatingSymbols();
    searchInput.focus();
  });

  // Fechar modal ao clicar no botão X
  if (searchModalClose) {
    searchModalClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
      searchInput.value = '';
      resultsContainer.innerHTML = '';
      removeFloatingSymbols();
    });
  }

  // Fechar ao clicar fora do modal
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      searchInput.value = '';
      resultsContainer.innerHTML = '';
      removeFloatingSymbols();
    }
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
      searchInput.value = '';
      resultsContainer.innerHTML = '';
      removeFloatingSymbols();
    }
  });

  // Buscar enquanto digita
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      
      if (query.length > 0) {
        performNavSearch(query, resultsContainer);
      } else {
        resultsContainer.innerHTML = '';
      }
    });
  }

  function performNavSearch(query, container) {
    // Filtrar títulos
    const filtered = TITULOS_DATABASE.filter(titulo => 
      titulo.titulo.toLowerCase().includes(query.toLowerCase()) ||
      titulo.tagline.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length > 0) {
      const resultsHtml = filtered.map(titulo => `
        <a href="${titulo.link}" class="nav-search-result">
          <img src="${titulo.imagem}" alt="${titulo.titulo}" class="nav-search-result-image" onerror="this.src='https://via.placeholder.com/60x80?text=Capa'">
          <div class="nav-search-result-content">
            <div class="nav-search-result-title">${titulo.titulo}</div>
            <div class="nav-search-result-tagline">${titulo.tagline}</div>
          </div>
        </a>
      `).join('');
      container.innerHTML = resultsHtml;
      container.style.display = 'flex';
    } else {
      container.innerHTML = '<div class="nav-search-empty">🔍 Nenhum título encontrado</div>';
      container.style.display = 'flex';
    }
  }
}
