import { useState, useEffect, useCallback } from 'react'
import { GameState } from '../types/game'
import { loadFunTiles, loadLearningTiles } from '../services/gameService'
import { soundService } from '../services/soundService'

const initialGameState: GameState = {
  mode: 'fun',
  isActive: false,
  isProcessing: false,
  isComplete: false,
  tiles: [],
  flippedTiles: [],
  matchedTiles: [],
  moves: 0,
  hints: {
    remaining: 3,
    used: 0
  },
  timer: {
    seconds: 0,
    isRunning: false
  },
  config: {
    difficulty: 'easy',
    gridSize: 4,
    soundEnabled: true
  },
  stats: {
    totalPairs: 0,
    matchedCount: 0,
    accuracy: 0,
    startTime: null,
    endTime: null
  },
  matchedPairs: [],
  attemptsMap: {},
  lastExplanation: null,
  streak: 0,
  multiplier: 1.0,
  peek: {
    isActive: false,
    timesUsed: 0,
    maxTimes: 2
  }
}

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState)

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (gameState.timer.isRunning) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timer: {
            ...prev.timer,
            seconds: prev.timer.seconds + 1
          }
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState.timer.isRunning])

  // Check for game completion
  useEffect(() => {
    if (!gameState.isComplete && gameState.tiles.length > 0 && gameState.matchedTiles.length === gameState.tiles.length) {
      soundService.playVictory()
      setGameState(prev => {
        const accuracy = Math.round((prev.stats.totalPairs / Math.max(prev.moves, 1)) * 100)
        return {
          ...prev,
          isActive: false,
          isComplete: true,
          timer: { ...prev.timer, isRunning: false },
          stats: {
            ...prev.stats,
            endTime: new Date(),
            accuracy: Math.min(accuracy, 100)
          }
        }
      })
    }
  }, [gameState.isComplete, gameState.matchedTiles, gameState.tiles])

  const initializeGame = useCallback((mode: 'fun' | 'learning', config: Partial<GameState['config']>) => {
    const initialConfig = { ...initialGameState.config, ...config }
    const tileResult = mode === 'fun'
      ? loadFunTiles(initialConfig.theme || 'animals', initialConfig.difficulty)
      : loadLearningTiles(initialConfig.subject || 'math', initialConfig.topic || 'addition', initialConfig.difficulty)

    soundService.setMute(!initialConfig.soundEnabled)

    setGameState(_prev => ({
      ...initialGameState,
      mode,
      config: {
        ...initialConfig,
        gridSize: tileResult.gridSize
      },
      tiles: tileResult.tiles,
      stats: {
        ...initialGameState.stats,
        totalPairs: tileResult.tiles.length / 2,
        startTime: new Date(),
        endTime: null,
        accuracy: 0,
        matchedCount: 0
      },
      peek: {
        ...initialGameState.peek,
        maxTimes: initialConfig.difficulty === 'easy' ? 2 : initialConfig.difficulty === 'medium' ? 1 : 0
      }
    }))

    // Automatic peek reveal at game start - show all tiles for 2 seconds
    setTimeout(() => {
      setGameState(current => ({
        ...current,
        tiles: current.tiles.map(t => ({ ...t, isFlipped: true })),
        peek: { ...current.peek, isActive: true }
      }))

      // Flip back all tiles after 2 seconds
      setTimeout(() => {
        setGameState(current => ({
          ...current,
          tiles: current.tiles.map(t => ({ ...t, isFlipped: false })),
          peek: { ...current.peek, isActive: false }
        }))
      }, 2000)
    }, 500)
  }, [])

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundService.setMute(!enabled)
    setGameState(prev => ({
      ...prev,
      config: { ...prev.config, soundEnabled: enabled }
    }))
  }, [])

  const flipTile = useCallback((tileId: number) => {
    if (gameState.isProcessing || gameState.isComplete) return

    soundService.playFlip()

    setGameState(prev => {
      const tile = prev.tiles.find(t => t.id === tileId)
      if (!tile || tile.isFlipped || tile.isMatched) return prev

      const newFlippedTiles = [...prev.flippedTiles, tileId]
      let newTiles = prev.tiles.map(t =>
        t.id === tileId ? { ...t, isFlipped: true } : t
      )

      // Start timer on first move
      let newTimer = prev.timer
      if (!prev.isActive) {
        newTimer = { seconds: 0, isRunning: true }
      }

      // Check for match when 2 tiles are flipped
      if (newFlippedTiles.length === 2) {
        const [firstId, secondId] = newFlippedTiles
        const firstTile = newTiles.find(t => t.id === firstId)
        const secondTile = newTiles.find(t => t.id === secondId)

        if (firstTile && secondTile) {
          const pairId = firstTile.pairId
          const newAttemptsMap = {
            ...prev.attemptsMap,
            [pairId]: (prev.attemptsMap[pairId] || 0) + 1
          }

          const isMatch = prev.mode === 'fun'
            ? firstTile.value === secondTile.value
            : firstTile.pairId === secondTile.pairId

          if (isMatch) {
            // Match found
            soundService.playMatch()
            newTiles = newTiles.map(t =>
              t.id === firstId || t.id === secondId
                ? { ...t, isMatched: true }
                : t
            )
            
            const matchedPair = {
              q: prev.mode === 'learning' 
                ? (firstTile.type === 'question' ? firstTile.content! : secondTile.content!)
                : firstTile.value!,
              a: prev.mode === 'learning'
                ? (firstTile.type === 'answer' ? firstTile.content! : secondTile.content!)
                : firstTile.value!,
              explanation: firstTile.explanation || `Matched pair of ${firstTile.value || firstTile.content}`,
              attempts: newAttemptsMap[pairId]
            }

            setTimeout(() => {
              setGameState(current => ({
                ...current,
                isProcessing: false
              }))
            }, 500)

            return {
              ...prev,
              tiles: newTiles,
              flippedTiles: [],
              matchedTiles: [...prev.matchedTiles, firstId, secondId],
              matchedPairs: [...prev.matchedPairs, matchedPair],
              moves: prev.moves + 1,
              isActive: true,
              timer: newTimer,
              isProcessing: true,
              attemptsMap: newAttemptsMap,
              stats: {
                ...prev.stats,
                matchedCount: prev.stats.matchedCount + 1
              },
              lastExplanation: firstTile.explanation || secondTile.explanation || null
            }
          } else {
            // No match - flip back after delay
            soundService.playError()
            newTiles = newTiles.map(t =>
              t.id === firstId || t.id === secondId
                ? { ...t, isWrong: true }
                : t
            )

            setTimeout(() => {
              setGameState(current => ({
                ...current,
                tiles: current.tiles.map(t =>
                  t.id === firstId || t.id === secondId
                    ? { ...t, isFlipped: false, isWrong: false }
                    : t
                ),
                flippedTiles: [],
                isProcessing: false
              }))
            }, 800)

            return {
              ...prev,
              tiles: newTiles,
              flippedTiles: newFlippedTiles,
              moves: prev.moves + 1,
              isActive: true,
              timer: newTimer,
              isProcessing: true,
              attemptsMap: newAttemptsMap,
              lastExplanation: null
            }
          }
        }
      }

      return {
        ...prev,
        tiles: newTiles,
        flippedTiles: newFlippedTiles,
        isActive: true,
        timer: newTimer
      }
    })
  }, [gameState.isProcessing, gameState.isComplete])

  const useHint = useCallback(() => {
    if (gameState.hints.remaining <= 0 || gameState.isProcessing || gameState.isComplete) return

    // Find a random unmatched pair
    const unmatchedTiles = gameState.tiles.filter(t => !t.isMatched)
    if (unmatchedTiles.length < 2) return

    const randomTile = unmatchedTiles[Math.floor(Math.random() * unmatchedTiles.length)]
    const matchingTile = unmatchedTiles.find(t => t.pairId === randomTile.pairId && t.id !== randomTile.id)

    if (randomTile && matchingTile) {
      soundService.playFlip()
      setGameState(prev => ({
        ...prev,
        isProcessing: true,
        hints: {
          remaining: prev.hints.remaining - 1,
          used: prev.hints.used + 1
        },
        tiles: prev.tiles.map(t =>
          t.id === randomTile.id || t.id === matchingTile.id
            ? { ...t, isFlipped: true }
            : t
        )
      }))

      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          isProcessing: false,
          tiles: prev.tiles.map(t =>
            t.id === randomTile.id || t.id === matchingTile.id
              ? { ...t, isFlipped: false }
              : t
          )
        }))
      }, 1500)
    }
  }, [gameState.tiles, gameState.hints.remaining, gameState.isProcessing, gameState.isComplete])

  const usePeek = useCallback(() => {
    if (gameState.peek.timesUsed >= gameState.peek.maxTimes || gameState.isProcessing || gameState.isComplete || gameState.peek.isActive) return

    soundService.playFlip()
    setGameState(prev => ({
      ...prev,
      isProcessing: true,
      peek: {
        ...prev.peek,
        isActive: true,
        timesUsed: prev.peek.timesUsed + 1
      },
      tiles: prev.tiles.map(t => ({
        ...t,
        isFlipped: !t.isMatched
      }))
    }))

    // Flip back unmatched tiles after 3 seconds
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        isProcessing: false,
        peek: { ...prev.peek, isActive: false },
        tiles: prev.tiles.map(t =>
          t.isMatched ? t : { ...t, isFlipped: false }
        )
      }))
    }, 3000)
  }, [gameState.peek, gameState.isProcessing, gameState.isComplete, gameState.tiles])

  const restartGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isActive: false,
      isProcessing: false,
      isComplete: false,
      tiles: prev.tiles.map(t => ({ ...t, isFlipped: false, isMatched: false })),
      flippedTiles: [],
      matchedTiles: [],
      moves: 0,
      hints: { remaining: 3, used: 0 },
      timer: { seconds: 0, isRunning: false },
      stats: {
        ...prev.stats,
        matchedCount: 0,
        accuracy: 0,
        startTime: null,
        endTime: null
      },
      matchedPairs: [],
      lastExplanation: null,
      streak: 0,
      peek: {
        ...prev.peek,
        isActive: false,
        timesUsed: 0
      }
    }))
  }, [])

  return {
    gameState,
    initializeGame,
    setSoundEnabled,
    flipTile,
    useHint,
    usePeek,
    restartGame
  }
}