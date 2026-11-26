import { useState } from 'react'

export default function Header() {
  const [logoOk, setLogoOk] = useState(true)

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="brand" aria-label="Kerplunk Media home">
          {logoOk ? (
            <img
              src="/logo.png"
              alt="Kerplunk Media"
              className="brand-logo"
              onError={() => setLogoOk(false)}
            />
          ) : (
            <>
              <span className="brand-mark">K</span>
              <span className="brand-name">
                Kerplunk<span className="brand-accent"> Media</span>
              </span>
            </>
          )}
        </a>
        <span className="pill pill-safe">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          100% Anonymous
        </span>
      </div>
    </header>
  )
}
