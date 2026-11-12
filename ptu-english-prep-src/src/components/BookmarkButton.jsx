import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getBookmark, saveBookmark, removeBookmark } from '../lib/bookmarks'

// Floating button on lesson pages. The reader chooses to save their spot.
export default function BookmarkButton({ title }) {
  const { pathname } = useLocation()
  const [saved, setSaved] = useState(() => !!getBookmark(pathname))
  const [note, setNote] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    setSaved(!!getBookmark(pathname))
    setNote('')
  }, [pathname])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const flash = (text) => {
    setNote(text)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNote(''), 2500)
  }

  const save = () => {
    saveBookmark(pathname, title, window.scrollY)
    setSaved(true)
    flash(saved ? 'Bookmark moved here' : 'Spot bookmarked')
  }

  const remove = () => {
    removeBookmark(pathname)
    setSaved(false)
    flash('Bookmark removed')
  }

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