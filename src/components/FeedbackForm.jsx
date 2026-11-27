import { Fragment, useRef, useState } from 'react'
import StarRating, { tap } from './StarRating.jsx'
import VoiceStep from './VoiceStep.jsx'
import { VOICE_ITEMS, VOICE_PARTS } from '../voiceItems.js'

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

const SENTIMENTS = [
  { value: 'Positive', emoji: '😊', className: 'pos' },
  { value: 'Neutral', emoji: '😐', className: 'neu' },
  { value: 'Negative', emoji: '😞', className: 'neg' },
]

const STEPS = [
  { title: 'Rating', desc: 'Your overall impression', heading: 'How would you rate us?' },
  {
    title: 'Kerplunk Voice',
    desc: '12 areas in 4 quick parts',
    heading: 'Kerplunk Voice',
    sub: 'Rate each area. Comments are optional.',
  },
  { title: 'Feedback', desc: 'Tell us in your own words', heading: 'Share your feedback', sub: 'Good or bad, be honest. Nobody will know it was you.' },
]

// Internal pages: Rating, one page per Kerplunk Voice part, then Feedback.
const PAGES = [{ step: 0 }, ...VOICE_PARTS.map((_, part) => ({ step: 1, part })), { step: 2 }]
const firstPageOf = (step) => PAGES.findIndex((p) => p.step === step)

const MAX = 1000

const initialState = {
  overallRating: 0,
  sentiment: '',
  voice: Object.fromEntries(VOICE_ITEMS.map((v) => [v.key, { rating: 0, comment: '' }])),
  feedback: '',
  website: '', // honeypot – real users never see/fill this
}

const missingMsg = (n) => `Please rate ${n === 1 ? 'this area' : `all ${n} areas`} to continue.`

function validatePage(page, form) {
  const e = {}
  const { step, part } = PAGES[page]
  if (step === 0 && !form.overallRating) e.overallRating = 'Please pick a star rating to continue.'
  if (step === 0 && !form.sentiment) e.sentiment = 'Please choose how your experience felt.'
  if (step === 1) {
    const missing = VOICE_PARTS[part].items.filter((v) => !form.voice[v.key].rating).map((v) => v.key)
    if (missing.length) {
      e.voice = missingMsg(missing.length)
      e.missing = missing
    }
  }
  if (step === 2 && !form.feedback.trim()) {
    e.text = 'Please write a few words of feedback.'
  }
  return e
}

