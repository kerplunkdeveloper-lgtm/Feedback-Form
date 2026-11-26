export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} Kerplunk Media. All rights reserved.</span>
        <span>Your response is anonymous. We don't collect names, emails or IP addresses.</span>
      </div>
    </footer>
  )
}
