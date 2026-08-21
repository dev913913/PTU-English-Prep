import { useParams, Link } from 'react-router-dom'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getMcqs } from '../lib/content'
import Breadcrumb from '../components/Breadcrumb'
import QuizWidget from '../components/QuizWidget'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

export default function QuizPage() {
  const { track, unitId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const mcqs = getMcqs(track, unitId)
  const trackLabel = TRACK_LABELS[track]

  if (!unit || mcqs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">No quiz available for this unit yet.</p>
        <Link to={`/${track}/${unitId}`} className="text-rule underline">Back to notes</Link>
      </div>
    )
  }

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: trackLabel, to: `/${track}` },
    { label: `Unit ${unit.number}`, to: `/${track}/${unitId}` },
    { label: 'Quiz' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <Breadcrumb items={crumbs} />
      <p className="font-mono text-xs text-rule tracking-widest mb-1">
        {trackLabel} · UNIT {unit.number}
      </p>
      <h1 className="font-display text-2xl font-semibold text-board mb-2">{unit.title} — Quiz</h1>

           <QuizWidget
        key={`quiz-progress:${track}:${unitId}`}
        mcqs={mcqs}
        title={`${trackLabel} Unit ${unit.number} — ${unit.title}`}
        storageKey={`quiz-progress:${track}:${unitId}`}
      />
      <Link to={`/${track}/${unitId}`} className="inline-block mt-6 text-rule font-medium hover:underline">
        ← Back to notes
      </Link>
         <p className="text-xs text-ink-soft mt-1">Your progress is saved in this browser tab — safe to go back and resume, but it won't carry over if you close the tab or switch devices.</p>
    </div>
  )
}
