// Every image the site shows lives in this file.
//
// The venue's own photography, sent 2026-09-12: a proper camera shoot, 3400 to
// 5472px on the long edge, covering the grounds, the auditorium, the terrace
// and the Executive Hall. Twenty-five of the twenty-six frames are placed. The
// twenty-sixth, GIG-OUT11, is a second press of the shutter on GIG-OUT10 and is
// left out rather than shown twice.
//
// Three banners are still stock and say so: catering, beverages, and the bridal
// bouquet.
//
// To swap any picture, regenerate the derivatives at the same widths, update
// the alt text, and check the ratio. Nothing else in the app needs to change.
//
// Stills ship as AVIF with a WebP fallback: AVIF is roughly a third smaller at
// matching quality, which is what buys the 2800w tier without the first paint
// costing more.
//
// NOTHING IN A GALLERY IS CROPPED ANY MORE. Every space picture is generated at
// the shape it came off the camera, and the grid on the facility page lays each
// one out at its own ratio. That is why `picture()` now takes one. The old
// behaviour cut every frame to 16:9, which cost a band top and bottom on the
// six that were shot at 3:2 — both hall interiors, the corridor, the traveller's
// palm, the fan palm and the urn.
//
// One exception, and it is a composition fix rather than a shape: the
// auditorium's close frame is cut in from the left, because an out-of-focus
// terracotta urn sat across a fifth of it.
//
// The hero is the one place a crop is still forced. It is full-viewport, so a
// phone held upright cuts it hardest, and 3:2 is the shape that survives that.

const AVIF_W = [900, 1400, 2000, 2800]
const WEBP_W = [900, 1400, 2000]

// The ratios actually on disk, so a caller never has to guess and the grid
// never reflows once the picture decodes.
const WIDE = 16 / 9 // 1.778, straight off the camera
const CLASSIC = 3 / 2 // 1.5, the rest of the shoot and every hero frame
const HALL = 1.426 // GIG-IN5 alone, which is its own shape

const set = (name, ext, widths) =>
  widths.map((w) => `/hero/${name}-${w}.${ext} ${w}w`).join(', ')

// One picture, every tier of it. Callers pick their own `sizes`.
//
// `cap` is the widest file that exists on disk for this name: the generator
// skips anything above it, so advertising more in the srcset would point the
// browser at a 404. Two reasons a name is capped. A source too small to reach
// the top tier without upscaling is one. The other is deliberate: a picture
// that only ever appears inside the gallery stops at 2000, because no cell is
// wider than about 650px and the lightbox is bounded by the viewport. The 2800
// tier is for the hero and for the one picture that heads each space.
//
// `ladder` replaces the standard widths outright, for a picture generated on
// its own scale — the cards sit at a quarter of the container and need tiers
// below the shared ladder's floor, not above it.
const picture = (name, alt, ratio = WIDE, cap = Infinity, ladder) => {
  const avif = (ladder ? ladder.avif : AVIF_W).filter((w) => w <= cap)
  const webp = (ladder ? ladder.webp : WEBP_W).filter((w) => w <= cap)
  return {
    alt,
    ratio,
    avifSrcSet: set(name, 'avif', avif),
    srcSet: set(name, 'webp', webp),
    // The bare src is the no-srcset fallback, so it has to name a file that
    // exists — 1400 when there is one, otherwise the widest there is.
    src: `/hero/${name}-${webp.includes(1400) ? 1400 : webp[webp.length - 1]}.webp`,
  }
}

const shot = (name, alt, hold = 6500) => ({
  kind: 'image',
  hold,
  ...picture(name, alt, CLASSIC),
})

// Two frames, both theirs, and they do different jobs. The first is taken
// standing on the grass at the far end, which is what a guest sees walking in.
// The second backs off and puts the terrace in the middle of the lawn.
//
// The drone frame that used to open the site came off on 2026-09-12 at the
// client's request. On a wide desktop it cropped to bare lawn with the
// auditorium roof sliced down one edge, and it was the one picture on the site
// graded warmer than the rest of the shoot.
export const heroFrames = [
  shot(
    'lawn-open',
    'The lawn from ground level, with the guest block and the terrace along the far side',
  ),
  shot(
    'lawn-wide',
    'The terrace across the open lawn, palms to either side under a clear sky',
  ),
]

