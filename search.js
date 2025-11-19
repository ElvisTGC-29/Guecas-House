// ========= SISTEMA DE BUSCA GLOBAL =========

// Base de dados de títulos
const TITULOS_DATABASE = [
  {
    id: 'peso',
    titulo: 'O Peso Invisível',
    tagline: 'Fadiga emocional da era digital',
    categoria: 'serie-mente-cansada',
    populares: true,
    imagem: 'arquivos/Imagens/dd.jpg',
    link: 'paginas-detalhes/detalhes-o-peso-invisivel.html'
  },
  {
    id: 'corpo',
    titulo: 'O Corpo que Não Desliga',
    tagline: 'Quando o corpo continua em modo alerta',
    categoria: 'serie-mente-cansada',
    populares: true,
    imagem: 'arquivos/Imagens/placeholder-corpo.jpg',
    link: 'paginas-detalhes/detalhes-o-corpo-que-nao-desliga.html'
  },
  {
    id: 'vigilia',
    titulo: 'O Preço da Vigília',
    tagline: 'A energia como vício social',
    categoria: 'serie-mente-cansada',
    populares: true,
    imagem: 'arquivos/Imagens/placeholder-vigilia.jpg',
    link: 'paginas-detalhes/detalhes-o-preco-da-vigilia.html'
  }
];

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
    searchInput.focus();
  });

  // Fechar modal ao clicar no botão X
  if (searchModalClose) {
    searchModalClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
      searchInput.value = '';
      resultsContainer.innerHTML = '';
    });
  }

  // Fechar ao clicar fora do modal
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      searchInput.value = '';
      resultsContainer.innerHTML = '';
    }
  });

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
      searchInput.value = '';
      resultsContainer.innerHTML = '';
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
