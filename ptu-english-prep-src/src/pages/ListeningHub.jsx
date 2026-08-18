import { useParams, Link } from 'react-router-dom'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getListeningExercises } from '../lib/content'
import Breadcrumb from '../components/Breadcrumb'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

export default function ListeningHub() {
  const { track, unitId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const exercises = getListeningExercises(track, unitId)
  const trackLabel = TRACK_LABELS[track]

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: trackLabel, to: `/${track}` },
    { label: unit ? `Unit ${unit.number}` : 'Unit', to: `/${track}/${unitId}` },
    { label: 'Listening' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Breadcrumb items={crumbs} />
      <p className="font-mono text-xs text-rule tracking-widest mb-1">PART 1</p>
      <h1 className="font-display text-3xl font-semibold text-board">Listening Exercises</h1>
      <p className="text-ink-soft mt-2">Pick an exercise, watch the clip, then answer the quick check.</p>

      <div className="grid gap-4 mt-8">
        {exercises.map((ex) => (
          <Link
            key={ex.id}
            to={`/${track}/${unitId}/listening/${ex.id}`}
            className="group bg-white/60 border border-ink/10 rounded-lg p-5 hover:border-highlight hover:shadow-md transition-all flex items-center justify-between gap-4"
          >
            <span className="font-display text-lg font-semibold text-board leading-snug">{ex.title}</span>
            <span className="font-mono text-sm text-rule shrink-0 group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        ))}
      </div>

      <Link to={`/${track}/${unitId}`} className="inline-block mt-8 text-rule font-medium hover:underline">
        ← Back to Unit {unit?.number}
      </Link>
    </div>
  )
}