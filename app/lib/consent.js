// Cookie consent, such as it is.
//
// This site sets no cookies of its own. Not analytics, not advertising. Fonts
// are self-hosted by next/font at build time, so loading a page makes no
// request to Google for them. The answer to the notice is kept in localStorage
// on the visitor's own device rather than in a cookie.
//
// The embedded map is the exception, and the reason OPTIONAL is no longer
// empty: it is an iframe served by Google, and Google sets its own cookies
// inside it. It loads by default — the client asked for a map that is simply
// there — so the choice offered is a real opt-out rather than a gate, and
// declining swaps the map for a plain link.
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
  // { id: 'analytics', name: 'Analytics', note: 'How the site is used.' },
]

const KEY = 'gc-consent'

// Bumping this re-asks everyone. Do it when what is being consented to
// changes — a new optional category, not a wording tweak.
const VERSION = 2

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
}

// The gate. Anything optional must be behind this, not merely behind a flag
// set after the script has already loaded.
export function hasConsent(id) {
  const saved = getConsent()
  return Boolean(saved && saved.granted && saved.granted.includes(id))
}
