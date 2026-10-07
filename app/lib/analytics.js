// Google Analytics, property "Gig Cottage" (stream https://gigcottage.net).
//
// Page views, scrolls, outbound links and history changes are measured by the
// stream's enhanced measurement, switched on in the GA admin, not here. Client
// side navigation between pages is counted by that last one.
//
// What enhanced measurement cannot see is the reason the site exists: a call,
// a WhatsApp message, an enquiry. Those are named events, sent with track().
export const GA_ID = 'G-95WBEK1R2L'

// Does nothing until components/Analytics.js has loaded the tag, which it only
// does after the visitor accepts analytics. So callers never check consent
// themselves, and a declined visitor's clicks go nowhere.
export function track(name, params) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
