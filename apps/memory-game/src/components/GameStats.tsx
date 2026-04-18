import { GameState } from '../types/game'

interface GameStatsProps {
  gameState: GameState
}

export const GameStats = ({ gameState }: GameStatsProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="game-stats">
      <div className="stat">
        <span className="stat-label">Moves:</span>
        <span className="stat-value">{gameState.moves}</span>
      </div>
      <div className="stat">
        <span className="stat-label">Time:</span>
        <span className="stat-value">{formatTime(gameState.timer.seconds)}</span>
      </div>
      {gameState.mode === 'learning' && (
        <div className="stat">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">
            {gameState.moves > 0 ? Math.round((gameState.stats.matchedCount / gameState.moves) * 100) : 0}%
          </span>
        </div>
      )}
      <div className="stat">
        <span className="stat-label">Matched:</span>
        <span className="stat-value">{gameState.matchedTiles.length / 2} / {gameState.tiles.length / 2}</span>
      </div>
    </div>
  )
}