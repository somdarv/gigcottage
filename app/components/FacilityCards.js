import Link from 'next/link'
import { SPACES, spacePath } from '../lib/content'
import { spaceCard } from '../lib/media'

// The four spaces as pictures, straight under the service tiles.
//
// The tiles above name what Gig Cottage does; this shows what it actually is.
// A row of hairline icons is a menu, and a menu is a poor argument for a venue
// whose whole case is that it is a beautiful place with room in it.
//
// Below four across the row becomes a horizontal rail rather than wrapping —
// see the note in the stylesheet.
//
// The line above each name is the capacity, not the address — the pattern this
// follows uses a location there, but all four of these are on one property, so
// it would read "Malejor, Accra" four times and say nothing. Sentence case
// rather than letterspaced caps: it is information, not a label.
export default function FacilityCards() {
  return (
    <section className="gc-cards" aria-labelledby="gc-cards-title">
      <div className="gc-sec-head">
        <h2 className="gc-sec-title" id="gc-cards-title" data-gc-reveal>
          Our Facilities
        </h2>
      </div>

      <ul className="gc-card-grid" data-gc-reveal-group>
        {SPACES.map((space) => {
          const card = spaceCard(space.slug)
          return (
            <li key={space.slug}>
              <Link className="gc-card" href={spacePath(space)}>
                <span className="gc-card-media">
                  <picture>
                    <source
                      type="image/avif"
                      srcSet={card.avifSrcSet}
                      sizes="(min-width: 1020px) 24vw, 68vw"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.src}
                      srcSet={card.srcSet}
                      sizes="(min-width: 1020px) 24vw, 68vw"
                      alt={card.alt}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </span>

                <span className="gc-card-meta">{space.guests} guests</span>
                <span className="gc-card-name">{space.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
