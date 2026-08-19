import { useState } from 'react'
import { downloadQuizResultPdf } from '../lib/generatePdf'

export default function QuizWidget({ mcqs, title }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  if (!mcqs || mcqs.length === 0) return null

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

  function handleDownload() {
    downloadQuizResultPdf({
      title,
      score,
      total: mcqs.length,
      questions: mcqs.map((mq, i) => ({
        question: mq.question,
        options: mq.options,
        selectedIndex: answers[i].selected,
        correctIndex: mq.correctAnswer,
        explanation: mq.explanation,
      })),
    })
  }

  if (finished) {
    return (
      <div className="mt-8">
        <div className="bg-white/60 border border-ink/10 rounded-lg p-8 text-center">
          <p className="font-mono text-xs text-rule tracking-widest mb-2">QUIZ COMPLETE</p>
          <p className="font-display text-4xl font-semibold text-board">
            {score} / {mcqs.length}
          </p>
          <p className="text-ink-soft mt-2">
            {score === mcqs.length
              ? 'Perfect score — great work!'
              : score / mcqs.length >= 0.6
              ? 'Solid work. Review the ones you missed below.'
              : 'Worth going through it again before your next attempt.'}
          </p>
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <button
              onClick={handleRestart}
              className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors"
            >
              Retry quiz
            </button>
            <button
              onClick={handleDownload}
              className="bg-board text-paper font-semibold px-5 py-2.5 rounded-md hover:bg-board-light transition-colors"
            >
              Download as PDF
            </button>
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
    <div className="mt-8 bg-white/40 border border-ink/10 rounded-lg p-6">
      <div className="flex items-center justify-between mb-3 font-mono text-xs text-ink-soft">
        <span>Question {current + 1} of {mcqs.length}</span>
      </div>

      <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-highlight transition-all duration-300"
          style={{ width: `${((current + (selected !== null ? 1 : 0)) / mcqs.length) * 100}%` }}
        />
      </div>

      <h2 className="font-display text-xl font-semibold text-board leading-snug">{q.question}</h2>

      <div className="mt-5 space-y-3">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = idx === q.correctAnswer
          let style = 'border-ink/15 hover:border-highlight bg-white/60'
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