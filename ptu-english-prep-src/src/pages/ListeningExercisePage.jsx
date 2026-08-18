import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getListeningExercises, getListeningExerciseContent } from '../lib/content'
import Breadcrumb from '../components/Breadcrumb'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

export default function ListeningExercisePage() {
  const { track, unitId, exerciseId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const exercises = getListeningExercises(track, unitId)
  const exercise = exercises.find((e) => e.id === exerciseId)
  const content = getListeningExerciseContent(track, unitId, exerciseId)
  const trackLabel = TRACK_LABELS[track]

  if (!exercise) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">Exercise not found.</p>
        <Link to={`/${track}/${unitId}/listening`} className="text-rule underline">
          Back to Listening Exercises
        </Link>
      </div>
    )
  }

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: trackLabel, to: `/${track}` },
    { label: unit ? `Unit ${unit.number}` : 'Unit', to: `/${track}/${unitId}` },
    { label: 'Listening', to: `/${track}/${unitId}/listening` },
    { label: exercise.title.replace(/^Listening Exercise \d+:\s*/, '') },
  ]

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Breadcrumb items={crumbs} />
      <h1 className="font-display text-2xl font-semibold text-board">{exercise.title}</h1>

      <div className="notes-content mt-6">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {content || 'Content coming soon.'}
        </ReactMarkdown>
      </div>

      <Link to={`/${track}/${unitId}/listening`} className="inline-block mt-6 text-rule font-medium hover:underline">
        ← All listening exercises
      </Link>
    </div>
  )
}