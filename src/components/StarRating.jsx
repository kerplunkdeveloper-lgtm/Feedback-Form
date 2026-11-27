import { useState } from 'react'

// Light haptic tick on phones that support it (Android). No-op elsewhere.
export const tap = () => {
  try {
    navigator.vibrate?.(8)
  } catch {
    /* ignore */
  }
}

const LABELS = ['', 'Very poor', 'Poor', 'Okay', 'Good', 'Excellent']

export default function StarRating({ value, onChange, size = 'lg', name }) {
  const [hover, setHover] = useState(0)
  const active = hover || value

  return (
    <div className={`stars stars-${size}`}>
      <div className="stars-row" role="radiogroup" aria-label={name} onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''} – ${LABELS[n]}`}
            className={`star ${n <= active ? 'on' : ''}`}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(0)}
            onClick={() => {
              tap()
              onChange(n)
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>
      {size === 'lg' && <span className="stars-label">{active ? LABELS[active] : 'Tap to rate'}</span>}
    </div>
  )
}
