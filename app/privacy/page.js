import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import { CONTACT } from '../lib/content'

// The privacy policy.
//
// Written from an audit of what the site actually does, not from a template.
// It says the site sets no cookies because it sets no cookies — there is no
// analytics, no advertising pixel, no third-party embed, and next/font
// self-hosts the typefaces at build time so loading a page reaches no other
// server. If any of that changes, this page changes with it.

export const metadata = {
  title: 'Privacy & Cookies | Gig Cottage',
  description:
    'What Gig Cottage collects when you enquire, what we do with it, and why this site sets no cookies.',
}

const UPDATED = '27 August 2026'

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />

      <main className="gc-legal">
        <header className="gc-legal-head">
          <span className="gc-legal-rule" aria-hidden="true" />
          <h1 className="gc-legal-title">Privacy &amp; Cookies</h1>
          <p className="gc-legal-updated">Last updated {UPDATED}</p>
        </header>

        <div className="gc-legal-body">
          <section>
            <h2>Who we are</h2>
            <p>
              Gig Cottage, {CONTACT.addressLines.join(', ')}, Ghana. This policy
              covers {CONTACT.site} and the enquiries sent through it. We are
              responsible for the information described here.
            </p>
          </section>

          <section>
            <h2>What we collect</h2>
            <p>
              Only what you type into an enquiry and send us: your name, a phone
              or WhatsApp number, an email address if you give one, the dates
              you are asking about, roughly how many guests you expect, what the
              event is, and anything else you choose to write.
            </p>
            <p>
              Nothing is collected automatically. There is no analytics on this
              site, no advertising pixel, and no profiling of visitors. If you
              read the site and never send an enquiry, we do not know you were
              here.
            </p>
          </section>

          <section>
            <h2>How your enquiry reaches us</h2>
            <p>
              Whichever route you pick on the form:
            </p>
            <ul>
              <li>
                <strong>WhatsApp.</strong> The site opens WhatsApp with your
                message already written; you send it yourself. The message
                travels through WhatsApp, which is operated by Meta, so their
                terms apply to it as well as ours.
              </li>
              <li>
                <strong>Email.</strong> The message is sent from this site to
                our mailbox through our hosting provider&rsquo;s mail server.
              </li>
            </ul>
          </section>

          <section>
            <h2>What we do with it</h2>
            <p>
              Answer you, check whether the date is free, quote for it, and hold
              the booking. That is all. We do not sell it, rent it, or hand it to
              anyone who is not part of arranging your event.
            </p>
          </section>

          <section>
            <h2>How long we keep it</h2>
            <p>
              For as long as it takes to deal with your enquiry, and afterwards
              in our booking records. Ask us to delete it and we will, unless we
              are required to keep it for tax or legal reasons.
            </p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              <strong>This site sets no cookies of its own.</strong> None for
              advertising and none for analytics.
            </p>
            <p>
              There is one third party: the map on our home page is an embedded
              Google map, and Google sets cookies inside it. It loads with the
              page. If you would rather it did not, choose{' '}
              <strong>Essential only</strong> in the cookie notice and we will
              show you a link to Google Maps instead of the map itself.
            </p>
            <p>
              The one thing stored is your answer to the cookie notice, and it is
              kept in your browser&rsquo;s local storage on your own device
              rather than in a cookie. It never travels to us and we cannot read
              it. Clearing your browser data removes it and the notice will ask
              again.
            </p>
            <p>
              The typefaces are served from this site rather than from Google, so
              loading a page does not tell anyone else that you did. If we ever
              add analytics, the notice will ask you first and nothing will run
              until you agree.
            </p>
            <p>
              Apart from that map, nothing on these pages is fetched from anyone
              else.
            </p>
          </section>

          <section>
            <h2>Links to other sites</h2>
            <p>
              We link out to WhatsApp, to Google Maps for directions, and to our
              developer. Once you follow one of those links, that
              company&rsquo;s own privacy policy applies, not ours.
            </p>
          </section>

          <section>
            <h2>Your rights</h2>
            <p>
              Under Ghana&rsquo;s Data Protection Act, 2012 (Act 843) &mdash; and
              under the GDPR if you are in the UK or the EU &mdash; you can ask
              what we hold about you, ask us to correct it, or ask us to delete
              it. Call or message us and we will deal with it.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              {CONTACT.phones.map((phone, i) => (
                <span key={phone.tel}>
                  {i > 0 && ' or '}
                  <a href={`tel:${phone.tel}`}>{phone.label}</a>
                </span>
              ))}
              , or write to us at {CONTACT.addressLines.join(', ')}.
            </p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>
              If what we do with your information changes, this page changes with
              it, and the date at the top will tell you when.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