export default function FeedbackForm({ onExit }) {
  const [form, setForm] = useState(initialState)
  const [page, setPage] = useState(0)
  const step = PAGES[page].step
  const [dir, setDir] = useState('next') // animation direction
  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(0)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const cardRef = useRef(null)

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors({})
  }

  const goTo = (target) => {
    setDir(target > page ? 'next' : 'prev')
    setErrors({})
    setPage(target)
    // Keep the card in view on small screens.
    const top = cardRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const failStep = (e) => {
    setErrors(e)
    setShake((n) => n + 1)
    if (e.missing?.length) {
      setTimeout(() => {
        document
          .getElementById(`voice-${e.missing[0]}`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 60)
    }
  }

  const setVoice = (key, value) => {
    setForm((f) => ({ ...f, voice: { ...f.voice, [key]: value } }))
    setErrors((e) => {
      if (!e.missing) return e
      const missing = e.missing.filter((k) => k !== key || !value.rating)
      return missing.length
        ? { ...e, missing, voice: missingMsg(missing.length) }
        : {}
    })
  }

  const next = () => {
    const e = validatePage(page, form)
    if (Object.keys(e).length) return failStep(e)
    goTo(page + 1)
  }

  const back = () => page > 0 && goTo(page - 1)

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (page < PAGES.length - 1) return next()

    for (let p = 0; p < PAGES.length; p++) {
      const e = validatePage(p, form)
      if (Object.keys(e).length) {
        goTo(p)
        return failStep(e)
      }
    }

    // Bot filled the hidden field: pretend success, send nothing.
    if (form.website) return setStatus('success')

    setStatus('sending')
    const { website, ...data } = form
    const payload = {
      ...data,
      voice: VOICE_ITEMS.map((v) => ({
        key: v.key,
        rating: data.voice[v.key].rating,
        comment: data.voice[v.key].comment.trim(),
      })),
      feedback: data.feedback.trim(),
      submittedAt: new Date().toISOString(),
    }

    try {
      if (!SCRIPT_URL) throw new Error('VITE_GOOGLE_SCRIPT_URL is not set')
      // text/plain avoids a CORS preflight, which Apps Script does not support.
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (json.result && json.result !== 'success') throw new Error(json.error || 'Save failed')
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const reset = () => {
    setForm(initialState)
    setErrors({})
    setPage(0)
    setDir('prev')
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <section className="card success-card" aria-live="polite">
        <svg className="check" viewBox="0 0 52 52" aria-hidden="true">
          <circle className="check-circle" cx="26" cy="26" r="24" />
          <path className="check-tick" d="M15 27l7 7 15-15" />
        </svg>
        <h2>Thank you!</h2>
        <p>
          Your feedback reached the Kerplunk Media team. It's completely anonymous, and we
          read every response.
        </p>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          Submit another response
        </button>
      </section>
    )
  }

  const isLast = page === PAGES.length - 1
  const voicePart = PAGES[page].part
  const moreVoice = voicePart !== undefined && voicePart < VOICE_PARTS.length - 1

  return (
    <section className="card form-card" id="feedback" ref={cardRef}>
      <aside className="form-aside">
        {onExit && (
          <button type="button" className="back-link" onClick={onExit} aria-label="Back to start">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 12H5m6-6-6 6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="back-text">Back</span>
          </button>
        )}
        <div className="aside-head">
          <p className="aside-eyebrow">Kerplunk Media</p>
          <h3 className="aside-title">Feedback form</h3>
        </div>

      <ol className="stepper" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
        {STEPS.map((s, i) => (
          <Fragment key={s.title}>
            {i > 0 && (
              <li className="connector" aria-hidden="true">
                <span className={`connector-fill ${i <= step ? 'filled' : ''}`} />
              </li>
            )}
            <li>
              <button
                type="button"
                className={`step-item ${i === step ? 'current' : ''} ${i < step ? 'done' : ''}`}
                onClick={() => i < step && goTo(firstPageOf(i))}
                disabled={i >= step}
                aria-current={i === step ? 'step' : undefined}
              >
                <span className="dot">{i < step ? '✓' : i + 1}</span>
                <span className="dot-text">
                  <span className="dot-label">{s.title}</span>
                  <span className="dot-desc">{s.desc}</span>
                </span>
              </button>
            </li>
          </Fragment>
        ))}
      </ol>

        <p className="aside-note">
          🔒 100% anonymous. We don't collect your name, email or IP address.
        </p>
      </aside>

      <form className="form-main" onSubmit={handleSubmit} noValidate>
        <div className="step-viewport">
          <div key={page} className={`step-panel slide-${dir}`} data-step={step}>
            <div className="step-head">
              <h2>{STEPS[step].heading}</h2>
              {STEPS[step].sub && <p>{STEPS[step].sub}</p>}
            </div>

            <div>
              {step === 0 && (
                <>
                  <fieldset className="field">
                    <legend>
                      Overall, how would you rate Kerplunk Media? <span className="req">*</span>
                    </legend>
                    <StarRating
                      name="Overall rating"
                      value={form.overallRating}
                      onChange={(v) => set('overallRating', v)}
                    />
                    {errors.overallRating && <p key={shake} className="field-error shake">{errors.overallRating}</p>}
                  </fieldset>

                  <fieldset className="field">
                    <legend>
                      How was your experience? <span className="req">*</span>
                    </legend>
                    <div className="sentiments">
                      {SENTIMENTS.map((s, i) => (
                        <button
                          key={s.value}
                          type="button"
                          style={{ '--i': i }}
                          className={`sentiment stagger ${s.className} ${form.sentiment === s.value ? 'active' : ''}`}
                          aria-pressed={form.sentiment === s.value}
                          onClick={() => {
                            tap()
                            set('sentiment', s.value)
                          }}
                        >
                          <span className="sentiment-emoji" aria-hidden="true">{s.emoji}</span>
                          {s.value}
                        </button>
                      ))}
                    </div>
                    {errors.sentiment && <p key={shake} className="field-error shake">{errors.sentiment}</p>}
                  </fieldset>

                </>
              )}

              {step === 1 && (
                <>
                  <VoiceStep
                    part={voicePart}
                    voice={form.voice}
                    onChange={setVoice}
                    missing={errors.missing || []}
                    shake={shake}
                  />
                  {errors.voice && <p key={shake} className="field-error shake">{errors.voice}</p>}
                </>
              )}

              {step === 2 && (
                <>
                  <div className="summary stagger" style={{ '--i': 0 }}>
                    <div className="summary-stat">
                      <span>Overall</span>
                      <strong>
                        {'★'.repeat(form.overallRating)}
                        <span className="dim">{'★'.repeat(5 - form.overallRating)}</span>
                      </strong>
                    </div>
                    <span className="summary-sep" aria-hidden="true" />
                    <div className="summary-stat">
                      <span>Voice avg</span>
                      <strong className="summary-avg">{voiceAverage(form.voice)}</strong>
                    </div>
                    <span className={`tag ${form.sentiment.toLowerCase()}`}>{form.sentiment}</span>
                  </div>
                  <TextBox
                    id="feedback"
                    tone="sug"
                    index={1}
                    rows={6}
                    label={<>Your feedback <span className="req">*</span></>}
                    placeholder="Tell us anything: what you liked, what we should improve, or ideas for us…"
                    value={form.feedback}
                    onChange={(v) => set('feedback', v)}
                  />
                  {errors.text && <p key={shake} className="field-error shake">{errors.text}</p>}

                  {status === 'error' && (
                    <div className="alert" role="alert">
                      Something went wrong and your feedback wasn't saved. Please check your
                      connection and try again.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          className="hp"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => set('website', e.target.value)}
          aria-hidden="true"
        />

        <div className="nav">
          {step > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-back"
              onClick={back}
              disabled={status === 'sending'}
              aria-label="Previous"
            >
              <span aria-hidden="true">←</span>
              <span className="btn-label">Back</span>
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
            {status === 'sending' ? (
              <>
                <span className="spinner" aria-hidden="true" /> Sending…
              </>
            ) : isLast ? (
              'Submit feedback ✓'
            ) : moreVoice ? (
              'Next →'
            ) : (
              'Continue →'
            )}
          </button>
        </div>
        <p className="fine">🔒 We don't collect your name, email or IP address.</p>
      </form>
    </section>
  )
}

function voiceAverage(voice) {
  const r = VOICE_ITEMS.map((v) => voice[v.key].rating).filter(Boolean)
  return r.length ? (r.reduce((a, b) => a + b, 0) / r.length).toFixed(1) + ' / 5' : '–'
}

function TextBox({ id, label, placeholder, value, onChange, tone, index, rows = 4 }) {
  return (
    <div className={`field textbox stagger tone-${tone}`} style={{ '--i': index }}>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        rows={rows}
        maxLength={MAX}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="counter">
        {value.length}/{MAX}
      </span>
    </div>
  )
}
