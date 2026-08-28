'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CONTACT, SPACES, SERVICES, serviceHref, spacePath, whatsappLink } from '../lib/content'
import { wordmark } from '../lib/media'

// The logo sits in the bar, and the intro plays the same mark full size before
// handing over to it.
//
// The bar sits on solid bone from the top, so the labels hold one colour the
// whole way down and nothing has to be sampled from the hero. is-docked still
// shrinks the height once the hero is behind us.
export default function SiteHeader() {
  const headerRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return undefined

    let queued = false

    function paint() {
      queued = false
      const viewport = window.innerHeight
      // Hero copy fades well before the bar docks, so the two use different ranges.
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, viewport * 0.62)))
      document.documentElement.style.setProperty('--gc-p', p.toFixed(4))
      header.classList.toggle(
        'is-docked',
        window.scrollY > viewport - header.offsetHeight - 8,
      )
    }

    function onScroll() {
      if (queued) return
      queued = true
      requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <header className="gc-hdr" ref={headerRef}>
        <button
          type="button"
          className="gc-hdr-btn gc-hdr-cell gc-hdr-left"
          aria-expanded={menuOpen}
          aria-controls="gc-menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className="gc-rules" aria-hidden="true">
            <i />
            <i />
          </span>
          Menu
        </button>

        <Link className="gc-hdr-cell gc-hdr-mark" href="/" aria-label="Gig Cottage, home">
          {/* alt is empty on purpose: the link already carries the name, and
              labelling both makes a screen reader say it twice. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wordmark.src}
            width={wordmark.width}
            height={wordmark.height}
            alt=""
          />
        </Link>

        <div className="gc-hdr-cell gc-hdr-right">
          {/* Both numbers, not just the first — the footer and the mobile
              menu have always carried the pair and the bar was the one place
              that did not. The second drops out on narrower screens, where
              there is no room for it beside the wordmark. */}
          <span className="gc-hdr-phones">
            {CONTACT.phones.map((phone, i) => (
              <a
                key={phone.tel}
                className={`gc-hdr-btn gc-phone${i > 0 ? ' gc-phone--alt' : ''}`}
                href={`tel:${phone.tel}`}
              >
                {phone.label}
              </a>
            ))}
          </span>
          <a
            className="gc-hdr-btn gc-enq"
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Enquire
          </a>
        </div>
      </header>

      <div
        className={`gc-menu${menuOpen ? ' is-open' : ''}`}
        id="gc-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
      >
        <button type="button" className="gc-menu-close" onClick={() => setMenuOpen(false)}>
          Close
        </button>

        <ol className="gc-menu-list">
          {SPACES.map((space) => (
            <li key={space.slug}>
              <Link href={spacePath(space)} onClick={() => setMenuOpen(false)}>
                <span className="gc-menu-name">{space.name}</span>
                <span className="gc-menu-cap">{space.seated} seated</span>
              </Link>
            </li>
          ))}
        </ol>

        <div className="gc-menu-side">
          <div>
            <span className="gc-label gc-menu-label">Services</span>
            {SERVICES.map((service) => {
              // Same destinations as the tiles: an enquiry, unless the service
              // has somewhere on the site to land.
              const internal = Boolean(service.href)
              return (
                <a
                  key={service.slug}
                  href={serviceHref(service)}
                  target={internal ? undefined : '_blank'}
                  rel={internal ? undefined : 'noopener noreferrer'}
                  onClick={() => setMenuOpen(false)}
                >
                  {service.name}
                </a>
              )
            })}
          </div>
          <div>
            <span className="gc-label gc-menu-label">Enquiries</span>
            {CONTACT.phones.map((phone) => (
              <a key={phone.tel} href={`tel:${phone.tel}`}>
                {phone.label}
              </a>
            ))}
          </div>
          <div>
            <span className="gc-label gc-menu-label">Find us</span>
            <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">
              {CONTACT.addressLines.join(', ')}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
