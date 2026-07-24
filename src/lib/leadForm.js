import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_PAGE_FORM } from '../config/form-ids';

// Control characters are written as \xNN escapes (never raw bytes) so the built
// bundle stays plain text and greppable. Raw control bytes make bundles read as
// binary and break tooling and source maps. The regex intentionally matches
// control chars in order to strip them from user input, so no-control-regex is
// disabled for this one line.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x1F\x7F]/g;
const HTML_TAGS = /<[^>]*>/g;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function sanitize(value, max = 2000) {
  return String(value == null ? '' : value)
    .replace(HTML_TAGS, '')
    .replace(CONTROL_CHARS, '')
    .trim()
    .slice(0, max);
}

// Cheap bot heuristics that need no server: a URL in the name field, or a
// link-stuffed message.
export function looksLikeSpam(fields) {
  const name = fields.name || '';
  const message = fields.message || '';
  if (/https?:\/\/|www\.|\.[a-z]{2,}\//i.test(name)) return true;
  if ((message.match(/https?:\/\//gi) || []).length > 2) return true;
  return false;
}

export function validateLead(raw) {
  const fields = {
    name: sanitize(raw.name, 120),
    phone: sanitize(raw.phone, 40),
    email: sanitize(raw.email, 160),
    service: sanitize(raw.service, 120),
    address: sanitize(raw.address, 200),
    message: sanitize(raw.message, 2000),
  };
  const errors = {};
  if (fields.email && !EMAIL_RE.test(fields.email)) errors.email = true;
  const digits = (fields.phone.match(/\d/g) || []).length;
  if (fields.phone && (digits < 7 || digits > 15)) errors.phone = true;
  return { fields, errors, valid: Object.keys(errors).length === 0 };
}

/**
 * pushLeadSubmit — the ADDITIONAL, custom GTM dataLayer event, separate from and
 * on top of GTM's native `gtm.formSubmit` listener (which we do not touch).
 *
 * It fires ONE `lead_submit` event per confirmed-good lead. The two form_id
 * buckets the analytics tags expect:
 *   - the Contact page's own form  → 'contact-form'
 *   - every other lead/quote form  → 'quote-form'
 * The full-detail per-form id still rides along on the onLead payload; this push
 * carries only the coarse bucket GTM asked for.
 *
 * `window.dataLayer` is created by the GTM head snippet, but we guard with
 * `|| []` in case this ever runs before GTM (the push is then queued and GTM
 * consumes it on load).
 */
function pushLeadSubmit(formId) {
  if (typeof window === 'undefined') return;
  const form_id = formId === CONTACT_PAGE_FORM ? 'contact-form' : 'quote-form';
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: 'lead_submit', form_id });
}

/**
 * Page + campaign context that rides along with every lead, read from the URL
 * at submit time. Kept here (not in the form components) so all forms send the
 * same shape. Guarded for SSG: during prerender there is no window, so it
 * returns empty strings and the client fills them in on the real submission.
 */
function collectContext() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const q = (k) => params.get(k) || '';
  return {
    page_path: window.location.pathname,
    page_url: window.location.href,
    referrer: document.referrer || '',
    utm_source: q('utm_source'),
    utm_medium: q('utm_medium'),
    utm_campaign: q('utm_campaign'),
    utm_term: q('utm_term'),
    utm_content: q('utm_content'),
    gclid: q('gclid'),
  };
}

/**
 * sendLead — POST the confirmed-good lead to the site's own serverless relay at
 * /api/lead, which reads GHL_WEBHOOK_URL server-side and forwards to the GHL
 * inbound webhook. The webhook URL is NEVER referenced here, so it stays out of
 * the client bundle.
 *
 * Fire-and-forget with `keepalive: true`: the handler navigates to /thank-you
 * immediately after (preserving the existing UX), and keepalive lets the request
 * complete even though React unmounts the form. Failures are logged but never
 * surfaced to the visitor, matching the existing success/error handling.
 */
function sendLead(fields) {
  if (typeof window === 'undefined' || typeof fetch !== 'function') return;
  const payload = { ...collectContext(), ...fields, form_name: fields.formId };
  // formId is carried as form_id (the name the relay/CRM expects); drop the camelCase alias.
  delete payload.formId;
  payload.form_id = fields.formId;
  try {
    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      if (typeof console !== 'undefined') console.error('[lead] relay post failed', err);
    });
  } catch (err) {
    if (typeof console !== 'undefined') console.error('[lead] relay post threw', err);
  }
}