// Tiny inline blur behind the first frame so there is no flash of empty ground
// before it decodes. Regenerated whenever that frame changes; this one is
// lawn-open at 24x16.
export const heroLqip =
  'data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAABwBACdASoYABAAPulgqU2pJaQiMAgBIB0JbACdH8ADM//MVr2DsN3fC8R2AAD+3yaDBOfFFERUaWe/ohWzKy2EoqYUD6lVF6GlJAIA5U/k89SKjBGElzUheDSJeLKS/uR061TmmP7YMjjoQKdUgPwII38ONxJZOOXXQAAA'

// The pictures for each space, in the order they should be seen. The first is
// the one the rail on /facilities uses, and the only one in the set on the full
// ladder; the rest live inside the grid and stop at 2000.
//
// The sets are uneven on purpose. The garden is the venue — it is the lawn
// everything else sits around — so it carries the most. The Executive Hall
// carries three because three is what was shot.
const SPACE_PICTURES = {
  garden: [
    picture(
      'garden-open',
      'The open lawn, with palms and the boundary planting along the far edge',
    ),
    picture(
      'garden-palm',
      'A traveller’s palm at the edge of the lawn, fanned out above the shrubs',
      CLASSIC,
      2000,
    ),
    picture(
      'garden-front',
      'The guest block and the terrace seen together from across the lawn',
      WIDE,
      2000,
    ),
    picture(
      'garden-border',
      'The grounds seen past the planting along one edge of the lawn',
      WIDE,
      2000,
    ),
    picture(
      'garden-frond',
      'A fan palm frond in the sun, the lawn out of focus behind it',
      WIDE,
      2000,
    ),
    // The four drone frames sit together at the end rather than scattered
    // through the set. They are graded warmer than the ground-level shoot and
    // the roofs read a different colour in them, so run consecutively they read
    // as "the property from above" instead of as a mismatch.
    picture('garden-above-lawn', 'The lawn and the grounds from above', WIDE, 2000),
    picture(
      'garden-above-block',
      'The guest block and the terrace from above, the lawn below them',
      WIDE,
      2000,
    ),
    picture(
      'garden-above-walk',
      'The paved walk between the buildings and the lawn, from above',
      WIDE,
      2000,
    ),
    picture(
      'garden-above-terrace',
      'The terrace and the full length of the lawn from above',
      WIDE,
      2000,
    ),
  ],
  auditorium: [
    picture(
      'auditorium-hall',
      'The auditorium seen across the lawn, open along its length under a pitched roof',
    ),
    picture(
      'auditorium-urns',
      'The auditorium across the grass, with planted urns in the foreground',
      WIDE,
      2000,
    ),
    picture(
      'auditorium-terrace',
      'The auditorium framed between two terrace columns, the lawn running between them',
      WIDE,
      2000,
    ),
    picture(
      'auditorium-eaves',
      'The auditorium close to, its open bays and the louvred band under the eaves',
      WIDE,
      2000,
    ),
    picture(
      'auditorium-palms',
      'The auditorium roof seen through palm fronds',
      WIDE,
      2000,
    ),
  ],
  'executive-hall': [
    // Their camera, and the room is empty in all three: it was photographed
    // finished but unfurnished, so what these show is the floor, the height and
    // the light rather than a room dressed for an event. A set taken with
    // tables in is the thing to ask for next.
    picture(
      'hall-wide',
      'The Executive Hall, a polished dark floor running the width of the room',
      HALL,
    ),
    picture(
      'hall-doors',
      'The Executive Hall looking towards its doors, columns to either side',
      CLASSIC,
      2000,
    ),
    // Honestly labelled. This one is the corridor outside the room rather than
    // the room, and the alt text says so instead of calling it the hall.
    picture(
      'hall-corridor',
      'The corridor leading into the Executive Hall',
      CLASSIC,
      2000,
    ),
  ],
  terrace: [
    picture(
      'terrace-pavilion',
      'The terrace, a curved roof carried on columns above a tiled floor',
    ),
    picture(
      'terrace-dusk',
      'The terrace at dusk, the lawn beside it under a pink sky',
      WIDE,
      2000,
    ),
    picture(
      'terrace-evening',
      'The terrace colonnade in the evening, the grounds beyond it',
      WIDE,
      2000,
    ),
    picture(
      'terrace-lawn',
      'The terrace and the guest block from the middle of the lawn',
      WIDE,
      2000,
    ),
    picture(
      'terrace-urn',
      'A fan palm in a terracotta urn between the terrace columns',
      WIDE,
      2000,
    ),
    picture(
      'terrace-palm',
      'A fan palm in its urn, the lawn beyond the columns',
      CLASSIC,
      2000,
    ),
  ],
}

