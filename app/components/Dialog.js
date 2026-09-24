'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// The overlay every dialog on the site sits in: the dimmed ground, the page
// held still behind it, Escape or a click on the ground to close, and focus
// handed back to whatever opened it.
//
// Rendered into <body>, not where it is used. A block that is revealed on
// scroll carries a transform and an opacity while it moves, and a fixed
// overlay inside one is positioned against that block and faded with it. The
// staff party button sits in exactly such a block.
//
// What is inside stays mounted while it is closed, hidden rather than removed,
// so a half-filled enquiry is still there when the visitor comes back to it.
//
// On opening, focus goes to whatever inside is marked data-autofocus.
export default function Dialog({ open, label, onClose, children }) {
  const [mounted, setMounted] = useState(false)
  const root = useRef(null)
  const opener = useRef(null)

  // Read by the key handler, which is bound once per opening and would
  // otherwise call whichever onClose was current when it was bound.
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return undefined

    opener.current = document.activeElement

    const gap = window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`

    const onKey = (e) => {
      if (e.key === 'Escape') closeRef.current()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      document.removeEventListener('keydown', onKey)
      const back = opener.current
      if (back && back.focus) back.focus()
    }
  }, [open])

  // Declared after the effect above so the opener is recorded before focus
  // moves off it.
  useEffect(() => {
    if (!open || !root.current) return
    const target = root.current.querySelector('[data-autofocus]')
    if (target) target.focus()
  }, [open, mounted])

  if (!mounted) return null

  return createPortal(
    <div
      ref={root}
      className="gc-modal"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
