import { useState } from 'react'
import StarRating from './StarRating.jsx'
import { VOICE_ITEMS } from '../voiceItems.js'

const LABELS = ['', 'Very poor', 'Poor', 'Okay', 'Good', 'Excellent']
const MAX_COMMENT = 500

export default function VoiceStep({ voice, onChange, missing, shake }) {
  const [open, setOpen] = useState(() =>
    Object.fromEntries(VOICE_ITEMS.map((v) => [v.key, Boolean(voice[v.key].comment)]))
  )
  const rated = VOICE_ITEMS.filter((v) => voice[v.key].rating).length
  const pct = (rated / VOICE_ITEMS.length) * 100

  const update = (key, patch) => onChange(key, { ...voice[key], ...patch })

  return (
    <div className="voice">
      <div className="voice-progress stagger" style={{ '--i': 0 }}>
        <div className="voice-progress-top">
          <span>
            <strong>{rated}</strong> of {VOICE_ITEMS.length} rated
          </span>
          {rated === VOICE_ITEMS.length && <span className="voice-done">All done ✓</span>}
        </div>
        <div className="voice-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>

      <ol className="voice-list">
        {VOICE_ITEMS.map((item, i) => {
          const v = voice[item.key]
          const isMissing = missing.includes(item.key)
          const isOpen = open[item.key]
          return (
            <li
              key={item.key}
              id={`voice-${item.key}`}
              className={`voice-item stagger ${v.rating ? 'rated' : ''} ${isMissing ? 'missing' : ''}`}
              style={{ '--i': Math.min(i + 1, 8) }}
            >
              <div className="voice-row">
                <div className="voice-label">
                  <span className="voice-icon" aria-hidden="true">{item.icon}</span>
                  <div>
                    <span className="voice-name">{item.label}</span>
                    <span className={`voice-hint ${v.rating ? 'on' : ''}`}>
                      {v.rating ? LABELS[v.rating] : isMissing ? 'Please rate this' : 'Not rated yet'}
                    </span>
                  </div>
                </div>
                <div key={isMissing ? shake : 'ok'} className={isMissing ? 'shake' : ''}>
                  <StarRating
                    size="sm"
                    name={item.label}
                    value={v.rating}
                    onChange={(r) => update(item.key, { rating: r })}
                  />
                </div>
              </div>

              <button
                type="button"
                className={`voice-toggle ${isOpen ? 'open' : ''} ${v.comment ? 'has' : ''}`}
                aria-expanded={isOpen}
                aria-controls={`voice-c-${item.key}`}
                onClick={() => setOpen((o) => ({ ...o, [item.key]: !o[item.key] }))}
              >
                <span aria-hidden="true">💬</span>
                {v.comment ? 'Edit comment' : 'Add a comment'}
                <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={`voice-collapse ${isOpen ? 'open' : ''}`} id={`voice-c-${item.key}`}>
                <div className="voice-collapse-inner">
                  <textarea
                    rows={2}
                    maxLength={MAX_COMMENT}
                    tabIndex={isOpen ? 0 : -1}
                    aria-label={`Comment on ${item.label}`}
                    placeholder={`What would you like to say about ${item.label.toLowerCase()}? (optional)`}
                    value={v.comment}
                    onChange={(e) => update(item.key, { comment: e.target.value })}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
