import { useState, useEffect } from 'react'
import { downloadQuizResultPdf } from '../lib/generatePdf'

function loadProgress(key) {
  if (!key) return null
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveProgress(key, data) {
  if (!key) return
  try {
    sessionStorage.setItem(key, JSON.stringify(data))
  } catch {
    // storage unavailable (private browsing etc) — quiz still works, just without persistence
  }
}

function clearProgress(key) {
  if (!key) return
  try {
    sessionStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export default function QuizWidget({ mcqs, title, storageKey }) {
  if (!mcqs || mcqs.length === 0) return null

  const saved = loadProgress(storageKey)
  const validSaved = saved && Array.isArray(saved.answers) && saved.answers.length <= mcqs.length

  // If every question was already answered (even if the user left before tapping
  // "See results"), treat it as finished on load — otherwise the last question would
  // render again as unanswered, and selecting it a second time would double-count it.
  const initialAnswers = validSaved ? saved.answers : []
  const initialFinished = validSaved ? (!!saved.finished || initialAnswers.length >= mcqs.length) : false
  const initialCurrent = validSaved ? Math.min(initialAnswers.length, mcqs.length - 1) : 0
  const wasResumedMidway = validSaved && initialAnswers.length > 0 && !initialFinished

   const [answers, setAnswers] = useState(initialAnswers)
  const [finished, setFinished] = useState(initialFinished)
  const [current, setCurrent] = useState(initialCurrent)
  const [selected, setSelected] = useState(null)
  const [resumed] = useState(wasResumedMidway)
  const [resumedAtIndex] = useState(initialCurrent)

  useEffect(() => {
    saveProgress(storageKey, { answers, finished })
  }, [answers, finished, storageKey])

  const q = mcqs[current]
  const score = answers.filter((a) => a.correct).length

  function handleSelect(idx) {
    if (selected !== null) return
    if (answers.length >= mcqs.length) return // safety net: never record more answers than questions
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
    clearProgress(storageKey)
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
            if (!a) return null
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
           <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-ink-soft">Question {current + 1} of {safeMcqs.length}</p>
          {storageKey && (
            <p className="font-mono text-[10px] text-ink-soft/50 mt-0.5">Progress saved in this browser tab</p>
          )}
        </div>
        <button
          onClick={handleRestart}
          className="font-mono text-[10px] text-rule underline hover:no-underline shrink-0"
        >
          Restart quiz
        </button>
      </div>

          {resumed && current === resumedAtIndex && (
        <div className="mb-4 bg-highlight/20 border border-highlight/40 rounded-md px-3 py-2 text-xs text-board">
          Resumed your previous attempt — picking up at question {current + 1}.
        </div>
      )}

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