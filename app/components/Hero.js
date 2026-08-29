'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CONTACT, SPACES, whatsappLink } from '../lib/content'
import { heroFrames, heroLqip } from '../lib/media'

// One stage that cross-dissolves through stills and the wedding clip, rather
// than several videos playing at once — it reads as one continuous piece and
// only ever loads one asset at a time.
export default function Hero() {
  const [active, setActive] = useState(0)
  const [armed, setArmed] = useState(false)
  const [allowVideo, setAllowVideo] = useState(false)
  const [reduced, setReduced] = useState(false)
  const videoRef = useRef(null)

  // When the clip is gated off we drop it from the rotation rather than
  // falling back to its poster — the poster is a frame of the clip, so it
  // would read as a still that never moves.
  const frames = useMemo(
    () => (allowVideo ? heroFrames : heroFrames.filter((f) => f.kind !== 'video')),
    [allowVideo],
  )

  useEffect(() => {
    setActive((current) => Math.min(current, frames.length - 1))
  }, [frames.length])

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

  // The clip is ~4MB. It is worth it on a laptop and it is not worth it on
  // Ghanaian mobile data, so small screens and metered connections keep the
  // stills. Mounting it late also lets the first frame win the bandwidth.
  useEffect(() => {
    if (reduced) return undefined
    const connection = navigator.connection || {}
    const wideEnough = window.matchMedia('(min-width: 768px)').matches
    const cheapEnough =
      !connection.saveData && !/(^|-)2g$/.test(connection.effectiveType || '')
    if (!wideEnough || !cheapEnough) return undefined

    const id = setTimeout(() => setAllowVideo(true), 2600)
    return () => clearTimeout(id)
  }, [reduced])

  useEffect(() => {
    if (reduced) return undefined
    const id = setTimeout(() => advance(1), frames[active].hold)
    return () => clearTimeout(id)
  }, [active, frames, reduced, advance])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (frames[active].kind === 'video') {
      video.muted = true
      try {
        video.currentTime = 0
      } catch {
        /* not seekable yet — it will play from wherever it is */
      }
      video.play().catch(() => {
        /* autoplay refused; the poster stays up, which is fine */
      })
    } else {
      video.pause()
    }
  }, [active, frames])

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
            className={`gc-frame${i === active ? ' is-on' : ''}${
              frame.kind === 'video' ? ' gc-frame--video' : ''
            }`}
            style={i === 0 ? { backgroundImage: `url(${heroLqip})` } : undefined}
          >
            <div className="gc-kb">
              {frame.kind === 'video' ? (
                <video
                  ref={videoRef}
                  src={frame.src}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster={frame.poster}
                  aria-label={frame.alt}
                />
              ) : (
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
              )}
            </div>
          </div>
        ))}

        <div className="gc-scrim-grad" />
      </div>

      <div className="gc-hero-mid">
        <h1 className="gc-thesis gc-rise gc-d3">
          One Property! Multiple Spaces! Endless Possibilities!
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
      </div>
    </section>
  )
}
