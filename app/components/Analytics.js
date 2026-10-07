'use client'

import { useEffect } from 'react'
import { CONSENT_EVENT, hasConsent } from '../lib/consent'
import { GA_ID, track } from '../lib/analytics'

// Loads Google Analytics, and only after the visitor has accepted it.
//
// The script tag is created here rather than written into the HTML, so a
// visitor who declined, or has not answered yet, never requests it. Nothing
// is queued for later either: clicks before consent are simply not counted.

function load() {
  if (window.gtag) return
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)
}

// Calls and WhatsApp are links in the header, the footer, the hero and the
// service pages. One listener on the document catches them all, including any
// added later, without each component knowing analytics exists.
function onClick(e) {
  const link = e.target.closest && e.target.closest('a[href]')
  if (!link) return
  const href = link.getAttribute('href')

  if (href.startsWith('tel:')) {
    track('phone_call', { phone_number: href.slice(4) })
  } else if (href.includes('wa.me/')) {
    track('whatsapp_click', { link_text: link.textContent.trim().slice(0, 100) })
  }
}

export default function Analytics() {
  useEffect(() => {
    if (hasConsent('analytics')) load()

    const onAnswer = (e) => {
      if (Array.isArray(e.detail) && e.detail.includes('analytics')) load()
    }
    window.addEventListener(CONSENT_EVENT, onAnswer)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener(CONSENT_EVENT, onAnswer)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
