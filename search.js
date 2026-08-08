// ========= SISTEMA DE BUSCA GLOBAL =========

// Detectar se estamos em uma página de detalhes para ajustar caminhos
const isDetailPage = window.location.pathname.includes('paginas-detalhes');
const imagePath = isDetailPage ? '../arquivos/Imagens/' : 'arquivos/Imagens/';

// Base de dados de títulos
const TITULOS_DATABASE = [
  {
    id: 'peso',
    titulo: 'O Peso Invisível',
    tagline: 'Fadiga emocional da era digital',
    categoria: 'serie-mente-cansada',
    populares: true,
    imagem: imagePath + 'o peso invisivel.jpg',
    link: isDetailPage ? 'detalhes-o-peso-invisivel.html' : 'paginas-detalhes/detalhes-o-peso-invisivel.html'
  },
  {
    id: 'corpo',
    titulo: 'O Corpo que Não Desliga',
    tagline: 'Quando o corpo continua em modo alerta',
    categoria: 'serie-mente-cansada',
    populares: true,
    imagem: imagePath + 'placeholder-corpo.jpg',
    link: isDetailPage ? 'detalhes-o-corpo-que-nao-desliga.html' : 'paginas-detalhes/detalhes-o-corpo-que-nao-desliga.html'
  },
  {
    id: 'vigilia',
    titulo: 'O Preço da Vigília',
    tagline: 'A energia como vício social',
    categoria: 'serie-mente-cansada',
    populares: true,
    imagem: imagePath + 'placeholder-vigilia.jpg',
    link: isDetailPage ? 'detalhes-o-preco-da-vigilia.html' : 'paginas-detalhes/detalhes-o-preco-da-vigilia.html'
  }
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
