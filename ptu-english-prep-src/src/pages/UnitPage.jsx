import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getNotes, getMcqs, getUnitParts } from '../lib/content'
import Breadcrumb from '../components/Breadcrumb'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

function QuizCallout({ track, unitId, count }) {
  return (
    <div className="bg-board rounded-lg p-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <p className="text-paper font-display text-lg font-semibold">Ready to test yourself?</p>
        <p className="text-paper/60 text-sm font-mono mt-1">{count} questions</p>
      </div>
      <Link
        to={`/${track}/${unitId}/quiz`}
        className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors shrink-0"
      >
        Take the quiz
      </Link>
    </div>
  )
}

export default function UnitPage() {
  const { track, unitId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const trackLabel = TRACK_LABELS[track]

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: trackLabel, to: `/${track}` },
    { label: unit ? `Unit ${unit.number}` : 'Unit' },
  ]

  if (!unit) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">Unit not found.</p>
        <Link to={`/${track}`} className="text-rule underline">Back to {trackLabel}</Link>
      </div>
    )
  }

  if (unit.status !== 'available') {
    return (
      <div className="max-w-3xl mx-auto px-5 py-10">
        <Breadcrumb items={crumbs} />
        <p className="font-mono text-xs text-rule tracking-widest mb-1">UNIT {unit.number}</p>
        <h1 className="font-display text-3xl font-semibold text-board">{unit.title}</h1>
        <div className="mt-8 bg-white/60 border border-dashed border-ink/20 rounded-lg p-8 text-center">
          <p className="text-ink-soft">
            Notes for this unit are being written and will appear here soon.
          </p>
          <Link to={`/${track}`} className="inline-block mt-4 text-rule font-medium hover:underline">
            ← Back to {trackLabel} units
          </Link>
        </div>
      </div>
    )
  }

  const parts = getUnitParts(track, unitId)
  const notes = getNotes(track, unitId)

  // --- Parts-based unit (e.g. Lab Unit 1): intro + part cards, no single long page ---
  if (parts && parts.length > 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-10">
        <Breadcrumb items={crumbs} />
        <p className="font-mono text-xs text-rule tracking-widest mb-1">
          {trackLabel} · UNIT {unit.number}
        </p>
        <h1 className="font-display text-3xl font-semibold text-board">{unit.title}</h1>

        {notes && (
          <div className="notebook-page mt-6">
            <div className="notes-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{notes}</ReactMarkdown>
            </div>
          </div>
        )}

        <div className="grid gap-4 mt-8">
          {parts.map((part) => {
            const href = part.type === 'listening'
              ? `/${track}/${unitId}/listening`
              : `/${track}/${unitId}/${part.id}`
            return (
              <Link
                key={part.id}
                to={href}
                className="group bg-white/60 border border-ink/10 rounded-lg p-5 hover:border-highlight hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-rule tracking-wider mb-1">PART {part.number}</p>
                    <h3 className="font-display text-lg font-semibold text-board leading-snug">{part.title}</h3>
                    {part.blurb && <p className="text-sm text-ink-soft mt-1">{part.blurb}</p>}
                  </div>
                  <span className="font-mono text-sm text-rule shrink-0 group-hover:translate-x-0.5 transition-transform mt-1">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  // --- Standard unit (e.g. Theory units): full notes page with quiz above and below ---
  const mcqs = getMcqs(track, unitId)

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Breadcrumb items={crumbs} />
      <p className="font-mono text-xs text-rule tracking-widest mb-1">
        {trackLabel} · UNIT {unit.number}
      </p>
      <h1 className="font-display text-3xl font-semibold text-board">{unit.title}</h1>

      {mcqs.length > 0 && (
        <div className="mt-6">
          <QuizCallout track={track} unitId={unitId} count={mcqs.length} />
        </div>
      )}

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
        <div className="mt-10">
          <QuizCallout track={track} unitId={unitId} count={mcqs.length} />
        </div>
      )}
    </div>
  )
}