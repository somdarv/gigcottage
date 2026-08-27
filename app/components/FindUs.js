'use client'

import { useEffect, useState } from 'react'
import { CONTACT, directionsLink, mapEmbed } from '../lib/content'
import { getConsent } from '../lib/consent'

// Where the venue is, with the map already loaded.
//
// The map is a Google iframe, and Google sets cookies inside it — so this is
// the one thing on the site that contacts a third party without being asked.
// It loads anyway, by decision: a map you have to summon is a map most people
// never see.
//
// What that buys is an obligation, and it is met in two places rather than
// waved at. The cookie notice names it and offers a real opt-out, and anyone
// who takes that gets a link here instead of the embed. Consent is read before
// the iframe is ever rendered, not after — a decline that still fires the
// request is not a decline.

export default function FindUs() {
  // null until the stored answer has been read. The iframe is never rendered
  // in that state, so a visitor who declined does not fetch it for one frame
  // before the effect takes it away again.
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    const saved = getConsent()
    setAllowed(!saved || saved.granted.includes('map'))
  }, [])

  return (
    <section className="gc-find" id="find-us" aria-labelledby="gc-find-title">
      <div className="gc-sec-head gc-sec-head--split">
        <h2 className="gc-sec-title" id="gc-find-title" data-gc-reveal>
          Find us
        </h2>
        <p className="gc-sec-lead" data-gc-reveal>
          On the Adenta-Dodowa Road at Malejor, with spacious enclosed parking
          on site.
        </p>
      </div>

      <div className="gc-find-body">
        <div className="gc-find-map" data-gc-reveal>
          {allowed === true && (
            <iframe
              src={mapEmbed()}
              title="Map showing Gig Cottage at Malejor, Accra"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          )}

          {allowed === false && (
            <div className="gc-find-holder">
              <p>
                You chose not to load third-party content, so the map stays off.
              </p>
              <a
                className="gc-btn gc-btn--gold"
                href={CONTACT.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Google Maps
              </a>
            </div>
          )}
        </div>

        <div className="gc-find-detail" data-gc-reveal-group>
          <div>
            <p className="gc-find-label">Address</p>
            <p className="gc-find-text">
              {CONTACT.addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
          </div>

          <div>
            <p className="gc-find-label">Call us</p>
            <p className="gc-find-text">
              {CONTACT.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`}>
                  {phone.label}
                </a>
              ))}
            </p>
          </div>

          <a
            className="gc-space-cta"
            href={directionsLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get directions
          </a>
        </div>
      </div>
    </section>
  )
}
