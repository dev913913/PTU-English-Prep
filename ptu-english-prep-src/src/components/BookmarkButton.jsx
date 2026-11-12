import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getBookmark, saveBookmark, removeBookmark } from '../lib/bookmarks'

// Floating button on lesson pages. The reader chooses to save their spot.
// It hides itself while the quiz is on screen, so it never covers quiz buttons.
export default function BookmarkButton({ title }) {
  const { pathname } = useLocation()
  const [saved, setSaved] = useState(() => !!getBookmark(pathname))
  const [note, setNote] = useState('')
  const [hidden, setHidden] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setSaved(!!getBookmark(pathname))
    setNote('')
  }, [pathname])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // Hide while anything marked data-bookmark-hide (the quiz) is visible
  useEffect(() => {
    setHidden(false)
    const el = document.querySelector('[data-bookmark-hide]')
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [pathname])

  const flash = (text) => {
    setNote(text)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNote(''), 2500)
  }

  const save = () => {
    // Remember which answer boxes are open, so Continue can open them again
    const open = []
    document.querySelectorAll('details').forEach((d, i) => {
      if (d.open) open.push(i)
    })
    const ok = saveBookmark(pathname, title, window.scrollY, open)
    setSaved(!!getBookmark(pathname))
    flash(ok ? (saved ? 'Bookmark moved here' : 'Spot bookmarked') : 'Could not save: browser storage is blocked')
  }

  const remove = () => {
    const ok = removeBookmark(pathname)
    setSaved(!!getBookmark(pathname))
    flash(ok ? 'Bookmark removed' : 'Could not remove: browser storage is blocked')
  }

  if (hidden) return null

  const btn =
    'font-mono text-xs font-semibold px-3 py-2 rounded-full shadow-md border border-ink/10 bg-paper text-board hover:bg-highlight transition-colors'

  return (
    <div className="fixed bottom-4 right-4 z-20 flex flex-col items-end gap-2" data-no-swipe="">
      {note && (
        <span role="status" aria-live="polite" className="bg-board text-paper font-mono text-xs px-3 py-1.5 rounded shadow-md">
          {note}
        </span>
      )}
      <div className="flex gap-2">
        {saved && (
          <button type="button" onClick={remove} className={btn}>
            Remove
          </button>
        )}
        <button type="button" onClick={save} className={btn}>
          {saved ? 'Move bookmark here' : 'Bookmark this spot'}
        </button>
      </div>
    </div>
  )
}