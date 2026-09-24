// The enquiry email's HTML body.
//
// Email is not the web. Tables carry the layout because Outlook still renders
// with Word's engine and ignores most of flex and grid; every style is inline
// because Gmail strips <style> blocks in some clients; and the typeface is
// Georgia rather than the site's Newsreader, since a webfont in an email is a
// tracking pixel that half the clients block anyway.
//
// Colours are the site's, written as hex — there are no custom properties here
// either.

const BONE = '#fdfbf8'
const BONE_2 = '#f5f0e9'
const OXBLOOD = '#44180f'
const INK = '#2a2320'
const INK_SOFT = '#6e675f'
const GOLD = '#c9a24a'
const HAIRLINE = '#e4dbd4'

const SERIF = "Georgia, 'Times New Roman', serif"
const SANS = "'Segoe UI', Helvetica, Arial, sans-serif"

// Everything below is typed by a stranger on a public form and lands in
// someone's mail client. Escaping is not optional.
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// tel: wants no spaces or punctuation. Ghanaian numbers are usually written
// 025 744 1441, which is not dialable as-is.
const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`

function row(label, valueHtml) {
  return `
    <tr>
      <td style="padding:0 0 4px;font-family:${SANS};font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:${INK_SOFT};">${esc(label)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 20px;font-family:${SERIF};font-size:17px;line-height:1.45;color:${INK};">${valueHtml}</td>
    </tr>`
}

// A link styled as a block, not an <a> with padding — Outlook collapses the
// latter to a bare underline.
function button(href, text, filled) {
  const bg = filled ? GOLD : BONE
  const fg = filled ? '#2b0f09' : OXBLOOD
  const border = filled ? GOLD : HAIRLINE
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;margin:0 8px 8px 0;">
    <tr>
      <td align="center" bgcolor="${bg}" style="border:1px solid ${border};">
        <a href="${esc(href)}" style="display:block;padding:13px 24px;font-family:${SANS};font-size:12px;font-weight:600;letter-spacing:1.6px;text-transform:uppercase;color:${fg};text-decoration:none;">${esc(text)}</a>
      </td>
    </tr>
  </table>`
}

export function enquiryHtml(data) {
  const { space, name, dates, occasion, guests, phone, email, notes } = data

  const rows = [row('Space', esc(space)), row('Name', esc(name)), row('Dates', esc(dates))]

  if (occasion) rows.push(row('Occasion', esc(occasion)))
  if (guests) rows.push(row('Guests', `about ${esc(guests)}`))

  if (phone) {
    rows.push(
      row(
        'Phone / WhatsApp',
        `<a href="${esc(telHref(phone))}" style="color:${OXBLOOD};text-decoration:none;border-bottom:1px solid ${HAIRLINE};">${esc(phone)}</a>`,
      ),
    )
  }

  if (email) {
    rows.push(
      row(
        'Email',
        `<a href="mailto:${esc(email)}" style="color:${OXBLOOD};text-decoration:none;border-bottom:1px solid ${HAIRLINE};">${esc(email)}</a>`,
      ),
    )
  }

  if (notes) {
    rows.push(row('Notes', esc(notes).replace(/\n/g, '<br>')))
  }

  // The reply comes back with the space and their name already in the subject,
  // so it threads sensibly and nobody has to remember which enquiry it was.
  const replySubject = `Re: your enquiry about the ${space} — Gig Cottage`
  const actions = [
    email ? button(`mailto:${esc(email)}?subject=${encodeURIComponent(replySubject)}`, 'Reply by email', true) : '',
    phone ? button(telHref(phone), `Call ${phone}`, false) : '',
  ].join('')

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>New enquiry</title>
</head>
<body style="margin:0;padding:0;background:${BONE_2};">
  <!-- Shown in the inbox list under the subject, and nowhere else. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${esc(name)} — ${esc(dates)}${guests ? ` — about ${esc(guests)} guests` : ''}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BONE_2};">
    <tr>
      <td align="center" style="padding:28px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:${BONE};border:1px solid ${HAIRLINE};">

          <tr>
            <td align="center" bgcolor="${OXBLOOD}" style="padding:26px 24px;">
              <div style="font-family:${SERIF};font-size:19px;letter-spacing:5px;text-transform:uppercase;color:${BONE};">Gig&nbsp;Cottage</div>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 34px 8px;">
              <div style="font-family:${SANS};font-size:11px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${GOLD};padding-bottom:10px;">New enquiry</div>
              <div style="font-family:${SERIF};font-size:28px;line-height:1.15;color:${OXBLOOD};padding-bottom:26px;">${esc(space)}</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${rows.join('')}
              </table>
            </td>
          </tr>

          ${
            actions
              ? `<tr>
            <td style="padding:6px 34px 30px;border-top:1px solid ${HAIRLINE};padding-top:26px;">
              ${actions}
            </td>
          </tr>`
              : ''
          }

          <tr>
            <td style="padding:18px 34px 24px;border-top:1px solid ${HAIRLINE};font-family:${SANS};font-size:11px;line-height:1.6;color:${INK_SOFT};">
              Sent from the enquiry form on gigcottage.net.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}
