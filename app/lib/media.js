// Every image and video the site plays lives in this file.
//
// These are stock photographs standing in for the venue's own material. When
// the real photography arrives, regenerate the derivatives at the same widths
// and update the alt text here — nothing else in the app needs to change.
//
// Stills ship as AVIF with a WebP fallback: AVIF is roughly a third smaller at
// matching quality, which is what buys the 2800w tier without the first paint
// costing more. Every source is cropped to 3:2 at generation time rather than
// left to object-fit, so no viewport is ever handed a third of an image it
// will not show.

const AVIF_W = [900, 1400, 2000, 2800]
const WEBP_W = [900, 1400, 2000]

const set = (name, ext, widths) =>
  widths.map((w) => `/hero/${name}-${w}.${ext} ${w}w`).join(', ')

// One picture, every tier of it. Callers pick their own `sizes`.
//
// `cap` is for sources too small to fill the top tier without upscaling: the
// generator skips those files, so advertising them in the srcset would point
// the browser at a 404. Give it the widest tier that actually exists.
//
// `ladder` replaces the standard widths outright, for a picture generated on
// its own scale — the floral photograph is 1280px and needs tiers below the
// shared ladder's floor, not above it.
const picture = (name, alt, cap = Infinity, ladder) => {
  const avif = (ladder ? ladder.avif : AVIF_W).filter((w) => w <= cap)
  const webp = (ladder ? ladder.webp : WEBP_W).filter((w) => w <= cap)
  return {
    alt,
    avifSrcSet: set(name, 'avif', avif),
    srcSet: set(name, 'webp', webp),
    // The bare src is the no-srcset fallback, so it has to name a file that
    // exists — 1400 when there is one, otherwise the widest there is.
    src: `/hero/${name}-${webp.includes(1400) ? 1400 : webp[webp.length - 1]}.webp`,
  }
}

const shot = (name, alt, hold = 6500, cap) => ({
  kind: 'image',
  hold,
  ...picture(name, alt, cap),
})

export const heroFrames = [
  shot('garden-path', 'A stone path running beside the lawn under mature trees'),
  {
    // Holds longer than the stills — motion needs room to read, and this is
    // the only frame that shows the place actually in use.
    kind: 'video',
    alt: 'White chairs and flowers being set out on the lawn for a wedding',
    hold: 11000,
    // H.264 1920x1080. AV1 was smaller at the same resolution but almost no
    // machine has AV1 hardware decode, and software-decoding 1080p AV1 while
    // the page is also compositing a full-viewport hero drops frames. H.264
    // decodes in hardware essentially everywhere, so it plays smooth.
    src: '/videos/wedding-setup.mp4',
    // A single URL: <video poster> takes no srcset, and the clip is desktop
    // only, so there is nothing smaller to serve.
    poster: '/hero/wedding-poster-1400.webp',
  },
  // Source is 2000px wide, so there is no tier above it.
  shot('garden-beds', 'Clipped hedge beds framing a stretch of open lawn', 6500, 2000),
]

// Tiny inline blur behind the first frame so there is no flash of empty ground
// before it decodes. Later frames dissolve in from an already painted one.
export const heroLqip =
  'data:image/webp;base64,UklGRqAAAABXRUJQVlA4IJQAAABQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JbACdAB+X9PG3q1/P4530pdEwAP7qltaNA3+/gLyAcbYuDQ1600PmOaSzum5EpS7rKZR2YQOeMnBi7L8sOXZUjcp2cx8Y1S7ReiRfysF+ycbYEfCGD2RcUCPzle3DJboAOJW7a6s9o4OrT4LjFwiZ2qOovBdeYc3R6uAA'

// The pictures for each space, in the order they should be seen. The first is
// the one the rail and the page header use; the rest exist only in the gallery
// on the space's own page.
//
// PLACEHOLDER STATUS: all of these are stock standing in for the venue's own
// photography, but every one is at least the KIND of space it is labelled.
//
// The sets are deliberately uneven. Garden and Terrace have three apiece
// because there was honest material for three; Auditorium and Executive Hall have
// one each, and padding them out with grounds shots is exactly the dishonesty
// that was removed earlier. The gallery renders a single-picture set as a plain
// picture with no controls, so one is a legitimate state, not a broken one.
//
// Two caveats worth knowing before these ship: the auditorium frame is
// deliberately defocused (a stock shot of an audience), and the hall is a 3D
// render rather than a photograph.
const SPACE_PICTURES = {
  garden: [
    picture('lawn-tree', 'An open lawn running out to a mature tree'),
    picture('garden-path', 'A stone path running beside the lawn under mature trees'),
    // Source is 2000px wide, so there is no tier above it.
    picture('garden-beds', 'Clipped hedge beds framing a stretch of open lawn', 2000),
  ],
  auditorium: [
    picture('auditorium-seating', 'A seated audience in a tiered auditorium'),
  ],
  'executive-hall': [
    // Source is 2700px wide at 3:2, so there is no 2800 tier.
    picture('hall-banquet', 'An enclosed hall laid with round tables for an event', 2000),
  ],
  terrace: [
    picture('terrace-deck', 'An open-air timber terrace looking out over trees and water'),
    picture('terrace-stone', 'A stone terrace with built-in seating under a timber pergola'),
    picture('terrace-seating', 'A paved terrace set with low seating and planting'),
  ],
}

