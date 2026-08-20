import { Link, useLocation } from 'react-router-dom'

export default function Layout({ children }) {
  const location = useLocation()

  const navLink = (to, label) => {
    const active = location.pathname === to
    return (
      <Link
        to={to}
        className={`font-mono text-sm tracking-wide px-3 py-1.5 rounded transition-colors ${
          active
            ? 'bg-highlight text-board font-semibold'
            : 'text-paper/80 hover:text-paper hover:bg-board-light'
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-board text-paper sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between flex-wrap gap-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-paper">PTU English Prep</span>
            <span className="font-mono text-[11px] text-highlight-soft/80 hidden sm:inline">AECC · BTHU103/104</span>
          </Link>
          <nav className="flex items-center gap-1">
           {navLink('/', 'Home')}
            {navLink('/theory', 'Theory')}
            {navLink('/lab', 'Lab')}
            {navLink('/pyq', 'PYQ')}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink/10 mt-16">
        <div className="max-w-5xl mx-auto px-5 py-6 text-sm text-ink-soft font-mono">
          Built by Mr. Dev Kumar, for the class — content added unit by unit.
        </div>
      </footer>
    </div>
  )
}
