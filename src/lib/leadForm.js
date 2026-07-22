import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

    // Clean, valid submissions fire onLead. Bots reach the thank-you page with
    // no lead recorded and no signal that they were caught.
    if (!honeypotHit && !looksLikeSpam(fields) && typeof onLead === 'function') {
      onLead({ ...fields, formId });
    }
    navigate('/thank-you');
  }

  return { honeypotProps, onSubmit };
}
