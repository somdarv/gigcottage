import { SITE_URL } from './lib/content'

// /robots.txt. Everything is open except the enquiry endpoint, which is not a
// page, and /cgi-bin/, which cPanel answers with a redirect Search Console
// kept reporting as an error.
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/cgi-bin/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
