// Every image and video the site plays lives in this file.
//
// The venue's own photography, sent 2026-09-12: a proper camera shoot, 3400 to
// 5472px on the long edge, covering the grounds, the auditorium, the terrace
// and the Executive Hall. It replaced the phone frames that came through a
// messaging app, and with them every "small, knowingly" note this file used to
// carry. Three banners are still stock and say so: catering, beverages, and the
// bridal bouquet.
//
// To swap any picture, regenerate the derivatives at the same widths and update
// the alt text here. Nothing else in the app needs to change.
//
// Stills ship as AVIF with a WebP fallback: AVIF is roughly a third smaller at
// matching quality, which is what buys the 2800w tier without the first paint
// costing more. Sources are cropped at generation time rather than left to
// object-fit, so no viewport is handed a third of an image it will not show.
//
// The crop is 16:9 for anything a space uses, because that is the ratio of
// both the gallery cell and the rail slide, and every one of those frames came
// off the camera at 16:9. They were cut to 3:2 at first, which threw away a
// band down each side and then lost more to the slot, and on the terrace you
// could see it. Matching the slot means the picture arrives whole.
//
// The hero keeps 3:2. It is the one full-viewport picture on the site, so a
// phone held upright crops it hardest, and the taller frame is what survives
// that.

const AVIF_W = [900, 1400, 2000, 2800]
const WEBP_W = [900, 1400, 2000]

const set = (name, ext, widths) =>
  widths.map((w) => `/hero/${name}-${w}.${ext} ${w}w`).join(', ')

// One picture, every tier of it. Callers pick their own `sizes`.
//
// `cap` is the widest file that exists on disk for this name: the generator
// skips anything above it, so advertising more in the srcset would point the
// browser at a 404. Two reasons a name is capped. A source too small to reach
// the top tier without upscaling is one. The other is deliberate: a picture
// that only ever appears inside the gallery stops at 2000, because the slot is
// 1320px at its widest and 2000 already covers it on a 1.5x screen. The 2800
// tier is for the hero and for the one picture that heads each space.
//
// `ladder` replaces the standard widths outright, for a picture generated on
// its own scale — the cards sit at a quarter of the container and need tiers
// below the shared ladder's floor, not above it.
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

// Two frames, both theirs, and they do different jobs. The aerial is the only
// picture that shows the whole property at once, which is the thing the
// headline claims. The second was taken standing on the grass at the far end,
// and it is what a guest sees walking in. Scale, then arrival.
//
// The hero cross-dissolves on its own once there is more than one frame, so a
// third is one more line here and nothing else.
export const heroFrames = [
  shot(
    'lawn-aerial',
    'The lawn, the auditorium and the grounds seen from above',
  ),
  shot(
    'lawn-open',
    'The lawn from ground level, with the guest block and the terrace along the far side',
  ),
]

// Tiny inline blur behind the first frame so there is no flash of empty ground
// before it decodes. Later frames dissolve in from an already painted one.
export const heroLqip =
  'data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAQBACdASoYABAAPu1iqU2ppaOiMAgBMB2JbACdMoADg7Jo4KVD/UA0AAD7dVmaxdnW8s0RLPoBY1FxYZOwfV0NCwKGLaFoWiLQCz0it03Q2ts7XkejW68d2mKu5sEe2+8KogfV02/i3Zcac7w0qRMMOF/t8HgxoJdp+SKxy0JyeQCc+E5l6uozfeve5OZr/wAAAA=='

// The pictures for each space, in the order they should be seen. The first is
// the one the rail and the page header use, and the only one in the set on the
// full ladder; the rest live inside the gallery and stop at 2000.
//
// Every frame here is the venue's own. The stock lawns are gone, and so is the
// note that used to apologise for them.
const SPACE_PICTURES = {
  garden: [
    // The lawn as its own space, at standing height. The aerial still earns a
    // place at the end of the set — it is the only frame that shows how far the
    // grass runs — but it is no longer doing the introducing.
    picture(
      'garden-open',
      'The open lawn, with palms and the boundary planting along the far edge',
    ),
    picture(
      'garden-traveller',
      'A traveller’s palm at the edge of the lawn, fanned out above the shrubs',
      2000,
    ),
    picture('garden-lawn', 'The lawn from above, planted along its edges', 2000),
  ],
  auditorium: [
    picture(
      'auditorium-hall',
      'The auditorium seen across the lawn, open along its length under a pitched roof',
    ),
    picture(
      'auditorium-urns',
      'The auditorium across the grass, with planted urns in the foreground',
      2000,
    ),
    picture(
      'auditorium-terrace',
      'The auditorium framed between two terrace columns, the lawn running between them',
      2000,
    ),
    picture(
      'auditorium-eaves',
      'The auditorium close to, its open bays and the louvred band under the eaves',
      2000,
    ),
  ],
  'executive-hall': [
    // Their camera, and the room is empty in all three: it was photographed
    // finished but unfurnished, so what these show is the floor, the height and
    // the light rather than a room dressed for an event. A set taken with
    // tables in is the thing to ask for next.
    picture(
      'hall-room',
      'The Executive Hall, a polished dark floor running the width of the room',
    ),
    picture(
      'hall-entrance',
      'The Executive Hall looking towards its entrance, columns to either side',
      2000,
    ),
    // Honestly labelled. This one is the corridor outside the room rather than
    // the room, and the alt text says so instead of calling it the hall.
    picture('hall-lobby', 'The corridor leading into the Executive Hall', 2000),
  ],
  terrace: [
    picture(
      'terrace-pavilion',
      'The terrace, a curved roof carried on columns above a tiled floor',
    ),
    picture(
      'terrace-dusk',
      'The terrace at dusk, the lawn beside it under a pink sky',
      2000,
    ),
    picture(
      'terrace-evening',
      'The terrace colonnade in the evening, the grounds beyond it',
      2000,
    ),
    picture(
      'terrace-urn',
      'A fan palm in a terracotta urn between the terrace columns',
      2000,
    ),
  ],
}

