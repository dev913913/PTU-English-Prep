import { useParams } from 'react-router-dom'
import { theoryUnits, labUnits } from '../content/syllabus'
import UnitCard from '../components/UnitCard'

const TRACK_META = {
  theory: {
    title: 'Theory',
    code: 'BTHU103/18',
    units: theoryUnits,
    blurb: 'The fundamentals — communication theory, language, reading, and writing skills.',
  },
  lab: {
    title: 'Lab / Practical',
    code: 'BTHU104/18',
    units: labUnits,
    blurb: 'Speaking and listening practice — interviews, presentations, and real conversations.',
  },
}

export default function TrackPage() {
  const { track } = useParams()
  const meta = TRACK_META[track]

  if (!meta) return null

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <p className="font-mono text-xs text-rule tracking-widest mb-1">{meta.code}</p>
      <h1 className="font-display text-3xl font-semibold text-board">{meta.title}</h1>
      <p className="text-ink-soft mt-2 max-w-xl">{meta.blurb}</p>

      <div className="sm:columns-2 sm:gap-4 mt-8">
        {meta.units.map((unit) => (
          <UnitCard key={unit.id} track={track} unit={unit} />
        ))}
      </div>
    </div>
  )
}
