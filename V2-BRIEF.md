# Gig Cottage v2 — Running Brief

Status: direction agreed, not yet built. Stack stays Next 14 + Tailwind.

## Client-approved references

| Ref | What she liked / what we take |
|---|---|
| aman.com | Header treatment, fonts, background + text colours. **Primary palette + type reference.** |
| singita.com | Overall feel — big serif, full-bleed, warm accent on bone |
| romanticgarden.rw | Clickable icon + label tiles that route to each service |
| gig cottage v1 landing | Oversized logo opening — keep, refine |

## Extracted from the references (measured, not guessed)

**Aman** — bg `#f3eee7` (warm bone). Type: Lyon Display Light (display),
Lyon Text Regular (body), Whitney SSm 300/400 (UI/nav). All licensed.

**Singita** — accent `#cb9275` (clay), text `#484848` / `#1f1f1f`,
grounds `#f4f1ec` / `#f1ede6` / `#e0ded9`. Type: Morion (serif), Europa (sans).

Both converge on the same formula: warm bone ground, high-contrast LIGHT serif
display, soft near-black text (never pure black), one desaturated warm accent.

## Proposed tokens

    bone        #f3eee7   page ground (Aman's exact value)
    bone-deep   #e8e1d6   alternating band
    oxblood     #44180f   existing brand — hero/footer ground, headings on bone
    ink         #2a2320   body text (warm near-black, not #000)
    ink-soft    #6e675f   secondary text
    gold        #c9a24a   muted from existing #dfb854 — small doses only
                          (existing gold is too saturated next to bone)

Fonts (free, on Google Fonts, work with next/font):
- Display: **Newsreader** Light — closest free face to Lyon Display, variable
  with an optical-size axis. Alternative for display-only: Instrument Serif.
- Body: Newsreader 400, or Source Serif 4.
- UI / nav / small caps: Inter (stand-in for Whitney SSm).

## Hero — decided

Full-bleed media hero. She wants "images and videos playing all together",
swipe for more, click to enlarge.

Resolution: ONE stage, cross-dissolving between clips and stills (5-7s each,
slow fade). Reads as everything playing together; loads one asset at a time.
Swipe + lightbox live in the dedicated gallery further down, not in the hero.

Rules: poster frame renders first; `muted loop playsinline`; `preload="none"`
on everything after the first; hero clip capped ~2-3MB; still image only under
`prefers-reduced-motion` and on Save-Data / slow connections. Audience is
mobile-first on Ghanaian mobile data — this is not optional.

## Section order

1. Logo landing — oversized wordmark, scroll-shrinks into Aman-style sticky header
2. Hero media stage (above or merged with 1)
3. The Place — two sentences, Adenta-Dodowa Road (Malejor)
4. Service tiles — Hospitality / Beverages / Catering, romanticgarden.rw pattern:
   thin-line gold icon + serif label, each routes to its section/page.
   NOT the filled clip-art icons from the reference — those cheapen it.
5. G.A.E.T. — Garden, Auditorium, Exec Hall, Terrace. Full-bleed panel each:
   capacity, rate, inclusions, WhatsApp CTA. Descending scale = "large events".
6. Find your space — guest-count slider + event-type chips -> recommends a space
7. Catering — 5 packages + plate builder (pick within allowance, live price)
8. Gallery — swipe + click-to-enlarge lightbox
9. Enquire — date + space + guests + type -> prefilled wa.me deep link
10. Footer — map, directions, both numbers

## Rates & capacity

All published capacities are SEATED (theatre) — client confirmed.

| Space      | Seated  | Rate (GHS) |
|------------|---------|------------|
| Garden     | 1500+   | 20,000     |
| Auditorium | 1000    | 25,000     |
| Exec Hall  | 120 (?) | 6,500 (?)  |
| Terrace    | 100     | 4,000      |

Open: Exec/Mini Hall is 150 @ 6,000 on the old card, 120 @ 6,500 on the new one.
Needs one confirmation.

Catering: Taste 95 / Gathering 140 / Feast 210 / Celebration 280 / Royal 350.
Note: Celebration = Feast + 2 extras for +70. Will look odd side by side on a
pricing page — flag to client.

Contact: 025 744 1441, 020 020 0054 -> wa.me/233257441441, wa.me/233200200054

## Media

Real photos exist but are not in hand. Using internet stock as placeholder.

