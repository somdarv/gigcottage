import Intro from './components/Intro'
import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'
import StaffParty from './components/StaffParty'
import ThePlace from './components/ThePlace'
import ServiceTiles from './components/ServiceTiles'
import FacilityCards from './components/FacilityCards'
import FindUs from './components/FindUs'
import SiteFooter from './components/SiteFooter'

// Rebuilt hourly rather than once per deploy. The staff party section ends on
// a date, and a page built once would carry it into January until somebody
// redeployed.
export const revalidate = 3600

// No 'use client' here any more: only the intro, the header and the hero need
// the browser, so everything below the fold ships as plain HTML. The staff
// party's booking button is the one small exception.
export default function Page() {
  return (
    <>
      <Intro />
      <SiteHeader />
      <main>
        <Hero />
        <StaffParty />
        <ThePlace />
        <ServiceTiles />
        <FacilityCards />
        <FindUs />
      </main>
      <SiteFooter />
    </>
  )
}
