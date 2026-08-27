import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { CATERING, whatsappLink } from '../lib/content'
import { cateringBanner } from '../lib/media'

// Catering.
//
// The menu comes first and the packages after it. A package is a count —
// "two starters, four mains, six extras" — and a count means nothing until you
// know what there is to count. Read the dishes, then choose how much of the
// table to fill.

export const metadata = {
  title: 'Catering | Gig Cottage',
  description:
    'Buffet catering at Gig Cottage, Malejor. Goat stew, palava sauce, grilled tilapia, waakye and jollof, in five packages from a taste to a feast.',
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

          {/* Set apart and set bold: it applies to every package on the page,
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
        </section>

        <section className="gc-packs" aria-labelledby="gc-packs-title">
          <div className="gc-sec-head gc-sec-head--split">
            <h2 className="gc-sec-title" id="gc-packs-title" data-gc-reveal>
              Packages
            </h2>
            <p className="gc-sec-lead" data-gc-reveal>
              Every package comes from the same kitchen — the difference is how
              much of the table it fills. Choose your dishes from the menu
              above, then the package that holds them.
            </p>
          </div>

          {/* A table, because this is tabular: five packages measured on the
              same three counts and a price. Cards made you compare by moving
              your eye between boxes; a column lets you read straight down. */}
          <div className="gc-table-wrap" data-gc-reveal>
            <table className="gc-table">
              <caption className="gc-sr-only">
                Catering packages, with the number of starters, mains and extras
                in each, and the price.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Package</th>
                  <th scope="col" className="gc-td-num">Starters</th>
                  <th scope="col" className="gc-td-num">Mains</th>
                  <th scope="col" className="gc-td-num">Extras</th>
                  <th scope="col" className="gc-td-end">Price</th>
                </tr>
              </thead>
              <tbody>
                {CATERING.packages.map((pack) => (
                  <tr key={pack.name}>
                    <th scope="row" className="gc-td-name">
                      {pack.name}
                    </th>
                    <td className="gc-td-num">{pack.starters}</td>
                    <td className="gc-td-num">{pack.mains}</td>
                    <td className="gc-td-num">{pack.extras}</td>
                    <td className="gc-td-end gc-td-price">
                      {pack.price}
                      {CATERING.priceUnit && (
                        <span className="gc-td-unit"> {CATERING.priceUnit}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
