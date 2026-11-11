import { Link } from 'react-router-dom'

export default function UnitCard({ track, unit }) {
  const available = unit.status === 'available'
  const href = `/${track}/${unit.id}`

  const content = (
    <div
      className={`group relative bg-white/60 border rounded-lg p-5 mb-4 break-inside-avoid transition-all ${
        available
          ? 'border-ink/10 hover:border-highlight hover:shadow-md cursor-pointer'
          : 'border-ink/5 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-xs text-rule tracking-wider mb-1">
            UNIT {unit.number}
          </div>
          <h3 className="font-display text-lg font-semibold text-board leading-snug">
            {unit.title}
          </h3>
        </div>
        <span
          className={`shrink-0 text-[10px] font-mono px-2 py-1 rounded-full ${
            available ? 'bg-highlight text-board font-semibold' : 'bg-ink/10 text-ink-soft'
          }`}
        >
          {available ? 'Available' : 'Coming soon'}
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-ink-soft">
        {unit.topics.map((t) => (
          <li key={t} className="flex gap-2">
            <span className="text-rule/60">—</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return available ? <Link to={href}>{content}</Link> : content
}
