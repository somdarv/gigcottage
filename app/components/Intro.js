'use client'

import { useEffect, useState } from 'react'
import { wordmark } from '../lib/media'

// The wordmark's one moment: it holds alone on bone, then dissolves into the
// hero. After this the logo is gone from the chrome entirely — it belongs in
// the body of the site, not pinned to the header.
//
// The fade is a CSS animation with a forwards fill rather than a JS timer, so
// a hydration failure cannot leave the overlay stranded across the page. React
// only unmounts it afterwards to take it out of the tree.
// Must stay past the end of the CSS dissolve (2.4s delay + 0.75s fade), or
// React pulls the overlay out from under its own exit.
const CLEAR_AFTER = 3450

export default function Intro() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('gc-intro-lock')
    const id = setTimeout(() => {
      setDone(true)
      document.documentElement.classList.remove('gc-intro-lock')
    }, CLEAR_AFTER)

    return () => {
      clearTimeout(id)
      document.documentElement.classList.remove('gc-intro-lock')
    }
  }, [])

  if (done) return null

  return (
    <div className="gc-intro" aria-hidden="true">
      <div className="gc-intro-mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={wordmark.src} alt="" width={wordmark.width} height={wordmark.height} />
      </div>
    </div>
  )
}
