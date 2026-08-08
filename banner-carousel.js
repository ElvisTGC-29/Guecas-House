// ========= BANNER CAROUSEL — HOME =========

document.addEventListener('DOMContentLoaded', initBannerCarousel);

function initBannerCarousel() {
  const carousel = document.getElementById('banner-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.banner-track');
  const slides = Array.from(carousel.querySelectorAll('.banner-slide'));
  const dotsWrapper = carousel.querySelector('.banner-dots');
  const prevBtn = carousel.querySelector('.banner-prev');
  const nextBtn = carousel.querySelector('.banner-next');

  if (!track || slides.length === 0) return;

  if (slides.length > 1) {
    carousel.classList.add('has-multiple');
  }

  const DEFAULT_DURATION = 6000;
  let current = 0;
  let autoplayTimer = null;

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'banner-dot';
    dot.setAttribute('aria-label', `Ir para o banner ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrapper.appendChild(dot);

    const video = slide.querySelector('video');
    if (video) {
      video.addEventListener('ended', () => {
        if (i === current) next();
      });
    }
  });
  const dots = Array.from(dotsWrapper.children);

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));

    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (!video) return;
      if (i === current) {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise) playPromise.catch(() => {});
      } else {
        video.pause();
      }
    });

    scheduleAutoplay();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function scheduleAutoplay() {
    clearTimeout(autoplayTimer);
    if (slides.length < 2) return;

    const activeSlide = slides[current];
    if (activeSlide.querySelector('video')) return; // avança via evento "ended" do vídeo

    const duration = parseInt(activeSlide.dataset.duration, 10) || DEFAULT_DURATION;
    autoplayTimer = setTimeout(next, duration);
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  carousel.addEventListener('mouseenter', () => clearTimeout(autoplayTimer));
  carousel.addEventListener('mouseleave', scheduleAutoplay);

  let touchStartX = null;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev();
    }
    touchStartX = null;
  });

  goTo(0);
}