Discipline: one source, one treatment — warm natural light, no heavy filters,
no obviously-European architecture. All media referenced from a single
`content/media.js` manifest so the swap to real photos is one file, not a
hunt through JSX.

Shot list for her: garden wide at golden hour, auditorium empty + dressed,
exec hall, terrace, one food hero, one detail.

## Cookies

To add. Note: with WhatsApp-only enquiries and no analytics/embeds there is
currently nothing that legally requires consent. Only needed once GA4, Meta
Pixel, or an embedded YouTube/Maps iframe goes in — so build the banner to
GATE those scripts, not to sit there decoratively.

Slim bottom bar (not a modal): bone ground, oxblood text, Accept / Decline,
choice in localStorage, analytics loads only on accept.

## Hero + header mock — approved direction (awaiting client sign-off)

https://claude.ai/code/artifact/740afd7c-0da2-4e9d-ab16-e0a3e9f1a008

Signature move: the wordmark opens LARGE and centred over the venue footage,
then shrinks and docks into the header centre as you scroll, crossfading from
a bone silhouette to full colour as the bar turns bone. Gives her the big bold
logo AND the media hero in one gesture instead of stacking two heroes.

Built with the real v1 venue media (6 stills + the 15s clip), not stock.
Stills resized 4500px -> 1600px WebP q75: 359KB total for all six.
Type: Newsreader 200/300 + Source Sans 3. Single-theme by intent.

## Built — hero + header shipped into the Next app

