// Facility and contact facts, in one place so a change is one edit.
//
// Everything here is transcribed from the client's own facility rate cards:
// the figures are seated (theatre) capacities, and the inclusions and "suited
// for" lists are their wording, not ours. Nothing is invented.
//
// The site calls them GUESTS, not seated — the client's instruction
// (2026-08-28). The number is unchanged and still the rate card's; only the
// word above it moved, so `guests` is what the field is called too.
//
// And no thousands comma on any of them, hers too: 2000, not 2,000. The
// figures are strings for that reason — nothing formats them, so nothing can
// put the comma back.
//
// NO FACILITY PRICES. The rate cards carry them; the site deliberately does
// not, at any depth. There is no `rate` field on a space to render by accident
// — hire is quoted through an enquiry.
//
// Catering carries no prices either. The five packages and their per-head
// rates came off the site on the client's instruction (2026-08-28): what a
// buffet costs is a conversation, and the menu is the part worth reading.

export const CONTACT = {
  phones: [
    { label: '025 744 1441', tel: '+233257441441', whatsapp: '233257441441' },
    { label: '020 020 0054', tel: '+233200200054', whatsapp: '233200200054' },
  ],
  addressLines: ['Adenta-Dodowa Road', 'Malejor, Accra'],
  maps:
    'https://www.google.com/maps/place/5%C2%B046%2753.2%22N+0%C2%B007%2736.1%22W/@5.7816124,-0.1266073,20.28z',
  coords: { lat: 5.7816124, lng: -0.1266073 },
  site: 'gigcottage.net',
  // Footer credit.
  developer: {
    name: 'Saharabase Technologies',
    url: 'https://saharabasetech.com',
  },
}

// The embedded map's URL. Never rendered into the page: an iframe pointing at
// Google is a request to Google, with the cookies that implies, and this site
// promises in its privacy policy not to make one uninvited. It is only ever
// used after the visitor presses the button. See components/FindUs.js.
export function mapEmbed() {
  const { lat, lng } = CONTACT.coords
  return `https://www.google.com/maps?q=${lat},${lng}&z=17&hl=en&output=embed`
}

