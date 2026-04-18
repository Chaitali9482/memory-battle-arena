import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const pageMotion = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, ease: 'easeOut' } }
}

const titleMotion = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const cardMotion = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const selectionMotion = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
}

const themes = [
  { id: 'animals', name: 'Animals', icon: '🐾' },
  { id: 'food', name: 'Food', icon: '🍎' },
  { id: 'nature', name: 'Nature', icon: '🌲' },
  { id: 'space', name: 'Space', icon: '🚀' },
  { id: 'sports', name: 'Sports', icon: '⚽' }
]

const subjects = [
  { id: 'math', name: 'Math', icon: '➗', topics: ['solve'] },
  { id: 'science', name: 'Science', icon: '🧪', topics: ['elements'] },
  { id: 'history', name: 'History', icon: '🏛️', topics: ['civilizations'] },
  { id: 'geography', name: 'Geography', icon: '🌍', topics: ['capitals'] }
]

const difficulties = [
  { id: 'easy', name: 'Easy', desc: '4x4 Grid' },
  { id: 'medium', name: 'Medium', desc: '6x6 Grid' },
  { id: 'hard', name: 'Hard', desc: '8x8 Grid' }
]

const HomePage = () => {
  const navigate = useNavigate()
  const [showFunOptions, setShowFunOptions] = useState(false)
  const [showLearningOptions, setShowLearningOptions] = useState(false)
  
  const [selectedTheme, setSelectedTheme] = useState('animals')
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy')

  const [selectedSubject, setSelectedSubject] = useState('math')
  const [selectedTopic, setSelectedTopic] = useState('addition')

  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'fun'>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'dark' | 'light' | 'fun'
    if (savedTheme) {
      setThemeMode(savedTheme)
      document.body.className = `${savedTheme}-theme`
    } else {
      document.body.className = 'dark-theme'
    }
  }, [])

  const startFunGame = () => {
    navigate(`/game?mode=fun&theme=${selectedTheme}&difficulty=${selectedDifficulty}`)
  }

  const startLearningGame = () => {
    navigate(`/game?mode=learning&subject=${selectedSubject}&topic=${selectedTopic}&difficulty=${selectedDifficulty}`)
  }

  const handleModeClick = (mode: 'fun' | 'learning') => {
    if (mode === 'fun') {
      setShowFunOptions(true)
    } else {
      setShowLearningOptions(true)
    }
  }

  const toggleTheme = () => {
    const next: Record<'dark' | 'light' | 'fun', 'dark' | 'light' | 'fun'> = {
      dark: 'light',
      light: 'fun',
      fun: 'dark'
    }
    const newTheme = next[themeMode]
    setThemeMode(newTheme)
    document.body.className = `${newTheme}-theme`
    localStorage.setItem('app-theme', newTheme)
  }

  const currentSubject = subjects.find(s => s.id === selectedSubject)

  return (
    <motion.section className="home-page" initial="hidden" animate="visible" variants={pageMotion}>
      <header className="page-header">
        <button className="theme-toggle" onClick={toggleTheme}>
          {themeMode === 'dark' ? '🌙' : themeMode === 'light' ? '☀️' : '🌈'}
        </button>
      </header>
      
      <motion.div className="home-titles compact" variants={titleMotion}>
        <h1 className="main-title">Memory Battle Arena</h1>
        <p className="main-subtitle">Train your brain. Beat the clock.</p>
      </motion.div>

      <div className="home-content">
        <AnimatePresence mode="wait">
          {!showFunOptions && !showLearningOptions ? (
            <motion.div 
              key="modes"
              className="mode-selection-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div 
                className="mode-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
              <motion.div
                className="mode-card fun-card"
                variants={cardMotion}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeClick('fun')}
              >
                <div className="icon-splash fun-icon">
                  <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                </div>
                <div className="mode-copy">
                  <h3>Fun Mode</h3>
                  <p>Match emojis, beat your high score, pure arcade fun.</p>
                </div>
              </motion.div>

              <motion.div
                className="mode-card learning-card"
                variants={cardMotion}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModeClick('learning')}
              >
                <div className="icon-splash learning-icon">
                  <span className="emoji-icon">
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  </span>
                </div>
                <div className="mode-copy">
                  <h3>Learning Mode</h3>
                  <p>Master math, science, and history while playing.</p>
                </div>
              </motion.div>
              </motion.div>
            </motion.div>
          ) : showFunOptions ? (
            <motion.div 
              key="fun-options"
              className="selection-overlay"
              variants={selectionMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="selection-container">
                <div className="selection-header">
                  <button className="back-link" onClick={() => setShowFunOptions(false)}>
                    &lt; Back
                  </button>
                  <h2 style={{ color: 'var(--text-main)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                    Configure Fun Mode
                  </h2>
                </div>

                <div className="selection-group" style={{ marginBottom: '1.2rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.8rem' }}>Select Theme</label>
                  <div className="option-grid theme-grid">
                    {themes.map((t, i) => (
                      <motion.button 
                        key={t.id}
                        className={`option-btn ${selectedTheme === t.id ? 'active' : ''}`}
                        onClick={() => setSelectedTheme(t.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="btn-icon">{t.icon}</span>
                        <span className="btn-label">{t.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="selection-group">
                  <label>Select Difficulty</label>
                  <div className="option-grid difficulty-grid">
                    {difficulties.map((d, i) => (
                      <motion.button 
                        key={d.id}
                        className={`option-btn ${selectedDifficulty === d.id ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(d.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="btn-label">{d.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <button className="primary start-btn" onClick={startFunGame}>
                  START BATTLE
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="learning-options"
              className="selection-overlay"
              variants={selectionMotion}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="selection-container">
                <div className="selection-header">
                  <button className="back-link" onClick={() => setShowLearningOptions(false)}>
                    &lt; Back
                  </button>
                  <h2 style={{ color: 'var(--text-main)', fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                    Configure Learning Mode
                  </h2>
                </div>

                <div className="selection-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.6rem' }}>Select Subject</label>
                  <div className="option-grid theme-grid">
                    {subjects.map((s, i) => (
                      <motion.button 
                        key={s.id}
                        className={`option-btn ${selectedSubject === s.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedSubject(s.id)
                          setSelectedTopic(s.topics[0])
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="btn-icon">{s.icon}</span>
                        <span className="btn-label">{s.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="selection-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.8rem', marginBottom: '0.6rem' }}>Select Topic</label>
                  <div className="option-grid theme-grid">
                    {currentSubject?.topics.map((t, i) => (
                      <motion.button 
                        key={t}
                        className={`option-btn ${selectedTopic === t ? 'active' : ''}`}
                        onClick={() => setSelectedTopic(t)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="btn-label" style={{ textTransform: 'capitalize' }}>{t}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="selection-group">
                  <label>Select Difficulty</label>
                  <div className="option-grid difficulty-grid">
                    {difficulties.map((d, i) => (
                      <motion.button 
                        key={d.id}
                        className={`option-btn ${selectedDifficulty === d.id ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(d.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="btn-label">{d.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <button className="primary start-btn" onClick={startLearningGame}>
                  START BATTLE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>

  )
}

export default HomePage