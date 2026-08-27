import Intro from './components/Intro'
import SiteHeader from './components/SiteHeader'
import Hero from './components/Hero'
import ThePlace from './components/ThePlace'
import ServiceTiles from './components/ServiceTiles'
import FacilityCards from './components/FacilityCards'
import FindUs from './components/FindUs'
import SiteFooter from './components/SiteFooter'

// No 'use client' here any more: only the intro, the header and the hero need
// the browser, so everything below the fold ships as plain HTML.
export default function Page() {
  return (
    <>
      <Intro />
      <SiteHeader />
      <main>
        <Hero />
        <ThePlace />
        <ServiceTiles />
        <FacilityCards />
        <FindUs />
      </main>
      <SiteFooter />
    </>
  )
}
