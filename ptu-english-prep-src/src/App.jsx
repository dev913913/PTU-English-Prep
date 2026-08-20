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

export default function App() {
  return (
    <Layout>
      <Analytics />
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
    </Layout>
  )
}