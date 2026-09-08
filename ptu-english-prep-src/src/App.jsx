import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import Home from './pages/Home'
import TrackPage from './pages/TrackPage'
import UnitPage from './pages/UnitPage'
import QuizPage from './pages/QuizPage'
import ListeningHub from './pages/ListeningHub'
import ListeningExercisePage from './pages/ListeningExercisePage'
import LabPartPage from './pages/LabPartPage'
import PyqPage from './pages/PyqPage'
import ErrorBoundary from './components/ErrorBoundary'

/**
 * Root application component. Sets up the page layout, analytics, and all
 * client-side routes, wrapped in an error boundary so a crash on one page
 * doesn't take down the whole site.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Analytics />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pyq" element={<PyqPage />} />
            <Route path="/:track" element={<TrackPage />} />
            <Route path="/:track/:unitId" element={<UnitPage />} />
            <Route path="/:track/:unitId/quiz" element={<QuizPage />} />
            <Route path="/:track/:unitId/listening" element={<ListeningHub />} />
            <Route path="/:track/:unitId/listening/:exerciseId" element={<ListeningExercisePage />} />
            <Route path="/:track/:unitId/:partId" element={<LabPartPage />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </ErrorBoundary>
  )
}