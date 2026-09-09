'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTACT, SPACES, whatsappLink } from '../lib/content'
import { heroFrames, heroLqip } from '../lib/media'

// One stage that cross-dissolves through the frames it is given. There is a
// single photograph in it today, so nothing dissolves and the controls do not
// render. The set is still a set, so a second frame added in media.js brings
// the rotation back on its own.
export default function Hero() {
  const [active, setActive] = useState(0)
  const [armed, setArmed] = useState(false)
  const [reduced, setReduced] = useState(false)

  const frames = heroFrames
  const many = frames.length > 1

  const advance = useCallback(
    (step) => setActive((current) => (current + step + frames.length) % frames.length),
    [frames.length],
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  // Arm the progress fill one frame after mount so the first tick animates
  // from empty instead of rendering already full.
  useEffect(() => {
    const id = requestAnimationFrame(() => setArmed(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // With one frame there is nothing to advance to, so no timer is armed.
  useEffect(() => {
    if (reduced || !many) return undefined
    const id = setTimeout(() => advance(1), frames[active].hold)
    return () => clearTimeout(id)
  }, [active, frames, reduced, advance, many])

  /* ------------------------------------------------------------------- swipe */

  const pointer = useRef(null)

  const onPointerDown = (e) => {
    pointer.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerUp = (e) => {
    const start = pointer.current
    pointer.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) advance(dx < 0 ? 1 : -1)
  }

  return (
    <section className="gc-hero">
      <div
        className="gc-stage"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointer.current = null
        }}
      >
        {frames.map((frame, i) => (
          <div
            key={frame.src}
            className={`gc-frame${i === active ? ' is-on' : ''}`}
            style={i === 0 ? { backgroundImage: `url(${heroLqip})` } : undefined}
          >
            <div className="gc-kb">
              <picture>
                <source type="image/avif" srcSet={frame.avifSrcSet} sizes="100vw" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.src}
                  srcSet={frame.srcSet}
                  sizes="100vw"
                  alt={frame.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        ))}

        <div className="gc-scrim-grad" />
      </div>

      <div className="gc-hero-mid">
        <h1 className="gc-thesis gc-rise gc-d3">
          Built to host, ready for thousands
        </h1>
        <p className="gc-hero-sub gc-rise gc-d4">
          From 100 to 2000 guests. Weddings, concerts, funeral receptions,
          church programmes and conferences.
        </p>
        <a
          className="gc-hero-cta gc-rise gc-d5"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          Enquire on WhatsApp
        </a>

        {/* The address in the first view, not two sections down. Someone
            deciding whether a venue is worth an enquiry is deciding on where
            it is before anything else, and until now they had to scroll to
            find out. Links to the map so the answer is one tap, not a copied
            street name. */}
        <a
          className="gc-hero-place gc-rise gc-d5"
          href={CONTACT.maps}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          {CONTACT.addressLines.join(', ')}
        </a>
      </div>

      <div className="gc-hero-foot">
        <div className="gc-hero-spaces gc-eyebrow gc-rise gc-d5">
          {SPACES.map((space) => (
            <span key={space.slug}>{space.name}</span>
          ))}
        </div>

        <div className="gc-scroll-cue gc-rise gc-d5" aria-hidden="true">
          <span className="gc-eyebrow">Scroll</span>
          <i />
        </div>

        {many && (
          <div className="gc-ticks gc-rise gc-d5">
            {frames.map((frame, i) => (
              <button
                key={frame.src}
                type="button"
                className={`gc-tick${armed && i === active ? ' is-on' : ''}`}
                style={{ '--gc-hold': `${frame.hold}ms` }}
                aria-label={`Show image ${i + 1} of ${frames.length}`}
                aria-current={i === active}
                onClick={() => setActive(i)}
              >
                <i />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