New:
  app/lib/media.js          hero frames + wordmark. THE swap point for real photos.
  app/lib/content.js        spaces, rates, contact, whatsappLink()
  app/components/SiteHeader.js  header, morphing wordmark, menu overlay
  app/components/Hero.js        cross-dissolve stage, ticks, swipe, video gating
  public/hero/*.webp        18 derivatives (6 shots x 900/1600/2400), 1.2MB total
  public/logo-bone.png      bone silhouette wordmark for the dark hero

Changed: globals.css (tokens + gc- chrome), layout.js (fonts, metadata),
tailwind.config.js (v2 palette), page.js (old logo block -> SiteHeader + Hero).

Montserrat stays the body default so the v1 sections below the hero are
untouched. New chrome opts into Newsreader/Source Sans explicitly.

Decisions worth remembering:
- Wordmark morph couples via #gc-wm-anchor in the hero; no anchor = starts docked.
- SiteHeader writes --gc-p (hero scroll progress) to <html>; the hero fades its
  own copy in pure CSS off that. One scroll listener for the whole chrome.
- The clip is gated: >=768px AND not saveData AND not 2g, mounted 2s after load.
  When gated off it is FILTERED OUT of the rotation, not swapped for its poster
  (its poster is frame 0's photo — showing it would play a picture twice).
- Hero images are pre-generated, not run through next/image. 4500px sources
  through the optimizer on shared cPanel is expensive on every cold hit.
- Newsreader has no metric overrides in Next 14, so adjustFontFallback is off
  with an explicit Georgia fallback.

Verified: build exits 0, no warnings; prod server serves 6 frames + 7 preloads;
React auto-preloads frame 0 with the full srcset.

## Revision 2 — new media, adaptive header, intro splash

MEDIA (replaces the v1 location photos in the hero):
  garden-path   from grassland-landscape-...jpg   4000x2670, bright sky
  garden-lawn   from 1735.jpg                     2000x1333, overcast
  wedding-setup from 519548_Arranging_White_1920x1080.mp4
                white chairs + flowers on a lawn, 17.4s
                24.9MB -> 4.05MB  (1280w, 24fps, hqdn3d, x264 crf30, faststart)
                encoded with the ffmpeg bundled under EaseUS Data Recovery
                Wizard \VideoViewer — there is no ffmpeg on PATH.
  The v1 gigloc*.webp and gigvideo.mp4 are untouched; the Swiper gallery
  below the hero still uses them.

ADAPTIVE HEADER CONTRAST (app/lib/luminance.js):
  Samples the strip of hero behind the header and flips Menu / Enquire between
  bone and oxblood type. Sampled PER SIDE, because they genuinely disagree —
  on garden-path at 1440x900 the left reads 0.698 (bright sky) and the right
  0.297 (canopy). One verdict for the whole bar would be wrong on one side.

  The decision is made against what is actually on screen, so the module
  models both hero overlays: the oxblood soft-light tint and the vertical
  gradient, in gamma-encoded sRGB (the space CSS blending works in). The
  gradient stops are duplicated in globals.css — CHANGE BOTH.

  Top of the gradient dropped from .50 to .14 alpha; at .50 nothing could ever
  read as bright and the feature would never fire. Legibility insurance is now
  an adaptive text-shadow instead.

  Hysteresis 0.48 / 0.58 so a pan across dappled canopy cannot strobe the bar.
  Re-sampled on frame change (650ms into the dissolve, so colour moves with the
  picture), on scroll, on resize, and every 700ms while the clip plays.

INTRO (app/components/Intro.js) — replaces the docking wordmark:
  Wordmark holds alone on bone, then dissolves into the hero at 1.35s, clear by
  2.1s. Pure CSS with a forwards fill, so it clears itself even if JS never
  runs; React only unmounts it after. Hero copy delays retimed to 1.55-2.3s so
  the hero assembles as the overlay goes rather than being already finished.
  Scroll lock is added by JS only, so a hydration failure cannot strand it.

  THE HEADER NOW CARRIES NO LOGO AT ALL. Per client. Consequence worth raising:
  after the intro there is no wordmark anywhere above the fold. Option if she
  wants it back: reveal a small wordmark only in the docked (bone) bar.

Removed: public/logo-bone.png (was for the old morphing wordmark).
Verified: build exits 0, no warnings; contrast verdicts checked against the
real files at desktop and phone viewports; all new assets serve 200.

## Revision 3 — vignette out, menu fix, bolder hero, higher-res media

VIGNETTE REMOVED. .gc-scrim-tint (oxblood soft-light @55%) is gone; the
gradient is now neutral rgba(18,16,14) shading with no colour cast. The
greens read as green again. luminance.js lost its soft-light model with it,
and the thresholds moved .48/.58 -> .50/.60 because every frame reads
brighter once the tint is off. Re-verified against all frames at desktop and
phone: bright sky .766, overcast .747, canopy .271-.461. Correct throughout.

MENU CONTRAST BUG — root cause: .gc-hdr-btn sets `color: inherit`, which a
<button> needs to escape the UA stylesheet. At (0,1,0) it TIED with the bare
.gc-hdr-cell rule and won on source order, pinning Menu to one colour. The
right-hand links were unaffected because they inherit from their wrapper.
Fixed by scoping the base to `.gc-hdr .gc-hdr-cell` (0,2,0). Verified in the
built CSS, not just the source.

HERO TYPE. Thesis 200 -> 300 and up to clamp(1.85rem, 4.6vw, 3.9rem); eyebrow
and space names to 600; two-layer text-shadow on .gc-hero-mid and
.gc-hero-foot. Newsreader 200 is lovely on bone and vanishes over moving
photography — this is the trade for a media hero.

COPY, now selling scale rather than atmosphere:
  "Room for the whole guest list."
  "Up to 1,500 seated across four spaces — weddings, concerts, church
   programmes, graduations and conferences."

HIGHER RESOLUTION + FASTER, which are not in tension here:
  Stills: AVIF primary + WebP fallback via <picture>, generated from the
  ORIGINALS rather than re-compressing the webp. Ceiling 2400w -> 2800w while
  the 1440px-laptop first paint went 291KB -> 186KB.

  Video: AV1 1920x1080 @ 4.58MB replaces H.264 1280x720 @ 4.05MB — 2.25x the
  pixels for the same bytes. H.264 1440x810 @ 3.34MB stays as fallback.
  Source picked in JS via canPlayType, because <source> negotiation only
  rejects on declared type and never on an actual decode failure.
  No AV1 hardware on this machine, so libaom -cpu-used 5, ~4.5 min one-time.

  Cache-Control: Next serves /public with no-cache, so the hero was being
  re-downloaded on every visit. next.config.mjs now sets immutable one-year
  caching on /hero and /videos — filenames carry width and codec, so a changed
  asset is always a new URL.

TRIED AND DROPPED: a manual LCP preload for the AVIF srcset. Wrapping the img
in <picture> stops React auto-preloading it, but neither a hand-written <link>
nor ReactDOM.preload hoists into <head> on Next 14 — both land in <body>. Not
worth it: the img is in the initial HTML with fetchPriority="high", and a
preload whose srcset missed the chosen <source> would fetch the frame twice.

STILL IN public/: gigvideo.mp4 (5.9MB), the v1 clip. Nothing references it now
that the hero uses the wedding footage — 5.9MB recoverable on your say-so.

## Gotcha: "reload shows raw HTML" is a stale .next, not a CSS bug

Symptom: page reloads unstyled, images only. Actually an HTTP 500 —
  Error: Cannot find module './vendor-chunks/@swc.js'
The browser was rendering a bare error page, hence "raw html".

Cause: Next reuses .next incrementally. If a build is interrupted, or
next.config.mjs changes across rebuilds, or a running server holds files open
on Windows, webpack-runtime.js from one build can end up requiring vendor
chunks another build produced. `next build` still exits 0 — the mismatch only
shows at request time.

Fix locally:  npm run build:clean   (added to package.json)
Fix on deploy: .github/workflows/deploy.yml now wipes .next before building,
keeping .next/cache so the build stays inside command_timeout. This mattered —
.next is gitignored so `git reset --hard` never cleaned it, and with
cancel-in-progress:true a cancelled run leaves half-written output for the
next deploy to build on top of.

If it ever recurs, wipe .next/cache too.

## Revision 4 — typographic wordmark, smooth video, hero fixes

WORDMARK BACK IN THE HEADER, but set in TYPE, not the logo image — the logo
mark still gets the intro and does not return. "GIG COTTAGE" in Cormorant
Garamond, letterspaced caps. Cormorant is the Google stand-in for the display
serifs on the two references (Lyon / Morion). Header moved from flex
space-between to a 1fr/auto/1fr grid so the name centres on the VIEWPORT, not
on the gap between Menu and Enquire. text-indent equal to the tracking, or
uppercase letter-spacing leaves it visibly left of centre.
Contrast sampling now has THREE cells (left / mid / right) — the wordmark can
need a different colour from Menu and Enquire on the same frame.

VIDEO JUDDER — my error. AV1 was chosen for bytes, but almost nothing has AV1
hardware decode, so it was software-decoding 1080p while the page composited a
full-viewport hero. Now H.264 1920x1080 crf35, 5.00MB — H.264 has hardware
decode essentially everywhere. AV1 file deleted.
Compounding it: .gc-kb was scaling the video 1.09 -> 1.0 over 9.5s, so the
compositor re-scaled a 1080p surface every frame. Ken Burns is now off for the
video frame only (.gc-frame--video). The clip already moves; the drift was
never doing anything for it.

HERO SUB now two lines: dropped "graduations" and widened 44ch -> 58ch. With
text-wrap:balance that lands as two even lines instead of a ragged three.

MOBILE HERO FOOT stacked (<=820px): ticks on their own centred row, then the
four space names spread edge to edge via justify-content:space-between at full
width. Diamonds hidden — space-between is doing the separating and they only
crowded it. Type steps 9px/.16em, then 8px/.08em under 400px so EXECUTIVE HALL
cannot overflow.

BUILD FLAKINESS SEEN: next/font failed to fetch Cormorant from
fonts.googleapis.com twice, then succeeded, while curl reached it fine the
whole time. Node's fetcher, not connectivity. Relevant to deploys — a failed
font fetch fails the build under `set -e`. Keeping .next/cache (rev-3 deploy
change) means only a cache-cold build is exposed.

## Revision 5 — the body sections

BUILT (all server components — none of them ship JS):
  ThePlace.js      one paragraph and out, the way the references earn their calm
  ServiceTiles.js  the romanticgarden.rw pattern, hairline icons not clip-art
  Spaces.js        THE PRODUCT. Four panels, descending capacity
  SiteFooter.js    oxblood, with the name large in Cormorant

REMOVED (superseded): SmallMenu.js, Services.js (v1), GetInTouch.js,
FloralModal.js, the Swiper gallery block, public/rose.png, public/flower.avif.
swiper and react-icons are now unimported — still in package.json, worth
pruning on the next deploy pass.

page.js lost its 'use client'. Only Intro, SiteHeader and Hero need the
browser now, so First Load JS went 128 kB -> 91.2 kB.

DESIGN CALLS:
- Capacity set LARGE per panel, so reading down the page gives
  1,500+ / 1,000 / 120 / 100. That is the scale argument, and scale is what
  this venue sells. No chart needed.
- Panels alternate via :nth-of-type(even), not :nth-child — the section's
  first child is its header, which would have thrown the rhythm off by one.
- Each panel's CTA carries its own context into WhatsApp: "...hiring the
  Garden (1,500+ seated)". The enquiry arrives already qualified.
- The four anchors (#garden #auditorium #executive-hall #terrace) mean the
  header menu overlay finally goes somewhere.
- Service tiles reveal their "Enquire" cue on hover, and unconditionally under
  @media (hover: none) — nothing hovers on a phone.

HONESTY NOTES:
- Only the Garden panel shows the space it is labelled. The other three are
  other angles of the same grounds. Alt text stays neutral ("The grounds at
  Gig Cottage") so the page never claims to show a room it is not showing.
  THE CLIENT NEEDS TO SHOOT: auditorium interior, executive hall, terrace.
- The Terrace has no documented "suited to" list on any rate card, so that
  block is omitted for it rather than invented. suitedFor: [] in content.js.
- The `note` line on each space is light editorial drawn from documented
  inclusions — reviewable copy, not fact from the cards.

STILL TO BUILD: gallery (swipe + lightbox), "find your space" guest-count
picker, catering packages + plate builder, and the enquiry form that prefills
WhatsApp with date/space/guests.

## HOUSE RULES (apply to every section from here on)

1. NO EM OR EN DASHES anywhere in rendered copy. Not in body text, not in
   headings, not in metadata, not in the address. Use a full stop, a comma, or
   a plain hyphen. "Adenta-Dodowa Road" takes a hyphen, which is how the rate
   cards write it anyway. Code comments are not the website and are exempt.

2. NO EYEBROWS. No small letterspaced caps label sitting above a heading or a
   paragraph to announce it. Sections introduce themselves.

   .gc-eyebrow survives for exactly two things, both in the hero foot: the row
   of space names and the scroll cue. Neither is a label above content.

   Labels that genuinely carry information (Seated, Rate, "What's included",
   footer and menu column headings) keep their words but use .gc-label:
   serif, sentence case, reading size, no tracking. They read as part of the
   text instead of hovering above it.

## Revision 6 — house rules applied

Removed: "The Place" label, "Our Facilities" label, the hero's address
eyebrow, the "Enquire" hover cue on the service tiles, and the now-dead CSS
for each. CONTACT import dropped from Hero.js with the address.

Converted to .gc-label: Seated / Rate, "What's included" / "Suited to",
footer column headings, menu overlay column headings. List labels went gold ->
oxblood so they still out-rank the ink-soft items beneath them.

THE PLACE rewritten and rebuilt. Losing the label column freed the width, so
the measure went 34ch -> 70ch and the type up to clamp(1.3rem, 2.5vw, 2.1rem).
Copy tightened to a pure summary, which lands it at three lines instead of
five. Its two-column grid is now a single column, as is .gc-sec-head.

Verified: zero em/en dashes and zero &mdash;/&ndash; in the served HTML.

NOTE: the adaptive header-contrast system (luminance.js and the
:root[data-gc-hero-*] rules) was removed outside this session; the header now
sits on solid bone from the top. Nothing is orphaned, and .gc-hdr-cell is
still the base colour rule.

## Revision 7 — scroll reveal on the body sections

Soft fade-and-rise as each block enters view. 24px travel, 1.15s,
cubic-bezier(.22,1,.36,1) — decelerating with no overshoot, so blocks arrive
and stop rather than bouncing. Fires once per element, then unobserves.

TWO MARKUP HOOKS, no component per section:
  data-gc-reveal        the element itself reveals
  data-gc-reveal-group  its CHILDREN reveal, cascading 95ms apart

The group hook is what makes it flow. One observer entry per block, and the
children stagger in CSS via :nth-child setting --gc-reveal-delay, so a whole
panel body cascades off a single intersection instead of five elements each
firing whenever they personally cross the line.

data-gc-reveal="media" is slower still (1.55s) and comes from scale(1.03), so
pictures feel heavier than the type beside them. .gc-space-media got
overflow:hidden so that overscale cannot nudge the layout.

WHY IT IS AN INLINE SCRIPT IN layout.js AND NOT A COMPONENT:
The hiding class has to be on <html> before the sections paint, or every block
flashes in at full opacity and then jumps back to animate. A useEffect runs too
late for that. Inline in <body> it executes during parse, before the sections
below it exist.

It also makes the failure mode safe. The hidden state is scoped to
.gc-reveal-ready, and only that script adds it — so no JS means no class means
everything renders visible. Reduced motion bails before the class is added,
and there is a matching media query as a second guard. Verified: the
server-rendered <html> does not carry the class.

Revealed: The Place (2 children), the service tiles (3), the spaces section
title, and per space panel the media and the body (5 children: name, note,
figures, lists, CTA). Footer wordmark, columns and baseline.
