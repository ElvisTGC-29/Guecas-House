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

  if (!openButton || !modal || !dialog || !canvas || !wrapper) return;

  const pdfUrl = '../arquivos/previas/previa-alvo-dumbledore.pdf';
  let pdfDocument = null;
  let currentPage = 1;
  let renderTask = null;
  let lastFocusedElement = null;
  let resizeTimer = null;

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
    if (nextButton) nextButton.disabled = !pdfDocument || currentPage >= pdfDocument.numPages;
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
    if (currentPage <= 1) return;
    currentPage -= 1;
    await renderCurrentPage();
  });

  nextButton?.addEventListener('click', async () => {
    if (!pdfDocument || currentPage >= pdfDocument.numPages) return;
    currentPage += 1;
    await renderCurrentPage();
  });

  document.addEventListener('keydown', async (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closePreview();
    if (event.key === 'ArrowLeft' && currentPage > 1) {
      currentPage -= 1;
      await renderCurrentPage();
    }
    if (event.key === 'ArrowRight' && pdfDocument && currentPage < pdfDocument.numPages) {
      currentPage += 1;
      await renderCurrentPage();
    }
  });

  window.addEventListener('resize', () => {
    if (!modal.classList.contains('is-open') || !pdfDocument) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderCurrentPage().catch(() => {}), 140);
  });

  dialog.addEventListener('contextmenu', (event) => event.preventDefault());
})();
