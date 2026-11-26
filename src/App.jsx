import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import FeedbackForm from './components/FeedbackForm.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="page">
      <div className="bg-blob blob-1" aria-hidden="true" />
      <div className="bg-blob blob-2" aria-hidden="true" />
      <Header />
      <main className="container main-grid">
        <Hero />
        <FeedbackForm />
      </main>
      <Footer />
    </div>
  )
}
