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

  document.title = `${work.title} — ${work.releaseLabel} | Download`;
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

  if (isMediaFireUrl(work.mediafireUrl)) {
    elements.mediafireButton.href = work.mediafireUrl;
    elements.mediafireButton.removeAttribute('aria-disabled');
    elements.delivery.textContent = 'Arquivo hospedado no MediaFire. Confira o nome da obra antes de confirmar o download.';
  } else {
    elements.mediafireButton.removeAttribute('href');
    elements.mediafireButton.setAttribute('aria-disabled', 'true');
    elements.mediafireButton.textContent = 'Link do MediaFire em configuração';
    elements.delivery.textContent = 'O link da edição mais recente está sendo preparado.';
  }

})();
