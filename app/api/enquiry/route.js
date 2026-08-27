import nodemailer from 'nodemailer'
import { enquiryHtml } from '../../lib/enquiryEmail'

// Emails an enquiry to the venue.
//
// WhatsApp is the other half of this and it needs no server at all — the form
// builds a wa.me link and the browser hands it off. This route exists for the
// people who would rather not open WhatsApp, and it is the only part of the
// site that needs credentials.
//
// SMTP and the destination both come from the environment; see .env.example.
// Production mails seyram@gigconsult.net; .env.local overrides it locally so a
// test enquiry never lands in the client's inbox.
//
// There is no hardcoded fallback recipient on purpose. With nothing configured
// the route answers 503 and the form falls back to WhatsApp with a visible
// message, which is the right failure: an enquiry that silently evaporates is
// worse than one that says "use WhatsApp".

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const REQUIRED = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASS', 'ENQUIRY_TO']

// Header injection: a newline in a field that ends up in the Subject line lets
// the sender add headers of their own. The body is fine — it is just text — but
// anything reaching a header gets flattened first.
const flatten = (value) => String(value || '').replace(/[\r\n]+/g, ' ').trim()

export async function POST(request) {
  const missing = REQUIRED.filter((key) => !process.env[key])
  if (missing.length) {
    console.error(`[enquiry] not configured; missing ${missing.join(', ')}`)
    return Response.json(
      { error: 'Email is not configured on this server.' },
      { status: 503 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Bad request.' }, { status: 400 })
  }

  const name = flatten(body.name)
  const space = flatten(body.space)
  const summary = String(body.summary || '')

  if (!name || !summary) {
    return Response.json({ error: 'Bad request.' }, { status: 400 })
  }

  // A hard ceiling on what gets relayed, so the endpoint cannot be used to post
  // arbitrary volumes of text through the venue's mailbox.
  if (summary.length > 4000) {
    return Response.json({ error: 'That message is too long.' }, { status: 413 })
  }

  const port = Number(process.env.SMTP_PORT || 465)
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    // 465 is implicit TLS; 587 starts plaintext and upgrades with STARTTLS.
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  try {
    await transport.sendMail({
      // From must be a mailbox the SMTP account is allowed to send as — with
      // Gmail that means the authenticated account itself. The enquirer's
      // address goes in Reply-To, where it belongs.
      from: `"Gig Cottage website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.ENQUIRY_TO,
      replyTo: flatten(body.email) || undefined,
      subject: `Enquiry — ${space || 'facility'} — ${name}`,
      // Both parts, always. The HTML is what anyone will actually see; the
      // text is what a screen reader, a watch, or a client with images and
      // markup switched off falls back to, and sending HTML alone is also a
      // reliable way to score spam points.
      text: summary,
      html: enquiryHtml({
        space: space || 'Facility',
        name,
        dates: flatten(body.dates),
        occasion: flatten(body.occasion),
        guests: flatten(body.guests),
        phone: flatten(body.phone),
        email: flatten(body.email),
        // Notes are the one field where line breaks matter, so they are not
        // flattened — enquiryHtml escapes them and turns newlines into <br>.
        notes: String(body.notes || '').slice(0, 2000),
      }),
    })
  } catch (error) {
    console.error('[enquiry] send failed:', error.message)
    return Response.json({ error: 'Could not send that.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
