import "./globals.css";
import { Montserrat, Newsreader, Source_Sans_3 } from "next/font/google";
import localFont from "next/font/local";
import Reveal from "./components/Reveal";
import CookieNotice from "./components/CookieNotice";

// The wordmark face, and only the wordmark. Both references set their name in a
// high-contrast display serif — Lyon on aman.com, Morion on singita.com — and
// Cormorant Garamond is the closest thing to either.
//
// SELF-HOSTED, not fetched from Google at build time. next/font/google does not
// fail loudly when its fetcher cannot reach fonts.googleapis.com — it emits a
// metrics-matched local() fallback and the build goes green, so the wordmark
// shipped in Times New Roman with nothing in the output saying so. This is the
// latin subset of the variable face: 37KB, no network in the build path, and
// the same file every deploy.
const cormorant = localFont({
  src: "./fonts/CormorantGaramond-Latin.woff2",
  variable: "--font-cormorant",
  // One variable file spanning the axis, so name the range rather than a weight.
  weight: "300 700",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "Times New Roman", "serif"],
});
// No manual LCP preload here. Wrapping the hero image in <picture> stops React
// auto-preloading it, and neither a hand-written <link> nor ReactDOM.preload
// gets hoisted into <head> on Next 14 — both land in <body>. It buys nothing
// anyway: the <img> is in the initial HTML with fetchPriority="high", so the
// preload scanner finds it in the same parse, and a preload whose srcset did
// not match the chosen <source> would download the frame twice.

// Newsreader is the closest free face to Lyon, which is what aman.com uses and
// what the client approved. The optical-size axis is what keeps it elegant at
// hero scale without going spindly in body copy.
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  axes: ["opsz"],
  display: "swap",
  // Next 14 has no metric overrides for Newsreader, so it cannot auto-generate
  // a size-adjusted fallback. Georgia is the closest widely installed face —
  // declaring it explicitly beats letting it shift against Times.
  adjustFontFallback: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

// Stands in for Whitney SSm on the letterspaced caps: humanist, tall x-height.
const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

// Still the default face for the v1 sections below the hero.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// The hidden state, and nothing else.
//
// It has to be applied BEFORE the sections below are painted, or every block
// flashes in at full opacity and then jumps back to animate — which is why this
// is an inline script and not a React effect. It also means the hidden state
// can never be applied unless JS is really running: no script, no class, and
// every block simply renders visible. Same for reduced motion, which bails
// before the class is added.
//
// The observer that clears it lives in <Reveal>, a client component, because it
// has to be rebuilt on every route change. See the note there.
const REVEAL_SCRIPT = `(function(){
try{
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(!('IntersectionObserver' in window))return;
}catch(e){return}
document.documentElement.classList.add('gc-reveal-ready');
})()`;

export const metadata = {
  title: "Gig Cottage | Event Spaces on the Adenta-Dodowa Road",
  description:
    "Four event spaces at Malejor, Accra. A garden seating 2,000, a large naturally ventilated auditorium, an air-conditioned executive hall and a terrace. Catering, beverages and floral.",
};

export default function RootLayout({ children }) {
  return (
    // The font variables go on <html>, NOT <body>. globals.css builds
    // --gc-display / --gc-serif / --gc-sans on :root, and a custom property
    // cannot read a variable that is only declared on its own child — it
    // resolves to guaranteed-invalid, font-family falls back to whatever body
    // inherits, and every v2 face silently renders as Montserrat.
    <html
      lang="en"
      className={`${montserrat.variable} ${newsreader.variable} ${sourceSans.variable} ${cormorant.variable}`}
    >
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: REVEAL_SCRIPT }} />
        <Reveal />
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}
