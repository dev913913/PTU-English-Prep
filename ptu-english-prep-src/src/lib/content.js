// Loads markdown notes and MCQ json from src/content using Vite's glob import.
// Add a new unit's files following this same path pattern and they'll be picked up automatically.

const notesFiles = import.meta.glob('../content/**/notes.md', { query: '?raw', import: 'default', eager: true })
const mcqFiles = import.meta.glob('../content/**/mcqs.json', { eager: true })
const listeningConfigs = import.meta.glob('../content/**/listening.js', { eager: true })
const listeningContentFiles = import.meta.glob('../content/**/listening/*.md', { query: '?raw', import: 'default', eager: true })
const listeningMcqFiles = import.meta.glob('../content/**/listening/*-mcqs.json', { eager: true })
const partsConfigs = import.meta.glob('../content/**/parts.js', { eager: true })
const partContentFiles = import.meta.glob('../content/**/parts/*.md', { query: '?raw', import: 'default', eager: true })
const partMcqFiles = import.meta.glob('../content/**/parts/*-mcqs.json', { eager: true })

/**
 * Retrieves markdown notes content for a specific unit.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @returns {string|null} The markdown content as a string, or null if not found
 */
export function getNotes(track, unitId) {
  const path = `../content/${track}/${unitId}/notes.md`
  return notesFiles[path] || null
}

/**
 * Retrieves multiple choice questions for a specific unit.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @returns {Array} Array of MCQ objects, or empty array if not found
 */
export function getMcqs(track, unitId) {
  const path = `../content/${track}/${unitId}/mcqs.json`
  const mod = mcqFiles[path]
  return mod ? mod.default : []
}

/**
 * Retrieves the list of listening exercises for a specific unit.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @returns {Array} Array of listening exercise objects, or empty array if not found
 */
export function getListeningExercises(track, unitId) {
  const path = `../content/${track}/${unitId}/listening.js`
  const mod = listeningConfigs[path]
  return mod ? mod.listeningExercises : []
}

/**
 * Retrieves markdown content for a specific listening exercise.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @param {string} exerciseId - The exercise identifier
 * @returns {string|null} The markdown content as a string, or null if not found
 */
export function getListeningExerciseContent(track, unitId, exerciseId) {
  const path = `../content/${track}/${unitId}/listening/${exerciseId}.md`
  return listeningContentFiles[path] || null
}

/**
 * Retrieves multiple choice questions for a specific listening exercise.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @param {string} exerciseId - The exercise identifier
 * @returns {Array} Array of MCQ objects, or empty array if not found
 */
export function getListeningMcqs(track, unitId, exerciseId) {
  const path = `../content/${track}/${unitId}/listening/${exerciseId}-mcqs.json`
  const mod = listeningMcqFiles[path]
  return mod ? mod.default : []
}

/**
 * Retrieves the configuration of parts for a specific unit.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @returns {Array|null} Array of unit part objects, or null if not found
 */
export function getUnitParts(track, unitId) {
  const path = `../content/${track}/${unitId}/parts.js`
  const mod = partsConfigs[path]
  return mod ? mod.unitParts : null
}

/**
 * Retrieves markdown content for a specific part within a unit.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @param {string} partId - The part identifier
 * @returns {string|null} The markdown content as a string, or null if not found
 */
export function getPartContent(track, unitId, partId) {
  const path = `../content/${track}/${unitId}/parts/${partId}.md`
  return partContentFiles[path] || null
}

/**
 * Retrieves multiple choice questions for a specific part within a unit.
 * @param {string} track - The track identifier (e.g., 'theory', 'lab')
 * @param {string} unitId - The unit identifier (e.g., 'unit1', 'unit2')
 * @param {string} partId - The part identifier
 * @returns {Array} Array of MCQ objects, or empty array if not found
 */
export function getPartMcqs(track, unitId, partId) {
  const path = `../content/${track}/${unitId}/parts/${partId}-mcqs.json`
  const mod = partMcqFiles[path]
  return mod ? mod.default : []
}