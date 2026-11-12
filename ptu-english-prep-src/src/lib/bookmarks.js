// Reader bookmarks. Stored only in this browser (localStorage). Nothing is saved
// unless the reader taps the Bookmark button.
const KEY = 'ptu-bookmarks'
const RESUME_KEY = 'ptu-resume'

function readAll() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}')
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // storage blocked or full: bookmarks simply do not save
  }
}

export function getBookmark(path) {
  const all = readAll()
  const b = Object.hasOwn(all, path) ? all[path] : null
  return b && typeof b.y === 'number' ? b : null
}

export function saveBookmark(path, title, y) {
  const all = readAll()
  all[path] = { title, y: Math.max(0, Math.round(y)), savedAt: Date.now() }
  writeAll(all)
}

export function removeBookmark(path) {
  const all = readAll()
  delete all[path]
  writeAll(all)
}

// All bookmarks whose page starts with the given prefix, newest first
export function listBookmarks(prefix) {
  const all = readAll()
  return Object.keys(all)
    .filter((p) => p.startsWith(prefix) && all[p] && typeof all[p].y === 'number')
    .map((p) => ({ path: p, ...all[p] }))
    .sort((a, b) => (b.savedAt || 0) - (a.savedAt || 0))
}

// Used when the reader taps "Continue": tells the next page where to scroll
export function setResume(path, y) {
  try {
    sessionStorage.setItem(RESUME_KEY, JSON.stringify({ path, y }))
  } catch {
    // ignore
  }
}

export function takeResume(path) {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY)
    if (!raw) return 0
    sessionStorage.removeItem(RESUME_KEY)
    const r = JSON.parse(raw)
    return r && r.path === path && Number.isFinite(r.y) && r.y > 0 ? r.y : 0
  } catch {
    return 0
  }
}