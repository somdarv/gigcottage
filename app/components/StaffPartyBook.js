'use client'

import { useState } from 'react'
import { STAFF_PARTY } from '../lib/content'
import Dialog from './Dialog'
import { EnquiryFields } from './EnquiryForm'

// What the enquiry form asks when it is booking a staff party. One day, no
// occasion to pick because the occasion is the offer, and the menu in its
// place.
export const PARTY_TOPIC = {
  name: 'Staff party',
  title: 'Book a staff party',
  sub: 'Tell us the date and roughly how many staff. We will come back to you to confirm.',
  opening: 'Hello Gig Cottage, I would like to book a staff party.',
  // Followed by " on 12 Dec 2026" when there is a date, so it has to read as
  // the party being on that day, not the request.
  received: 'We have your request for a staff party',
  reply: 'We will come back to you shortly to confirm.',
  multiDay: false,
  menus: STAFF_PARTY.packages.map((pkg) => `${pkg.name}, GHS ${pkg.price}`),
  guestsLabel: 'Staff',
}

// The section's button and the form behind it. A client island, so the rest
// of the section ships as plain HTML.
export default function StaffPartyBook() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button type="button" className="gc-btn gc-btn--gold" onClick={() => setOpen(true)}>
        {PARTY_TOPIC.title}
      </button>

      <Dialog open={open} label={PARTY_TOPIC.title} onClose={close}>
        <EnquiryFields topic={PARTY_TOPIC} open={open} onClose={close} />
      </Dialog>
    </>
  )
}
