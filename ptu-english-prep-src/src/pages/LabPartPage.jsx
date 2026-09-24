import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getUnitParts, getPartContent, getPartMcqs } from '../lib/content'
import Breadcrumb from '../components/Breadcrumb'
import QuizWidget from '../components/QuizWidget'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

function SelfIntroductionBuilderCallout({ track, unitId, partId }) {
  return (
    <div className="bg-board rounded-lg p-6 flex items-center justify-between flex-wrap gap-4 mb-8">
      <div>
        <p className="text-paper font-display text-lg font-semibold">Want help creating your own self-introduction?</p>
        <p className="text-paper/60 text-sm font-mono mt-1">Writing practice · build your introduction from your own ideas</p>
      </div>
      <Link
        to={'/' + track + '/' + unitId + '/' + partId + '/builder'}
        className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors shrink-0"
      >
        Build yours
      </Link>
    </div>
  )
}


export default function LabPartPage() {
  const { track, unitId, partId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const parts = getUnitParts(track, unitId) || []
  const part = parts.find((p) => p.id === partId)
  const content = part ? getPartContent(track, unitId, part.id) : null
  const mcqs = part ? getPartMcqs(track, unitId, part.id) : []
  const trackLabel = TRACK_LABELS[track]

  if (!unit || !part) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">Page not found.</p>
        <Link to={`/${track}/${unitId}`} className="text-rule underline">Back to unit</Link>
      </div>
    )
  }

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: trackLabel, to: `/${track}` },
    { label: `Unit ${unit.number}`, to: `/${track}/${unitId}` },
    { label: part.title },
  ]

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Breadcrumb items={crumbs} />
      <p className="font-mono text-xs text-rule tracking-widest mb-1">PART {part.number}</p>
      <h1 className="font-display text-3xl font-semibold text-board">{part.title}</h1>

      {track === 'lab' && unitId === 'unit1' && partId === 'self-introduction' && (
        <SelfIntroductionBuilderCallout track={track} unitId={unitId} partId={partId} />
      )}

      <div className="notebook-page mt-6">
        <div className="notes-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content || 'Content coming soon.'}
          </ReactMarkdown>
        </div>
      </div>

      {mcqs.length > 0 && (
        <QuizWidget
          key={`quiz-progress:${track}:${unitId}:part:${part.id}`}
          mcqs={mcqs}
          title={`${unit.title}: ${part.title}`}
          storageKey={`quiz-progress:${track}:${unitId}:part:${part.id}`}
        />
      )}

      <Link to={`/${track}/${unitId}`} className="inline-block mt-8 text-rule font-medium hover:underline">
        ← Back to Unit {unit.number}
      </Link>
    </div>
  )
}