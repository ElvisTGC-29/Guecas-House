// MENU MOBILE LATERAL
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  const navClose = nav.querySelector(".nav-close");

  function openMenu() {
    nav.classList.add("open");
    toggle.classList.add("open");
    document.body.classList.add("no-scroll");
  }

  function closeMenu() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  toggle.addEventListener("click", () => {
    if (nav.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
});

// Detectar quando a navbar é clara ou escura
function updateHeaderTheme() {
  const header = document.querySelector('header');
  const detailHero = document.querySelector('.detail-hero');
  
  if (!header) return;
  
  if (detailHero) {
    const heroRect = detailHero.getBoundingClientRect();
    // Se o hero está visível (fundo claro), adicionar class light-header
    if (heroRect.bottom > 64) {
      header.classList.add('light-header');
    } else {
      header.classList.remove('light-header');
    }
  } else {
    // Se não tem hero (outras páginas), navbar é escura por padrão
    header.classList.remove('light-header');
  }
}

window.addEventListener('scroll', updateHeaderTheme);
window.addEventListener('load', updateHeaderTheme);
updateHeaderTheme();


// Caminhos dos PDFs de prévia
const previas = {
  peso: "arquivos/previas/previa-o-peso-invisivel.pdf",
  corpo: "arquivos/previas/previa-corpo-nao-desliga.pdf",
  vigilia: "arquivos/previas/previa-preco-vigilia.pdf"
};

// Links reais de compra na Kiwify
const linksCompra = {
  peso: "https://pay.kiwify.com.br/SEU_LINK_PESO",
  corpo: "https://pay.kiwify.com.br/SEU_LINK_CORPO",
  vigilia: "https://pay.kiwify.com.br/SEU_LINK_VIGILIA"
};

function abrirPreview(id) {
  const modal = document.getElementById("previewModal");
  const embed = document.getElementById("previewPagina");
  const btn = document.getElementById("previewComprar");

  embed.src = previas[id];
  btn.href = linksCompra[id];

  modal.classList.add("open");
}

function fecharPreview() {
  const modal = document.getElementById("previewModal");
  modal.classList.remove("open");
}

// Formulário de contato - Envio via Formspree + redirecionamento
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contatoForm');
  if (!form) return; // se não estiver na página de contato, ignora

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // impede o envio padrão

    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/movyeedk', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // redireciona para a página de sucesso
        window.location.href = 'contato-sucesso.html';
      } else {
        alert('Houve um problema ao enviar sua mensagem. Tente novamente em instantes.');
      }
    } catch (error) {
      alert('Não foi possível enviar agora. Verifique sua conexão e tente de novo.');
      console.error(error);
    }
  });
});

/* Ajuste dinâmico: faz a capa respeitar a altura disponível até o bloco '.detail-price-note' */
function fitCoverToPrice() {
  const img = document.querySelector('.detail-cover-card img');
  const content = document.querySelector('.detail-content');
  const price = document.querySelector('.detail-price-note');
  if (!img || !content || !price) return;

  // Retira quaisquer estilos anteriores para medir naturalmente
  img.style.maxHeight = '';

  const contentRect = content.getBoundingClientRect();
  const priceRect = price.getBoundingClientRect();

  // pequena folga entre imagem e preço
  const GAP = 12; // px

  // altura disponível entre o topo do conteúdo (considerando padding) e o topo do bloco de preço
  const computed = window.getComputedStyle(content);
  const paddingTop = parseFloat(computed.paddingTop) || 0;
  const available = (priceRect.top - contentRect.top) - paddingTop - GAP;

  // se houver espaço suficiente, limita a altura da imagem
  if (available > 80) {
    img.style.maxHeight = Math.floor(available) + 'px';
    img.style.width = 'auto';
    img.style.maxWidth = '100%';
    img.style.objectFit = 'cover';
  } else {
    // remove restrições quando não houver espaço
    img.style.maxHeight = '';
    img.style.width = '';
    img.style.objectFit = '';
  }
}

function debounce(fn, wait = 120) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}


