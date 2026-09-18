'use client'

import { useEffect, useState } from 'react'
import { STAFF_PARTY, offerRunning } from '../lib/content'
import Dialog from './Dialog'
import { EnquiryFields } from './EnquiryForm'
import { PARTY_TOPIC } from './StaffPartyBook'

// The staff party offer as a notice on the home page.
//
// It opens on every load of the home page, reloads included. The user asked
// for that on 2026-09-18, over the once-per-device version. Nothing is stored
// to make it so, which is why the privacy policy still names the cookie
// answer as the only thing kept.
//
// It waits for the intro to clear and the hero to finish assembling, so it
// lands on a finished page rather than over the opening.
//
// Booking turns the notice into the form in place, inside the same overlay,
// so the page behind does not flash between the two.

// The hero's last line finishes rising at about 4.5s.
const OPEN_AFTER = 4600

export default function StaffPartyNotice() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('offer')

  useEffect(() => {
    if (!offerRunning(STAFF_PARTY)) return undefined

    const id = setTimeout(() => {
      // Something else already has the visitor: the menu, or a form they
      // opened from the section. It will open again on the next load.
      if (document.querySelector('.gc-modal:not([hidden]), .gc-menu.is-open')) return
      setOpen(true)
    }, OPEN_AFTER)

    return () => clearTimeout(id)
  }, [])

  const close = () => setOpen(false)

  function seeMenus(e) {
    e.preventDefault()
    close()
    // Once the overlay has gone and the scroll lock with it.
    setTimeout(() => {
      const section = document.getElementById('staff-party')
      const heading = document.getElementById('gc-party-title')
      if (!section || !heading) return
      section.scrollIntoView({ block: 'start' })
      heading.focus({ preventScroll: true })
    }, 0)
  }

  const label = step === 'form' ? PARTY_TOPIC.title : STAFF_PARTY.heading

  return (
    <Dialog open={open} label={label} onClose={close} step={step}>
      {step === 'form' ? (
        <EnquiryFields topic={PARTY_TOPIC} open={open} onClose={close} />
      ) : (
        <div className="gc-promo" tabIndex={-1} data-autofocus>
          <button type="button" className="gc-modal-close" onClick={close}>
            Close
          </button>

          <h2 className="gc-promo-title">{STAFF_PARTY.heading}</h2>
          <p className="gc-promo-lead">{STAFF_PARTY.lead}</p>

          <ul className="gc-promo-pkgs">
            {STAFF_PARTY.packages.map((pkg) => (
              <li key={pkg.name}>
                <p className="gc-promo-name">{pkg.name}</p>
                <p className="gc-pkg-price">
                  <span className="gc-pkg-cur">GHS </span>
                  {pkg.price}
                </p>
                <p className="gc-promo-sum">{pkg.summary}</p>
              </li>
            ))}
          </ul>

          <div className="gc-promo-actions">
            <button
              type="button"
              className="gc-btn gc-btn--gold"
              onClick={() => setStep('form')}
            >
              {PARTY_TOPIC.title}
            </button>
            <a className="gc-party-alt" href="#staff-party" onClick={seeMenus}>
              See both menus
            </a>
          </div>
        </div>
      )}
    </Dialog>
  )
}
