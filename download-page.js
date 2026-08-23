(function () {
  const params = new URLSearchParams(window.location.search);
  const workId = params.get('obra') || 'alvo-dumbledore';
  const work = window.GUECAS_DOWNLOADS?.[workId];

  if (!work) return;

  const elements = {
    title: document.getElementById('dl-title'),
    description: document.getElementById('dl-description'),
    cover: document.getElementById('dl-cover'),
    release: document.getElementById('dl-release'),
    chapters: document.getElementById('dl-chapters'),
    chaptersLabel: document.getElementById('dl-chapters-label'),
    parts: document.getElementById('dl-parts'),
    partsLabel: document.getElementById('dl-parts-label'),
    pages: document.getElementById('dl-pages'),
    updated: document.getElementById('dl-updated'),
    progressNote: document.getElementById('dl-progress-note'),
    instagramHandle: document.getElementById('instagram-handle'),
    instagramButton: document.getElementById('instagram-button'),
    unlockProgress: document.getElementById('unlock-progress'),
    unlockProgressBar: document.getElementById('unlock-progress-bar'),
    unlockStatus: document.getElementById('unlock-status'),
    mediafireButton: document.getElementById('mediafire-button'),
    delivery: document.getElementById('download-delivery')
  };

  const isSecureUrl = (value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch (_error) {
      return false;
    }
  };

  const isMediaFireUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && (url.hostname === 'mediafire.com' || url.hostname.endsWith('.mediafire.com'));
    } catch (_error) {
      return false;
    }
  };

  document.title = `${work.title} — Download | Guecas House`;
  elements.title.textContent = work.title;
  elements.description.textContent = work.description;
  elements.cover.src = work.cover;
  elements.cover.alt = `Capa de ${work.title}`;
  elements.release.textContent = work.releaseLabel;
  elements.chapters.textContent = String(work.chaptersWritten);
  elements.chaptersLabel.textContent = work.chaptersLabel;
  elements.parts.textContent = String(work.partsWritten);
  elements.partsLabel.textContent = work.partsLabel;
  elements.pages.textContent = String(work.pages);
  elements.updated.textContent = `Atualizado em ${work.updatedAt}`;
  elements.progressNote.textContent = work.progressNote;
  elements.instagramHandle.textContent = work.instagramHandle;

  if (isSecureUrl(work.instagramUrl)) {
    elements.instagramButton.href = work.instagramUrl;
  }

  const mediaFireConfigured = isMediaFireUrl(work.mediafireUrl);
  const delay = Math.max(2, Number(work.unlockDelaySeconds) || 3);
  const visitKey = `guecas-instagram-visited:${workId}`;
  let unlockStarted = false;

  function finishUnlock() {
    elements.unlockProgressBar.style.width = '100%';
    elements.mediafireButton.hidden = false;

    if (mediaFireConfigured) {
      elements.mediafireButton.href = work.mediafireUrl;
      elements.mediafireButton.removeAttribute('aria-disabled');
      elements.unlockStatus.textContent = 'Acesso liberado. O MediaFire abrirá em uma nova aba.';
      elements.delivery.textContent = 'Arquivo hospedado no MediaFire. Confira o nome da obra antes de confirmar o download.';
    } else {
      elements.unlockStatus.textContent = 'Etapa concluída. O link do MediaFire ainda precisa ser configurado.';
      elements.mediafireButton.textContent = 'Link do MediaFire em configuração';
      elements.delivery.textContent = 'A página está pronta. Assim que o link do arquivo for adicionado, o botão será liberado automaticamente.';
    }
  }

  function beginUnlock() {
    if (unlockStarted || sessionStorage.getItem(visitKey) !== 'true') return;

    unlockStarted = true;
    elements.unlockProgress.hidden = false;
    elements.delivery.textContent = 'Visita ao Instagram registrada. Preparando o acesso ao arquivo…';
    let remaining = delay;
    elements.unlockStatus.textContent = `Preparando o download em ${remaining} segundos…`;

    const timer = window.setInterval(() => {
      remaining -= 1;
      const progress = ((delay - remaining) / delay) * 100;
      elements.unlockProgressBar.style.width = `${Math.min(progress, 100)}%`;

      if (remaining <= 0) {
        window.clearInterval(timer);
        finishUnlock();
        return;
      }

      elements.unlockStatus.textContent = `Preparando o download em ${remaining} segundos…`;
    }, 1000);
  }

  elements.instagramButton.addEventListener('click', () => {
    sessionStorage.setItem(visitKey, 'true');
    window.setTimeout(beginUnlock, 300);
  });

  window.addEventListener('focus', beginUnlock);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) beginUnlock();
  });

  elements.mediafireButton.addEventListener('click', (event) => {
    if (elements.mediafireButton.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
    }
  });

  beginUnlock();
})();
