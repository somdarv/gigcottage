'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { CONTACT } from '../lib/content'
import Dialog from './Dialog'

// The enquiry form.
//
// One send path: the form posts everything to /api/enquiry and the server
// mails it to the venue. The visitor is not asked how to deliver it — that is
// the venue's business, not a decision to hand to someone who just wants a
// date checked.
//
// Kept deliberately short: dates, size, occasion, how to reach you. Anything
// longer is a conversation, and the conversation is what the enquiry starts.
//
// Two things ask through it: a space, from its own page, and the staff party
// offer on the home page. They need different questions, so each describes
// itself as a topic (spaceTopic below, the party's in StaffPartyBook.js) and
// the form asks what its topic says.

const DAY = 86400000

function parse(value) {
  // As parts, not as a string: `new Date('2026-09-12')` is UTC midnight, which
  // renders as the 11th anywhere west of Greenwich.
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const show = (date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function lastDay(from, days) {
  if (!from) return null
  const end = parse(from)
  end.setDate(end.getDate() + Math.max(1, Number(days) || 1) - 1)
  return end
}

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  occasion: '',
  menu: '',
  span: 'one',
  from: '',
  days: '2',
  guests: '',
  notes: '',
}

export function spaceTopic(space) {
  const name = space.shortName || space.name
  return {
    name,
    title: `Enquire about the ${name}`,
    sub: 'A few questions, and we will come back to you with availability and a quote.',
    opening: `Hello Gig Cottage, I would like to enquire about the ${name}.`,
    received: `We have your enquiry for the ${name}`,
    reply: 'We will come back to you shortly with availability and a quote.',
    multiDay: true,
    // The space's own list, so the answer is one the venue already thinks in,
    // and it doubles as a hint at what it suits.
    occasions: space.suitedFor,
    guestsLabel: 'Guests',
    guestsHint: space.guests,
  }
}

// A space's page: the button, and the form behind it.
export default function EnquiryForm({ space }) {
  const [open, setOpen] = useState(false)
  const topic = spaceTopic(space)
  const close = () => setOpen(false)

  return (
    <>
      <button type="button" className="gc-space-cta" onClick={() => setOpen(true)}>
        {topic.title}
      </button>

      <Dialog open={open} label={topic.title} onClose={close}>
        <EnquiryFields topic={topic} open={open} onClose={close} />
      </Dialog>
    </>
  )
}

// The form itself, and the thank-you that replaces it. Sits inside a Dialog.
export function EnquiryFields({ topic, open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')

  // More than one form can be on a page at once (the home page has two, the
  // section's and the notice's), so the ids that tie labels to fields are
  // made per form rather than written in.
  const uid = useId()
  const id = (field) => `${uid}-${field}`

  const doneButton = useRef(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  // A sent enquiry is finished. Reopening should be a blank form, not the
  // last one still filled in with a thank-you under it. Anything short of sent
  // is kept, so a visitor who closed it by accident comes back to what they
  // had typed.
  useEffect(() => {
    if (open) return
    if (state === 'sent') {
      setForm(EMPTY)
      setErrors({})
    }
    setState('idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Focus is sitting on the submit button when the form is swapped out from
  // under it. Left alone the caret falls back to the top of the document,
  // which for a keyboard or screen-reader user reads as the dialog having
  // simply vanished.
  useEffect(() => {
    if (state === 'sent' && doneButton.current) doneButton.current.focus()
  }, [state])

  const many = topic.multiDay && form.span === 'many'
  const end = many ? lastDay(form.from, form.days) : null

  // Only the things a reply genuinely cannot be written without. Everything
  // else is optional, because a half-filled enquiry that arrives beats a
  // complete one that was abandoned at the fourth required field.
  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!form.from) next.from = 'Which date are you looking at?'
    if (many && Number(form.days) < 2) {
      next.days = 'Two days or more.'
    }
    // We reply to you, so one route back is all that is required — a phone
    // number or an email, either will do.
    if (!form.phone.trim() && !form.email.trim()) {
      next.phone = 'We need a phone number or an email to reply to.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // The dates are formatted once, here, and both the email's layout and its
  // plain-text fallback use the result. Formatting them again on the server
  // would mean two places to get a timezone wrong.
  function dateLine() {
    if (!form.from) return ''
    const first = show(parse(form.from))
    if (!topic.multiDay) return first
    return many && end
      ? `${first} to ${show(end)} (${form.days} days)`
      : `${first} (one day)`
  }

  function message() {
    const lines = [topic.opening, '', `Name: ${form.name.trim()}`]
    if (form.menu) lines.push(`Menu: ${form.menu}`)
    lines.push(`${topic.multiDay ? 'Dates' : 'Date'}: ${dateLine()}`)
    if (form.occasion) lines.push(`Occasion: ${form.occasion}`)
    if (form.guests.trim()) lines.push(`${topic.guestsLabel}: about ${form.guests.trim()}`)
    if (form.phone.trim()) lines.push(`Phone / WhatsApp: ${form.phone.trim()}`)
    if (form.email.trim()) lines.push(`Email: ${form.email.trim()}`)
    if (form.notes.trim()) lines.push('', form.notes.trim())
    return lines.join('\n')
  }

  async function send(e) {
    e.preventDefault()
    if (!validate()) return

    setState('sending')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          space: topic.name,
          ...form,
          dates: dateLine(),
          summary: message(),
        }),
      })
      setState(res.ok ? 'sent' : 'failed')
    } catch {
      setState('failed')
    }
  }

  if (state === 'sent') {
    return (
      <div className="gc-enq-done">
        <span className="gc-enq-done-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>

        <h2 className="gc-enq-done-title">Thank you</h2>

        <p className="gc-enq-done-text">
          {topic.received}
          {form.from ? ` on ${dateLine()}` : ''}. {topic.reply}
        </p>

        <button
          type="button"
          className="gc-btn gc-btn--gold"
          ref={doneButton}
          onClick={onClose}
        >
          Done
        </button>
      </div>
    )
  }

  const guestsField = (
    <div className="gc-field">
      <label htmlFor={id('guests')}>
        {topic.guestsLabel} <span className="gc-field-opt">roughly</span>
      </label>
      <input
        id={id('guests')}
        type="number"
        inputMode="numeric"
        min="1"
        placeholder={topic.guestsHint}
        value={form.guests}
        onChange={set('guests')}
      />
    </div>
  )

  return (
    <form className="gc-enq-form" onSubmit={send} noValidate>
      <button type="button" className="gc-modal-close" onClick={onClose}>
        Close
      </button>

      <h2 className="gc-enq-title">{topic.title}</h2>
      <p className="gc-enq-sub">{topic.sub}</p>

      <div className="gc-field">
        <label htmlFor={id('name')}>Your name</label>
        <input
          id={id('name')}
          data-autofocus
          value={form.name}
          onChange={set('name')}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name && <span className="gc-field-err">{errors.name}</span>}
      </div>

      {/* Optional, and nothing is picked for them. Someone who has not
          decided should still be able to ask for a date. */}
      {topic.menus && (
        <fieldset className="gc-fieldset">
          <legend>
            Which menu? <span className="gc-field-opt">optional</span>
          </legend>
          <div className="gc-choice">
            {topic.menus.map((menu) => (
              <label key={menu} className="gc-choice-opt">
                <input
                  type="radio"
                  name={id('menu')}
                  value={menu}
                  checked={form.menu === menu}
                  onChange={set('menu')}
                />
                <span>{menu}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {/* How long comes before which day: a one-day booking and a four-day
          one ask for different fields, and asking the length first means only
          the fields that apply are ever shown. */}
      {topic.multiDay && (
        <fieldset className="gc-fieldset">
          <legend>How long do you need it?</legend>
          <div className="gc-choice">
            {[
              ['one', 'One day'],
              ['many', 'Several days'],
            ].map(([value, text]) => (
              <label key={value} className="gc-choice-opt">
                <input
                  type="radio"
                  name={id('span')}
                  value={value}
                  checked={form.span === value}
                  onChange={set('span')}
                />
                <span>{text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="gc-field-row">
        <div className="gc-field">
          <label htmlFor={id('from')}>{many ? 'First day' : 'Date'}</label>
          <input
            id={id('from')}
            type="date"
            value={form.from}
            onChange={set('from')}
            aria-invalid={Boolean(errors.from)}
          />
          {errors.from && <span className="gc-field-err">{errors.from}</span>}
        </div>

        {many && (
          <div className="gc-field">
            <label htmlFor={id('days')}>How many days</label>
            <input
              id={id('days')}
              type="number"
              inputMode="numeric"
              min="2"
              value={form.days}
              onChange={set('days')}
              aria-invalid={Boolean(errors.days)}
            />
            {errors.days ? (
              <span className="gc-field-err">{errors.days}</span>
            ) : (
              end && <span className="gc-field-hint">Through {show(end)}</span>
            )}
          </div>
        )}

        {/* With no occasion to ask, the head count takes the place beside the
            date rather than a row of its own. */}
        {!topic.occasions && guestsField}
      </div>

      {topic.occasions && (
        <div className="gc-field-row">
          <div className="gc-field">
            <label htmlFor={id('occasion')}>What is it for?</label>
            <select id={id('occasion')} value={form.occasion} onChange={set('occasion')}>
              <option value="">Select one</option>
              {topic.occasions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="Something else">Something else</option>
            </select>
          </div>

          {guestsField}
        </div>
      )}

      <div className="gc-field-row">
        <div className="gc-field">
          <label htmlFor={id('phone')}>Phone or WhatsApp</label>
          <input
            id={id('phone')}
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && <span className="gc-field-err">{errors.phone}</span>}
        </div>

        <div className="gc-field">
          <label htmlFor={id('email')}>
            Email <span className="gc-field-opt">optional</span>
          </label>
          <input
            id={id('email')}
            type="email"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="gc-field-err">{errors.email}</span>}
        </div>
      </div>

      <div className="gc-field">
        <label htmlFor={id('notes')}>
          Anything else <span className="gc-field-opt">optional</span>
        </label>
        <textarea id={id('notes')} rows={3} value={form.notes} onChange={set('notes')} />
      </div>

      <div className="gc-enq-send">
        <button
          type="submit"
          className="gc-btn gc-btn--gold"
          disabled={state === 'sending'}
        >
          {state === 'sending' ? 'Sending…' : 'Send enquiry'}
        </button>
      </div>

      {state === 'failed' && (
        <p className="gc-enq-note gc-enq-note--bad">
          That did not go through. Please call{' '}
          <a href={`tel:${CONTACT.phones[0].tel}`}>{CONTACT.phones[0].label}</a> and
          we will take the details over the phone.
        </p>
      )}
    </form>
  )
}
