'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { SPACES, spacePath } from '../lib/content'
import { spaceImage } from '../lib/media'

// The facilities, shown the way singita.com shows a lodge: one large picture at
// a time with the name written on it, and a way in underneath. Contained rather
// than full bleed on purpose — the bone margin around the frame is most of what
// separates "a considered piece of the page" from "a slideshow".
//
// Nothing here is the detail. Capacities, inclusions and what each space suits
// are a reading job, and they live on the space's own page.

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const HOLD = 7000

export default function Facilities() {
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const [visible, setVisible] = useState(false)
  const count = SPACES.length

  const go = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  )

  /* ------------------------------------------------------------- autoplay */

  const railRef = useRef(null)

  // Only runs while the rail is actually on screen. A carousel cycling in a
  // section nobody is looking at is a timer burning battery and, worse, means
  // arriving at it always lands mid-rotation on whichever slide the clock
  // happened to reach.
  useEffect(() => {
    const rail = railRef.current
    if (!rail || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.35 },
    )
    io.observe(rail)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (held || !visible) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    // Keyed on `index`, so any manual move — arrow, name, swipe — restarts the
    // clock rather than leaving a part-elapsed one to fire immediately after.
    const id = setTimeout(() => go(index + 1), HOLD)
    return () => clearTimeout(id)
  }, [index, held, visible, go])

  // A backgrounded tab throttles timers into a burst on return; parking the
  // rotation while hidden is both cheaper and less startling.
  useEffect(() => {
    const onVisibility = () => setHeld(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  /* ------------------------------------------------------------------ keys */

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    }
  }

  /* ----------------------------------------------------------------- swipe */
  // Same gesture as the hero: a horizontal throw past 44px moves one frame, and
  // anything more vertical than horizontal is left alone so the page can scroll.

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
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
  }

  /* ------------------------------------------------------- neighbour decode */
  // Only the current frame and the one either side are worth decoding early;
  // the rest stay lazy so the section costs one image on arrival.

  const near = (i) =>
    i === index || i === (index + 1) % count || i === (index - 1 + count) % count

  return (
    <section className="gc-fac" id="facilities">
      <div
        className="gc-rail"
        ref={railRef}
        data-gc-reveal
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        <div
          className="gc-rail-view"
          role="group"
          aria-roledescription="carousel"
          aria-label="Our facilities"
          aria-live={held ? 'polite' : 'off'}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointer.current = null
          }}
        >
          <div
            className="gc-rail-track"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {SPACES.map((space, i) => {
              const image = spaceImage(space.slug)
              const on = i === index
              return (
                <figure
                  className="gc-slide"
                  key={space.slug}
                  aria-hidden={!on}
                  aria-label={`${i + 1} of ${count}`}
                >
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={image.avifSrcSet}
                      sizes="(min-width: 1400px) 1320px, 100vw"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.src}
                      srcSet={image.srcSet}
                      sizes="(min-width: 1400px) 1320px, 100vw"
                      alt={image.alt}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      fetchPriority={near(i) ? 'auto' : 'low'}
                      decoding="async"
                    />
                  </picture>

                  <figcaption className="gc-slide-cap">
                    <span className="gc-slide-rule" aria-hidden="true" />
                    <h3 className="gc-slide-name">{space.name}</h3>
                    {/* The figure stands on its own line rather than opening
                        the sentence — the client's instruction, and it is the
                        one thing on the slide anyone is scanning for. */}
                    <p className="gc-slide-figure">{space.guests} guests</p>
                    <p className="gc-slide-note">{space.note}</p>
                    <Link
                      className="gc-slide-cta"
                      href={spacePath(space)}
                      tabIndex={on ? undefined : -1}
                    >
                      View details
                      <Chevron />
                    </Link>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>

        <div className="gc-rail-bar">
          <div className="gc-rail-names">
            {SPACES.map((space, i) => (
              <button
                key={space.slug}
                type="button"
                className={`gc-rail-name${i === index ? ' is-on' : ''}`}
                aria-current={i === index}
                onClick={() => go(i)}
              >
                {space.shortName || space.name}
              </button>
            ))}
          </div>

          <div className="gc-rail-nav">
            <span className="gc-rail-count" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
              <i />
              {String(count).padStart(2, '0')}
            </span>
            <button
              type="button"
              className="gc-rail-arrow gc-rail-arrow--prev"
              aria-label="Previous facility"
              onClick={() => go(index - 1)}
            >
              <Chevron />
            </button>
            <button
              type="button"
              className="gc-rail-arrow"
              aria-label="Next facility"
              onClick={() => go(index + 1)}
            >
              <Chevron />
            </button>
          </div>
        </div>
      </div>

      {/* The same four, in a form you can read down in one pass rather than
          clicking through. Still no detail — that is what the pages are for. */}
      <ol className="gc-fac-list" data-gc-reveal-group>
        {SPACES.map((space) => (
          <li key={space.slug}>
            <Link className="gc-fac-row" href={spacePath(space)}>
              <span className="gc-fac-name">{space.name}</span>
              <span className="gc-fac-note">{space.note}</span>
              <span className="gc-fac-guests">{space.guests} guests</span>
              <span className="gc-fac-go" aria-hidden="true">
                <Chevron />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
