import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getMcqs } from '../lib/content'

export default function QuizPage() {
  const { track, unitId } = useParams()
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const mcqs = getMcqs(track, unitId)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([]) // { selected, correct }
  const [finished, setFinished] = useState(false)

  if (!unit || mcqs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">No quiz available for this unit yet.</p>
        <Link to={`/${track}/${unitId}`} className="text-rule underline">Back to notes</Link>
      </div>
    )
  }

  const q = mcqs[current]
  const score = answers.filter((a) => a.correct).length

  function handleSelect(idx) {
    if (selected !== null) return
    const correct = idx === q.correctAnswer
    setSelected(idx)
    setAnswers([...answers, { selected: idx, correct }])
  }

  function handleNext() {
    if (current + 1 < mcqs.length) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-14">
        <div className="bg-white/60 border border-ink/10 rounded-lg p-8 text-center">
          <p className="font-mono text-xs text-rule tracking-widest mb-2">QUIZ COMPLETE</p>
          <p className="font-display text-4xl font-semibold text-board">
            {score} / {mcqs.length}
          </p>
          <p className="text-ink-soft mt-2">
            {score === mcqs.length
              ? "Perfect score — you know this unit cold."
              : score / mcqs.length >= 0.6
              ? 'Solid work. Review the ones you missed below.'
              : 'Worth another read through the notes before your next attempt.'}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={handleRestart}
              className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors"
            >
              Retry quiz
            </button>
            <Link
              to={`/${track}/${unitId}`}
              className="border border-ink/20 px-5 py-2.5 rounded-md hover:bg-ink/5 transition-colors"
            >
              Back to notes
            </Link>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {mcqs.map((mq, i) => {
            const a = answers[i]
            return (
              <div key={i} className="bg-white/50 border border-ink/10 rounded-lg p-4">
                <p className="font-medium text-ink">{i + 1}. {mq.question}</p>
                <p className={`text-sm mt-1 ${a.correct ? 'text-green-700' : 'text-rule'}`}>
                  Your answer: {mq.options[a.selected]} {a.correct ? '✓' : '✗'}
                </p>
                {!a.correct && (
                  <p className="text-sm text-ink-soft mt-0.5">Correct: {mq.options[mq.correctAnswer]}</p>
                )}
                <p className="text-sm text-ink-soft mt-1.5 italic">{mq.explanation}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <div className="flex items-center justify-between mb-4 font-mono text-xs text-ink-soft">
        <span>Question {current + 1} of {mcqs.length}</span>
        <span>Unit {unit.number}</span>
      </div>

      <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-highlight transition-all duration-300"
          style={{ width: `${((current + (selected !== null ? 1 : 0)) / mcqs.length) * 100}%` }}
        />
      </div>

      <h2 className="font-display text-xl font-semibold text-board leading-snug">{q.question}</h2>

      <div className="mt-6 space-y-3">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = idx === q.correctAnswer
          let style = 'border-ink/15 hover:border-highlight bg-white/50'
          if (selected !== null) {
            if (isCorrect) style = 'border-green-600 bg-green-50'
            else if (isSelected) style = 'border-rule bg-rule/10'
            else style = 'border-ink/10 bg-white/30 opacity-60'
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={selected !== null}
              className={`w-full text-left px-4 py-3 rounded-md border transition-colors ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 bg-board/5 border border-board/10 rounded-md p-4">
          <p className="text-sm text-ink-soft italic">{q.explanation}</p>
          <button
            onClick={handleNext}
            className="mt-3 bg-highlight text-board font-semibold px-5 py-2 rounded-md hover:bg-highlight-soft transition-colors"
          >
            {current + 1 < mcqs.length ? 'Next question' : 'See results'}
          </button>
        </div>
      )}
    </div>
  )
}
