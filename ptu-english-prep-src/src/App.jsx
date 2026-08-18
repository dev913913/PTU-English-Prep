import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import TrackPage from './pages/TrackPage'
import UnitPage from './pages/UnitPage'
import QuizPage from './pages/QuizPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:track" element={<TrackPage />} />
        <Route path="/:track/:unitId" element={<UnitPage />} />
        <Route path="/:track/:unitId/quiz" element={<QuizPage />} />
      </Routes>
    </Layout>
  )
}
