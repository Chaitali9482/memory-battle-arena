import { Tile } from './Tile'
import { Tile as TileType } from '../types/game'

interface GridProps {
  tiles: TileType[]
  onTileClick: (tileId: number) => void
  disabled: boolean
  gridSize: number
  mode?: 'fun' | 'learning'
  difficulty?: 'easy' | 'medium' | 'hard'
}

export const Grid = ({ tiles, onTileClick, disabled, gridSize, mode, difficulty }: GridProps) => {
  // REQUIREMENT: Do NOT render if tiles count is incorrect
  if (tiles.length !== gridSize * gridSize) {
    return null;
  }

  // Responsive gap calculation based on grid size and viewport
  const getResponsiveGap = (size: number): string => {
    if (size > 0) return 'clamp(4px, 1vw, 10px)'
    return 'clamp(4px, 1vw, 10px)'
  }

  const gap = getResponsiveGap(gridSize)

  return (
    <div
      className={`game-grid grid-${gridSize} ${mode === 'learning' ? 'learning-grid' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        width: '100%',
        height: '100%',
        aspectRatio: '1 / 1',
        margin: 'auto',
        gap: gap
      }}
    >
      {tiles.map(tile => (
        <Tile
          key={tile.id}
          tile={tile}
          onClick={onTileClick}
          disabled={disabled}
          mode={mode}
          gridSize={gridSize}
          difficulty={difficulty}
        />
      ))}
    </div>
  )
}