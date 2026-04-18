import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Spark {
  id: number
  angle: number
  dist: number
  size: number
  color: string
}

const SPARK_COLORS = ['#facc15', '#4ade80', '#60a5fa', '#f472b6', '#ffffff', '#a78bfa']

interface Props {
  active: boolean
  x: number  // px from left
  y: number  // px from top
}

export const MatchSparks = ({ active, x, y }: Props) => {
  const [sparks, setSparks] = useState<Spark[]>([])

  useEffect(() => {
    if (!active) return
    setSparks(
      Array.from({ length: 12 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i / 12) * 360,
        dist: 30 + Math.random() * 35,
        size: 4 + Math.random() * 5,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)]
      }))
    )
    const t = setTimeout(() => setSparks([]), 700)
    return () => clearTimeout(t)
  }, [active])

  return (
    <AnimatePresence>
      {sparks.map(s => {
        const rad = (s.angle * Math.PI) / 180
        const tx = Math.cos(rad) * s.dist
        const ty = Math.sin(rad) * s.dist
        return (
          <motion.div
            key={s.id}
            initial={{ x, y, scale: 1, opacity: 1 }}
            animate={{ x: x + tx, y: y + ty, scale: 0, opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              backgroundColor: s.color,
              pointerEvents: 'none',
              zIndex: 9000,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`
            }}
          />
        )
      })}
    </AnimatePresence>
  )
}
