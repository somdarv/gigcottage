'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Owns the scroll-reveal observer.
//
// This used to be an inline script in the layout that observed once at
// DOMContentLoaded and unobserved each element as it landed. Both halves of
// that broke on a real site:
//
//   - App Router navigation never fires DOMContentLoaded again, so the layout
//     script never re-ran. Arriving on a new route, the elements still picked
//     up the hidden state from .gc-reveal-ready — which is on <html> for the
//     life of the session — but nothing was watching them, so the copy simply
//     never appeared. Going back was the same. That is the reported bug.
//   - unobserve() made the reveal one-shot, so scrolling back up left
//     everything already settled.
//
// Now: the observer is rebuilt on every pathname change so new markup is always
// watched, and `is-in` is toggled rather than latched, so a block animates every
// time it comes back into view.
//
// The hidden state is still applied by the inline script in layout.js, because
// that has to land before first paint. If JS never runs, the class never lands
// and everything renders visible — nothing can be stranded invisible.
export default function Reveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-in', entry.isIntersecting)
        })
      },
      // Enter a little before the element is fully on screen; the same margin
      // means it resets only once it is properly past, not on the edge.
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    )

    document
      .querySelectorAll('[data-gc-reveal],[data-gc-reveal-group]')
      .forEach((el) => io.observe(el))

    // The bottom of the document is a blind spot for a root shrunk from the
    // bottom. The page stops scrolling once its end meets the viewport, so
    // anything nearer the end than the margin can never rise into the box and
    // never intersects — it stays at opacity 0 for good.
    //
    // The footer's base bar was exactly that: its top sits about 64px above
    // the document end, against a 12% margin that is ~108px on a desktop
    // viewport. On a phone the taller wrapped bar cleared the smaller margin,
    // which is why it appeared there and nowhere else.
    //
    // So once the page is scrolled to its end, anything still hidden but
    // actually on screen is revealed and unobserved — unobserved because the
    // observer would otherwise toggle it straight back off. Only elements in
    // view are swept, so blocks further up keep re-animating as before.
    function sweepBottom() {
      const doc = document.documentElement
      if (window.innerHeight + window.scrollY < doc.scrollHeight - 2) return

      document
        .querySelectorAll(
          '[data-gc-reveal]:not(.is-in),[data-gc-reveal-group]:not(.is-in)',
        )
        .forEach((el) => {
          const box = el.getBoundingClientRect()
          if (box.top < window.innerHeight && box.bottom > 0) {
            io.unobserve(el)
            el.classList.add('is-in')
          }
        })
    }

    window.addEventListener('scroll', sweepBottom, { passive: true })
    window.addEventListener('resize', sweepBottom)
    sweepBottom()

    return () => {
      io.disconnect()
      window.removeEventListener('scroll', sweepBottom)
      window.removeEventListener('resize', sweepBottom)
    }
  }, [pathname])

  return null
}
