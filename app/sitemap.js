import { SITE_URL, SPACES, spacePath } from './lib/content'

// /sitemap.xml, submitted in Search Console under the gigcottage.net property.
//
// Every page a visitor can land on. A new page goes in this list or Google
// finds it only by following links. No lastModified: a build date on every
// entry would tell Google that every page changed on every deploy.
export default function sitemap() {
  const paths = [
    '/',
    '/facilities',
    ...SPACES.map(spacePath),
    '/catering',
    '/beverages',
    '/floral',
    '/privacy',
  ]
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }))
}