// Directions, as a plain link — no third party is contacted until it is
// followed, so this one is safe to render.
export function directionsLink() {
  const { lat, lng } = CONTACT.coords
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

export const SPACES = [
  {
    slug: 'garden',
    name: 'Garden',
    guests: '2000',
    note: 'Well maintained garden space with outdoor mist fans.',
    // A space opens its own page on `lead` where it has one, and on `note`
    // where it does not. The garden's is the client's line, and it is a
    // headline rather than a description — which is what she asked for.
    lead: 'Outdoor events just got better with our natural lawns.',
    included: [
      'Expansive landscaped garden',
      'Beautiful trees and greenery',
      'Outdoor mist fans',
      'Spacious enclosed parking',
      'Backup generator',
      'Security',
    ],
    suitedFor: [
      'Weddings',
      'Concerts',
      'Festivals',
      'Church programmes',
      'Corporate events',
      'Graduation ceremonies',
      'Outdoor exhibitions',
    ],
  },
  {
    slug: 'auditorium',
    name: 'Large Auditorium',
    shortName: 'Auditorium',
    guests: '1000',
    note: 'Large naturally ventilated auditorium. Comfortable airflow with no air conditioning required.',
    included: [
      'Large naturally ventilated auditorium',
      'Indoor fans',
      'Comfortable airflow, no air conditioning required',
      'Spacious enclosed parking',
      'Backup generator',
    ],
    suitedFor: [
      'Weddings',
      'Concerts',
      'Festivals',
      'Funeral receptions',
      'Church programmes',
      'Corporate events',
      'Graduation ceremonies',
      'Exhibitions',
    ],
  },
  {
    slug: 'executive-hall',
    name: 'Executive Hall',
    guests: '120',
    note: 'Fully air-conditioned and enclosed, with private washrooms.',
    included: [
      'Fully air-conditioned hall',
      'Private washrooms',
      'Enclosed indoor venue',
      'Spacious parking',
      'Backup generator',
      'Security',
    ],
    suitedFor: [
      'Corporate meetings',
      'Seminars',
      'Private events',
      'Training sessions',
      'Presentations',
      'Workshops',
    ],
  },
  {
    slug: 'terrace',
    name: 'Terrace',
    guests: '100',
    note: 'Beautiful open-air terrace with a scenic view of the garden.',
    included: [
      'Beautiful open-air terrace',
      'Scenic view of the garden',
      'Outdoor mist fans',
      'Access to spacious parking',
      'Backup generator',
    ],
    suitedFor: [
      'Cocktail events',
      'Birthday celebrations',
      'Networking sessions',
      'Bridal showers',
      'Private dinners',
      'Product launches',
      'Small receptions',
    ],
  },
]

export const SERVICES = [
  // Points at the facilities page rather than opening a WhatsApp thread — the
  // answer to "what facilities?" is a page, not a conversation.
  { slug: 'facilities', name: 'Facilities', href: '/facilities' },
  { slug: 'catering', name: 'Catering', href: '/catering' },
  { slug: 'beverages', name: 'Beverages', href: '/beverages' },
  // The bare word makes an odd sentence in the WhatsApp message, so this one
  // carries its own phrasing for the enquiry.
  { slug: 'floral', name: 'Floral', href: '/floral' },
]

// The catering menu, transcribed from the client's own menu card.
//
// NO PRICES, and no packages either — the five packages and their per-head
// rates were taken off the site by the client (2026-08-28). What is left is
// the food, which is the part someone is actually choosing between.
export const CATERING = {
  note: 'Every buffet is served with green sauce, shito and Ghanaian salad.',
  courses: [
    {
      name: 'Starters',
      items: [
        'Samosa',
        'Khebab',
        'Spring rolls',
        'Plantain chips',
        'Coated groundnut',
      ],
    },
    {
      name: 'Main meals',
      items: [
        'Goat stew',
        'Beef stew',
        'Palava sauce',
        'Shrimp stew',
        'Grilled tilapia and sauce',
        'Light soup',
        'Palm nut soup',
        'Groundnut soup',
        'Okra stew',
      ],
    },
    {
      name: 'Extras',
      // Fifteen items against five and nine — left in one column it ran to
      // twice the height of its neighbours.
      wide: true,
      items: [
        'Jollof rice',
        'Plain rice',
        'Vegetable rice',
        'Vermicelli rice',
        'Waakye',
        'Banku',
        'Fried yam',
        'Boiled yam and plantain',
        'Fried plantain',
        'Abolo',
        'Tubani',
        'Yakeyake',
        'Kaklen',
        'Apapransa',
        'Fufu',
      ],
    },
  ],
}

// Drinks, from the client's own card. Five, and that is genuinely all of them
// — there is no bar list behind this, so the page does not pretend to one.
//
// No prices: the card gives none. If they ever do, this follows catering.
export const BEVERAGES = {
  note: 'Freshly squeezed juice and local drinks, made to order.',
  // Sentence case to match every other list on the site; the card sets them in
  // title case, which is a poster decision rather than a naming one.
  drinks: [
    'Pineapple and mint',
    'Pineapple and ginger',
    'Pineapple and passion fruit',
    'Bissap',
    'Liha',
  ],
}

// Floral, recovered from the v1 build (app/components/FloralModal.js, still in
// git history). The five services are theirs verbatim; the lead is the v1 copy
// rewritten into this site's plainer voice, with nothing added to it.
export const FLORAL = {
  heading: 'Fresh natural flowers',
  note: 'Flowers arranged for the occasion — bouquets, wreaths and decorations for the room, made here at Gig Cottage.',
  services: [
    'Custom wedding bouquets and arrangements',
    'Memorial and sympathy wreaths',
    'Event and venue floral decorations',
    'Corporate flower arrangements',
    'Seasonal and holiday designs',
  ],
}

const DEFAULT_ENQUIRY =
  'Hello Gig Cottage, I would like to enquire about booking a space.'

// Every enquiry on the site funnels through here, so the message can carry
// whatever context the page already knows.
export function whatsappLink(
  message = DEFAULT_ENQUIRY,
  number = CONTACT.phones[0].whatsapp,
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

// Each space has a page of its own. The home page carries the picture, the
// name and one line; everything that needs reading rather than scanning —
// inclusions, what it suits, the figures — lives at the other end of this.
export function spacePath(space) {
  return `/facilities/${space.slug}`
}

export function spaceEnquiry(space) {
  return whatsappLink(
    `Hello Gig Cottage, I would like to enquire about hiring the ${space.name} (${space.guests} guests).`,
  )
}

// Where a service link goes. Most open an enquiry; anything that already has a
// section of its own on the page links there instead.
export function serviceHref(service) {
  return service.href || serviceEnquiry(service)
}

export function serviceEnquiry(service) {
  return whatsappLink(
    `Hello Gig Cottage, I would like to enquire about ${service.enquiry || service.name.toLowerCase()}.`,
  )
}
