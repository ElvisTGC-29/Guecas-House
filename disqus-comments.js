(() => {
  const thread = document.getElementById('disqus_thread');

  if (!thread) return;

  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const pageUrl = thread.dataset.pageUrl || canonical || window.location.href.split('#')[0];
  const pageIdentifier = thread.dataset.pageIdentifier || window.location.pathname;

  window.disqus_config = function configurarDisqus() {
    this.page.url = pageUrl;
    this.page.identifier = pageIdentifier;
    this.page.title = document.title;
    this.language = 'pt_BR';
  };

  const carregarComentarios = () => {
    if (thread.dataset.loaded === 'true') return;

    thread.dataset.loaded = 'true';
    const script = document.createElement('script');
    script.src = 'https://guecashouse.disqus.com/embed.js';
    script.async = true;
    script.setAttribute('data-timestamp', String(Date.now()));
    script.onerror = () => {
      thread.dataset.loaded = 'false';
      thread.innerHTML = '<p class="article-comments-loading">Não foi possível carregar os comentários agora. Tente novamente mais tarde.</p>';
    };
    document.head.appendChild(script);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      carregarComentarios();
    }, { rootMargin: '600px 0px' });

    observer.observe(thread);
    return;
  }

  carregarComentarios();
})();
