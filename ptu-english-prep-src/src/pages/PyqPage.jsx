import { useState } from 'react'
import { pyqPapers } from '../content/pyq'
import Breadcrumb from '../components/Breadcrumb'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PyqPage() {
  const [openId, setOpenId] = useState(null)

  const papers = [...pyqPapers].sort((a, b) => (b.date || '').localeCompare(a.date || ''))

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id))
  }

  function viewerUrl(file) {
    const absoluteUrl = `${window.location.origin}${file}`
    return `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'PYQ Papers' }]} />
      <p className="font-mono text-xs text-rule tracking-widest mb-1">EXAM PREP</p>
      <h1 className="font-display text-3xl font-semibold text-board">Previous Year Question Papers</h1>
      <p className="text-ink-soft mt-2">Tap a paper to view it, or download it to keep for offline revision.</p>

      {papers.length === 0 ? (
        <div className="mt-8 bg-white/50 border border-dashed border-ink/20 rounded-lg p-8 text-center">
          <p className="text-ink-soft text-sm">Papers are being added soon. Check back shortly.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {papers.map((paper) => {
            const isOpen = openId === paper.id
            return (
              <div key={paper.id} className="bg-white/60 border border-ink/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(paper.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/80 transition-colors"
                >
                  <div>
                    <p className="font-display text-lg font-semibold text-board leading-snug">
                      {paper.subject}
                    </p>
                    <p className="font-mono text-xs text-ink-soft mt-1">
                      {paper.session}{paper.date ? ` · ${formatDate(paper.date)}` : ''}
                    </p>
                  </div>
                  <span
                    className={`font-mono text-rule shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-ink/10 pt-4">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <a
                        href={paper.file}
                        download
                        className="bg-highlight text-board font-semibold px-4 py-2 rounded-md text-sm hover:bg-highlight-soft transition-colors"
                      >
                        Download PDF
                      </a>
                      <a
                        href={viewerUrl(paper.file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-ink/20 px-4 py-2 rounded-md text-sm hover:bg-ink/5 transition-colors"
                      >
                        Open in new tab
                      </a>
                    </div>
                    <div className="rounded-md overflow-hidden border border-ink/10">
                      <iframe
                        src={viewerUrl(paper.file)}
                        title={`${paper.subject} — ${paper.session}`}
                        className="w-full"
                        style={{ height: '70vh' }}
                      />
                    </div>
                    <p className="text-xs text-ink-soft mt-2">
                      If the preview doesn't load, use "Open in new tab" or "Download PDF" above instead.
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}