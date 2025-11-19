// ========= BRAND ANIMATION =========

document.addEventListener('DOMContentLoaded', () => {
  initBrandAnimation();
});

function initBrandAnimation() {
  const container = document.getElementById('brand-animation-container');
  if (!container) return;

  const text = 'GUECAS HOUSE';
  const textContainer = document.querySelector('.brand-text-container');
  
  // Limpar container
  textContainer.innerHTML = '';

  // Criar letras individuais
  text.split('').forEach((letter, index) => {
    const span = document.createElement('span');
    span.className = 'brand-letter';
    
    // Algumas letras (aleatoriamente) ficam folheando
    if (Math.random() > 0.5 && letter !== ' ') {
      span.classList.add('page-flipper');
    }
    
    span.textContent = letter;
    span.style.setProperty('--rotation', Math.random() * 30 - 15 + 'deg');
    
    textContainer.appendChild(span);
  });

  // Criar partículas de luz quando as letras caem
  createParticles();

  // Criar linha decorativa
  const underline = document.createElement('div');
  underline.className = 'brand-underline';
  textContainer.appendChild(underline);

  // Criar subtitle
  const subtitle = document.createElement('div');
  subtitle.className = 'brand-subtitle';
  subtitle.textContent = 'Editorial Seal';
  textContainer.appendChild(subtitle);
}

// Criar partículas de luz
function createParticles() {
  const container = document.querySelector('.brand-animation-wrapper');
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posição inicial aleatória
    const startX = Math.random() * window.innerWidth - window.innerWidth / 2;
    const startY = Math.random() * 200 - 100;
    
    // Direção aleatória
    const tx = (Math.random() - 0.5) * 200;
    const ty = Math.random() * 300 + 150;
    
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.left = (window.innerWidth / 2 + startX) + 'px';
    particle.style.top = startY + 'px';
    particle.style.animationDelay = (0.5 + Math.random() * 1) + 's';
    
    container.appendChild(particle);
  }
}

// Reiniciar animação ao recarregar
window.addEventListener('pageshow', () => {
  const container = document.getElementById('brand-animation-container');
  if (container) {
    // Reset dos dados de animação para que CSS reaplique
    const cloned = container.cloneNode(true);
    container.parentNode.replaceChild(cloned, container);
    initBrandAnimation();
  }
});

// Criar livros caminhando pela tela
function createWalkingBooks() {
  const container = document.querySelector('.brand-animation-wrapper');
  const bookNames = ['📕 Novel', '📗 Poetry', '📘 Essays', '📙 Art'];
  const bookCount = 3;

  for (let i = 0; i < bookCount; i++) {
    const book = document.createElement('div');
    book.className = 'walking-book';
    book.textContent = bookNames[Math.floor(Math.random() * bookNames.length)];
    book.style.animationDelay = (2.5 + i * 0.8) + 's';
    book.style.setProperty('--walk-direction', Math.random() > 0.5 ? '1' : '-1');
    container.appendChild(book);
  }
}

// Criar PDFs lendo e desaparecendo
function createReadingPDFs() {
  const container = document.querySelector('.brand-animation-wrapper');
  const pdfCount = 3;

  for (let i = 0; i < pdfCount; i++) {
    const pdf = document.createElement('div');
    pdf.className = 'reading-pdf';
    pdf.innerHTML = '<span class="pdf-icon">📄</span>';
    pdf.style.left = Math.random() * 60 + 20 + '%';
    pdf.style.animationDelay = (3 + i * 1.2) + 's';
    container.appendChild(pdf);
  }
}
