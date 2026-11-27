import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import Header from './components/Header.jsx'
import Landing from './components/Landing.jsx'
import FeedbackForm from './components/FeedbackForm.jsx'
import Footer from './components/Footer.jsx'

// "#form" shows the form page, anything else shows the landing page.
// Using the URL hash means the browser Back button returns to the landing page.
const isFormHash = () => window.location.hash === '#form'

const canTransition =
  typeof document !== 'undefined' &&
  'startViewTransition' in document &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Animate between pages with the View Transitions API when the browser supports it.
function switchPage(update, direction) {
  const apply = () => {
    flushSync(update)
    window.scrollTo({ top: 0 })
  }
  if (!canTransition) return apply()
  const root = document.documentElement
  root.dataset.nav = direction
  const t = document.startViewTransition(apply)
  t.finished.finally(() => delete root.dataset.nav)
}

export default function App() {
  const [started, setStarted] = useState(isFormHash)

  useEffect(() => {
    const onHash = () => {
      const next = isFormHash()
      switchPage(() => setStarted(next), next ? 'forward' : 'back')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const start = () => {
    window.location.hash = 'form' // triggers hashchange → animated switch
  }

  const goHome = () => {
    if (!isFormHash()) return
    history.pushState('', document.title, window.location.pathname + window.location.search)
    switchPage(() => setStarted(false), 'back')
  }

  return (
    <div className={`page ${started ? 'page--form' : ''}`}>
      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />
      <Header onHome={goHome} />
      <main className="main">
        {started ? (
          <div key="form" className={`form-page container ${canTransition ? '' : 'page-enter'}`}>
            <FeedbackForm onExit={goHome} />
          </div>
        ) : (
          <Landing key="landing" onStart={start} />
        )}
      </main>
      <Footer />
    </div>
  )
}
