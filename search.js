// ========= SISTEMA DE BUSCA NO ACERVO =========

// Base de dados de títulos
const titulos = [
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

let currentCategory = 'todos';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const searchResults = document.getElementById('search-results');
  const resultsClose = document.getElementById('results-close');

  // Filtrar por categoria
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      
      // Se houver texto de busca, re-fazer a busca com a nova categoria
      if (searchInput.value.trim()) {
        performSearch(searchInput.value.trim());
      } else {
        searchResults.style.display = 'none';
      }
    });
  });

  // Buscar enquanto digita
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
      performSearch(query);
    } else {
      searchResults.style.display = 'none';
    }
  });

  // Fechar resultados
  resultsClose.addEventListener('click', () => {
    searchInput.value = '';
    searchResults.style.display = 'none';
  });

  // Fechar ao clicar fora
  document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
});

function performSearch(query) {
  const searchResults = document.getElementById('search-results');
  const resultsList = document.getElementById('results-list');
  
  // Filtrar títulos baseado na busca e categoria
  let filtered = titulos.filter(titulo => {
    const matchesQuery = titulo.titulo.toLowerCase().includes(query.toLowerCase()) ||
                        titulo.tagline.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = currentCategory === 'todos' || 
                           titulo.categoria === currentCategory ||
                           (currentCategory === 'populares' && titulo.populares);
    
    return matchesQuery && matchesCategory;
  });

  // Renderizar resultados
  if (filtered.length > 0) {
    resultsList.innerHTML = filtered.map(titulo => `
      <a href="${titulo.link}" class="result-item">
        <img src="${titulo.imagem}" alt="${titulo.titulo}" onerror="this.src='https://via.placeholder.com/60x80?text=Capa'">
        <div class="result-content">
          <h4 class="result-title">${titulo.titulo}</h4>
          <p class="result-tagline">${titulo.tagline}</p>
          <span class="result-category">${getCategoryLabel(titulo.categoria)}</span>
        </div>
      </a>
    `).join('');
  } else {
    resultsList.innerHTML = `
      <div class="no-results">
        <p>🔍 Nenhum título encontrado</p>
        <p>Tente pesquisar por outro nome ou mudar a categoria</p>
      </div>
    `;
  }

  searchResults.style.display = 'block';
}

function getCategoryLabel(category) {
  const labels = {
    'serie-mente-cansada': 'A Era da Mente Cansada',
    'populares': 'Mais Populares',
    'todos': 'Todos'
  };
  return labels[category] || category;
}
