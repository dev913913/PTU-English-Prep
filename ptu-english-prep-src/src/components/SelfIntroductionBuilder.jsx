import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ptu-self-introduction-builder'

const INITIAL_DATA = {
  name: '',
  location: '',
  qualification: '',
  course: '',
  college: '',
  hobbies: '',
  skills: '',
  strength: '',
  experience: '',
  goal: '',
  extra: '',
}

function clean(value) {
  return value.trim().replace(/\s+/g, ' ').replace(/\s+([,.!?])/g, '$1')
}

function capitalize(value) {
  const text = clean(value)
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : ''
}

function formatName(value) {
  const text = clean(value)
  if (!text) return ''
  if (/^[A-Z .'-]+$/.test(text)) return text
  return text.split(' ').map((word) => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '').join(' ')
}

function lowerInitial(value) {
  const text = clean(value)
  if (!text) return ''
  if (/^[A-Z]{2,}(\b|\W)/.test(text)) return text
  return text.charAt(0).toLowerCase() + text.slice(1)
}

const CANONICAL_NAMES = {
  'bca': 'BCA',
  'bca-it': 'BCA-IT',
  'mca': 'MCA',
  'bba': 'BBA',
  'b.com': 'B.Com',
  'bcom': 'B.Com',
  'b.sc': 'B.Sc',
  'bsc': 'B.Sc',
  'm.com': 'M.Com',
  'mcom': 'M.Com',
  'msc': 'M.Sc',
  'm.sc': 'M.Sc',
  'mba': 'MBA',
  'kms college': 'KMS College of IT and Management',
  'kms college of it and management': 'KMS College of IT and Management',
  'kms': 'KMS College of IT and Management',
  'ptu': 'I.K. Gujral Punjab Technical University (IKGPTU)',
  'ikgptu': 'I.K. Gujral Punjab Technical University (IKGPTU)',
  'gndu': 'Guru Nanak Dev University (GNDU)',
  'guru nanak dev university': 'Guru Nanak Dev University (GNDU)',
}

const COMMON_PHRASES = [
  [/\blistening\s+(?:to\s+)?music\b/gi, 'listening to music'],
  [/\blisten\s+(?:to\s+)?music\b/gi, 'listening to music'],
  [/\blistening\s+(?:to\s+)?songs\b/gi, 'listening to songs'],
  [/\blisten\s+(?:to\s+)?songs\b/gi, 'listening to songs'],
  [/\bwatch(?:ing)?\s+movies\b/gi, 'watching movies'],
  [/\bwatch(?:ing)?\s+youtube\b/gi, 'watching YouTube'],
  [/\bplay\s+cricket\b/gi, 'playing cricket'],
  [/\bplay\s+football\b/gi, 'playing football'],
  [/\bplay\s+badminton\b/gi, 'playing badminton'],
  [/\bplay\s+volleyball\b/gi, 'playing volleyball'],
  [/\bread\s+books\b/gi, 'reading books'],
  [/\breading\s+book\b/gi, 'reading books'],
  [/\buse\s+social\s+media\b/gi, 'using social media'],
  [/\busing\s+social\s+media\b/gi, 'using social media'],
  [/\bdance\b/gi, 'dancing'],
  [/\bsing\b/gi, 'singing'],
  [/\bdraw\b/gi, 'drawing'],
  [/\btravel(?:l?ing)?\b/gi, 'travelling'],
  [/\bplay\s+chess\b/gi, 'playing chess'],
  [/\bplay\s+games\b/gi, 'playing games'],
  [/\bread\b/gi, 'reading'],
  [/\bcook\b/gi, 'cooking'],
  [/\bgarden\b/gi, 'gardening'],
  [/\bcycle\b/gi, 'cycling'],
  [/\bcode\b/gi, 'coding'],
]

function normalizeKnownName(value) {
  const text = clean(value)
  return CANONICAL_NAMES[text.toLowerCase()] || capitalize(text)
}

function improveCommonPhrases(value) {
  let text = clean(value)
  for (const [pattern, replacement] of COMMON_PHRASES) {
    text = text.replace(pattern, replacement)
  }
  return text
}

function formatList(value) {
  const items = improveCommonPhrases(value)
    .split(',')
    .map(clean)
    .filter(Boolean)

  if (items.length <= 1) return items[0] || ''
  if (items.length === 2) return items.join(' and ')

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function buildIntroduction(data) {
  const sentences = []
  const name = formatName(data.name)
  const location = normalizeKnownName(data.location)
  const qualification = normalizeKnownName(data.qualification)
  const course = normalizeKnownName(data.course)
  const college = normalizeKnownName(data.college)
  const hobbies = formatList(data.hobbies)
  const skills = formatList(data.skills)
  const strength = formatStrength(data.strength)
  const experience = formatExperience(data.experience)
  const goal = formatGoal(data.goal)
  const extra = improveCommonPhrases(data.extra)

  sentences.push(name ? `Hello everyone. My name is ${capitalize(name)}.` : 'Hello everyone.')

  if (location) {
    sentences.push(`I am from ${capitalize(location)}.`)
  }

  if (qualification) {
    sentences.push(`I have completed ${qualification}.`)
  }

  if (course && college) {
    sentences.push(`I am currently pursuing ${capitalize(course)} at ${capitalize(college)}.`)
  } else if (course) {
    sentences.push(`I am currently pursuing ${capitalize(course)}.`)
  } else if (college) {
    sentences.push(`I am currently studying at ${capitalize(college)}.`)
  }

  if (experience) {
    if (/\bexperience\b/i.test(experience)) {
      sentences.push(`I have ${experience}.`)
    } else {
      sentences.push(`I have ${experience} experience.`)
    }
  }

  if (hobbies) {
    sentences.push(`In my free time, I enjoy ${hobbies}.`)
  }

  if (skills) {
    sentences.push(`My skills include ${skills}.`)
  }

  if (strength) {
    if (/^i (consider|believe|think)\b/i.test(strength)) {
      sentences.push(`${capitalize(strength)}.`)
    } else if (/^i am\s+/i.test(data.strength)) {
      sentences.push(`I consider myself ${strength}.`)
    } else {
      sentences.push(`One of my strengths is ${strength}.`)
    }
  }

  if (goal) {
    sentences.push(`My career goal is to ${goal}.`)
  }

  if (extra) {
    sentences.push(capitalize(extra.endsWith('.') ? extra : `${extra}.`))
  }

  sentences.push('Thank you.')

  return sentences.join(' ')
}

export default function SelfIntroductionBuilder() {
  const [data, setData] = useState(INITIAL_DATA)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setData({ ...INITIAL_DATA, ...JSON.parse(saved) })
      }
    } catch {
      // Ignore malformed local data.
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      // Local persistence is optional; the builder still works without it.
    }
  }, [data])

  const introduction = useMemo(() => buildIntroduction(data), [data])

  function updateField(field, value) {
    setData((current) => ({ ...current, [field]: value }))
  }

  function clearEverything() {
    setData(INITIAL_DATA)
    setShowResult(false)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors.
    }
  }

  return (
    <section className="mt-8 rounded-lg border border-ink/10 bg-white/70 p-5 sm:p-6">
      <div className="mb-5">
        <p className="font-mono text-xs tracking-widest text-rule">WRITING PRACTICE</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-board">
          Build Your Self-Introduction
        </h2>
        <p className="mt-2 text-sm leading-6 text-ink-soft">
          Give us your ideas. We’ll turn them into a simple introduction you can
          edit and practise.
        </p>
        <p className="mt-2 text-xs text-ink-soft">
          Your answers stay in this browser and are not sent to an AI or server.
        </p>
      </div>

      <div className="grid gap-4">
        <Field label="Your name" value={data.name} onChange={(value) => updateField('name', value)} placeholder="e.g. Aman Kumar" />
        <Field label="Where are you from?" value={data.location} onChange={(value) => updateField('location', value)} placeholder="e.g. Hoshiarpur" />
        <Field label="Your qualification" value={data.qualification} onChange={(value) => updateField('qualification', value)} placeholder="e.g. 12th standard" />
        <Field label="What are you studying?" value={data.course} onChange={(value) => updateField('course', value)} placeholder="e.g. BCA" />
        <Field label="College / institution" value={data.college} onChange={(value) => updateField('college', value)} placeholder="e.g. KMS College" />
        <Field label="Hobbies / interests" value={data.hobbies} onChange={(value) => updateField('hobbies', value)} placeholder="e.g. playing cricket, listening music" hint="You can enter more than one, separated by commas." />
        <Field label="Skills" value={data.skills} onChange={(value) => updateField('skills', value)} placeholder="e.g. communication, Python, teamwork" />
        <Field label="One strength" value={data.strength} onChange={(value) => updateField('strength', value)} placeholder="e.g. hardworking and patient" />
        <Field label="Experience (optional)" value={data.experience} onChange={(value) => updateField('experience', value)} placeholder="e.g. 2 years of teaching" />
        <Field label="What is your career goal?" value={data.goal} onChange={(value) => updateField('goal', value)} placeholder="e.g. Become a great teacher" />
        <Field label="Anything else?" value={data.extra} onChange={(value) => updateField('extra', value)} placeholder="Optional" />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowResult(true)}
          className="rounded-md bg-highlight px-5 py-2.5 font-semibold text-board transition-colors hover:bg-highlight-soft"
        >
          {showResult ? 'Update My Introduction' : 'Create My Introduction'}
        </button>

        <button
          type="button"
          onClick={clearEverything}
          className="rounded-md border border-ink/15 px-5 py-2.5 font-medium text-ink-soft transition-colors hover:border-ink/30 hover:text-board"
        >
          Clear everything
        </button>
      </div>

      {showResult && (
        <div className="mt-6 rounded-lg border border-highlight/30 bg-paper p-5">
          <p className="font-mono text-xs tracking-widest text-rule">YOUR INTRODUCTION</p>
          <p className="mt-3 leading-7 text-board">{introduction}</p>
          <p className="mt-4 text-xs text-ink-soft">
            Change any answer above and select “Update My Introduction” to create a new version.
          </p>
        </div>
      )}
    </section>
  )
}

function Field({ label, value, onChange, placeholder, hint }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-board">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm text-board outline-none transition-colors placeholder:text-ink-soft/50 focus:border-highlight"
      />
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  )
}
