const points = [
  { icon: '🕶️', title: 'No name, no email', text: 'We never ask who you are. Nothing personal is stored.' },
  { icon: '⚡', title: 'Takes 2 minutes', text: 'A quick rating and a few honest words is all we need.' },
  { icon: '🚀', title: 'We act on it', text: 'Every response is read by our team and shapes what we do next.' },
]

export default function Hero() {
  return (
    <section className="hero">
      <span className="pill pill-brand">We're listening 👂</span>
      <h1>
        Your honest feedback 
      </h1>
      <p className="hero-sub">
        Good or bad, tell us how we're doing. Rate your experience and share what we
        should keep doing and what we should fix.
      </p>

      <ul className="points">
        {points.map((p) => (
          <li key={p.title} className="point">
            <span className="point-icon" aria-hidden="true">{p.icon}</span>
            <div>
              <strong>{p.title}</strong>
              <p>{p.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
