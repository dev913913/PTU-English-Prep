import { useState } from 'react'
import { Link } from 'react-router-dom'
import { listBookmarks, removeBookmark, setResume } from '../lib/bookmarks'

// Shown on a unit page when the reader has bookmarked a lesson in that unit
export default function ContinueReading({ prefix }) {
  const [items, setItems] = useState(() => listBookmarks(prefix))
  if (items.length === 0) return null

  return (
    <div className="mt-6 bg-highlight/20 border border-highlight rounded-lg p-4">
      <p className="font-mono text-xs text-board tracking-widest mb-2">YOUR BOOKMARKS</p>
      <ul className="grid gap-2">
        {items.map((b) => (
          <li key={b.path} className="flex items-center justify-between gap-3">
            <Link
              to={b.path}
              onClick={() => setResume(b.path, b.y)}
              className="text-board font-medium underline"
            >
              Continue: {b.title}
            </Link>
            <button
              type="button"
              onClick={() => {
                removeBookmark(b.path)
                setItems(listBookmarks(prefix))
              }}
              className="font-mono text-xs text-ink-soft hover:underline shrink-0"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}