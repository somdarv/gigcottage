'use client'

import { useEffect, useRef, useState } from 'react'
import { CONTACT } from '../lib/content'

// The enquiry form.
//
// One send path: the form posts everything to /api/enquiry and the server
// mails it to the venue. The visitor is not asked how to deliver it — that is
// the venue's business, not a decision to hand to someone who just wants a
// date checked.
//
// Kept deliberately short: dates, size, occasion, how to reach you. Anything
// longer is a conversation, and the conversation is what the enquiry starts.

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
  span: 'one',
  from: '',
  days: '2',
  guests: '',
  notes: '',
}

export default function EnquiryForm({ space }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle')

  const opener = useRef(null)
  const firstField = useRef(null)
  const doneButton = useRef(null)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    if (!open) return undefined

    const gap = window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`

    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    if (firstField.current) firstField.current.focus()

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      document.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function openForm() {
    opener.current = document.activeElement
    setState('idle')
    setOpen(true)
  }

  // Focus is sitting on the submit button when the form is swapped out from
  // under it. Left alone the caret falls back to the top of the document,
  // which for a keyboard or screen-reader user reads as the dialog having
  // simply vanished.
  useEffect(() => {
    if (state === 'sent' && doneButton.current) doneButton.current.focus()
  }, [state])

  function close() {
    setOpen(false)
    if (opener.current && opener.current.focus) opener.current.focus()
    // A sent enquiry is finished. Reopening should be a blank form, not the
    // last one still filled in with a thank-you under it.
    if (state === 'sent') {
      setForm(EMPTY)
      setErrors({})
      setState('idle')
    }
  }

  const end = form.span === 'many' ? lastDay(form.from, form.days) : null

  // Only the things a reply genuinely cannot be written without. Everything
  // else is optional, because a half-filled enquiry that arrives beats a
  // complete one that was abandoned at the fourth required field.
  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'Please tell us your name.'
    if (!form.from) next.from = 'Which date are you looking at?'
    if (form.span === 'many' && Number(form.days) < 2) {
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
    return form.span === 'many' && end
      ? `${show(parse(form.from))} to ${show(end)} (${form.days} days)`
      : `${show(parse(form.from))} (one day)`
  }

  function message() {
    const dates = dateLine()

    const lines = [
      `Hello Gig Cottage, I would like to enquire about the ${space.shortName || space.name}.`,
      '',
      `Name: ${form.name.trim()}`,
      `Dates: ${dates}`,
    ]
    if (form.occasion) lines.push(`Occasion: ${form.occasion}`)
    if (form.guests.trim()) lines.push(`Guests: about ${form.guests.trim()}`)
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
          space: space.shortName || space.name,
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

  const label = `Enquire about the ${space.shortName || space.name}`

  return (
    <>
      <button type="button" className="gc-space-cta" onClick={openForm}>
        {label}
      </button>

      {open && (
        <div
          className="gc-modal"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          {state === 'sent' ? (
            <div className="gc-enq-done">
              <span className="gc-enq-done-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>

              <h2 className="gc-enq-done-title">Thank you</h2>

              <p className="gc-enq-done-text">
                We have your enquiry for the {space.shortName || space.name}
                {form.from ? ` on ${dateLine()}` : ''}. We will come back to you
                shortly with availability and a quote.
              </p>

              <button
                type="button"
                className="gc-btn gc-btn--gold"
                ref={doneButton}
                onClick={close}
              >
                Done
              </button>
            </div>
          ) : (
          <form className="gc-enq-form" onSubmit={send} noValidate>
            <button type="button" className="gc-modal-close" onClick={close}>
              Close
            </button>

            <h2 className="gc-enq-title">{label}</h2>
            <p className="gc-enq-sub">
              A few questions, and we will come back to you with availability
              and a quote.
            </p>

            <div className="gc-field">
              <label htmlFor="enq-name">Your name</label>
              <input
                id="enq-name"
                ref={firstField}
                value={form.name}
                onChange={set('name')}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="gc-field-err">{errors.name}</span>}
            </div>

            {/* How long comes before which day: a one-day booking and a
                four-day one ask for different fields, and asking the length
                first means only the fields that apply are ever shown. */}
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
                      name="span"
                      value={value}
                      checked={form.span === value}
                      onChange={set('span')}
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="gc-field-row">
              <div className="gc-field">
                <label htmlFor="enq-from">
                  {form.span === 'many' ? 'First day' : 'Date'}
                </label>
                <input
                  id="enq-from"
                  type="date"
                  value={form.from}
                  onChange={set('from')}
                  aria-invalid={Boolean(errors.from)}
                />
                {errors.from && <span className="gc-field-err">{errors.from}</span>}
              </div>

              {form.span === 'many' && (
                <div className="gc-field">
                  <label htmlFor="enq-days">How many days</label>
                  <input
                    id="enq-days"
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
            </div>

            <div className="gc-field-row">
              <div className="gc-field">
                <label htmlFor="enq-occasion">What is it for?</label>
                {/* The space's own list, so the answer is one the venue already
                    thinks in — and it doubles as a hint at what it suits. */}
                <select id="enq-occasion" value={form.occasion} onChange={set('occasion')}>
                  <option value="">Select one</option>
                  {space.suitedFor.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                  <option value="Something else">Something else</option>
                </select>
              </div>

              <div className="gc-field">
                <label htmlFor="enq-guests">
                  Guests <span className="gc-field-opt">roughly</span>
                </label>
                <input
                  id="enq-guests"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  placeholder={space.seated.replace(/,/g, '')}
                  value={form.guests}
                  onChange={set('guests')}
                />
              </div>
            </div>

            <div className="gc-field-row">
              <div className="gc-field">
                <label htmlFor="enq-phone">Phone or WhatsApp</label>
                <input
                  id="enq-phone"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <span className="gc-field-err">{errors.phone}</span>}
              </div>

              <div className="gc-field">
                <label htmlFor="enq-email">
                  Email <span className="gc-field-opt">optional</span>
                </label>
                <input
                  id="enq-email"
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
              <label htmlFor="enq-notes">
                Anything else <span className="gc-field-opt">optional</span>
              </label>
              <textarea id="enq-notes" rows={3} value={form.notes} onChange={set('notes')} />
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
                <a href={`tel:${CONTACT.phones[0].tel}`}>
                  {CONTACT.phones[0].label}
                </a>{' '}
                and we will take the details over the phone.
              </p>
            )}
          </form>
          )}
        </div>
      )}
    </>
  )
}
