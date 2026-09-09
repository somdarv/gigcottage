'use client'

import { useEffect, useRef, useState } from 'react'

// The clip for a space that has one instead of a set of photographs.
//
// It is deliberately NOT the gallery. The gallery is built to cycle frames of
// the same room and open them full size, and neither of those means anything
// for a single 4.9 second loop. Bending the carousel around one video would
// have added a dot bar with one dot and a lightbox onto a portrait clip that
// is already smaller than the slot.
//
// CONTAINED, ON PURPOSE. The source is 360x640 off a phone, by way of a
// messaging app. Run full bleed it would be upscaled about three times and
// look it, so it sits at its own size on a dark ground and stays sharp. The
// width cap below is the native width; raise it only when a better source
// arrives, not to fill the space.
export default function FacilityVideo({ video }) {
  const ref = useRef(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  // Reduced motion stops the loop and hands over the controls rather than
  // hiding the clip: the footage is the only material this space has.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) el.pause()
    else {
      el.play().catch(() => {
        /* autoplay refused; the controls below are the way in */
      })
    }
  }, [reduced])

  return (
    <div className="gc-spacevid">
      <video
        ref={ref}
        className="gc-spacevid-el"
        src={video.src}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduced}
        aria-label={video.alt}
      />
    </div>
  )
}
