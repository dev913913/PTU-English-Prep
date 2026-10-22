import { useState } from 'react'

const MAX_CHARS = 600
const REQUEST_TIMEOUT_MS = 28000

function loadDraft(key) {
  try {
    const raw = sessionStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function saveDraft(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable: the practice still works, the draft just isn't kept
  }
}

// Only trust a reply that has the shape we expect.
function readReply(data, questions) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.results)) return null
  const byId = {}
  for (const r of data.results) {
    if (r && typeof r.id === 'string') byId[r.id] = r
  }
  if (!questions.every((q) => byId[q.id])) return null
  if (data.status === 'evaluated') {
    const ok = questions.every((q) => Number.isInteger(byId[q.id].marks))
    return ok ? { ...data, byId } : null
  }
  if (data.status === 'unavailable') return { ...data, byId }
  return null
}

export default function ReadingPractice({ exercise, exerciseId }) {
  const draftKey = `reading-draft:${exerciseId}`
  const [answers, setAnswers] = useState(() => loadDraft(draftKey))
  const [phase, setPhase] = useState('writing') // writing | sending | done | error
  const [reply, setReply] = useState(null)
  const [errorText, setErrorText] = useState('')

  const hasAnyAnswer = exercise.questions.some((q) => (answers[q.id] || '').trim())

  function updateAnswer(id, value) {
    const next = { ...answers, [id]: value.slice(0, MAX_CHARS) }
    setAnswers(next)
    saveDraft(draftKey, next)
  }

  async function submit() {
    if (!hasAnyAnswer || phase === 'sending') return
    setPhase('sending')
    setErrorText('')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const res = await fetch('/api/evaluate-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId, answers }),
        signal: controller.signal,
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setErrorText((data && data.error) || 'Something went wrong. Please try again.')
        setPhase('error')
        return
      }
      const parsed = readReply(data, exercise.questions)
      if (!parsed) {
        setErrorText('The marking reply was not understood. Please try again.')
        setPhase('error')
        return
      }
      setReply(parsed)
      setPhase('done')
    } catch {
      setErrorText('Could not reach the marking service. Check your internet and try again. Your answers are still saved here.')
      setPhase('error')
    } finally {
      clearTimeout(timer)
    }
  }

  function tryAgain() {
    setReply(null)
    setPhase('writing')
  }

  function startOver() {
    setAnswers({})
    saveDraft(draftKey, {})
    setReply(null)
    setPhase('writing')
  }

  const evaluated = phase === 'done' && reply && reply.status === 'evaluated'
  const unavailable = phase === 'done' && reply && reply.status === 'unavailable'

  return (
    <div data-no-swipe>
      <div className="notebook-page mt-6">
        <div className="notes-content">
          <h2>Read the passage</h2>
          <blockquote>
            <p>{exercise.passage}</p>
          </blockquote>
          <p>
            Write each answer in your own words, in one or two sentences. Do not type your name, phone number or
            other personal details.
          </p>
        </div>
      </div>

      {evaluated && (
        <div className="mt-8 bg-board rounded-lg p-6" role="status">
          <p className="text-paper/60 text-sm font-mono">YOUR SCORE</p>
          <p className="text-paper font-display text-3xl font-semibold mt-1">
            {reply.total} / {reply.max}
          </p>
          <p className="text-paper/60 text-sm mt-2">Marked by AI as a study aid. Your teacher's marking is final.</p>
        </div>
      )}

      {unavailable && (
        <div className="mt-8 bg-white/60 border border-highlight rounded-lg p-5" role="status">
          <p className="font-display text-lg font-semibold text-board">No marks this time</p>
          <p className="text-ink-soft mt-1">{reply.message}</p>
        </div>
      )}

      {phase === 'error' && (
        <div className="mt-8 bg-white/60 border border-rule rounded-lg p-5" role="alert">
          <p className="text-ink">{errorText}</p>
        </div>
      )}

      <div className="mt-8 grid gap-6">
        {exercise.questions.map((q, i) => {
          const value = answers[q.id] || ''
          const r = phase === 'done' && reply ? reply.byId[q.id] : null
          return (
            <div key={q.id} className="bg-white/40 border border-ink/10 rounded-lg p-5">
              <label htmlFor={`ans-${q.id}`} className="block font-display text-lg font-semibold text-board leading-snug">
                {i + 1}. {q.text}
              </label>

              {phase === 'done' ? (
                <p className="mt-3 text-ink whitespace-pre-wrap">
                  {value.trim() || <span className="text-ink-soft italic">No answer written.</span>}
                </p>
              ) : (
                <>
                  <textarea
                    id={`ans-${q.id}`}
                    value={value}
                    onChange={(e) => updateAnswer(q.id, e.target.value)}
                    disabled={phase === 'sending'}
                    rows={3}
                    maxLength={MAX_CHARS}
                    className="mt-3 w-full rounded-md border border-ink/20 bg-white/70 p-3 text-ink focus:outline-none focus:border-highlight"
                    placeholder="Type your answer here"
                  />
                  <p className="text-xs font-mono text-ink-soft mt-1 text-right">
                    {value.length} / {MAX_CHARS}
                  </p>
                </>
              )}

              {r && (
                <div className="mt-4 border-t border-ink/10 pt-4">
                  {evaluated && (
                    <>
                      <p className="font-mono text-sm text-rule">
                        {r.marks} / {r.max} marks
                      </p>
                      {r.feedback && <p className="mt-1 text-ink">{r.feedback}</p>}
                    </>
                  )}
                  <p className="mt-3 text-sm font-semibold text-board">Model answer</p>
                  <p className="text-ink-soft">{r.modelAnswer}</p>
                  {Array.isArray(r.keyPoints) && r.keyPoints.length > 0 && (
                    <>
                      <p className="mt-3 text-sm font-semibold text-board">Key points</p>
                      <ul className="list-disc pl-5 text-ink-soft">
                        {r.keyPoints.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {phase !== 'done' && (
          <button
            type="button"
            onClick={submit}
            disabled={!hasAnyAnswer || phase === 'sending'}
            className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phase === 'sending' ? 'Marking…' : 'Submit for marking'}
          </button>
        )}
        {unavailable && (
          <button
            type="button"
            onClick={tryAgain}
            className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors"
          >
            Edit and try again
          </button>
        )}
        {phase === 'done' && (
          <button
            type="button"
            onClick={startOver}
            className="border border-ink/20 text-board font-medium px-5 py-2.5 rounded-md hover:border-highlight transition-colors"
          >
            Start over
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-ink-soft">
        Your answers are sent to a free AI service only to be marked. They are not saved on this site.
      </p>
    </div>
  )
}
