import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// Forward order for swiping left. Swiping right goes the other way.
const SECTIONS = ['/', '/theory', '/lab', '/pyq']

 const MIN_DISTANCE_FRACTION = 0.35 // finger must travel this share of the screen width sideways
const MAX_DURATION = 500  // ms - slow drags are not swipes
const DIRECTION_RATIO = 3 // sideways movement must beat vertical by this much
const EDGE_ZONE = 24      // px - ignore swipes starting at screen edges (browser Back gesture)

/** Which main section a path belongs to: 0 Home, 1 Theory, 2 Lab, 3 PYQ, -1 unknown. */
function getSectionIndex(pathname) {
  if (pathname === '/') return 0
  const first = pathname.split('/')[1]
  if (first === 'theory') return 1
  if (first === 'lab') return 2
  if (first === 'pyq') return 3
  return -1
}

/** Pages where swiping is switched off so students don't leave mid-answer. */
function isSwipeDisabledPath(pathname) {
  return /\/quiz\/?$/.test(pathname) || /\/listening\/[^/]+/.test(pathname)
}

/** True if the touch began somewhere that has its own touch behaviour. */
function startsInProtectedArea(target) {
  if (!(target instanceof Element)) return false
  if (target.closest('input, textarea, select, video, audio, [data-no-swipe]')) return true
  // Anything the student can scroll sideways (wide tables, code blocks)
  for (let el = target; el && el !== document.body; el = el.parentElement) {
    if (el.scrollWidth > el.clientWidth + 1) {
      const overflowX = window.getComputedStyle(el).overflowX
      if (overflowX === 'auto' || overflowX === 'scroll') return true
    }
  }
  return false
}

export default function useSwipeNavigation() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const current = getSectionIndex(pathname)
    if (current === -1 || isSwipeDisabledPath(pathname)) return

    let start = null

    const onTouchStart = (e) => {
      // One finger only (two fingers = pinch zoom)
      if (e.touches.length !== 1) {
        start = null
        return
      }
      const t = e.touches[0]
      const nearEdge = t.clientX < EDGE_ZONE || t.clientX > window.innerWidth - EDGE_ZONE
      const zoomed = window.visualViewport && window.visualViewport.scale > 1.01
      if (nearEdge || zoomed || startsInProtectedArea(e.target)) {
        start = null
        return
      }
      start = { x: t.clientX, y: t.clientY, time: Date.now() }
    }

    const onTouchEnd = (e) => {
      if (!start) return
      const t = e.changedTouches[0]
      const dx = t.clientX - start.x
      const dy = t.clientY - start.y
      const elapsed = Date.now() - start.time
      start = null

      if (elapsed > MAX_DURATION) return
      if (Math.abs(dx) < window.innerWidth * MIN_DISTANCE_FRACTION) return
      if (Math.abs(dx) < Math.abs(dy) * DIRECTION_RATIO) return
      // Student was selecting text, not swiping
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) return

      const next = current + (dx < 0 ? 1 : -1) // swipe left = forward
      if (next < 0 || next >= SECTIONS.length) return
      navigate(SECTIONS[next])
    }

    const onTouchCancel = () => {
      start = null
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('touchcancel', onTouchCancel, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchCancel)
    }
  }, [pathname, navigate])
}
