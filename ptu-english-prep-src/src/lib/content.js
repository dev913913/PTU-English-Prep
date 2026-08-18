// Loads markdown notes and MCQ json from src/content using Vite's glob import.
// Add a new unit's files following this same path pattern and they'll be picked up automatically.

const notesFiles = import.meta.glob('../content/**/notes.md', { query: '?raw', import: 'default', eager: true })
const mcqFiles = import.meta.glob('../content/**/mcqs.json', { eager: true })
const listeningConfigs = import.meta.glob('../content/**/listening.js', { eager: true })
const listeningContentFiles = import.meta.glob('../content/**/listening/*.md', { query: '?raw', import: 'default', eager: true })
const partsConfigs = import.meta.glob('../content/**/parts.js', { eager: true })
const partContentFiles = import.meta.glob('../content/**/parts/*.md', { query: '?raw', import: 'default', eager: true })

export function getNotes(track, unitId) {
  const path = `../content/${track}/${unitId}/notes.md`
  return notesFiles[path] || null
}

export function getMcqs(track, unitId) {
  const path = `../content/${track}/${unitId}/mcqs.json`
  const mod = mcqFiles[path]
  return mod ? mod.default : []
}

export function getListeningExercises(track, unitId) {
  const path = `../content/${track}/${unitId}/listening.js`
  const mod = listeningConfigs[path]
  return mod ? mod.listeningExercises : []
}

export function getListeningExerciseContent(track, unitId, exerciseId) {
  const path = `../content/${track}/${unitId}/listening/${exerciseId}.md`
  return listeningContentFiles[path] || null
}

export function getUnitParts(track, unitId) {
  const path = `../content/${track}/${unitId}/parts.js`
  const mod = partsConfigs[path]
  return mod ? mod.unitParts : null
}

export function getPartContent(track, unitId, partId) {
  const path = `../content/${track}/${unitId}/parts/${partId}.md`
  return partContentFiles[path] || null
}