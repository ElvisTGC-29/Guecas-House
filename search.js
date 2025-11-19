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

// Símbolos para diferentes páginas - relacionados a leitura
const PAGE_SYMBOLS = {
  index: ['📖', '📚', '📄', '📃', '📑', '📋', '✍️'],
  sobre: ['📖', '📚', '📝', '✍️', '📄', '📃', '📑'],
  acervo: ['📚', '📖', '📜', '📄', '📑', '📋', '📃'],
  colecoes: ['📖', '📚', '📑', '📄', '📃', '📋', '🔖'],
  contato: ['📝', '📄', '📃', '📋', '📑', '✍️', '📖'],
  detalhes: ['📖', '📚', '📄', '📃', '📑', '🔖', '📋']
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

// Criar e gerenciar símbolos flutuantes
function createFloatingSymbols() {
  const container = document.createElement('div');
  container.className = 'floating-symbols';
  container.id = 'floating-symbols-container';
  document.body.appendChild(container);

  const pageType = getCurrentPageType();
  const symbols = PAGE_SYMBOLS[pageType] || PAGE_SYMBOLS.index;
  const numSymbols = 5;

  for (let i = 0; i < numSymbols; i++) {
    const symbol = document.createElement('div');
    symbol.className = `floating-symbol symbol-${(i % 5) + 1}`;
    symbol.textContent = symbols[i % symbols.length];
    
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
