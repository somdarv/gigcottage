import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { FLORAL, whatsappLink } from '../lib/content'
import { floralBanner, floralWork } from '../lib/media'

// Floral.
//
// Their own photograph of an arrangement is back (2026-08-28), cropped past
// the chair and the floor tiles that got the v1 version pulled. It sits beside
// the list, contained, at the width the source is actually sharp at — the note
// on floralWork in lib/media.js has the arithmetic.

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

            {/* Theirs, and the one picture on the site that is genuinely of
                Gig Cottage. */}
            <figure className="gc-floral-media">
              <div className="gc-floral-frame" data-gc-reveal="media">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={floralWork.avifSrcSet}
                    sizes="(min-width: 900px) 42vw, 100vw"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={floralWork.src}
                    srcSet={floralWork.srcSet}
                    sizes="(min-width: 900px) 42vw, 100vw"
                    alt={floralWork.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <figcaption>Arranged at Gig Cottage</figcaption>
            </figure>
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