// Portrait crops for the home-page cards, on their own ladder — the cards are
// never wider than a quarter of the container, so the shared 900-2800 ladder
// would only ever hand them a file far larger than the slot.
const CARD_LADDER = { avif: [480, 760, 1100], webp: [480, 760, 1100] }

const SPACE_CARDS = {
  garden: picture('card-garden', 'An open lawn running out to a mature tree', 1100, CARD_LADDER),
  auditorium: picture('card-auditorium', 'A seated audience in a tiered auditorium', 1100, CARD_LADDER),
  'executive-hall': picture('card-mini-hall', 'An enclosed hall laid with round tables for an event', 1100, CARD_LADDER),
  terrace: picture('card-terrace', 'An open-air timber terrace looking out over trees and water', 1100, CARD_LADDER),
}

export const spaceCard = (slug) => SPACE_CARDS[slug]

// Every picture for a space, for the gallery.
export const spaceGallery = (slug) => SPACE_PICTURES[slug] || []

// The one that represents the space wherever only one will fit.
export const spaceImage = (slug) => SPACE_PICTURES[slug][0]

// The banner on /catering. Same source as the Executive Hall's picture, cropped
// tight on the laid tables so it reads as the meal rather than as the room —
// reusing a frame is only cheap when it is the same frame. Source crop is
// 2025px wide, so the ladder stops at 2000.
export const cateringBanner = picture(
  'catering-table',
  'Round tables laid with place settings and flowers for a banquet',
  2000,
)

// The banner on /beverages, and the tall glass that sits beside the list. The
// glass keeps its 2:3 crop — the drink fills the frame top to bottom, and
// squaring it off to match every other picture on the site would cut the glass
// in half to no purpose. Both stop at the widths generated for them.
export const beveragesBanner = picture(
  'drinks-banner',
  'A tall pineapple drink garnished with fruit, beside a whole pineapple',
)

export const beveragesGlass = picture(
  'drinks-glass',
  'A glass of freshly pressed pineapple juice with a wedge of pineapple',
  1400,
)

// The banner on /floral. Theirs now, not stock — a bridal bouquet they made,
// sent 2026-08-28. The stock bed of flowers it replaces is gone.
//
// SOFT ON DESKTOP, KNOWINGLY. The source is 540x960: a WhatsApp-compressed
// phone frame, and WhatsApp is where the compression happened, not the camera.
// A full-bleed banner on a 1920px screen wants about 3.5x that width, so the
// 1080 tier here is a 2x Lanczos upscale and the browser stretches it further
// again. Baby's breath is the worst subject there is for that — it is all
// high-frequency detail, and upscaling turns it to porridge.
//
// It is shipped anyway because a real bouquet of theirs beats a stock bed of
// gerberas, which is the whole point the client has been making. Ask them for
// the original off the phone (it will be 3000px+) and regenerate these four
// files at the shared ladder; nothing else has to change.
//
// Cropped square, at 540x540 off the middle: the page hero is full bleed and
// object-fit covers it, so a square sits between what a phone crops to
// (portrait) and what a desktop crops to (a wide band) without losing the
// bouquet at either end.
export const floralBanner = picture(
  'floral-bouquet',
  'A bridal bouquet of white roses and baby\'s breath, tied with green ribbon',
  Infinity,
  { avif: [540, 1080], webp: [540, 1080] },
)

// The venue's own arrangement, photographed by them and sent 2026-08-27. The
// only genuine Gig Cottage photograph on the site — everything else here is
// stock standing in.
//
// Cropped hard, and that is the whole story of it. The source is a 1280px
// phone frame with a yellow chair, floor tiles and a set of car keys around
// the edges — which is why the v1 build's version of this picture was pulled
// rather than shown. What survives the crop is 740px of arrangement, so it is
// contained beside the list instead of run full bleed: at that width it is
// sharp, and a banner would upscale it half again to prove it was not.
export const floralWork = picture(
  'floral-work',
  'An arrangement of red ginger, white and pink roses in a basket, ringed with broad glossy leaves',
  Infinity,
  { avif: [480, 740], webp: [480, 740] },
)

// The mark itself, used full size by the intro and small in the header bar.
export const wordmark = {
  src: '/smallgiglogo.avif',
  width: 865,
  height: 400,
}