/**
 * useLeadForm — one shared submit handler for every lead form in the template.
 * Layers: honeypot field, input sanitisation, field validation, and cheap bot
 * heuristics, all fail-silent (a bot sees the same success view, no signal).
 * No time-trap: it caused a hydration mismatch and is intentionally omitted.
 *
 * The default action navigates to /thank-you. The optional onLead callback
 * fires only for clean, valid submissions and is where go-live wiring attaches
 * the dataLayer event / CRM webhook (handled outside the build).
 */
export function useLeadForm(formId = 'lead') {
  const navigate = useNavigate();
  const honeypotRef = useRef(null);
  // Guards against a second `lead_submit` for the same submission (e.g. a rapid
  // double-click firing submit twice before navigate unmounts the form), so one
  // successful submission always yields exactly one event.
  const hasPushedRef = useRef(false);

  // Off-screen hidden field a human never sees but bots fill in. Off-screen
  // (not display:none, which some bots skip), aria-hidden, untabbable, no
  // autocomplete.
  const honeypotProps = {
    ref: honeypotRef,
    type: 'text',
    name: 'company_website',
    tabIndex: -1,
    autoComplete: 'off',
    'aria-hidden': true,
    style: {
      position: 'absolute',
      left: '-9999px',
      top: 'auto',
      width: 1,
      height: 1,
      overflow: 'hidden',
      opacity: 0,
    },
  };

  function onSubmit(e, onLead) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const honeypotHit = !!(honeypotRef.current && honeypotRef.current.value);
    const { fields, errors, valid } = validateLead(raw);

    // ── Validation gate ──
    // The browser's own constraint check runs before `submit` fires, so an
    // empty `required` field never reaches this handler. What DOES reach it is
    // input the browser accepts but validateLead rejects — a phone with too few
    // digits, an address-shaped email. Surface those on the offending field
    // with the native bubble and stop, so no one is bounced to the thank-you
    // page having submitted nothing usable.
    //
    // Bot signals (honeypot, link-stuffing) are deliberately NOT surfaced: they
    // still fail silently to the thank-you page so a bot gets no feedback.
    if (!valid) {
      for (const name of Object.keys(errors)) {
        const field = form.elements[name];
        if (!field || typeof field.setCustomValidity !== 'function') continue;
        field.setCustomValidity(
          name === 'email'
            ? 'Please enter a valid email address.'
            : 'Please enter a valid phone number.'
        );
        // Clear on the next edit so the message never sticks to a fixed field.
        field.addEventListener('input', function clear() {
          field.setCustomValidity('');
          field.removeEventListener('input', clear);
        });
      }
      if (typeof form.reportValidity === 'function') form.reportValidity();
      return;
    }

    // Clean, valid submissions are the SUCCESS point: we are past the validation
    // gate above and past the honeypot/spam checks, so the lead is confirmed
    // good. Only here do we fire the custom GTM `lead_submit` event — never on
    // click, on submit-with-invalid-input, or for bot/spam submissions (bots
    // still reach the thank-you page silently, with no event). Bots reach the
    // thank-you page with no lead recorded and no signal that they were caught.
    if (!honeypotHit && !looksLikeSpam(fields)) {
      if (!hasPushedRef.current) {
        hasPushedRef.current = true;
        pushLeadSubmit(formId);
      }
      // Deliver the lead to the CRM via the server-side relay (/api/lead →
      // GHL_WEBHOOK_URL). This is the wiring the onLead comment always referred
      // to; onLead is still invoked below for any caller that also wants it.
      sendLead({ ...fields, formId });
      if (typeof onLead === 'function') onLead({ ...fields, formId });
    }
    navigate('/thank-you');
  }

  return { honeypotProps, onSubmit };
}
