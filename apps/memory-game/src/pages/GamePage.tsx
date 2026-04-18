import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGame } from '../hooks/useGame'
import { Grid } from '../components/Grid'
import { motion } from 'framer-motion'

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const GamePage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { gameState, initializeGame, setSoundEnabled, flipTile, useHint, usePeek, restartGame } = useGame()

  const mode = searchParams.get('mode') as 'fun' | 'learning'
  const theme = searchParams.get('theme') || 'animals'
  const difficulty = (searchParams.get('difficulty') || 'easy') as 'easy' | 'medium' | 'hard'
  const subject = searchParams.get('subject') || 'math'
  const topic = searchParams.get('topic') || 'addition'

  useEffect(() => {
    if (mode) {
      initializeGame(mode, {
        theme,
        subject,
        topic,
        difficulty,
      })
    }
  }, [mode, theme, subject, topic, difficulty, initializeGame])



  useEffect(() => {
    let resultTimeout: ReturnType<typeof setTimeout>
    if (gameState.isComplete) {
      resultTimeout = setTimeout(() => {
        navigate('/result', { 
          state: { 
            stats: { 
              ...gameState.stats, 
              seconds: gameState.timer.seconds,
              moves: gameState.moves 
            }, 
            mode: gameState.mode, 
            matchedPairs: gameState.matchedPairs,
            subject,
            topic,
            theme,
            difficulty
          } 
        })
      }, 1500)
    }
    return () => {
      if (resultTimeout) clearTimeout(resultTimeout)
    }
  }, [
    gameState.isComplete, 
    gameState.stats, 
    gameState.mode, 
    gameState.matchedPairs, 
    navigate, 
    difficulty, 
    gameState.moves, 
    gameState.timer.seconds, 
    subject, 
    theme, 
    topic
  ])

  if (!mode) return <div>Invalid game mode</div>

  const isLearning = mode === 'learning'

  return (
    <div className="game-page-container">
      <header className="game-header">
        <div className="header-left">
          <div className="mode-label">
            {isLearning ? 'LEARNING' : 'FUN'} &bull; {difficulty.toUpperCase()}
          </div>
          <div className="mode-title">
            {isLearning 
              ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} — ${topic.charAt(0).toUpperCase() + topic.slice(1)}` 
              : theme.charAt(0).toUpperCase() + theme.slice(1)}
          </div>
        </div>

        <div className="header-center">
          <div className="header-stat">
            <span>MOVES</span>
            <strong>{gameState.moves}</strong>
          </div>
          <div className="header-stat">
            <span>TIME</span>
            <strong>{formatTime(gameState.timer.seconds)}</strong>
          </div>
          <div className="header-stat">
            <span>SCORE</span>
            <strong className="score-val">{gameState.stats.matchedCount}</strong>
          </div>
        </div>

        <div className="header-right">
          {isLearning && (
            <>
              <button className="icon-btn hint-btn" title="Hint" onClick={useHint} disabled={gameState.hints.remaining === 0 || gameState.isProcessing}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M9 18h6M10 22h4M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="none" fill="currentColor"/><circle cx="12" cy="11" r="5" fill="none"/></svg>
                <span className="badge">{gameState.hints.remaining}</span>
              </button>
              <button className="icon-btn peek-btn" title="Peek" onClick={usePeek} disabled={gameState.peek.timesUsed >= gameState.peek.maxTimes || gameState.isProcessing || gameState.peek.isActive}>
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                <span className="badge">{gameState.peek.maxTimes - gameState.peek.timesUsed}</span>
              </button>
            </>
          )}
           <button 
            className="icon-btn" 
            onClick={() => setSoundEnabled(!gameState.config.soundEnabled)} 
            title={gameState.config.soundEnabled ? "Mute" : "Unmute"}
          >
            {gameState.config.soundEnabled ? (
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
            )}
          </button>
          <button className="icon-btn" onClick={restartGame} title="Restart">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          </button>
          <button className="icon-btn" onClick={() => navigate('/')} title="Home">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </button>
        </div>
      </header>

      <main className="game-board-area">
        <div className="game-board-wrapper">
          <Grid
            tiles={gameState.tiles}
            onTileClick={flipTile}
            disabled={gameState.isProcessing}
            gridSize={gameState.config.gridSize}
            mode={mode}
            difficulty={difficulty}
          />

        </div>
      </main>
    </div>
  )
}

export default GamePage