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
    downloadButton: document.getElementById('download-file-button'),
    delivery: document.getElementById('download-delivery')
  };

  const isSecureUrl = (value) => {
    try {
      return new URL(value).protocol === 'https:';
    } catch (_error) {
      return false;
    }
  };

  const isDownloadUrl = (value) => {
    try {
      const url = new URL(value, window.location.href);
      const isMediaFire = url.hostname === 'mediafire.com' || url.hostname.endsWith('.mediafire.com');
      const isOfficialPdf = (
        (url.hostname === 'guecashouse.com.br' || url.hostname === 'www.guecashouse.com.br') &&
        url.pathname.startsWith('/arquivos/previas/') &&
        url.pathname.toLowerCase().endsWith('.pdf')
      );
      return url.protocol === 'https:' && (isMediaFire || isOfficialPdf);
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

  if (isDownloadUrl(work.downloadUrl)) {
    elements.downloadButton.href = work.downloadUrl;
    elements.downloadButton.removeAttribute('aria-disabled');
    elements.delivery.textContent = 'PDF atualizado com as partes 1, 2 e 3. Esta página sempre apontará para a edição mais recente.';
  } else {
    elements.downloadButton.removeAttribute('href');
    elements.downloadButton.setAttribute('aria-disabled', 'true');
    elements.downloadButton.textContent = 'PDF em atualização';
    elements.delivery.textContent = 'O link da edição mais recente está sendo preparado.';
  }

})();
