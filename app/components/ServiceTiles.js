import { SERVICES, serviceHref } from '../lib/content'

// The tile pattern the client picked out from romanticgarden.rw — icon over a
// label, each one a way in. Theirs are filled clip-art in tan; these are single
// weight hairline drawings, which is the difference between the pattern reading
// cheap and reading considered.
const ICONS = {
  facilities: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M6 34V19l14-9 14 9v15" />
      <path d="M2 34h36" />
      <path d="M15 34V24h10v10" />
      <path d="M20 10V4" />
    </svg>
  ),
  beverages: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M12 6h16l-1.6 10.5A6.6 6.6 0 0 1 20 22a6.6 6.6 0 0 1-6.4-5.5Z" />
      <path d="M20 22v10" />
      <path d="M13.5 34h13" />
    </svg>
  ),
  catering: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M5 27h30" />
      <path d="M8 27a12 12 0 0 1 24 0" />
      <path d="M20 15v-3" />
      <path d="M11 33h18" />
    </svg>
  ),
  floral: (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 18v16" />
      <path d="M13 8c0 5.6 3 9.8 7 9.8s7-4.2 7-9.8c-2.7 1.1-4.9 2.7-7 5.4-2.1-2.7-4.3-4.3-7-5.4Z" />
      <path d="M20 27c-3.3 0-5.8-1.7-6.8-4.6 3.3-.9 5.8.4 6.8 4.6Z" />
    </svg>
  ),
}

export default function ServiceTiles() {
  return (
    <nav className="gc-services" aria-label="Services" id="services" data-gc-reveal-group>
      {SERVICES.map((service) => {
        // The ones without a section of their own land in a WhatsApp enquiry.
        // Give them a section in content.js and they stop doing that.
        const internal = Boolean(service.href)
        return (
          <a
            key={service.slug}
            className="gc-svc"
            // Facilities is skipped here: the spaces section already owns
            // #facilities, and a second element with that id would win or lose
            // the anchor on document order rather than on intent.
            id={internal ? undefined : service.slug}
            href={serviceHref(service)}
            target={internal ? undefined : '_blank'}
            rel={internal ? undefined : 'noopener noreferrer'}
          >
            {ICONS[service.slug]}
            <h3 className="gc-svc-name">{service.name}</h3>
          </a>
        )
      })}
    </nav>
  )
}
