import { STAFF_PARTY, offerRunning, whatsappLink } from '../lib/content'
import StaffPartyBook from './StaffPartyBook'

// The year-end staff party offer, straight under the hero while it runs.
//
// A price list, read down: each package's name and price on one line over a
// rule, and what comes in it beneath. The heading and the booking sit to the
// left on a wide screen; on a phone the booking comes after the menus, so
// the button is where the reading ends rather than above what it books.
//
// Returns nothing once the offer's date has passed. The home page revalidates
// hourly, so that happens on its own.
export default function StaffParty() {
  if (!offerRunning(STAFF_PARTY)) return null

  const { heading, lead, packages } = STAFF_PARTY

  return (
    <section className="gc-party" id="staff-party" aria-labelledby="gc-party-title">
      <div className="gc-party-body" data-gc-reveal-group>
        <div className="gc-party-head">
          <h2 className="gc-party-title" id="gc-party-title">
            {heading}
          </h2>
          <p className="gc-party-lead">{lead}</p>
        </div>

        <div className="gc-party-menus">
          {packages.map((pkg) => (
            <div className="gc-pkg" key={pkg.name}>
              <div className="gc-pkg-head">
                <h3 className="gc-pkg-name">{pkg.name}</h3>
                <p className="gc-pkg-price">
                  <span className="gc-pkg-cur">GHS </span>
                  {pkg.price}
                </p>
              </div>

              <div
                className={`gc-pkg-groups${pkg.groups.length > 1 ? ' gc-pkg-groups--cols' : ''}`}
              >
                {pkg.groups.map((group, i) => (
                  <div key={group.name || i}>
                    {group.name && <p className="gc-pkg-group">{group.name}</p>}
                    <ul className="gc-space-list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="gc-party-actions">
          <StaffPartyBook />
          <a
            className="gc-party-alt"
            href={whatsappLink(STAFF_PARTY.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  )
}
