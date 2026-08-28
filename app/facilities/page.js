import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Facilities from '../components/Facilities'
import { facilitiesBanner } from '../lib/media'

// The facilities index. It opens the way a lodge page opens on singita.com — a
// picture edge to edge with the name written on it — and only then hands over
// to the rail, which is contained. Full bleed then framed is the rhythm; two
// full-bleed blocks in a row would read as one long banner.

export const metadata = {
  title: 'Facilities | Gig Cottage',
  description:
    'Four event spaces at Malejor on the Adenta-Dodowa Road: a garden seating 2,000, a large naturally ventilated auditorium, an air-conditioned executive hall and an open terrace.',
}

export default function FacilitiesPage() {
  const opening = facilitiesBanner

  return (
    <>
      <SiteHeader />

      <main>
        <header className="gc-page-hero">
          <picture>
            <source type="image/avif" srcSet={opening.avifSrcSet} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={opening.src}
              srcSet={opening.srcSet}
              sizes="100vw"
              alt={opening.alt}
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          {/* Centred, not written into the bottom-left corner. The rail
              below inscribes every slide bottom-left, and a page header that
              did the same read as one more slide rather than as the way in. */}
          <div className="gc-page-hero-cap">
            <h1 className="gc-page-hero-name">Facilities</h1>
            <span className="gc-page-hero-rule" aria-hidden="true" />
          </div>
        </header>

        <Facilities />
      </main>

      <SiteFooter />
    </>
  )
}
