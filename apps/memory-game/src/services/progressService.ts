/**
 * Progress Tracking Service
 * Manages localStorage for best times, scores, and accuracy tracking
 */

export interface ProgressStats {
  bestTime: number | null
  bestScore: number | null
  bestAccuracy: number | null
  gamesPlayed: number
  totalAccuracy: number // sum of all accuracies for average
}

const PREFIX = 'progress_'

/**
 * Generate storage key for mode/difficulty combination
 */
const getKey = (mode: 'fun' | 'learning', difficulty: 'easy' | 'medium' | 'hard', subject?: string, theme?: string): string => {
  if (mode === 'fun') {
    return `${PREFIX}${mode}_${difficulty}_${theme || 'animals'}`
  }
  return `${PREFIX}${mode}_${difficulty}_${subject || 'math'}`
}

/**
 * Get progress stats for a specific game mode
 */
export const getProgressStats = (
  mode: 'fun' | 'learning',
  difficulty: 'easy' | 'medium' | 'hard',
  subject?: string,
  theme?: string
): ProgressStats => {
  const key = getKey(mode, difficulty, subject, theme)
  const saved = localStorage.getItem(key)
  
  if (saved) {
    return JSON.parse(saved)
  }
  
  return {
    bestTime: null,
    bestScore: null,
    bestAccuracy: null,
    gamesPlayed: 0,
    totalAccuracy: 0
  }
}

/**
 * Update progress stats after a game
 */
export const updateProgressStats = (
  mode: 'fun' | 'learning',
  difficulty: 'easy' | 'medium' | 'hard',
  stats: {
    time: number
    score: number
    accuracy: number
  },
  subject?: string,
  theme?: string
): { isNewBestTime: boolean; isNewBestScore: boolean; isNewBestAccuracy: boolean } => {
  const key = getKey(mode, difficulty, subject, theme)
  const current = getProgressStats(mode, difficulty, subject, theme)

  let isNewBestTime = false
  let isNewBestScore = false
  let isNewBestAccuracy = false

  // Check for new best time (lower is better)
  if (current.bestTime === null || stats.time < current.bestTime) {
    current.bestTime = stats.time
    isNewBestTime = true
  }

  // Check for new best score (higher is better)
  if (current.bestScore === null || stats.score > current.bestScore) {
    current.bestScore = stats.score
    isNewBestScore = true
  }

  // Check for new best accuracy (higher is better)
  if (current.bestAccuracy === null || stats.accuracy > current.bestAccuracy) {
    current.bestAccuracy = stats.accuracy
    isNewBestAccuracy = true
  }

  // Update aggregate stats
  current.gamesPlayed += 1
  current.totalAccuracy += stats.accuracy

  localStorage.setItem(key, JSON.stringify(current))

  return { isNewBestTime, isNewBestScore, isNewBestAccuracy }
}

/**
 * Get average accuracy for a game mode
 */
export const getAverageAccuracy = (
  mode: 'fun' | 'learning',
  difficulty: 'easy' | 'medium' | 'hard',
  subject?: string,
  theme?: string
): number => {
  const stats = getProgressStats(mode, difficulty, subject, theme)
  if (stats.gamesPlayed === 0) return 0
  return Math.round(stats.totalAccuracy / stats.gamesPlayed)
}

/**
 * Get last game settings
 */
export const getLastGameSettings = (): {
  mode: 'fun' | 'learning'
  difficulty: 'easy' | 'medium' | 'hard'
  theme?: string
  subject?: string
  topic?: string
} | null => {
  const saved = localStorage.getItem('last_game_settings')
  return saved ? JSON.parse(saved) : null
}

/**
 * Save last game settings for quick start
 */
export const saveLastGameSettings = (settings: {
  mode: 'fun' | 'learning'
  difficulty: 'easy' | 'medium' | 'hard'
  theme?: string
  subject?: string
  topic?: string
}): void => {
  localStorage.setItem('last_game_settings', JSON.stringify(settings))
}

/**
 * Check if player has played before
 */
export const hasPlayedBefore = (): boolean => {
  return localStorage.getItem('last_game_settings') !== null
}

/**
 * Clear all progress (for debugging)
 */
export const clearAllProgress = (): void => {
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith(PREFIX) || key === 'last_game_settings') {
      localStorage.removeItem(key)
    }
  })
}
