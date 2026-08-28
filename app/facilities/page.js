import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import Facilities from '../components/Facilities'

// The facilities index. It used to open on a full-bleed photograph with the
// name written across it, then on the name alone; the client took both off
// (2026-08-28), so the page is now the rail and nothing else. The name still
// exists for screen readers and the document outline — a page whose first
// heading is the name of one of four spaces reads as a page about that space
// — it just is not drawn.

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
        <h1 className="gc-sr-only">Facilities</h1>

        <Facilities />
      </main>

      <SiteFooter />
    </>
  )
}
