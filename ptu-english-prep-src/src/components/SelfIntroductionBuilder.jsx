import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

const STORAGE_KEY = 'ptu-english-self-introduction'
const EMPTY_FORM = { name: '', qualification: '', course: '', college: '', hobbies: '', skills: '', strength: '', experience: '', goal: '', extra: '' }

const CANONICAL_NAMES = {
  bca: 'BCA', 'bca-it': 'BCA-IT', mca: 'MCA', bba: 'BBA', bcom: 'B.Com', 'b.com': 'B.Com',
  bsc: 'B.Sc', 'b.sc': 'B.Sc', mcom: 'M.Com', 'm.com': 'M.Com', msc: 'M.Sc', 'm.sc': 'M.Sc', mba: 'MBA',
  kms: 'KMS College of IT and Management', 'kms college': 'KMS College of IT and Management',
  ptu: 'I.K. Gujral Punjab Technical University (IKGPTU)', ikgptu: 'I.K. Gujral Punjab Technical University (IKGPTU)',
  gndu: 'Guru Nanak Dev University (GNDU)',
}

const COMMON_PHRASES = [
  ['listening music', 'listening to music'], ['listen music', 'listening to music'],
  ['listening songs', 'listening to songs'], ['listen songs', 'listening to songs'],
  ['watch movies', 'watching movies'], ['watch movie', 'watching movies'], ['watch youtube', 'watching YouTube'],
  ['play cricket', 'playing cricket'], ['play football', 'playing football'], ['play badminton', 'playing badminton'],
  ['play volleyball', 'playing volleyball'], ['play chess', 'playing chess'], ['play games', 'playing games'],
  ['read books', 'reading books'], ['read book', 'reading books'], ['reading book', 'reading books'],
  ['use social media', 'using social media'], ['dance', 'dancing'], ['sing', 'singing'], ['draw', 'drawing'],
  ['traveling', 'travelling'], ['travel', 'travelling'], ['read', 'reading'], ['cook', 'cooking'],
  ['garden', 'gardening'], ['cycle', 'cycling'], ['code', 'coding'],
]

function clean(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^()|[\]\\{}$]/g, '\\$&')
}

function formatName(value) {
  const name = clean(value)
  if (!name) return ''
  return name.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ')
}

function formatAcademic(value) {
  let result = clean(value)
  if (!result) return ''
  const lower = result.toLowerCase()
  if (CANONICAL_NAMES[lower]) return CANONICAL_NAMES[lower]
  Object.entries(CANONICAL_NAMES).forEach(([key, replacement]) => {
    result = result.replace(new RegExp('\\b' + escapeRegExp(key) + '\\b', 'gi'), replacement)
  })
  return result
}

function normalizePhrase(value) {
  let result = clean(value)
  if (!result) return ''
  for (const [from, to] of COMMON_PHRASES) {
    result = result.replace(new RegExp('\\b' + escapeRegExp(from) + '\\b', 'gi'), to)
  }
  return result
}

function formatList(value) {
  const items = clean(value).split(',').map((item) => normalizePhrase(item)).filter(Boolean)
  if (items.length <= 1) return items[0] || ''
  if (items.length === 2) return items[0] + ' and ' + items[1]
  return items.slice(0, -1).join(', ') + ', and ' + items[items.length - 1]
}

function formatGoal(value) {
  const text = clean(value).replace(/^to\s+/i, '').replace(/[.!?]+$/, '')
  return text ? text.charAt(0).toLowerCase() + text.slice(1) : ''
}

function formatStrength(value) {
  const text = clean(value)
  if (!text) return ''
  if (/^i\s+(am|consider|believe|think)\b/i.test(text)) return text.replace(/[.!?]+$/, '')
  return 'My strengths include ' + normalizePhrase(text).replace(/[.!?]+$/, '') + '.'
}

function formatExperience(value) {
  const text = clean(value)
  if (!text || /^(no|none|nil|n\/a)$/i.test(text)) return ''
  if (/experience/i.test(text)) return 'I have ' + text.replace(/[.!?]+$/, '') + '.'
  return 'I have ' + text.replace(/[.!?]+$/, '') + ' experience.'
}

function buildIntroduction(form) {
  const name = formatName(form.name)
  const qualification = formatAcademic(form.qualification)
  const course = formatAcademic(form.course)
  const college = formatAcademic(form.college)
  const hobbies = formatList(form.hobbies)
  const skills = formatList(form.skills)
  const strength = formatStrength(form.strength)
  const experience = formatExperience(form.experience)
  const goal = formatGoal(form.goal)
  const extra = clean(form.extra)
  const lines = []
  if (name) lines.push('Hello, my name is ' + name + '.')
  if (qualification) lines.push('I have completed ' + qualification + '.')
  if (course && college) lines.push('I am currently pursuing ' + course + ' at ' + college + '.')
  else if (course) lines.push('I am currently pursuing ' + course + '.')
  else if (college) lines.push('I am studying at ' + college + '.')
  if (experience) lines.push(experience)
  if (hobbies) lines.push('In my free time, I enjoy ' + hobbies + '.')
  if (skills) lines.push('My skills include ' + skills + '.')
  if (strength) lines.push(strength.endsWith('.') ? strength : strength + '.')
  if (goal) lines.push('My career goal is to ' + goal + '.')
  if (extra) lines.push(/[.!?]$/.test(extra) ? extra : extra + '.')
  return lines.join('\n\n')
}

