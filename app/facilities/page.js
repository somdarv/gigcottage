import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Facilities from '../components/Facilities'

// The facilities index. It used to open on a full-bleed photograph with the
// name written across it; the client took that off (2026-08-28), so the page
// opens on the name alone, on bone, and hands straight over to the rail. The
// rail is the page — the banner was a fifth picture competing with four.

export const metadata = {
  title: 'Facilities | Gig Cottage',
  description:
    'Four event spaces at Malejor on the Adenta-Dodowa Road: a garden for 2000 guests, a large naturally ventilated auditorium, an air-conditioned executive hall and an open terrace.',
}

export default function FacilitiesPage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Centred, and on bone. The same scale and the same gold full stop
            the banner version had — only the photograph is gone. */}
        <header className="gc-page-head">
          <h1 className="gc-page-head-name">Facilities</h1>
          <span className="gc-page-head-rule" aria-hidden="true" />
        </header>

        <Facilities />
      </main>

      <SiteFooter />
    </>
  )
}
