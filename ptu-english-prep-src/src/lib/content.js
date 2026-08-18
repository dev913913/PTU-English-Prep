// Loads markdown notes and MCQ json from src/content using Vite's glob import.
// Add a new unit's files following this same path pattern and they'll be picked up automatically.

const notesFiles = import.meta.glob('../content/**/notes.md', { query: '?raw', import: 'default', eager: true })
const mcqFiles = import.meta.glob('../content/**/mcqs.json', { eager: true })

export function getNotes(track, unitId) {
  const path = `../content/${track}/${unitId}/notes.md`
  return notesFiles[path] || null
}

export function getMcqs(track, unitId) {
  const path = `../content/${track}/${unitId}/mcqs.json`
  const mod = mcqFiles[path]
  return mod ? mod.default : []
}