// Portrait crops for the home-page cards, on their own ladder — the cards are
// never wider than a quarter of the container, so the shared 900-2800 ladder
// would only ever hand them a file far larger than the slot.
//
// These are the one place a deliberate crop survives. A card is a fixed 4:5
// slot in a row of four, and a row of four different shapes is not a card row.
const CARD_LADDER = { avif: [480, 760, 1100], webp: [480, 760, 1100] }
const CARD_RATIO = 4 / 5

// NEVER REGENERATE ONE OF THESE UNDER ITS OWN NAME. A file under /hero is
// served straight off disk by LiteSpeed, and a browser that already holds the
// old bytes keeps showing them: four cards were once swapped for the client's
// own photographs and carried on displaying stock, because the URL had not
// moved. Every name here changed with its picture, and the next swap has to
// change it again.
const SPACE_CARDS = {
  garden: picture(
    'card-garden-traveller',
    'A traveller’s palm at the edge of the lawn',
    CARD_RATIO,
    1100,
    CARD_LADDER,
  ),
  auditorium: picture(
    'card-auditorium-hall',
    'The auditorium seen across the lawn',
    CARD_RATIO,
    1100,
    CARD_LADDER,
  ),
  // Cropped up off the floor. A full-height 4:5 box out of this frame was more
  // than half black marble, which read as a dark empty room rather than a hall;
  // this keeps the doorway, the ceiling line and the reflection.
  'executive-hall': picture(
    'card-hall-room',
    'The Executive Hall, its doorway reflected in a polished dark floor',
    CARD_RATIO,
    1100,
    CARD_LADDER,
  ),
  terrace: picture(
    'card-terrace-pavilion',
    'The terrace under its curved roof',
    CARD_RATIO,
    1100,
    CARD_LADDER,
  ),
}

export const spaceCard = (slug) => SPACE_CARDS[slug]

// Every picture for a space, for the grid.
export const spaceGallery = (slug) => SPACE_PICTURES[slug] || []

// The one that represents the space wherever only one will fit.
export const spaceImage = (slug) => SPACE_PICTURES[slug][0]

// The banner on /catering. Stock, and one of the three left. Source crop is
// 2025px wide, so the ladder stops at 2000.
export const cateringBanner = picture(
  'catering-table',
  'Round tables laid with place settings and flowers for a banquet',
  CLASSIC,
  2000,
)

// The banner on /beverages, and the tall glass that sits beside the list. Both
// stock. The glass keeps its 2:3 crop — the drink fills the frame top to
// bottom, and squaring it off to match every other picture on the site would
// cut the glass in half to no purpose.
export const beveragesBanner = picture(
  'drinks-banner',
  'A tall pineapple drink garnished with fruit, beside a whole pineapple',
  CLASSIC,
)

export const beveragesGlass = picture(
  'drinks-glass',
  'A glass of freshly pressed pineapple juice with a wedge of pineapple',
  2 / 3,
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
// The 2026-09-12 shoot did not cover the floral work, so this is the one part
// of the site that did not get the upgrade the rest did. Ask for the originals
// off the phone (they will be 3000px+) and regenerate these four files at the
// shared ladder.
export const floralBanner = picture(
  'floral-bouquet',
  'A bridal bouquet of white roses and baby\'s breath, tied with green ribbon',
  1,
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
  1,
  Infinity,
  { avif: [480, 740], webp: [480, 740] },
)

// The mark itself, used full size by the intro and small in the header bar.
export const wordmark = {
  src: '/smallgiglogo.avif',
  width: 865,
  height: 400,
}
