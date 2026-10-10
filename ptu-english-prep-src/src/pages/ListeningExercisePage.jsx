import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { theoryUnits, labUnits } from '../content/syllabus'
import { getListeningExercises, getListeningExerciseContent, getListeningMcqs } from '../lib/content'
import Breadcrumb from '../components/Breadcrumb'
import QuizWidget from '../components/QuizWidget'

const TRACK_LABELS = { theory: 'Theory', lab: 'Lab / Practical' }

export default function ListeningExercisePage() {
  const { track, unitId, exerciseId } = useParams()
  const [giftVideo, setGiftVideo] = useState('voa')

  const isGiftOfTheMagi =
  track === 'lab' &&
  unitId === 'unit1' &&
  exerciseId === 'gift-of-the-magi'
  
  const units = track === 'theory' ? theoryUnits : labUnits
  const unit = units.find((u) => u.id === unitId)
  const exercises = getListeningExercises(track, unitId)
  const exercise = exercises.find((e) => e.id === exerciseId)
  const content = getListeningExerciseContent(track, unitId, exerciseId)
  const mcqs = getListeningMcqs(track, unitId, exerciseId)
  const trackLabel = TRACK_LABELS[track]

  if (!exercise) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">Exercise not found.</p>
        <Link to={`/${track}/${unitId}/listening`} className="text-rule underline">
          Back to Listening Exercises
        </Link>
      </div>
    )
  }

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: trackLabel, to: `/${track}` },
    { label: unit ? `Unit ${unit.number}` : 'Unit', to: `/${track}/${unitId}` },
    { label: 'Listening', to: `/${track}/${unitId}/listening` },
    { label: exercise.title.replace(/^Listening Exercise \d+:\s*/, '') },
  ]

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Breadcrumb items={crumbs} />
      <h1 className="font-display text-2xl font-semibold text-board">{exercise.title}</h1>

      
{isGiftOfTheMagi ? (
  <div className="notes-content mt-6">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {content || 'Choose a version of the story to watch.'}
    </ReactMarkdown>

    <p className="mt-4 mb-3 font-medium">
      Choose a video version:
    </p>

    <div className="flex flex-wrap gap-3 mb-4">
      <button
        type="button"
        onClick={() => setGiftVideo('animated')}
        aria-pressed={giftVideo === 'animated'}
        className={`px-4 py-2 rounded-lg border ${
          giftVideo === 'animated'
            ? 'bg-board text-white border-board'
            : 'border-ink/20 hover:bg-board/5'
        }`}
      >
        Animated Story
      </button>

      <button
        type="button"
        onClick={() => setGiftVideo('voa')}
        aria-pressed={giftVideo === 'voa'}
        className={`px-4 py-2 rounded-lg border ${
          giftVideo === 'voa'
            ? 'bg-board text-white border-board'
            : 'border-ink/20 hover:bg-board/5'
        }`}
      >
        VOA Narration
      </button>
    </div>

    <div className="video-embed">
      {giftVideo === 'animated' ? (
        <iframe
          src="https://www.youtube.com/embed/XLcnjwHpctQ"
          title="The Gift of the Magi — Animated Story"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
     
) : (
  <video
    controls
    playsInline
    preload="metadata"
    className="w-full aspect-video"
    title="The Gift of the Magi — VOA Learning English"
  >
    <source
      src="https://voa-video-ns.akamaized.net/pangeavideo/2014/12/3/36/36fb8ef4-a6ec-4ed7-a573-0924aaa83d0d_mobile.mp4?cb=ecc3616be&download=1"
      type="video/mp4"
    />
    Your browser does not support this video.
  </video>
)}

    </div>
  </div>
) : (
  <div className="notes-content mt-6">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {content || 'Content coming soon.'}
    </ReactMarkdown>
  </div>
)}


      {mcqs.length > 0 ? (
              <QuizWidget
          key={`quiz-progress:${track}:${unitId}:listening:${exerciseId}`}
          mcqs={mcqs}
          title={exercise.title}
          storageKey={`quiz-progress:${track}:${unitId}:listening:${exerciseId}`}
        />
      ) : (
        <div className="mt-8 bg-board/5 border border-dashed border-ink/20 rounded-lg p-6 text-center">
          <p className="text-ink-soft text-sm">Quiz for this exercise is being added soon.</p>
        </div>
      )}

      <Link to={`/${track}/${unitId}/listening`} className="inline-block mt-6 text-rule font-medium hover:underline">
        ← All listening exercises
      </Link>
      {mcqs.length > 0 && (
             <p className="text-xs text-ink-soft mt-1">Your progress is saved in this browser tab — safe to go back and resume, but it won't carry over if you close the tab or switch devices.</p>
      )}
    </div>
  )
}
