// middleware.js — Vercel Edge Middleware
// Intercepta requests de bots de redes sociales (Twitter, Facebook, WhatsApp, etc.)
// y les devuelve HTML con meta tags Open Graph correctos, generados desde la API.
// Los usuarios reales siguen recibiendo la SPA de React normalmente.

export const config = {
  matcher: '/articulo/:slug*',
};

const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Twitterbot',
  'WhatsApp',
  'LinkedInBot',
  'Slackbot',
  'TelegramBot',
  'Discordbot',
  'Pinterest',
  'redditbot',
];

function isSocialBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some((bot) => ua.includes(bot.toLowerCase()));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';

  if (!isSocialBot(userAgent)) {
    return; // usuario real -> sigue el flujo normal, sirve la SPA de siempre
  }

  const url = new URL(request.url);
  const slug = url.pathname.split('/articulo/')[1];

  if (!slug) {
    return;
  }

  const API_URL = process.env.API_URL || 'https://geopolitical.onrender.com/api';

  try {
    const res = await fetch(`${API_URL}/articles/slug/${slug}`);

    if (!res.ok) {
      return; // si falla, dejamos pasar a la SPA normal
    }

    const article = await res.json();

    const title = escapeHtml(article.title);
    const description = escapeHtml(
      article.content.length > 160
        ? article.content.substring(0, 157) + '...'
        : article.content
    );
    const image = article.imageUrl || `${url.origin}/og-default.png`;
    const pageUrl = url.toString();

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${title} | Geopolitics.Data</title>
  <meta name="description" content="${description}" />

  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:site_name" content="Geopolitics.Data" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />

  <meta http-equiv="refresh" content="0; url=${pageUrl}" />
</head>
<body>
  <p>Redirigiendo a <a href="${pageUrl}">${title}</a>...</p>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch (err) {
    return; // si algo falla, dejamos pasar a la SPA normal (fail-safe)
  }
}