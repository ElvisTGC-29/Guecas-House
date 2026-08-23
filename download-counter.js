(function () {
  const API_BASE = 'https://api.guecashouse.com.br/api/downloads';
  const REFRESH_INTERVAL = 10000;
  const counterBlocks = Array.from(document.querySelectorAll('[data-download-counter]'));

  if (!counterBlocks.length) return;

  const numberFormatter = new Intl.NumberFormat('pt-BR');
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel('guecas-download-counter') : null;

  function getCounterConfig(element) {
    return {
      key: element.dataset.counterKey
    };
  }

  function isValidConfig(config) {
    return Boolean(config.key);
  }

  function buildCounterUrl(config) {
    return `${API_BASE}/${encodeURIComponent(config.key)}`;
  }

  function updateBlocks(counterKey, value, status) {
    counterBlocks
      .filter((block) => block.dataset.counterKey === counterKey)
      .forEach((block) => {
        const number = block.querySelector('[data-download-count]');
        const message = block.querySelector('[data-download-count-status]');

        if (number && Number.isFinite(value)) {
          number.textContent = numberFormatter.format(value);
        }

        if (message && status) {
          message.textContent = status;
        }

        block.classList.toggle('is-unavailable', !Number.isFinite(value));
      });
  }

  async function requestCount(config, increment) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(buildCounterUrl(config), {
        method: increment ? 'POST' : 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'omit',
        signal: controller.signal,
        keepalive: increment,
        headers: {
          Accept: 'application/json',
          ...(increment ? { 'Content-Type': 'application/json' } : {})
        },
        body: increment ? '{}' : undefined
      });

      if (!response.ok) throw new Error('Contador indisponível');
      const data = await response.json();
      const value = Number(data.value);
      if (!Number.isFinite(value)) throw new Error('Resposta inválida');
      return value;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const counterConfigs = Array.from(new Map(
    counterBlocks
      .map((block) => getCounterConfig(block))
      .filter(isValidConfig)
      .map((config) => [config.key, config])
  ).values());

  function refreshCounter(config) {
    requestCount(config, false)
      .then((value) => updateBlocks(config.key, value, 'Atualização automática ativa'))
      .catch(() => updateBlocks(config.key, NaN, 'Contagem temporariamente indisponível'));
  }

  function refreshAllCounters() {
    if (document.hidden) return;
    counterConfigs.forEach(refreshCounter);
  }

  refreshAllCounters();
  const refreshTimer = window.setInterval(refreshAllCounters, REFRESH_INTERVAL);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshAllCounters();
  });

  window.addEventListener('focus', refreshAllCounters);
  window.addEventListener('pagehide', () => {
    window.clearInterval(refreshTimer);
    channel?.close();
  }, { once: true });

  channel?.addEventListener('message', (event) => {
    const counterKey = String(event.data?.key || '');
    const value = Number(event.data?.value);
    if (!counterKey || !Number.isFinite(value)) return;
    updateBlocks(counterKey, value, 'Sincronizado em tempo real');
  });

  document.querySelectorAll('[data-download-counter-trigger]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      if (trigger.hidden || trigger.getAttribute('aria-disabled') === 'true' || !trigger.href || trigger.href.endsWith('#')) return;

      const counterKey = trigger.dataset.downloadCounterTrigger;
      const relatedBlock = counterBlocks.find((block) => block.dataset.counterKey === counterKey);
      if (!relatedBlock) return;

      const config = getCounterConfig(relatedBlock);
      if (!isValidConfig(config)) return;

      requestCount(config, true)
        .then((value) => {
          updateBlocks(config.key, value, 'Download registrado agora');
          channel?.postMessage({ key: config.key, value });
        })
        .catch(() => {});
    });
  });
})();
