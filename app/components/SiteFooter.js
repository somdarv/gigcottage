import Link from 'next/link'
import { CONTACT, SPACES, SERVICES, serviceHref, spacePath, whatsappLink } from '../lib/content'
import { wordmark } from '../lib/media'

// Closes the page the way the intro opened it: the mark, large.
//
// The mark is knocked back to a single colour here rather than shipped as a
// second file. Its script is the same oxblood as this footer's ground, so in
// full colour the word "Gig" simply vanishes and only the palm and COTTAGE
// survive — the filter turns every opaque pixel bone, which keeps the palm's
// fronds as a silhouette and the script legible.
//
export default function SiteFooter() {
  return (
    <footer className="gc-foot" id="contact">
      <div className="gc-foot-top" data-gc-reveal>
        <Link className="gc-foot-mark" href="/" aria-label="Gig Cottage, home">
          {/* alt empty: the link already carries the name. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark.src} width={wordmark.width} height={wordmark.height} alt="" />
        </Link>

      </div>

      <div className="gc-foot-cols" data-gc-reveal-group>
        <div>
          <span className="gc-label gc-foot-label">Reach us on</span>
          {CONTACT.phones.map((phone) => (
            <a key={phone.tel} href={`tel:${phone.tel}`}>
              {phone.label}
            </a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>

        <div>
          <span className="gc-label gc-foot-label">Find us</span>
          <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">
            {CONTACT.addressLines[0]}
            <br />
            {CONTACT.addressLines[1]}
          </a>
        </div>

        <div>
          <span className="gc-label gc-foot-label">Facilities</span>
          {SPACES.map((space) => (
            <Link key={space.slug} href={spacePath(space)}>
              {space.shortName || space.name}
            </Link>
          ))}
        </div>

        <div>
          <span className="gc-label gc-foot-label">Services</span>
          {SERVICES.map((service) => {
            const internal = Boolean(service.href)
            return (
              <a
                key={service.slug}
                href={serviceHref(service)}
                target={internal ? undefined : '_blank'}
                rel={internal ? undefined : 'noopener noreferrer'}
              >
                {service.name}
              </a>
            )
          })}
        </div>
      </div>

      <div className="gc-foot-base" data-gc-reveal>
        <span>&copy; {new Date().getFullYear()} Gig Cottage</span>

        <span className="gc-foot-by">
          Developed and maintained by{' '}
          {CONTACT.developer.url ? (
            <a href={CONTACT.developer.url} target="_blank" rel="noopener noreferrer">
              {CONTACT.developer.name}
            </a>
          ) : (
            CONTACT.developer.name
          )}
        </span>

        <Link href="/privacy">Privacy &amp; Cookies</Link>
      </div>
    </footer>
  )
}
