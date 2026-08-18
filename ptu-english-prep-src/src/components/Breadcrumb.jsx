import { Link } from 'react-router-dom'

// items: [{ label, to }] — the last item should omit `to` (it's the current page, not a link)
export default function Breadcrumb({ items }) {
  return (
    <nav className="font-mono text-xs text-ink-soft mb-4 flex flex-wrap items-center gap-1">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {item.to && !isLast ? (
              <Link to={item.to} className="hover:text-rule hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-rule font-semibold' : ''}>{item.label}</span>
            )}
            {!isLast && <span className="text-ink-soft/50">/</span>}
          </span>
        )
      })}
    </nav>
  )
}