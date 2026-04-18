import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Achievement } from '../services/achievementsService'

interface Props {
  achievements: Achievement[]
  onDone: () => void
}

export function AchievementPopup({ achievements, onDone }: Props) {
  const [index, setIndex] = useState(0)
  const current = achievements[index]

  useEffect(() => {
    if (!current) return
    const t = setTimeout(() => {
      if (index + 1 < achievements.length) {
        setIndex(i => i + 1)
      } else {
        onDone()
      }
    }, 2800)
    return () => clearTimeout(t)
  }, [index, current, achievements.length, onDone])

  return (
    <AnimatePresence mode="wait">
      {current && (
        <motion.div
          key={current.id}
          className="achievement-popup"
          initial={{ y: -80, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -60, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          <div className="achievement-popup-inner">
            <span className="ach-trophy">🏆</span>
            <div className="ach-text">
              <span className="ach-label">Achievement Unlocked!</span>
              <span className="ach-title">{current.icon} {current.title}</span>
              <span className="ach-desc">{current.description}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
