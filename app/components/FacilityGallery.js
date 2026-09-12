'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Every picture of one space, laid out as a justified grid, and a lightbox you
// open to see any of them properly.
//
// It used to be a carousel: one 16:9 cell you cycled with dots and arrows. Two
// things killed it. The sets are 3 to 9 pictures now rather than the 1 they
// were built for, and a carousel hides all but one of those behind a click
// nobody makes. And every picture had to be cut to the cell's shape to fit,
// which took a band off the top and bottom of everything shot at 3:2.
//
// So the grid takes each picture at the shape it was taken. Rows fill the
// width, every picture in a row shares a height, and the row heights differ.
// That is the whole layout, and it is done in CSS with no measuring:
//
//   flex-basis: calc(ratio * a row height)   sets each cell's share of the row
//   flex-grow:  ratio                        spends the remainder in proportion
//   aspect-ratio: ratio                      holds the shape once it lands
//
// Because both the basis and the growth are proportional to the ratio, every
// cell that lands in the same row resolves to the same height. Wide pictures
// take more width than tall ones, which is what makes it read as justified
// rather than as a table.
//
// No captions. Each picture is the same place from another angle, so a line of
// text under every one would be nine ways of writing "the garden" — the space's
// name is already at the top of the page.

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

// A cell is never wider than about 650px, and most land near 400.
const CELL_SIZES = '(min-width: 900px) 42vw, (min-width: 600px) 46vw, 92vw'
const FULL_SIZES = '(min-width: 1400px) 1320px, 100vw'

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

  const current = pictures[index]

  return (
    <>
      <ul className="gc-grid">
        {pictures.map((picture, i) => (
          <li
            className="gc-grid-item"
            key={picture.src}
            style={{ '--gc-r': picture.ratio }}
          >
            <button
              type="button"
              className="gc-grid-btn"
              aria-label={`View picture ${i + 1} of ${count} full size`}
              onClick={() => openAt(i)}
            >
              {/* The first is the page's largest picture above the fold, so it
                  loads eagerly; the rest wait until they are scrolled to. */}
              <Frame picture={picture} sizes={CELL_SIZES} priority={i === 0} />
              <span className="gc-grid-zoom" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M4 9V4h5" />
                  <path d="M20 9V4h-5" />
                  <path d="M4 15v5h5" />
                  <path d="M20 15v5h-5" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="gc-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${name} pictures`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointer.current = null
          }}
        >
          <button
            type="button"
            className="gc-lightbox-close"
            aria-label="Close"
            ref={closeRef}
            onClick={close}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="gc-lightbox-stage">
            <Frame picture={current} sizes={FULL_SIZES} priority full />
          </div>

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

              <span className="gc-lightbox-count" aria-hidden="true">
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
