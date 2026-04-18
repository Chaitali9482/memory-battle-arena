export interface Tile {
  id: number
  value?: string // old fun mode
  content?: string // new requested property
  pairId: number
  isFlipped: boolean
  isMatched: boolean
  type?: 'question' | 'answer'
  explanation?: string
  isWrong?: boolean
}

export interface QuestionAnswer {
  q: string
  a: string
  pairId: number
  explanation?: string
}

export interface GameState {
  mode: 'fun' | 'learning'
  isActive: boolean
  isProcessing: boolean
  isComplete: boolean
  tiles: Tile[]
  flippedTiles: number[]
  matchedTiles: number[]
  moves: number
  hints: {
    remaining: number
    used: number
  }
  timer: {
    seconds: number
    isRunning: boolean
  }
  config: {
    theme?: string
    subject?: string
    topic?: string
    difficulty: 'easy' | 'medium' | 'hard'
    gridSize: number
    soundEnabled: boolean
  }
  stats: {
    totalPairs: number
    matchedCount: number
    accuracy: number
    startTime: Date | null
    endTime: Date | null
  }
  matchedPairs: Array<{ q: string, a: string, explanation?: string, attempts: number }>
  attemptsMap: Record<number, number>
  lastExplanation: string | null
  streak: number
  multiplier: number
  peek: {
    isActive: boolean
    timesUsed: number
    maxTimes: number
  }
}

export interface FunData {
  themes: {
    [theme: string]: {
      [difficulty: string]: {
        gridSize: number
        pairs: Array<{
          id: number
          emoji: string
          name: string
        }>
      }
    }
  }
}

export interface LearningData {
  subjects: {
    [subject: string]: {
      [topic: string]: {
        [difficulty: string]: Array<{
          q: string
          a: string
          pairId: number
          explanation?: string
        }>
      }
    }
  }
}