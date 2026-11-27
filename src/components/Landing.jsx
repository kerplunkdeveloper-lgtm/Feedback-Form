const pills = [
  {
    text: 'No name, no email',
    icon: (
      <path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    ),
  },
  {
    text: '3 quick steps · about 2 minutes',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  {
    text: 'We act on every response',
    icon: (
      <path d="m5 12 4 4 10-10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
]

export default function Landing({ onStart }) {
  return (
    <section className="landing container">
      <div className="landing-inner">
        <p className="eyebrow stagger" style={{ '--i': 0 }}>Kerplunk Media · We're listening</p>

        <h1 className="landing-title stagger" style={{ '--i': 1 }}>
          Your honest
          <span className="accent">feedback.</span>
        </h1>

        <p className="landing-sub stagger" style={{ '--i': 2 }}>
          Good or bad, tell us how we're doing. It's anonymous, so be honest.
        </p>

        <ul className="landing-pills stagger" style={{ '--i': 3 }}>
          {pills.map((p) => (
            <li key={p.text}>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">{p.icon}</svg>
              {p.text}
            </li>
          ))}
        </ul>

        <button type="button" className="btn-start stagger" style={{ '--i': 4 }} onClick={onStart}>
          Start feedback
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  )
}
