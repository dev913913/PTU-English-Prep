import { Link } from 'react-router-dom'
import { theoryUnits, labUnits } from '../content/syllabus'

export default function Home() {
  const availableCount = [...theoryUnits, ...labUnits].filter((u) => u.status === 'available').length
  const totalCount = theoryUnits.length + labUnits.length

  return (
    <div>
      <section className="bg-board text-paper">
        <div className="max-w-5xl mx-auto px-5 py-16">
          <p className="font-mono text-xs tracking-widest text-highlight-soft mb-3">
            AECC ENGLISH · IKGPTU
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight max-w-2xl">
            Your English notebook, always open.
          </h1>
          <p className="mt-4 text-paper/75 max-w-xl leading-relaxed">
            Notes, reading practice, and self-tests for the PTU English AECC syllabus —
            Theory (BTHU103) and Lab (BTHU104). Built unit by unit, so revisit anytime
            without waiting for class.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/theory/unit1"
              className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors"
            >
              Start Unit 1 — Theory
            </Link>
            <Link
              to="/theory"
              className="border border-paper/30 text-paper px-5 py-2.5 rounded-md hover:bg-board-light transition-colors"
            >
              View full syllabus
            </Link>
          </div>
          <p className="mt-6 font-mono text-xs text-paper/50">
            {availableCount} of {totalCount} units live — more added as the term goes on.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-12">
        <div className="notebook-page">
          <h2 className="font-display text-2xl font-semibold text-board mb-2">How to use this</h2>
          <p className="text-ink-soft leading-relaxed max-w-2xl">
            Pick a unit, read through the notes, then test yourself with the quiz.
            It's meant to sit alongside class, not replace it — use it to revise
            before an MST, catch up on a missed topic, or double-check your understanding.
          </p>
        </div>
      </section>
    </div>
  )
}
