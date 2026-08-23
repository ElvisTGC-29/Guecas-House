const ALLOWED_ORIGINS = new Set([
  'https://guecashouse.com.br',
  'https://www.guecashouse.com.br'
]);

const ALLOWED_SLUGS = new Set(['alvo-dumbledore']);

function responseHeaders(request) {
  const origin = request.headers.get('Origin');
  const headers = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff'
  });

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
    headers.set('Vary', 'Origin');
  }

  return headers;
}

function json(request, data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: responseHeaders(request)
  });
}

function validSlug(context) {
  return String(context.params.slug || '').trim().toLowerCase();
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin');
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return json(context.request, { error: 'Origem não autorizada' }, 403);
  }

  return new Response(null, { status: 204, headers: responseHeaders(context.request) });
}

export async function onRequestGet(context) {
  const slug = validSlug(context);
  if (!ALLOWED_SLUGS.has(slug)) {
    return json(context.request, { error: 'Obra não encontrada' }, 404);
  }

  const row = await context.env.DOWNLOADS_DB
    .prepare('SELECT total FROM download_counts WHERE slug = ?1')
    .bind(slug)
    .first();

  return json(context.request, { key: slug, value: Number(row?.total || 0) });
}

export async function onRequestPost(context) {
  const origin = context.request.headers.get('Origin');
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return json(context.request, { error: 'Origem não autorizada' }, 403);
  }

  const slug = validSlug(context);
  if (!ALLOWED_SLUGS.has(slug)) {
    return json(context.request, { error: 'Obra não encontrada' }, 404);
  }

  const row = await context.env.DOWNLOADS_DB
    .prepare(`
      INSERT INTO download_counts (slug, total)
      VALUES (?1, 1)
      ON CONFLICT(slug) DO UPDATE SET total = total + 1
      RETURNING total
    `)
    .bind(slug)
    .first();

  return json(context.request, { key: slug, value: Number(row?.total || 1) });
}
