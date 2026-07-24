/* global process */
// Vercel serverless function (Node runtime). Receives a sanitized lead from the
// site's forms and POSTs it server-side to the GHL inbound webhook.
//
// The webhook endpoint is read from the GHL_WEBHOOK_URL environment variable,
// configured in the Vercel project settings (Production + Preview), so it is
// never exposed in the client bundle. Every form POSTs to /api/lead; this
// function forwards to GHL. Mirrors the Winter Hill / Capstone pattern used on
// the other live KCA client sites.
//
// Runs only on Vercel (or `vercel dev`); it does not run under `vite preview`.
//
// Required env var:  GHL_WEBHOOK_URL   the leadconnectorhq webhook-trigger URL
// Optional env var:  ALLOWED_ORIGINS   comma-separated hostnames; OFF unless set

const MAX = { meta: 160, path: 300, name: 120, phone: 40, email: 160, service: 120, address: 200, message: 2000 };

// Drop control characters, strip HTML tags, collapse whitespace, cap length.
// A char-code loop handles control characters so the source needs no escapes.
function clip(value, max) {
  if (typeof value !== 'string') return '';
  let cleaned = '';
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code > 31 && code !== 127) cleaned += ch;
  }
  return cleaned
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function digits(value) {
  return (value.match(/\d/g) || []).length;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  // Optional origin allowlist (comma-separated hostnames in ALLOWED_ORIGINS).
  // OFF unless the env var is set, so it can never block real leads before the
  // production domain is confirmed. Subdomains of an allowed host pass too.
  const allowList = (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (allowList.length) {
    const ref = req.headers.origin || req.headers.referer || '';
    let host = '';
    try { host = ref ? new URL(ref).hostname : ''; } catch { host = ''; }
    const allowed = host && allowList.some((a) => host === a || host.endsWith('.' + a));
    if (!allowed) return res.status(403).json({ ok: false, error: 'forbidden_origin' });
  }

  // Body-size guard (defense-in-depth above Vercel's platform limit).
  const rawSize = typeof req.body === 'string' ? req.body.length : JSON.stringify(req.body || {}).length;
  if (rawSize > 16000) {
    return res.status(413).json({ ok: false, error: 'payload_too_large' });
  }

  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    // Not yet wired. Log for ops, stay vague to the client. Set GHL_WEBHOOK_URL
    // in the Vercel project to go live.
    console.error('[lead] GHL_WEBHOOK_URL is not configured in the environment');
    return res.status(503).json({ ok: false, error: 'webhook_not_configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const payload = {
    form_id: clip(body.form_id, MAX.meta),
    form_name: clip(body.form_name, MAX.meta),
    page_path: clip(body.page_path, MAX.path),
    page_url: clip(body.page_url, MAX.path),
    page_type: clip(body.page_type, MAX.meta),
    page_slug: clip(body.page_slug, MAX.meta),
    referrer: clip(body.referrer, MAX.path),
    utm_source: clip(body.utm_source, MAX.meta),
    utm_medium: clip(body.utm_medium, MAX.meta),
    utm_campaign: clip(body.utm_campaign, MAX.meta),
    utm_term: clip(body.utm_term, MAX.meta),
    utm_content: clip(body.utm_content, MAX.meta),
    gclid: clip(body.gclid, MAX.meta),
    name: clip(body.name, MAX.name),
    phone: clip(body.phone, MAX.phone),
    email: clip(body.email, MAX.email),
    service: clip(body.service, MAX.service),
    address: clip(body.address, MAX.address),
    message: clip(body.message, MAX.message),
    source: 'highpointrenovation.com',
    submitted_at: new Date().toISOString(),
  };

  // Server-side validation. This endpoint is public, so never trust the client;
  // re-check the essentials before forwarding to the CRM. A usable lead needs a
  // name and at least one working contact method. This site's forms differ from
  // the Capstone reference — the CTA and sticky-quote forms do not make email a
  // required field (only name + phone), so requiring BOTH email AND phone here
  // (as the reference did) would silently 422 those real leads. Requiring a
  // valid email OR a real phone keeps every form the site actually ships
  // compatible while still rejecting empty/uncontactable junk.
  const hasContact = isValidEmail(payload.email) || digits(payload.phone) >= 7;
  if (payload.name.length < 2 || !hasContact) {
    return res.status(422).json({ ok: false, error: 'invalid_lead' });
  }

  try {
    const ghlRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!ghlRes.ok) {
      console.error('[lead] GHL webhook responded', ghlRes.status);
      return res.status(502).json({ ok: false, error: 'webhook_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[lead] webhook post error', err);
    return res.status(502).json({ ok: false, error: 'webhook_error' });
  }
}
