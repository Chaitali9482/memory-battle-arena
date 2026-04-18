import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import ResultPage from './pages/ResultPage'
import ReviewPage from './pages/ReviewPage'
import AchievementsPage from './pages/AchievementsPage'
import { LoadingScreen } from './components/LoadingScreen'
import { BackgroundParticles } from './components/BackgroundParticles'
import './App.css'
import './index.css'

function App() {
  const location = useLocation()
  const [loading, setLoading] = useState(true)

  return (
    <div className="App">
      <BackgroundParticles />
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <main className="app-main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App