import { notFound } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '../../components/SiteHeader'
import SiteFooter from '../../components/SiteFooter'
import FacilityGallery from '../../components/FacilityGallery'
import EnquiryForm from '../../components/EnquiryForm'
import { SPACES, spacePath } from '../../lib/content'
import { spaceGallery } from '../../lib/media'

// The reading end of a facility. The rail on /facilities carries one picture
// and the name; everything that has to be read rather than glanced at is here.
//
// No <Intro> on these pages: the wordmark's moment is the arrival on the home
// page, and replaying it on every navigation would turn a flourish into a toll.

export function generateStaticParams() {
  return SPACES.map((space) => ({ slug: space.slug }))
}

export function generateMetadata({ params }) {
  const space = SPACES.find((s) => s.slug === params.slug)
  if (!space) return {}
  return {
    title: `${space.name} | Gig Cottage`,
    description: `${space.note} ${space.guests} guests at Malejor on the Adenta-Dodowa Road.`,
  }
}

const Chevron = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

export default function FacilityPage({ params }) {
  const space = SPACES.find((s) => s.slug === params.slug)
  if (!space) notFound()

  const at = SPACES.indexOf(space)
  const previous = SPACES[(at - 1 + SPACES.length) % SPACES.length]
  const next = SPACES[(at + 1) % SPACES.length]

  return (
    <>
      <SiteHeader />

      <main className="gc-detail">
        <div className="gc-detail-head">
          <Link className="gc-back" href="/facilities">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
            All facilities
          </Link>

          <h1 className="gc-detail-name">{space.name}</h1>
          {/* The client's own line where a space has one, the listing
              description where it does not. */}
          <p className="gc-detail-note">{space.lead || space.note}</p>
        </div>

        <div className="gc-detail-media">
          <FacilityGallery pictures={spaceGallery(space.slug)} name={space.name} />
        </div>

        <div className="gc-detail-body">
          <dl className="gc-space-figures">
            {/* dt before dd is what the spec allows; column-reverse puts the
                figure above its label visually. */}
            <div>
              <dt className="gc-label">Guests</dt>
              <dd className="gc-figure">{space.guests}</dd>
            </div>
          </dl>

          <div className="gc-space-lists">
            <div>
              <p className="gc-label gc-list-label">What&rsquo;s included</p>
              <ul className="gc-space-list">
                {space.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            {space.suitedFor.length > 0 && (
              <div>
                <p className="gc-label gc-list-label">Suited for</p>
                <ul className="gc-space-list">
                  {space.suitedFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <EnquiryForm space={space} />
        </div>

        {/* Two arrows rather than a block naming the next space. The names were
            doing nothing the arrows do not, and one of them took a whole band
            of the page to say "Eco-friendly Large Auditorium". */}
        <nav className="gc-detail-pager" aria-label="Facilities">
          <Link
            className="gc-pager-btn gc-pager-btn--prev"
            href={spacePath(previous)}
            aria-label={`Previous facility: ${previous.name}`}
          >
            <Chevron />
            <span>Previous</span>
          </Link>

          <Link className="gc-pager-all" href="/facilities">
            All facilities
          </Link>

          <Link
            className="gc-pager-btn"
            href={spacePath(next)}
            aria-label={`Next facility: ${next.name}`}
          >
            <span>Next</span>
            <Chevron />
          </Link>
        </nav>
      </main>

      <SiteFooter />
    </>
  )
}
