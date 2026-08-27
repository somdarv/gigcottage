import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { BEVERAGES, whatsappLink } from '../lib/content'
import { beveragesBanner, beveragesGlass } from '../lib/media'

// Beverages.
//
// Five drinks is the whole list, so the page is built to hold five well rather
// than to look like it holds more. The list takes one column and a picture
// takes the other: padding it out with invented categories, or stretching five
// rows across a full-width block, would both read as a page apologising for
// its own content.

export const metadata = {
  title: 'Beverages | Gig Cottage',
  description:
    'Freshly squeezed juice and local drinks at Gig Cottage, Malejor — pineapple and mint, pineapple and ginger, pineapple and passion fruit, bissap and liha.',
}

export default function BeveragesPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <header className="gc-page-hero">
          <picture>
            <source
              type="image/avif"
              srcSet={beveragesBanner.avifSrcSet}
              sizes="100vw"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beveragesBanner.src}
              srcSet={beveragesBanner.srcSet}
              sizes="100vw"
              alt={beveragesBanner.alt}
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          <div className="gc-page-hero-cap">
            <h1 className="gc-page-hero-name">Beverages</h1>
            <span className="gc-page-hero-rule" aria-hidden="true" />
          </div>
        </header>

        <section className="gc-menu-sec" aria-labelledby="gc-drinks-title">
          <div className="gc-sec-head gc-sec-head--split">
            <h2 className="gc-sec-title" id="gc-drinks-title" data-gc-reveal>
              Our Drinks
            </h2>
            <p className="gc-sec-lead" data-gc-reveal>
              Pressed and mixed on the day, and served alongside the catering or
              on their own. Order for your event and we will have them ready.
            </p>
          </div>

          <p className="gc-menu-note" data-gc-reveal>{BEVERAGES.note}</p>

          <div className="gc-drinks">
            <ul className="gc-drink-list" data-gc-reveal-group>
              {BEVERAGES.drinks.map((drink) => (
                <li className="gc-drink" key={drink}>
                  {drink}
                </li>
              ))}
            </ul>

            <div className="gc-drinks-media" data-gc-reveal="media">
              <picture>
                <source
                  type="image/avif"
                  srcSet={beveragesGlass.avifSrcSet}
                  sizes="(min-width: 900px) 42vw, 100vw"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={beveragesGlass.src}
                  srcSet={beveragesGlass.srcSet}
                  sizes="(min-width: 900px) 42vw, 100vw"
                  alt={beveragesGlass.alt}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </div>

          <div className="gc-course-cta">
            <a
              className="gc-space-cta"
              href={whatsappLink(
                'Hello Gig Cottage, I would like to order drinks for an event.',
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order beverages
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
