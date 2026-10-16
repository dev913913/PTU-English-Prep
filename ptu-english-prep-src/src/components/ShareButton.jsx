import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

const SHARE_TEXT = ‘PTU English Prep by Mr. Dev Kumar — free notes, quizzes and previous year papers for AECC English (Theory & Lab).’

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  // Fallback for older browsers / non-https
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      if (ok) resolve()
      else reject(new Error('copy failed'))
    } catch (e) {
      reject(e)
    }
  })
}

export default function ShareButton() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('')
  const wrapRef = useRef(null)
  const timerRef = useRef(null)

  // Close menu when the page changes
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const flash = (msg) => {
    setStatus(msg)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setStatus(''), 2200)
  }

  // Always the current page, without hash or tracking params
  const getUrl = () => `${window.location.origin}${window.location.pathname}`

  const openExternal = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  const shareWhatsApp = () =>
    openExternal(`https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT}\n${getUrl()}`)}`)

  const shareTelegram = () =>
    openExternal(
      `https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(SHARE_TEXT)}`
    )

  const copyLink = async () => {
    try {
      await copyText(getUrl())
      flash('Link copied!')
    } catch {
      flash('Could not copy')
    }
    setOpen(false)
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: document.title, text: SHARE_TEXT, url: getUrl() })
    } catch (e) {
      if (e && e.name !== 'AbortError') flash('Could not share')
    }
    setOpen(false)
  }

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  const itemClass =
    'w-full text-left px-4 py-2.5 text-sm text-ink hover:bg-paper-dark transition-colors flex items-center gap-2'

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="font-mono text-sm tracking-wide px-3 py-1.5 rounded text-paper/80 hover:text-paper hover:bg-board-light transition-colors flex items-center gap-1.5"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
          <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
        </svg>
        Share
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 bg-paper rounded-lg shadow-lg border border-ink/10 overflow-hidden z-30"
        >
          <button type="button" role="menuitem" onClick={shareWhatsApp} className={itemClass}>
            WhatsApp
          </button>
          <button type="button" role="menuitem" onClick={shareTelegram} className={itemClass}>
            Telegram
          </button>
          <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
            Copy link
          </button>
          {canNativeShare && (
            <button type="button" role="menuitem" onClick={nativeShare} className={`${itemClass} border-t border-ink/10`}>
              More options…
            </button>
          )}
        </div>
      )}

      <span role="status" aria-live="polite" className="sr-only">{status}</span>
      {status && (
        <div className="absolute right-0 mt-2 whitespace-nowrap bg-highlight text-board font-mono text-xs font-semibold px-3 py-1.5 rounded shadow-md z-30">
          {status}
        </div>
      )}
    </div>
  )
}
