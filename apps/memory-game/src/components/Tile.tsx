import { motion, useAnimation } from 'framer-motion'
import { Tile as TileType } from '../types/game'
import { MatchSparks } from './MatchSparks'
import { useRef, useEffect, useState } from 'react'

interface TileProps {
  tile: TileType
  onClick: (tileId: number) => void
  disabled: boolean
  mode?: 'fun' | 'learning'
  gridSize: number
  difficulty?: 'easy' | 'medium' | 'hard'
}

export const Tile = ({ tile, onClick, disabled, mode, gridSize, difficulty = 'easy' }: TileProps) => {
  const controls = useAnimation()
  const tileRef = useRef<HTMLDivElement>(null)
  const [sparkPos, setSparkPos] = useState<{ x: number; y: number } | null>(null)
  const [sparkActive, setSparkActive] = useState(false)
  const wasMatched = useRef(false)

  // Trigger sparks once when tile becomes matched
  useEffect(() => {
    if (tile.isMatched && !wasMatched.current) {
      wasMatched.current = true
      if (tileRef.current) {
        const rect = tileRef.current.getBoundingClientRect()
        setSparkPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        setSparkActive(true)
      }
    }
  }, [tile.isMatched])

  // Bounce flip animation
  useEffect(() => {
    if (tile.isFlipped || tile.isMatched) {
      controls.start({ scale: [1, 1.06, 0.97, 1], transition: { duration: 0.35, times: [0, 0.4, 0.7, 1] } })
    }
  }, [tile.isFlipped, tile.isMatched, controls])

  const handleClick = () => {
    if (!disabled && !tile.isFlipped && !tile.isMatched) {
      onClick(tile.id)
    }
  }

  const isLearning = mode === 'learning'
  const typeClass = tile.type || ''

  // Determine if this is a math tile (for learning mode, subject math, or content looks like math)
  const isMath = (() => {
    if (!tile.content) return false;
    return /[\d\+\-×÷=\*\/]/.test(tile.content);
  })();
  const isText = !isMath;

  // Content length-based font scaling
  let lengthClass = '';
  if (tile.content) {
    if (tile.content.length > 16) lengthClass = ' length-17';
    else if (tile.content.length > 12) lengthClass = ' length-13';
    else if (tile.content.length > 8) lengthClass = ' length-9';
  }

  const renderContent = () => {
    if (!tile.isMatched && !tile.isFlipped) return '?';

    let content = tile.content || (typeof tile.value === 'string' ? tile.value : '?');
    const isEmoji = mode === 'fun' && !tile.content;

    // Compact math strings (optional, keep if you want)
    if (typeof content === 'string' && content.includes('+')) {
      content = content.replace(/\s+/g, '');
    }

    // Assign class based on type, length, and difficulty
    let className = 'tile-text';
    if (isMath) className += ' math';
    if (isText) className += ' text';
    className += lengthClass;
    if (isEmoji) className += ' emoji';
    if (difficulty) className += ` ${difficulty}`;

    return (
      <div className={className}>
        {content}
      </div>
    );
  }

  return (
    <>
      {sparkPos && (
        <MatchSparks
          active={sparkActive}
          x={sparkPos.x}
          y={sparkPos.y}
        />
      )}
      <motion.div
        ref={tileRef}
        className={`tile ${isLearning ? 'learning' : ''} ${tile.isMatched ? 'matched' : ''} ${tile.isFlipped ? 'flipped' : ''} ${tile.isWrong ? 'shake-wrong' : ''} grid-${gridSize}`}
        onClick={handleClick}
        animate={controls}
        whileHover={!disabled && !tile.isMatched && !tile.isFlipped ? { 
          scale: 1.08,
          y: -6,
          boxShadow: "0 18px 40px rgba(52, 152, 219, 0.5)"
        } : !tile.isMatched ? { 
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)"
        } : {}}
        whileTap={!disabled && !tile.isMatched && !tile.isFlipped ? { scale: 0.96 } : {}}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 17
        }}
        style={{
          perspective: '1000px'
        }}
      >
        <div className="tile-inner">
          <div className="tile-front">?</div>
          <div className={`tile-back ${typeClass}`}>
            <div className="tile-content-wrapper">
              {renderContent()}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}