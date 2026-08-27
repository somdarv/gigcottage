'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { OPTIONAL, getConsent, saveConsent } from '../lib/consent'

// The notice. Its shape follows what there is to consent to:
//
//   nothing optional  -> one acknowledgement, and copy that says plainly that
//                        the site sets no cookies
//   optional present  -> "Accept all" / "Essential only", the usual pair
//
// So adding a category to OPTIONAL is the whole job when analytics arrives.
export default function CookieNotice() {
  // Never rendered on the server, and not on the first client paint either.
  // The answer lives in localStorage, which the server cannot see, so
  // rendering it in the HTML would flash the notice at everyone who has
  // already dismissed it.
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!getConsent()) setShow(true)
  }, [])

  if (!show) return null

  const answer = (granted) => {
    saveConsent(granted)
    setShow(false)
  }

  const hasOptional = OPTIONAL.length > 0

  return (
    <div className="gc-cookie" role="dialog" aria-label="About cookies on this site">
      <div className="gc-cookie-body">
        <h2 className="gc-cookie-title">About cookies on this site</h2>

        {hasOptional ? (
          <p className="gc-cookie-text">
            This site sets no cookies of its own and shows no advertising. The
            map on the home page is loaded from Google, and Google sets cookies
            inside it. Choose essential only and we will show a link instead.{' '}
            <Link href="/privacy">Read the privacy policy</Link>.
          </p>
        ) : (
          <p className="gc-cookie-text">
            This site sets no cookies — none for analytics, none for
            advertising, none belonging to anyone else. Your answer to this
            notice is the only thing kept, and it stays on your own device.{' '}
            <Link href="/privacy">Read the privacy policy</Link>.
          </p>
        )}
      </div>

      <div className="gc-cookie-actions">
        {hasOptional ? (
          <>
            <button
              type="button"
              className="gc-btn gc-btn--gold"
              onClick={() => answer(OPTIONAL.map((o) => o.id))}
            >
              Accept all
            </button>
            <button type="button" className="gc-btn" onClick={() => answer([])}>
              Essential only
            </button>
          </>
        ) : (
          <button
            type="button"
            className="gc-btn gc-btn--gold"
            onClick={() => answer([])}
          >
            Got it
          </button>
        )}
      </div>
    </div>
  )
}
