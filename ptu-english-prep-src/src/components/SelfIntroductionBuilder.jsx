import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'ptu-self-introduction-builder'

const INITIAL_DATA = {
  name: '',
  location: '',
  course: '',
  college: '',
  hobbies: '',
  strength: '',
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

function improveCommonPhrases(value) {
  let text = clean(value)

  const replacements = [
    [/\blistening music\b/gi, 'listening to music'],
    [/\blistening songs\b/gi, 'listening to songs'],
    [/\bplay cricket\b/gi, 'playing cricket'],
    [/\bplay football\b/gi, 'playing football'],
    [/\bread books\b/gi, 'reading books'],
    [/\bwatch youtube\b/gi, 'watching YouTube'],
  ]

  for (const [pattern, replacement] of replacements) {
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
  const name = clean(data.name)
  const location = clean(data.location)
  const course = clean(data.course)
  const college = clean(data.college)
  const hobbies = formatList(data.hobbies)
  const strength = improveCommonPhrases(data.strength)
  const goal = improveCommonPhrases(data.goal)
  const extra = clean(data.extra)

  sentences.push(name ? `Hello everyone. My name is ${capitalize(name)}.` : 'Hello everyone.')

  if (location) {
    sentences.push(`I am from ${capitalize(location)}.`)
  }

  if (course && college) {
    sentences.push(`I am currently pursuing ${capitalize(course)} at ${capitalize(college)}.`)
  } else if (course) {
    sentences.push(`I am currently pursuing ${capitalize(course)}.`)
  } else if (college) {
    sentences.push(`I am currently studying at ${capitalize(college)}.`)
  }

  if (hobbies) {
    sentences.push(`In my free time, I enjoy ${hobbies}.`)
  }

  if (strength) {
    if (/^i am\s+/i.test(strength)) {
      sentences.push(`I consider myself ${strength.replace(/^i am\s+/i, '')}.`)
    } else if (/^i (consider|believe|think)\b/i.test(strength)) {
      sentences.push(`${capitalize(strength)}.`)
    } else {
      sentences.push(`One of my strengths is being ${strength.replace(/^a\s+/i, 'a ')}.`)
    }
  }

  if (goal) {
    let goalText = goal.replace(/^to\s+/i, '')
    if (/^(become|work|build|learn|develop|start|pursue|get)\b/i.test(goalText)) {
      sentences.push(`My career goal is to ${goalText}.`)
    } else {
      sentences.push(`My career goal is to become a ${goalText}.`)
    }
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
        <Field label="What are you studying?" value={data.course} onChange={(value) => updateField('course', value)} placeholder="e.g. BCA" />
        <Field label="College / institution" value={data.college} onChange={(value) => updateField('college', value)} placeholder="e.g. KMS College" />
        <Field label="Hobbies / interests" value={data.hobbies} onChange={(value) => updateField('hobbies', value)} placeholder="e.g. playing cricket, listening to music" hint="You can enter more than one, separated by commas." />
        <Field label="One strength" value={data.strength} onChange={(value) => updateField('strength', value)} placeholder="e.g. hardworking and patient" />
        <Field label="Career goal" value={data.goal} onChange={(value) => updateField('goal', value)} placeholder="e.g. become a software developer" />
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
