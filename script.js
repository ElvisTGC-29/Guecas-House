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

// EFEITO DE NETWORK DE PARTÍCULAS NO HERO
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  // Configurar tamanho do canvas
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Classe Partícula
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      
      // Cores variadas: azul ciano, rosa, roxo
      const colors = [
        'rgba(59, 130, 246, 0.8)',  // azul
        'rgba(236, 72, 153, 0.8)',  // rosa
        'rgba(139, 92, 246, 0.8)',  // roxo
        'rgba(96, 165, 250, 0.8)'   // azul claro
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Wraparound nas bordas
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      
      // Efeito de brilho
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  
  // Criar partículas
  function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Desenhar linhas entre partículas próximas
  function connectParticles() {
    const maxDistance = 150;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.5;
          
          // Cor da linha baseada nas cores das partículas
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, particles[i].color.replace('0.8', opacity.toString()));
          gradient.addColorStop(1, particles[j].color.replace('0.8', opacity.toString()));
          
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  // Loop de animação
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    
    animationId = requestAnimationFrame(animate);
  }
  
  initParticles();
  animate();
  
  // Reinicializar ao redimensionar
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    initParticles();
    animate();
  });
});

// ANIMAÇÃO DE PARTÍCULAS NO LOGO
document.addEventListener("DOMContentLoaded", function () {
  const brandLogo = document.querySelector(".brand-logo");
  if (!brandLogo) return;

  const colors = ['#ffd93d', '#6bcf7f', '#4d96ff', '#ff6b9d', '#c780fa', '#ff8c42', '#00d4ff', '#ffb3ba'];

  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'brand-particle';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tx = (Math.random() - 0.5) * 120;
    const ty = -60 - Math.random() * 60;
    const rotate = (Math.random() - 0.5) * 180;
    
    particle.style.setProperty('--particle-color', color);
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.setProperty('--rotate', `${rotate}deg`);
    
    const rect = brandLogo.getBoundingClientRect();
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => particle.remove(), 2000);
  }

  let particleInterval;
  
  brandLogo.addEventListener('mouseenter', () => {
    particleInterval = setInterval(createParticle, 150);
  });
  
  brandLogo.addEventListener('mouseleave', () => {
    clearInterval(particleInterval);
  });
});

// Detectar quando a navbar é clara ou escura
function updateHeaderTheme() {
  const header = document.querySelector('header');
  const detailHero = document.querySelector('.detail-hero');
  const brandAnimation = document.getElementById('brand-animation-container');
  const hero = document.querySelector('.hero');
  
  if (!header) return;
  
  if (detailHero) {
    const heroRect = detailHero.getBoundingClientRect();
    // Se o hero está visível (fundo claro), adicionar class light-header
    if (heroRect.bottom > 64) {
      header.classList.add('light-header');
    } else {
      header.classList.remove('light-header');
    }
  } else if (brandAnimation || hero) {
    // Na index: remover light-header quando sair da animação (hero visível)
    if (hero) {
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.top <= 64) {
        header.classList.remove('light-header');
      } else {
        header.classList.add('light-header');
      }
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
  
  const cardWidth = 100; // width do card
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
