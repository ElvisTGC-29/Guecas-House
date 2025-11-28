// ========= BRAND ANIMATION - NETWORK PARTICLES =========

document.addEventListener('DOMContentLoaded', () => {
  initBrandAnimation();
});

function initBrandAnimation() {
  const container = document.getElementById('brand-animation-container');
  if (!container) return;

  const wrapper = document.querySelector('.brand-animation-wrapper');
  const textContainer = document.querySelector('.brand-text-container');
  
  // Limpar container de texto
  textContainer.innerHTML = '';

  // Criar texto "GUECAS HOUSE" branco
  const title = document.createElement('h1');
  title.className = 'brand-title-network';
  title.textContent = 'GUECAS HOUSE';
  textContainer.appendChild(title);

  // Criar subtitle com linha animada
  const subtitleWrapper = document.createElement('div');
  subtitleWrapper.className = 'brand-subtitle-wrapper';
  
  const subtitle = document.createElement('div');
  subtitle.className = 'brand-subtitle';
  subtitle.textContent = 'EDITORIAL SEAL';
  
  const animatedLine = document.createElement('div');
  animatedLine.className = 'brand-animated-line';
  
  subtitleWrapper.appendChild(subtitle);
  subtitleWrapper.appendChild(animatedLine);
  textContainer.appendChild(subtitleWrapper);

  // Criar canvas para partículas
  const canvas = document.createElement('canvas');
  canvas.className = 'brand-canvas';
  wrapper.insertBefore(canvas, textContainer);
  
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Sistema de partículas
  const particles = [];
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
      
      const colors = [
        'rgba(59, 130, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(96, 165, 250, 0.8)'
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

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
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
    }
  }

  function initParticles() {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDistance = 150;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.5;
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(236, 72, 153, ${opacity})`);
          gradient.addColorStop(1, `rgba(139, 92, 246, ${opacity})`);

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

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();
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

