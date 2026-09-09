// Every image and video the site plays lives in this file.
//
// Mixed provenance, and the comments below say which is which. The aerial,
// the auditorium, the terrace and the Executive Hall are the venue's own,
// sent 2026-09-09. The garden set is still stock standing in. To swap any of
// them, regenerate the derivatives at the same widths and update the alt text
// here. Nothing else in the app needs to change.
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

// One frame, and it is theirs. The aerial is the only picture that shows the
// whole property at once, which is the thing the headline claims, so it opens
// the site on its own rather than taking a turn in a rotation.
//
// The stock garden stills and the wedding clip that used to sit here are gone.
// Hero keeps the machinery for a set, so a second photograph of theirs is one
// more line in this array and nothing else has to change.
export const heroFrames = [
  shot(
    'lawn-aerial',
    'The lawn, the auditorium and the grounds seen from above',
  ),
]

// Tiny inline blur behind the first frame so there is no flash of empty ground
// before it decodes. Later frames dissolve in from an already painted one.
export const heroLqip =
  'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JbACdMoADg7Jo4KVD/UA0AAD7dVmaxdnW8s0RLPoBY1FxYZOwfV0NCwKGLaFoWiLQCz0it03Q2ts7XkejW68d2mKu5sEe2+8KogfV02/i3Zcac7w0qRMMOF/t8HgxoJdp+SKxy0JyeQCc+E5l6uozfeve5OZr/wAAAA=='

// The pictures for each space, in the order they should be seen. The first is
// the one the rail and the page header use; the rest exist only in the gallery
// on the space's own page.
//
// The sets are deliberately uneven, and one photograph is a finished state
// here rather than a broken one. The gallery renders a single-picture set as
// a plain picture with no controls.
//
// Auditorium and Terrace are the venue's own, one honest frame each. Padding
// them out with grounds shots is exactly the dishonesty that was removed
// earlier, so they stay at one until the client sends more.
//
// Garden is STILL STOCK, all three of it. It is the only space with no
// photography of its own yet, and it is the obvious next thing to ask for.
//
// Executive Hall's entry is the still off their own clip. The gallery shows
// the clip instead of this picture, but the rail and the page header need a
// frame that is not a video, and this is it.
const SPACE_PICTURES = {
  garden: [
    picture('lawn-tree', 'An open lawn running out to a mature tree'),
    picture('garden-path', 'A stone path running beside the lawn under mature trees'),
    // Source is 2000px wide, so there is no tier above it.
    picture('garden-beds', 'Clipped hedge beds framing a stretch of open lawn', 2000),
  ],
  auditorium: [
    picture(
      'auditorium-hall',
      'The auditorium seen across the lawn, open along its length under a pitched roof',
    ),
  ],
  'executive-hall': [
    picture('hall-still', 'The Executive Hall'),
  ],
  terrace: [
    picture(
      'terrace-pavilion',
      'The terrace, a curved roof carried on columns above a tiled floor',
    ),
  ],
}

// The Executive Hall is the one space the client sent moving footage of, and
// they asked for the clip alone rather than the clip beside a still.
//
// SMALL, KNOWINGLY. The source is 360x640: a portrait phone frame that has
// been through a messaging app, at roughly a third of the width the gallery
// slot wants. It plays contained at its own size instead of stretched across
// the slot, for the same reason the floral arrangement below is contained. Ask
// them for the original off the phone and it can run wider.
//
// H.264 in an mp4 at 0.86MB, so it decodes in hardware anywhere and costs
// about a quarter of what the wedding clip did.
const SPACE_VIDEOS = {
  'executive-hall': {
    src: '/videos/executive-hall.mp4',
    // Deliberately plain. Nobody on this side has watched the clip, and a
    // confident description of footage you have not seen is how alt text
    // starts lying. Tighten it once someone has.
    alt: 'A short clip of the Executive Hall',
    width: 360,
    height: 640,
  },
}

// The clip for a space, where there is one.
export const spaceVideo = (slug) => SPACE_VIDEOS[slug] || null

// Portrait crops for the home-page cards, on their own ladder — the cards are
// never wider than a quarter of the container, so the shared 900-2800 ladder
// would only ever hand them a file far larger than the slot.
const CARD_LADDER = { avif: [480, 760, 1100], webp: [480, 760, 1100] }

const SPACE_CARDS = {
  // Garden is the one card still cut from stock.
  garden: picture('card-garden', 'An open lawn running out to a mature tree', 1100, CARD_LADDER),
  auditorium: picture('card-auditorium', 'The auditorium seen across the lawn', 1100, CARD_LADDER),
  'executive-hall': picture('card-mini-hall', 'The Executive Hall', 1100, CARD_LADDER),
  terrace: picture('card-terrace', 'The terrace under its curved roof', 1100, CARD_LADDER),
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
