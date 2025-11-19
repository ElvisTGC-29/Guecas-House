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
});

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
