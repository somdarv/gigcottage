import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { FLORAL, whatsappLink } from '../lib/content'
import { floralBanner } from '../lib/media'

// Floral.
//
// The v1 build's own photograph of an arrangement was here and has been pulled:
// it was a phone snapshot on an office table, with a chair and floor tiles in
// shot, and at page scale that showed. Real beats stock only while the real one
// holds up. If a proper photograph of their work turns up, this is where it
// goes — beside the list, contained, at whatever size it is actually sharp at.

export const metadata = {
  title: 'Floral | Gig Cottage',
  description:
    'Floral arrangements at Gig Cottage, Malejor — wedding bouquets, memorial wreaths, venue decorations and corporate arrangements.',
}

export default function FloralPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <header className="gc-page-hero">
          <picture>
            <source type="image/avif" srcSet={floralBanner.avifSrcSet} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={floralBanner.src}
              srcSet={floralBanner.srcSet}
              sizes="100vw"
              alt={floralBanner.alt}
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          <div className="gc-page-hero-cap">
            <h1 className="gc-page-hero-name">Floral</h1>
            <span className="gc-page-hero-rule" aria-hidden="true" />
          </div>
        </header>

        <section className="gc-menu-sec" aria-labelledby="gc-floral-title">
          <div className="gc-sec-head gc-sec-head--split">
            <h2 className="gc-sec-title" id="gc-floral-title" data-gc-reveal>
              {FLORAL.heading}
            </h2>
            <p className="gc-sec-lead" data-gc-reveal>
              Tell us the occasion and roughly what the room is, and we will put
              something together for it.
            </p>
          </div>

          <p className="gc-menu-note" data-gc-reveal>{FLORAL.note}</p>

          <div className="gc-floral-services">
            <ul className="gc-drink-list gc-floral-list" data-gc-reveal-group>
              {FLORAL.services.map((service) => (
                <li className="gc-drink" key={service}>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="gc-course-cta">
            <a
              className="gc-space-cta"
              href={whatsappLink(
                'Hello Gig Cottage, I would like to enquire about floral arrangements.',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire about floral
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
