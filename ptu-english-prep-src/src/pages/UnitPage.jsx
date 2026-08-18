import { useParams, Link } from 'react-router-dom'
import rehypeRaw from 'rehype-raw'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getNotes, getMcqs } from '../lib/content'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

export default function UnitPage() {
  const { track, unitId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)

  if (!unit) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">Unit not found.</p>
        <Link to={`/${track}`} className="text-rule underline">Back to {TRACK_LABELS[track]}</Link>
      </div>
    )
  }

  if (unit.status !== 'available') {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16">
        <p className="font-mono text-xs text-rule tracking-widest mb-1">UNIT {unit.number}</p>
        <h1 className="font-display text-3xl font-semibold text-board">{unit.title}</h1>
        <div className="mt-8 bg-white/60 border border-dashed border-ink/20 rounded-lg p-8 text-center">
          <p className="text-ink-soft">
            Notes for this unit are being written and will appear here soon.
          </p>
          <Link to={`/${track}`} className="inline-block mt-4 text-rule font-medium hover:underline">
            ← Back to {TRACK_LABELS[track]} units
          </Link>
        </div>
      </div>
    )
  }

  const notes = getNotes(track, unitId)
  const mcqs = getMcqs(track, unitId)

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <p className="font-mono text-xs text-rule tracking-widest mb-1">
        {TRACK_LABELS[track]} · UNIT {unit.number}
      </p>
      <h1 className="font-display text-3xl font-semibold text-board">{unit.title}</h1>

      {notes ? (
        <div className="notebook-page mt-8">
          <div className="notes-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{notes}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-ink-soft">Notes coming soon.</p>
      )}

      {mcqs.length > 0 && (
        <div className="mt-10 bg-board rounded-lg p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-paper font-display text-lg font-semibold">Ready to test yourself?</p>
            <p className="text-paper/60 text-sm font-mono mt-1">{mcqs.length} questions · Unit {unit.number}</p>
          </div>
          <Link
            to={`/${track}/${unitId}/quiz`}
            className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors shrink-0"
          >
            Take the quiz
          </Link>
        </div>
      )}
    </div>
  )
}
