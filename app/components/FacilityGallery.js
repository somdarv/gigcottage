'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// The pictures for one space: a frame you cycle, and a lightbox you open to see
// any of them properly.
//
// No captions. Each picture is the same room from another angle, so a line of
// text under every one would be four ways of writing "the garden" — the space's
// name is already at the top of the page.
//
// A set of one renders as a plain picture with no controls. That is a real
// state here, not a degenerate one: two of the four spaces genuinely have a
// single honest photograph so far.

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

const SIZES = '(min-width: 1400px) 1320px, 100vw'

function Frame({ picture, sizes, priority = false, full = false }) {
  return (
    <picture>
      <source type="image/avif" srcSet={picture.avifSrcSet} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={picture.src}
        srcSet={picture.srcSet}
        sizes={sizes}
        alt={picture.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={full ? 'gc-lightbox-img' : undefined}
      />
    </picture>
  )
}

export default function FacilityGallery({ pictures, name }) {
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const count = pictures.length

  const go = useCallback(
    (next) => setIndex(((next % count) + count) % count),
    [count],
  )

  /* -------------------------------------------------------------- lightbox */

  // Where focus came from, so closing puts it back rather than dumping the
  // caret at the top of the document.
  const opener = useRef(null)
  const closeRef = useRef(null)

  const openAt = (i) => {
    opener.current = document.activeElement
    setIndex(i)
    setOpen(true)
  }

  const close = useCallback(() => {
    setOpen(false)
    if (opener.current && opener.current.focus) opener.current.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined

    // The page behind must not scroll while the lightbox is up, and the
    // scrollbar's width has to be given back as padding or the whole layout
    // shifts sideways the moment it opens.
    const gap = window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`

    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(index + 1)
      else if (e.key === 'ArrowLeft') go(index - 1)
    }
    document.addEventListener('keydown', onKey)

    if (closeRef.current) closeRef.current.focus()

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      document.removeEventListener('keydown', onKey)
    }
  }, [open, index, go, close])

  /* ----------------------------------------------------------------- swipe */

  const pointer = useRef(null)
  const moved = useRef(false)

  const onPointerDown = (e) => {
    pointer.current = { x: e.clientX, y: e.clientY }
    moved.current = false
  }

  const onPointerUp = (e) => {
    const start = pointer.current
    pointer.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) {
      // Flagged so the click that follows a swipe does not also open the
      // lightbox — a throw and a tap are different intentions.
      moved.current = true
      go(index + (dx < 0 ? 1 : -1))
    }
  }

  const single = count === 1

  return (
    <>
      <div className={`gc-gal${single ? ' gc-gal--single' : ''}`}>
        <button
          type="button"
          className="gc-gal-view"
          aria-label={`View ${name} pictures full size`}
          onClick={() => {
            if (!moved.current) openAt(index)
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointer.current = null
          }}
        >
          <div
            className="gc-gal-track"
            style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
          >
            {pictures.map((picture, i) => (
              <div className="gc-gal-cell" key={picture.src} aria-hidden={i !== index}>
                <Frame picture={picture} sizes={SIZES} priority={i === 0} />
              </div>
            ))}
          </div>

          <span className="gc-gal-hint" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4 9V4h5" />
              <path d="M20 9V4h-5" />
              <path d="M4 15v5h5" />
              <path d="M20 15v5h-5" />
            </svg>
            View full size
          </span>
        </button>

        {!single && (
          <div className="gc-gal-bar">
            <div className="gc-gal-dots">
              {pictures.map((picture, i) => (
                <button
                  key={picture.src}
                  type="button"
                  className={`gc-gal-dot${i === index ? ' is-on' : ''}`}
                  aria-label={`Show picture ${i + 1} of ${count}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                >
                  <i />
                </button>
              ))}
            </div>

            <div className="gc-gal-nav">
              <span className="gc-gal-count" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
                <i />
                {String(count).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="gc-rail-arrow gc-rail-arrow--prev"
                aria-label="Previous picture"
                onClick={() => go(index - 1)}
              >
                <Chevron />
              </button>
              <button
                type="button"
                className="gc-rail-arrow"
                aria-label="Next picture"
                onClick={() => go(index + 1)}
              >
                <Chevron />
              </button>
            </div>
          </div>
        )}
      </div>

      {open && (
        <div
          className="gc-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} pictures`}
          onClick={(e) => {
            // Only the backdrop closes. Clicking the picture itself should not.
            if (e.target === e.currentTarget) close()
          }}
        >
          <button
            type="button"
            className="gc-lightbox-close"
            ref={closeRef}
            onClick={close}
          >
            Close
          </button>

          <figure className="gc-lightbox-stage">
            <Frame picture={pictures[index]} sizes="100vw" priority full />
          </figure>

          {count > 1 && (
            <div className="gc-lightbox-bar">
              <button
                type="button"
                className="gc-lightbox-arrow gc-lightbox-arrow--prev"
                aria-label="Previous picture"
                onClick={() => go(index - 1)}
              >
                <Chevron />
              </button>
              <span className="gc-lightbox-count">
                {String(index + 1).padStart(2, '0')}
                <i />
                {String(count).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="gc-lightbox-arrow"
                aria-label="Next picture"
                onClick={() => go(index + 1)}
              >
                <Chevron />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
