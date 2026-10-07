// Cookie consent, such as it is.
//
// This site sets no cookies of its own and no advertising ones. Fonts are
// self-hosted by next/font at build time, so loading a page makes no request
// to Google for them. The answer to the notice is kept in localStorage on the
// visitor's own device rather than in a cookie.
//
// Two optional things come from Google.
//
// The embedded map is an iframe served by Google, and Google sets its own
// cookies inside it. It loads by default — the client asked for a map that is
// simply there — so the choice offered is a real opt-out rather than a gate,
// and declining swaps the map for a plain link.
//
// Analytics is the other way round: a gate. Google Analytics sets cookies of
// its own, so nothing loads until the visitor presses Accept all. See
// components/Analytics.js.
//
// A category here is the whole job. Adding one turns the notice into a
// two-button consent prompt on its own, and hasConsent() below is the gate
// every optional thing must sit behind.
export const OPTIONAL = [
  {
    id: 'map',
    name: 'Map',
    note: 'The Google map on the home page. Google sets cookies of its own.',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    note: 'Google Analytics. Counts visits and which buttons get pressed.',
  },
]

const KEY = 'gc-consent'

// Fired on window when the visitor answers, so anything gated can start on the
// same page view instead of waiting for the next one.
export const CONSENT_EVENT = 'gc-consent'

// Bumping this re-asks everyone. Do it when what is being consented to
// changes — a new optional category, not a wording tweak.
//
// 3 since 2026-10-07: analytics arrived.
const VERSION = 3

function read() {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (!saved || saved.v !== VERSION) return null
    return saved
  } catch {
    // Private browsing, storage disabled, or corrupt JSON. Treat as unanswered
    // rather than throwing — the notice reappearing is a far smaller problem
    // than the page failing to render.
    return null
  }
}

export function getConsent() {
  if (typeof window === 'undefined') return null
  return read()
}

export function saveConsent(granted) {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ v: VERSION, at: new Date().toISOString(), granted }),
    )
  } catch {
    // Nothing to do. The visitor is not blocked either way; they will just be
    // asked again next time.
  }
  // Outside the try, and carrying the answer itself: when storage is blocked
  // the save above fails, and hasConsent() would then say no to a visitor who
  // has just said yes.
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: granted }))
}

// The gate. Anything optional must be behind this, not merely behind a flag
// set after the script has already loaded.
export function hasConsent(id) {
  const saved = getConsent()
  return Boolean(saved && saved.granted && saved.granted.includes(id))
}
