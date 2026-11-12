// Reader bookmarks. Stored only in this browser (localStorage). Nothing is saved
// unless the reader taps the Bookmark button.
const KEY = 'ptu-bookmarks'
const RESUME_KEY = 'ptu-resume'
const RESUME_MAX_AGE_MS = 15000

function readAll() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY) || '{}')
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {}
  } catch {
    return {}
  }
}

// Returns true only if the browser really stored the data
function writeAll(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

// A saved record is used only if every field has the right type
function isValid(b) {
  return (
    !!b &&
    typeof b === 'object' &&
    typeof b.title === 'string' &&
    typeof b.y === 'number' &&
    Number.isFinite(b.y)
  )
}

function cleanOpen(list) {
  return Array.isArray(list)
    ? list.filter((n) => Number.isInteger(n) && n >= 0 && n < 200)
    : []
}

export function getBookmark(path) {
  const all = readAll()
  return Object.hasOwn(all, path) && isValid(all[path]) ? all[path] : null
}

// open = positions of the answer boxes that were open when the reader saved
export function saveBookmark(path, title, y, open = []) {
  const all = readAll()
  all[path] = { title, y: Math.max(0, Math.round(y)), open: cleanOpen(open), savedAt: Date.now() }
  return writeAll(all)
}

export function removeBookmark(path) {
  const all = readAll()
  delete all[path]
  return writeAll(all)
}

// All valid bookmarks whose page starts with the given prefix, newest first
export function listBookmarks(prefix) {
  const all = readAll()
  return Object.keys(all)
    .filter((p) => p.startsWith(prefix) && isValid(all[p]))
    .map((p) => ({ path: p, ...all[p], open: cleanOpen(all[p].open) }))
    .sort((a, b) => (Number(b.savedAt) || 0) - (Number(a.savedAt) || 0))
}

// Used when the reader taps "Continue": tells the next page where to scroll
export function setResume(path, y, open = []) {
  try {
    sessionStorage.setItem(
      RESUME_KEY,
      JSON.stringify({ path, y, open: cleanOpen(open), at: Date.now() })
    )
  } catch {
    // ignore
  }
}

// Returns { y, open } once, only for the right page and only if it is fresh
export function takeResume(path) {
  const none = { y: 0, open: [] }
  try {
    const raw = sessionStorage.getItem(RESUME_KEY)
    if (!raw) return none
    sessionStorage.removeItem(RESUME_KEY)
    const r = JSON.parse(raw)
    if (!r || r.path !== path || !Number.isFinite(r.y) || r.y <= 0) return none
    if (!Number.isFinite(r.at) || Date.now() - r.at > RESUME_MAX_AGE_MS) return none
    return { y: r.y, open: cleanOpen(r.open) }
  } catch {
    return none
  }
}