import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { CATERING, whatsappLink } from '../lib/content'
import { cateringBanner } from '../lib/media'

// Catering.
//
// The menu and nothing else. The five packages and their per-head prices came
// off at the client's request (2026-08-28), so the page is the food and one
// way to ask about it — what a spread costs is a conversation now.

export const metadata = {
  title: 'Catering | Gig Cottage',
  description:
    'Buffet catering at Gig Cottage, Malejor. Goat stew, palava sauce, light soup, grilled tilapia, waakye and jollof, served with green sauce, shito and Ghanaian salad.',
}

export default function CateringPage() {
  const banner = cateringBanner

  return (
    <>
      <SiteHeader />

      <main>
        <header className="gc-page-hero">
          <picture>
            <source type="image/avif" srcSet={banner.avifSrcSet} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.src}
              srcSet={banner.srcSet}
              sizes="100vw"
              alt={banner.alt}
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          <div className="gc-page-hero-cap">
            <h1 className="gc-page-hero-name">Catering</h1>
            <span className="gc-page-hero-rule" aria-hidden="true" />
          </div>
        </header>

        <section className="gc-menu-sec" aria-labelledby="gc-menu-title">
          <div className="gc-sec-head">
            <h2 className="gc-sec-title" id="gc-menu-title" data-gc-reveal>
              Our Menu
            </h2>
          </div>

          {/* Set apart and set bold: it applies to every buffet on the page,
              so it is not a caption under the menu, it is a term of it. */}
          <p className="gc-menu-note" data-gc-reveal>{CATERING.note}</p>

          <div className="gc-menu-grid" data-gc-reveal-group>
            {CATERING.courses.map((course) => (
              <div
                className={`gc-course${course.wide ? ' gc-course--wide' : ''}`}
                key={course.name}
              >
                <h3 className="gc-course-name">{course.name}</h3>
                <ul
                  className={`gc-space-list${course.wide ? ' gc-space-list--split' : ''}`}
                >
                  {course.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* The one call to action on the page, and it belongs to the menu
              now that the packages table is gone. */}
          <div className="gc-course-cta">
            <a
              className="gc-space-cta"
              href={whatsappLink(
                'Hello Gig Cottage, I would like to enquire about catering for an event.',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Enquire about catering
            </a>
          </div>
        </section>

      </main>

      <SiteFooter />
    </>
  )
}
