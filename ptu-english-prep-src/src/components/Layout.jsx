import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ShareButton from './ShareButton'
import useSwipeNavigation from '../hooks/useSwipeNavigation'

const TABS = [
  { to: '/', label: 'Home' },
  { to: '/theory', label: 'Theory' },
  { to: '/lab', label: 'Lab' },
  { to: '/pyq', label: 'PYQ' },
]

export default function Layout({ children }) {
  const location = useLocation()
  useSwipeNavigation()

  const navRef = useRef(null)
  const linkRefs = useRef({})
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, visible: false })
  const [animate, setAnimate] = useState(false)

  const isActive = (to) =>
    location.pathname === to ||
    (to !== '/' && location.pathname.startsWith(`${to}/`))

  const activeTo = TABS.find((tab) => isActive(tab.to))?.to

  // Measure the active tab and keep the sliding highlight under it
  useLayoutEffect(() => {
    const measure = () => {
      const el = activeTo ? linkRefs.current[activeTo] : null
      if (!el) {
        setPill((p) => (p.visible ? { ...p, visible: false } : p))
        return
      }
      const navBox = navRef.current.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      setPill({
        left: box.left - navBox.left,
        top: box.top - navBox.top,
        width: box.width,
        height: box.height,
        visible: true,
      })
    }
    measure()

    // Re-measure if the tabs change size (rotation, web fonts finishing loading)
    let observer
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      if (navRef.current) observer.observe(navRef.current)
      Object.values(linkRefs.current).forEach((el) => el && observer.observe(el))
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
    return () => observer && observer.disconnect()
  }, [activeTo])

  // Switch the slide animation on only after the first position is set,
  // so the highlight doesn't fly in from the corner on page load
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const navLink = (to, label) => {
    const active = isActive(to)
    return (
      <Link
        key={to}
        to={to}
        ref={(el) => {
          linkRefs.current[to] = el
        }}
        className={`relative z-10 font-mono text-sm tracking-wide px-3 py-1.5 rounded transition-colors ${
          active
            ? 'text-board font-semibold'
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
          <nav ref={navRef} className="relative flex items-center gap-1">
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 rounded bg-highlight pointer-events-none"
              style={{
                width: pill.width,
                height: pill.height,
                transform: `translate(${pill.left}px, ${pill.top}px)`,
                opacity: pill.visible ? 1 : 0,
                transition: animate
                  ? 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1), height 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease'
                  : 'none',
              }}
            />
            {TABS.map((tab) => navLink(tab.to, tab.label))}
            <ShareButton />
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-ink/10 mt-16">
        <div className="max-w-5xl mx-auto px-5 py-6 text-sm text-ink-soft font-mono">
           Built by <a href="https://dev-portfolio-3000.vercel.app/" target="_blank" rel="noopener noreferrer"><u>Mr. Dev Kumar</u></a>, for the class — content added unit by unit.
        </div>
      </footer>
    </div>
  )
}
