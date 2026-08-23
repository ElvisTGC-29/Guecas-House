(function () {
  const openButton = document.getElementById('open-alvo-preview');
  const modal = document.getElementById('alvo-pdf-modal');
  const dialog = modal?.querySelector('.pdf-modal-dialog');
  const closeButton = document.getElementById('close-alvo-preview');
  const previousButton = document.getElementById('alvo-pdf-previous');
  const nextButton = document.getElementById('alvo-pdf-next');
  const pageNumber = document.getElementById('alvo-pdf-page');
  const pageTotal = document.getElementById('alvo-pdf-total');
  const canvas = document.getElementById('alvo-pdf-canvas');
  const wrapper = modal?.querySelector('.pdf-modal-canvas-wrapper');
  const loading = document.getElementById('alvo-pdf-loading');
  const previewGate = document.getElementById('alvo-preview-gate');

  if (!openButton || !modal || !dialog || !canvas || !wrapper) return;

  const pdfUrl = '../arquivos/previas/previa-alvo-dumbledore-e-as-memorias-ancestrais-partes-preview.pdf';
  const PREVIEW_GATE_PAGE = 18;
  let pdfDocument = null;
  let currentPage = 1;
  let renderTask = null;
  let lastFocusedElement = null;
  let resizeTimer = null;
  let pageChangeInProgress = false;
  let gestureStartX = 0;
  let gestureStartY = 0;
  let gestureStartTime = 0;
  let activePointerId = null;

  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function updateControls() {
    if (pageNumber) pageNumber.textContent = String(currentPage);
    if (pageTotal) pageTotal.textContent = String(pdfDocument?.numPages || 0);
    if (previousButton) previousButton.disabled = currentPage <= 1;
    if (nextButton) nextButton.disabled = !pdfDocument || currentPage >= Math.min(pdfDocument.numPages, PREVIEW_GATE_PAGE);
  }

  async function renderCurrentPage() {
    if (!pdfDocument) return;
    if (renderTask) {
      renderTask.cancel();
      renderTask = null;
    }

    const page = await pdfDocument.getPage(currentPage);
    const naturalViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(240, wrapper.clientWidth - 40);
    const availableHeight = Math.max(280, wrapper.clientHeight - 40);
    const fitScale = Math.min(
      availableWidth / naturalViewport.width,
      availableHeight / naturalViewport.height
    );
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const renderViewport = page.getViewport({ scale: fitScale * pixelRatio });

    canvas.width = Math.round(renderViewport.width);
    canvas.height = Math.round(renderViewport.height);
    canvas.style.width = `${Math.round(renderViewport.width / pixelRatio)}px`;
    canvas.style.height = `${Math.round(renderViewport.height / pixelRatio)}px`;
    canvas.setAttribute('aria-label', `Página ${currentPage} de ${pdfDocument.numPages}`);
    const previewLocked = currentPage >= PREVIEW_GATE_PAGE;
    canvas.classList.toggle('is-preview-locked', previewLocked);
    if (previewGate) previewGate.hidden = !previewLocked;

    try {
      renderTask = page.render({
        canvasContext: canvas.getContext('2d', { alpha: false }),
        viewport: renderViewport
      });
      await renderTask.promise;
      loading.hidden = true;
      wrapper.scrollTo(0, 0);
    } catch (error) {
      if (error?.name !== 'RenderingCancelledException') throw error;
    } finally {
      renderTask = null;
    }
    updateControls();
  }

  async function goToPage(targetPage) {
    if (!pdfDocument || pageChangeInProgress) return;

    const lastPreviewPage = Math.min(pdfDocument.numPages, PREVIEW_GATE_PAGE);
    const nextPage = Math.min(lastPreviewPage, Math.max(1, targetPage));
    if (nextPage === currentPage) return;

    pageChangeInProgress = true;
    currentPage = nextPage;
    updateControls();

    try {
      await renderCurrentPage();
    } finally {
      pageChangeInProgress = false;
    }
  }

  async function ensureDocument() {
    if (pdfDocument) return;
    loading.hidden = false;
    try {
      const library = await loadPdfJs();
      pdfDocument = await library.getDocument(pdfUrl).promise;
      updateControls();
    } catch (_error) {
      loading.className = 'pdf-error';
      loading.innerHTML = 'Não foi possível carregar a prévia agora. <a href="' + pdfUrl + '" target="_blank" rel="noopener">Abrir o PDF em uma nova aba</a>.';
      throw _error;
    }
  }

  async function openPreview() {
    lastFocusedElement = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('pdf-preview-open');
    document.body.classList.add('pdf-preview-open');
    closeButton?.focus();
    await ensureDocument();
    await renderCurrentPage();
  }

  function closePreview() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('pdf-preview-open');
    document.body.classList.remove('pdf-preview-open');
    lastFocusedElement?.focus();
  }

  openButton.addEventListener('click', () => openPreview().catch(() => {}));
  closeButton?.addEventListener('click', closePreview);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closePreview();
  });

  previousButton?.addEventListener('click', async () => {
    await goToPage(currentPage - 1);
  });

  nextButton?.addEventListener('click', async () => {
    await goToPage(currentPage + 1);
  });

  document.addEventListener('keydown', async (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closePreview();
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      await goToPage(currentPage - 1);
    }

    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      await goToPage(currentPage + 1);
    }
  });

  wrapper.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    activePointerId = event.pointerId;
    gestureStartX = event.clientX;
    gestureStartY = event.clientY;
    gestureStartTime = Date.now();
    wrapper.setPointerCapture?.(event.pointerId);
  });

  wrapper.addEventListener('pointerup', async (event) => {
    if (!pdfDocument || event.pointerId !== activePointerId) return;

    activePointerId = null;
    const horizontalDistance = event.clientX - gestureStartX;
    const verticalDistance = event.clientY - gestureStartY;
    const gestureDuration = Date.now() - gestureStartTime;
    const isHorizontalSwipe = Math.abs(horizontalDistance) >= 48
      && Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.2
      && gestureDuration <= 900;

    if (!isHorizontalSwipe) return;

    if (horizontalDistance < 0) {
      await goToPage(currentPage + 1);
    } else {
      await goToPage(currentPage - 1);
    }
  });

  wrapper.addEventListener('pointercancel', () => {
    activePointerId = null;
  });

  window.addEventListener('resize', () => {
    if (!modal.classList.contains('is-open') || !pdfDocument) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderCurrentPage().catch(() => {}), 140);
  });

  dialog.addEventListener('contextmenu', (event) => event.preventDefault());
})();