// No space has footage any more. The Executive Hall's clip was here because it
// was the only material that room had; the room is now photographed properly,
// and a 360x640 frame off a messaging app is the weakest thing on that page
// rather than the best. The file is still at /videos/executive-hall.mp4, so
// putting it back is one entry in this object.
const SPACE_VIDEOS = {}

// The clip for a space, where there is one.
export const spaceVideo = (slug) => SPACE_VIDEOS[slug] || null

// Portrait crops for the home-page cards, on their own ladder — the cards are
// never wider than a quarter of the container, so the shared 900-2800 ladder
// would only ever hand them a file far larger than the slot.
const CARD_LADDER = { avif: [480, 760, 1100], webp: [480, 760, 1100] }

// NEVER REGENERATE ONE OF THESE UNDER ITS OWN NAME. A file under /hero is
// served straight off disk by LiteSpeed, and a browser that already holds the
// old bytes keeps showing them: four cards were once swapped for the client's
// own photographs and carried on displaying stock, because the URL had not
// moved. Every name here changed with its picture, and the next swap has to
// change it again.
const SPACE_CARDS = {
  // The same traveller's palm as the card it replaces, re-shot properly. The
  // phone version had power lines across the sky and the compound wall behind
  // it and stopped at 608px; this one is off the camera and crops to 2330px of
  // palm.
  garden: picture(
    'card-garden-traveller',
    'A traveller’s palm at the edge of the lawn',
    1100,
    CARD_LADDER,
  ),
  auditorium: picture(
    'card-auditorium-hall',
    'The auditorium seen across the lawn',
    1100,
    CARD_LADDER,
  ),
  // Cropped up off the floor. A full-height 4:5 box out of this frame was more
  // than half black marble, which read as a dark empty room rather than a hall;
  // this keeps the doorway, the ceiling line and the reflection.
  'executive-hall': picture(
    'card-hall-room',
    'The Executive Hall, its doorway reflected in a polished dark floor',
    1100,
    CARD_LADDER,
  ),
  terrace: picture(
    'card-terrace-pavilion',
    'The terrace under its curved roof',
    1100,
    CARD_LADDER,
  ),
}

export const spaceCard = (slug) => SPACE_CARDS[slug]

// Every picture for a space, for the gallery.
export const spaceGallery = (slug) => SPACE_PICTURES[slug] || []

// The one that represents the space wherever only one will fit.
export const spaceImage = (slug) => SPACE_PICTURES[slug][0]

// The banner on /catering. Stock, and one of the three left. Source crop is
// 2025px wide, so the ladder stops at 2000.
export const cateringBanner = picture(
  'catering-table',
  'Round tables laid with place settings and flowers for a banquet',
  2000,
)

// The banner on /beverages, and the tall glass that sits beside the list. Both
// stock. The glass keeps its 2:3 crop — the drink fills the frame top to
// bottom, and squaring it off to match every other picture on the site would
// cut the glass in half to no purpose.
export const beveragesBanner = picture(
  'drinks-banner',
  'A tall pineapple drink garnished with fruit, beside a whole pineapple',
)

export const beveragesGlass = picture(
  'drinks-glass',
  'A glass of freshly pressed pineapple juice with a wedge of pineapple',
  1400,
)

// The banner on /floral. Theirs, not stock — a bridal bouquet they made, sent
// 2026-08-28.
//
// SOFT ON DESKTOP, KNOWINGLY. The source is 540x960: a WhatsApp-compressed
// phone frame, and WhatsApp is where the compression happened, not the camera.
// A full-bleed banner on a 1920px screen wants about 3.5x that width, so the
// 1080 tier here is a 2x Lanczos upscale and the browser stretches it further
// again. Baby's breath is the worst subject there is for that — it is all
// high-frequency detail, and upscaling turns it to porridge.
//
// The 2026-09-12 shoot did not cover the floral work, so this is one of the few
// pictures that did not get the upgrade the rest of the site did. Ask for the
// originals off the phone (they will be 3000px+) and regenerate these four
// files at the shared ladder.
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

// The venue's own arrangement, photographed by them and sent 2026-08-27.
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
