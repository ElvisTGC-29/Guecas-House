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
    supportButton: document.getElementById('support-button'),
    unlockProgress: document.getElementById('unlock-progress'),
    unlockProgressBar: document.getElementById('unlock-progress-bar'),
    unlockStatus: document.getElementById('unlock-status'),
    mediafireButton: document.getElementById('mediafire-button'),
    delivery: document.getElementById('download-delivery'),
    adMessage: document.getElementById('ad-slot-message')
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

  const sponsorConfigured = isSecureUrl(work.sponsorUrl);
  const mediaFireConfigured = isMediaFireUrl(work.mediafireUrl);
  const delay = Math.max(3, Number(work.unlockDelaySeconds) || 8);

  if (sponsorConfigured) {
    elements.supportButton.textContent = 'Ver anúncio e liberar download';
    elements.adMessage.textContent = 'Use o botão abaixo para abrir o anúncio do parceiro. Ao retornar, o acesso ao arquivo será liberado.';
  } else {
    elements.supportButton.textContent = 'Preparar download';
    elements.adMessage.textContent = 'Área preparada para um único anúncio. Enquanto o parceiro não estiver ativo, nenhum redirecionamento será aberto.';
  }

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

  elements.supportButton.addEventListener('click', () => {
    if (elements.supportButton.disabled) return;

    if (sponsorConfigured) {
      window.open(work.sponsorUrl, '_blank', 'noopener,noreferrer');
    }

    elements.supportButton.disabled = true;
    elements.unlockProgress.hidden = false;
    let remaining = delay;
    elements.unlockStatus.textContent = `Preparando o download em ${remaining} segundos…`;

    const timer = window.setInterval(() => {
      remaining -= 1;
      const progress = ((delay - remaining) / delay) * 100;
      elements.unlockProgressBar.style.width = `${Math.min(progress, 100)}%`;

      if (remaining <= 0) {
        window.clearInterval(timer);
        elements.supportButton.hidden = true;
        finishUnlock();
        return;
      }

      elements.unlockStatus.textContent = `Preparando o download em ${remaining} segundos…`;
    }, 1000);
  });

  elements.mediafireButton.addEventListener('click', (event) => {
    if (elements.mediafireButton.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
    }
  });
})();
