export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
}

const STORAGE_KEY = 'mba_achievements'
const WIN_STREAK_KEY = 'mba_win_streak'

export const ALL_ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first_win',      title: 'First Win',      icon: '🏆', description: 'Complete your first game.' },
  { id: 'perfect_game',   title: 'Perfect Game',   icon: '✨', description: 'Finish with 0 mistakes.' },
  { id: 'speed_demon',    title: 'Speed Demon',    icon: '⚡', description: 'Finish a game in under 30 seconds.' },
  { id: 'win_streak_3',   title: 'On Fire',        icon: '🔥', description: 'Win 3 games in a row.' },
  { id: 'scholar',        title: 'Scholar',        icon: '🎓', description: 'Complete a Learning Mode game.' },
  { id: 'hard_mode',      title: 'Challenge Accepted', icon: '💀', description: 'Complete a Hard difficulty game.' },
  { id: 'fun_fan',        title: 'Fun Fan',        icon: '😄', description: 'Complete a Fun Mode game.' },
  { id: 'sharp_mind',     title: 'Sharp Mind',     icon: '🧠', description: 'Achieve 100% accuracy.' },
]

export function getAchievements(): Achievement[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  const unlocked: Record<string, string> = stored ? JSON.parse(stored) : {}
  return ALL_ACHIEVEMENTS.map(a => ({
    ...a,
    unlocked: !!unlocked[a.id],
    unlockedAt: unlocked[a.id],
  }))
}

function saveUnlock(id: string) {
  const stored = localStorage.getItem(STORAGE_KEY)
  const unlocked: Record<string, string> = stored ? JSON.parse(stored) : {}
  if (!unlocked[id]) {
    unlocked[id] = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked))
    return true // newly unlocked
  }
  return false // already had it
}

export interface GameResult {
  mode: 'fun' | 'learning'
  mistakes: number   // moves beyond minimum
  seconds: number
  accuracy: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export function checkAndUnlockAchievements(result: GameResult): Achievement[] {
  const newlyUnlocked: Achievement[] = []

  const tryUnlock = (id: string) => {
    if (saveUnlock(id)) {
      const def = ALL_ACHIEVEMENTS.find(a => a.id === id)!
      newlyUnlocked.push({ ...def, unlocked: true, unlockedAt: new Date().toISOString() })
    }
  }

  // First Win
  tryUnlock('first_win')

  // Perfect Game (100% accuracy or 0 mistakes)
  if (result.accuracy === 100 || result.mistakes === 0) tryUnlock('perfect_game')

  // Sharp Mind (100% accuracy)
  if (result.accuracy === 100) tryUnlock('sharp_mind')

  // Speed Demon
  if (result.seconds < 30) tryUnlock('speed_demon')

  // Mode-specific
  if (result.mode === 'learning') tryUnlock('scholar')
  if (result.mode === 'fun') tryUnlock('fun_fan')

  // Hard mode
  if (result.difficulty === 'hard') tryUnlock('hard_mode')

  // Win streak
  const stored = parseInt(localStorage.getItem(WIN_STREAK_KEY) || '0') + 1
  localStorage.setItem(WIN_STREAK_KEY, stored.toString())
  if (stored >= 3) tryUnlock('win_streak_3')

  return newlyUnlocked
}

export function resetWinStreak() {
  localStorage.setItem(WIN_STREAK_KEY, '0')
}
