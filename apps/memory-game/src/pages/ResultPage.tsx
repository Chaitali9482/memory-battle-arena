import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Confetti } from '../components/Confetti'
import { saveLastGameSettings } from '../services/progressService'

const containerMotion = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
}

const itemMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const CountUp = ({ value, duration = 1.5 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])
  
  return <span>{count}</span>
}

const ResultPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { stats, mode, subject, topic, theme, difficulty, matchedPairs } = location.state || { 
    stats: { accuracy: 85, moves: 15, matchedCount: 8, seconds: 26 }, 
    mode: 'fun',
    theme: 'animals',
    difficulty: 'easy',
    matchedPairs: []
  }

  const accuracy = stats?.accuracy || 0
  const moves = stats?.moves || 0

  // 3-Star Rating Logic
  let stars = 1
  if (accuracy >= 85 || (mode === 'fun' && (accuracy >= 90))) stars = 3
  else if (accuracy >= 60) stars = 2

  const score = Math.max(0, (stats?.matchedCount || 0) * 50 + accuracy - moves * 2)

  useEffect(() => {
    // Save last game settings for quick play
    saveLastGameSettings({
      mode: mode as 'fun' | 'learning',
      difficulty: difficulty as 'easy' | 'medium' | 'hard',
      theme,
      subject,
      topic
    })
  }, [mode, subject, theme, difficulty])

  const displayMode = mode === 'fun' ? 'Fun' : 'Learning'
  const displaySubject = mode === 'learning' ? (subject || 'Math') : (theme || 'Animals')
  const displayDetail = mode === 'learning' ? (topic || 'Addition') : (difficulty || 'Easy')


  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section className="result-page victory-container">
      <Confetti />
      <div className="victory-glow-bg" />
      <motion.div
        className="victory-card victory-card--result"
        variants={containerMotion}
        initial="hidden"
        animate="visible"
      >
        <motion.header className="victory-section victory-section--header" variants={itemMotion}>
          <h1 className="victory-title victory-title--glow">VICTORY!</h1>
          <p className="result-info-text victory-subtitle victory-subtitle--result">
            {displayMode} · {displaySubject} · {displayDetail}
          </p>

          <div className="victory-card-divider" role="separator" aria-hidden />

          <div className="stars-container-yellow">
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className={`star-gold ${i < stars ? 'filled' : ''}`}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.8 + i * 0.2, type: 'spring', rotate: { duration: 0.6, ease: 'easeOut' } }}
              >
                ★
              </motion.span>
            ))}
          </div>
        </motion.header>

        <motion.section className="victory-section victory-section--stats" aria-label="Game statistics" variants={itemMotion}>
          <div className="stats-grid stats-grid--result">
            <div className="stat-box">
              <span className="stat-label">SCORE</span>
              <span className="stat-value stat-value--score">
                <motion.span className="stat-value stat-value--score" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}><CountUp value={score} /></motion.span>
              </span>
            </div>
            <div className="stat-box">
              <span className="stat-label">TIME</span>
              <span className="stat-value">{formatTime(stats?.seconds || 0)}</span>
            </div>
            <div className="stat-box stat-box--wide">
              <span className="stat-label">MOVES</span>
              <span className="stat-value">{stats?.moves || 0}</span>
            </div>
          </div>
        </motion.section>

        <motion.section className="victory-section victory-section--actions" aria-label="Next steps" variants={itemMotion}>
          <div className="victory-actions">
            <motion.button
              type="button"
              className="victory-action victory-action--review victory-action--shine"
              onClick={() =>
                navigate('/review', { state: { matchedPairs, subject, topic, theme, mode } })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="victory-action-inner">Review Pairs</span>
            </motion.button>
            <motion.button type="button" className="victory-action victory-action--play" onClick={() => navigate(-1)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Play Again
            </motion.button>
            <motion.button type="button" className="victory-action victory-action--menu" onClick={() => navigate('/')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <span className="victory-menu-icon" aria-hidden>
                ◆
              </span>
              Menu
            </motion.button>
          </div>
        </motion.section>
      </motion.div>
    </section>
  )
}

export default ResultPage