import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getUnitParts, getListeningExercises } from '../lib/content'

const BASE_URL = 'https://ptuenglish.vercel.app'
const SITE = 'PTU English Prep'
const TRACKS = {
  theory: { label: 'Theory', code: 'BTHU103/18', units: theoryUnits },
  lab: { label: 'Lab', code: 'BTHU104/18', units: labUnits },
}

const HOME = {
  title: 'PTU English Prep by Dev Kumar — AECC English Notes & Quizzes',
  description:
    'Free PTU (IKGPTU) AECC English notes, quizzes, listening practice and previous year question papers for Theory BTHU103 and Lab BTHU104, by Dev Kumar.',
}

/** Works out the title, description and breadcrumb trail for a path. */
function describePath(pathname) {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const seg = path.split('/').filter(Boolean)
  const crumbs = [{ name: 'Home', path: '/' }]

  if (seg.length === 0) return { ...HOME, path: '/', crumbs: [] }

  if (seg[0] === 'pyq' && seg.length === 1) {
    return {
      title: `PTU English Previous Year Question Papers — ${SITE}`,
      description: 'Previous year question papers for PTU (IKGPTU) AECC English (BTHU103-18), with guess papers. View online or download as PDF.',
      path,
      crumbs: [...crumbs, { name: 'PYQ Papers', path }],
    }
  }

  const track = TRACKS[seg[0]]
  if (!track) return { title: `Page not found — ${SITE}`, description: HOME.description, path, crumbs: [], notFound: true }

  if (seg.length === 1) {
    const blurb = seg[0] === 'theory'
      ? 'Notes and quizzes on communication, language, reading and writing skills.'
      : 'Practice for listening, interviews, presentations and public speaking.'
    return {
      title: `${track.label} (${track.code}) ${seg[0] === 'theory' ? 'Notes & Quizzes' : 'Speaking & Listening Practice'} — ${SITE}`,
      description: `Free PTU AECC English ${track.label} (${track.code}). ${blurb}`,
      path,
      crumbs: [...crumbs, { name: track.label, path }],
    }
  }

  const unit = track.units.find((u) => u.id === seg[1])
  if (!unit) return { title: `Page not found — ${SITE}`, description: HOME.description, path, crumbs: [], notFound: true }

  const trackCrumb = { name: track.label, path: `/${seg[0]}` }
  const unitPath = `/${seg[0]}/${seg[1]}`
  const unitCrumb = { name: `Unit ${unit.number}`, path: unitPath }
  const unitName = `${track.label} Unit ${unit.number}: ${unit.title}`
  const topics = unit.topics.join(', ')

  if (seg.length === 2) {
    return {
      title: `${unitName} — ${SITE}`,
      description: `Free notes and quiz for PTU AECC English ${unitName}. Topics: ${topics}.`,
      path,
      crumbs: [...crumbs, trackCrumb, { name: unitCrumb.name, path }],
    }
  }

  const parts = getUnitParts(seg[0], seg[1]) || []

  if (seg[2] === 'quiz' && seg.length === 3) {
    return {
      title: `${unitName} Quiz — ${SITE}`,
      description: `Practice quiz for PTU AECC English ${unitName}, with instant answers and explanations.`,
      path,
      crumbs: [...crumbs, trackCrumb, unitCrumb, { name: 'Quiz', path }],
    }
  }

  if (seg[2] === 'listening') {
    const hubPath = `${unitPath}/listening`
    if (seg.length === 3) {
      return {
        title: `Listening Exercises — ${unitName} — ${SITE}`,
        description: `Listening comprehension exercises with videos and quizzes for PTU AECC English ${unitName}.`,
        path,
        crumbs: [...crumbs, trackCrumb, unitCrumb, { name: 'Listening', path }],
      }
    }
    const exercise = getListeningExercises(seg[0], seg[1]).find((e) => e.id === seg[3])
    if (exercise && seg.length === 4) {
      const name = exercise.title.replace(/^Listening Exercise \d+:\s*/, '')
      return {
        title: `${exercise.title} — ${SITE}`,
        description: `Watch the video and answer the quiz: ${name}. Listening practice for PTU AECC English Lab.`,
        path,
        crumbs: [...crumbs, trackCrumb, unitCrumb, { name: 'Listening', path: hubPath }, { name, path }],
      }
    }
  }

  const part = parts.find((p) => p.id === seg[2])
  if (part && seg.length === 3) {
    return {
      title: `${part.title} — ${unitName} — ${SITE}`,
      description: `${part.blurb || `Notes on ${part.title}`} Free PTU AECC English ${unitName}.`,
      path,
      crumbs: [...crumbs, trackCrumb, unitCrumb, { name: part.title, path }],
    }
  }

  return { title: `Page not found — ${SITE}`, description: HOME.description, path, crumbs: [], notFound: true }
}

function setMeta(selector, create, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  if (el.tagName === 'LINK') el.setAttribute('href', value)
  else el.setAttribute('content', value)
}

const makeMeta = (attr, key) => () => {
  const m = document.createElement('meta')
  m.setAttribute(attr, key)
  return m
}

/** Keeps the page title, description, canonical link and breadcrumb data in step with the route. */
export default function usePageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const info = describePath(pathname)
    const url = `${BASE_URL}${info.path === '/' ? '/' : info.path}`

    document.title = info.title
    setMeta('meta[name="description"]', makeMeta('name', 'description'), info.description)
    setMeta('meta[property="og:title"]', makeMeta('property', 'og:title'), info.title)
    setMeta('meta[property="og:description"]', makeMeta('property', 'og:description'), info.description)
    setMeta('meta[property="og:url"]', makeMeta('property', 'og:url'), url)
    setMeta(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link')
        l.setAttribute('rel', 'canonical')
        return l
      },
      url
    )

    // Tell search engines not to index made-up addresses
    let robots = document.head.querySelector('meta[name="robots"]')
    if (info.notFound) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex')
    } else if (robots) {
      robots.remove()
    }

    // Breadcrumb trail for search results
    let script = document.head.querySelector('script#page-breadcrumbs')
    if (info.crumbs.length > 1) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'page-breadcrumbs'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: info.crumbs.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: `${BASE_URL}${c.path === '/' ? '/' : c.path}`,
        })),
      })
    } else if (script) {
      script.remove()
    }
  }, [pathname])
}