function loadForm() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...EMPTY_FORM, ...JSON.parse(saved) } : EMPTY_FORM
  } catch {
    return EMPTY_FORM
  }
}

export default function SelfIntroductionBuilder() {
  const { track, unitId } = useParams()
  const [form, setForm] = useState(loadForm)
  const [introduction, setIntroduction] = useState(() => buildIntroduction(loadForm()))
  const [hasGenerated, setHasGenerated] = useState(() => !!buildIntroduction(loadForm()))
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(form)) } catch { /* storage unavailable */ }
  }, [form])

  const preview = useMemo(() => buildIntroduction(form), [form])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setCopied(false)
  }

  function handleGenerate(event) {
    event.preventDefault()
    setIntroduction(preview)
    setHasGenerated(true)
    setCopied(false)
  }

  function handleClear() {
    setForm(EMPTY_FORM)
    setIntroduction('')
    setHasGenerated(false)
    setCopied(false)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }

  async function handleCopy() {
    if (!introduction) return
    try {
      await navigator.clipboard.writeText(introduction)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { setCopied(false) }
  }

  const fields = [
    ['name', 'Your name', 'e.g. Dev Kumar'],
    ['qualification', 'Qualification', 'e.g. 12th / Diploma / BCA'],
    ['course', 'Current course', 'e.g. BCA'],
    ['college', 'College / University', 'e.g. KMS College'],
    ['hobbies', 'Hobbies', 'e.g. listening music, play cricket'],
    ['skills', 'Skills', 'e.g. Python, communication'],
    ['strength', 'Strength', 'e.g. I am hardworking and patient'],
    ['experience', 'Experience', 'Optional — e.g. 2 years of teaching'],
    ['goal', 'Career goal', 'e.g. Become a great teacher'],
    ['extra', 'Anything else', 'Optional — anything you want to add'],
  ]

  const crumbs = [
    { label: 'Home', to: '/' + track },
    { label: track === 'lab' ? 'Lab / Practical' : 'Theory', to: '/' + track },
    { label: 'Unit 1', to: '/' + track + '/' + unitId },
    { label: 'Self-Introduction', to: '/' + track + '/' + unitId + '/self-introduction' },
    { label: 'Builder' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <Breadcrumb items={crumbs} />
      <p className="font-mono text-xs text-rule tracking-widest mb-1">WRITING PRACTICE</p>
      <h1 className="font-display text-3xl font-semibold text-board">Build your self-introduction</h1>
      <p className="text-ink-soft mt-3 max-w-2xl leading-relaxed">
        Enter your own information. The website will turn your ideas into a simple, natural self-introduction.
        Your information stays in this browser and is not sent to an AI or server.
      </p>

      <div className="mt-8 grid lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={handleGenerate} className="bg-white/60 border border-ink/10 rounded-lg p-6">
          <div className="space-y-4">
            {fields.map(([name, label, placeholder]) => (
              <label key={name} className="block">
                <span className="font-medium text-board text-sm">{label}</span>
                <input name={name} value={form[name]} onChange={handleChange} placeholder={placeholder}
                  className="mt-1.5 w-full bg-white/70 border border-ink/15 rounded-md px-3 py-2.5 text-ink outline-none focus:border-highlight" />
              </label>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button type="submit" className="bg-highlight text-board font-semibold px-5 py-2.5 rounded-md hover:bg-highlight-soft transition-colors">
              {hasGenerated ? 'Regenerate introduction' : 'Create introduction'}
            </button>
            <button type="button" onClick={handleClear} className="border border-ink/15 text-ink-soft font-medium px-5 py-2.5 rounded-md hover:bg-ink/5 transition-colors">
              Clear everything & start again
            </button>
          </div>
        </form>

        <section className="bg-board rounded-lg p-6 text-paper lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-xs text-paper/50 tracking-widest">YOUR INTRODUCTION</p>
              <h2 className="font-display text-xl font-semibold mt-1">Ready to practise</h2>
            </div>
            {introduction && (
              <button type="button" onClick={handleCopy} className="bg-highlight text-board font-semibold px-3 py-2 rounded-md hover:bg-highlight-soft transition-colors text-sm">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          {introduction ? (
            <div className="mt-6 whitespace-pre-line leading-relaxed text-paper/90">{introduction}</div>
          ) : (
            <p className="mt-6 text-paper/55 leading-relaxed">
              Fill in the form and click <strong className="text-paper">Create introduction</strong>.
              You can regenerate it whenever you change your answers.
            </p>
          )}
          <p className="mt-7 text-xs text-paper/45">
            Tip: Read your introduction aloud after writing it. The builder helps you prepare the words; speaking practice comes next.
          </p>
        </section>
      </div>

      <div className="mt-8">
        <Link to={'/' + track + '/' + unitId + '/self-introduction'} className="text-rule font-medium hover:underline">← Back to Self-Introduction</Link>
      </div>
    </div>
  )
}