document.addEventListener('DOMContentLoaded', () => {
  fitCoverToPrice();
  window.addEventListener('resize', debounce(fitCoverToPrice, 120));
  // também observar mudanças de conteúdo caso o layout seja dinâmico
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(debounce(fitCoverToPrice, 120));
    const content = document.querySelector('.detail-content');
    if (content) ro.observe(content);
  }
  
  // Inicializar carrossel
  initCarousel();
  
  // Inicializar busca na nav
  initNavSearch();
});

// ========= BUSCA NA NAVBAR =========
function initNavSearch() {
  const navSearchBtn = document.getElementById('nav-search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchModalClose = document.querySelector('.search-modal-close');
  const searchInput = document.getElementById('search-input');

  if (!navSearchBtn || !searchModal) return;

  const titulos = [
    {
      id: 'peso',
      titulo: 'O Peso Invisível',
      tagline: 'Fadiga emocional da era digital',
      imagem: 'arquivos/Imagens/dd.jpg',
      link: 'paginas-detalhes/detalhes-o-peso-invisivel.html'
    },
    {
      id: 'corpo',
      titulo: 'O Corpo que Não Desliga',
      tagline: 'Quando o corpo continua em modo alerta',
      imagem: 'arquivos/Imagens/placeholder-corpo.jpg',
      link: 'paginas-detalhes/detalhes-o-corpo-que-nao-desliga.html'
    },
    {
      id: 'vigilia',
      titulo: 'O Preço da Vigília',
      tagline: 'A energia como vício social',
      imagem: 'arquivos/Imagens/placeholder-vigilia.jpg',
      link: 'paginas-detalhes/detalhes-o-preco-da-vigilia.html'
    }
  ];

  // Abrir modal
  navSearchBtn.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
  });

  // Fechar modal
  if (searchModalClose) {
    searchModalClose.addEventListener('click', () => {
      searchModal.classList.remove('active');
      searchInput.value = '';
    });
  }

  // Fechar ao clicar fora
  searchModal.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('active');
      searchInput.value = '';
    }
  });

  // Buscar enquanto digita
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    
    if (query.length > 0) {
      performNavSearch(query);
    }
  });

  function performNavSearch(query) {
    const filtered = titulos.filter(titulo => 
      titulo.titulo.toLowerCase().includes(query.toLowerCase()) ||
      titulo.tagline.toLowerCase().includes(query.toLowerCase())
    );

    const resultsHtml = filtered.map(titulo => `
      <a href="${titulo.link}" class="nav-search-result">
        <div class="nav-search-result-content">
          <div class="nav-search-result-title">${titulo.titulo}</div>
          <div class="nav-search-result-tagline">${titulo.tagline}</div>
        </div>
      </a>
    `).join('');

    const resultsList = searchModal.querySelector('.search-modal-content') || searchModal;
    let resultsContainer = resultsList.querySelector('.search-results');
    
    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.className = 'search-results';
      resultsList.appendChild(resultsContainer);
    }

    if (filtered.length > 0) {
      resultsContainer.innerHTML = resultsHtml;
      resultsContainer.style.display = 'flex';
    } else {
      resultsContainer.innerHTML = '<div class="nav-search-empty">Nenhum título encontrado</div>';
      resultsContainer.style.display = 'flex';
    }
  }

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
      searchInput.value = '';
    }
  });
}

// Carrossel com setas
function initCarousel() {
  const carouselRow = document.getElementById('carousel-row');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  
  if (!carouselRow || !prevBtn || !nextBtn) return;
  
  const cardWidth = 200; // width do card
  const gap = 28; // gap entre cards (1.75rem = 28px)
  const scrollAmount = cardWidth + gap;
  
  prevBtn.addEventListener('click', () => {
    carouselRow.scrollBy({
      left: -scrollAmount * 2,
      behavior: 'smooth'
    });
  });
  
  nextBtn.addEventListener('click', () => {
    carouselRow.scrollBy({
      left: scrollAmount * 2,
      behavior: 'smooth'
    });
  });
}
