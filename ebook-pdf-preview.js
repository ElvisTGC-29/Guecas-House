(function () {
  const modal = document.querySelector('[data-pdf-preview]');
  const openButton = document.querySelector('[data-pdf-preview-open]');
  if (!modal || !openButton) return;

  const dialog = modal.querySelector('.themed-pdf-dialog');
  const closeButton = modal.querySelector('[data-pdf-close]');
  const previousButton = modal.querySelector('[data-pdf-previous]');
  const nextButton = modal.querySelector('[data-pdf-next]');
  const pageNumber = modal.querySelector('[data-pdf-page]');
  const pageTotal = modal.querySelector('[data-pdf-total]');
  const canvas = modal.querySelector('.themed-pdf-canvas');
  const wrapper = modal.querySelector('.themed-pdf-canvas-wrapper');
  const loading = modal.querySelector('.themed-pdf-loading');
  const pdfUrl = modal.dataset.pdfUrl;

  if (!dialog || !canvas || !wrapper || !loading || !pdfUrl) return;

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
    } catch (error) {
      loading.className = 'themed-pdf-error';
      loading.innerHTML = `Não foi possível carregar a prévia agora. <a href="${pdfUrl}" target="_blank" rel="noopener">Abrir o PDF em uma nova aba</a>.`;
      throw error;
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

  async function goToPage(nextPage) {
    if (!pdfDocument || nextPage < 1 || nextPage > pdfDocument.numPages) return;
    currentPage = nextPage;
    await renderCurrentPage();
  }

  openButton.addEventListener('click', () => openPreview().catch(() => {}));
  closeButton?.addEventListener('click', closePreview);
  previousButton?.addEventListener('click', () => goToPage(currentPage - 1).catch(() => {}));
  nextButton?.addEventListener('click', () => goToPage(currentPage + 1).catch(() => {}));

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closePreview();
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closePreview();
    if (event.key === 'ArrowLeft') goToPage(currentPage - 1).catch(() => {});
    if (event.key === 'ArrowRight') goToPage(currentPage + 1).catch(() => {});
  });

  window.addEventListener('resize', () => {
    if (!modal.classList.contains('is-open') || !pdfDocument) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => renderCurrentPage().catch(() => {}), 140);
  });

  dialog.addEventListener('contextmenu', (event) => event.preventDefault());
})();
