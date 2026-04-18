import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const COLORS = ['#f2c94c', '#f2994a', '#8b4fff', '#1ba895', '#ff4d6d', '#ffffff', '#a78bfa', '#34d399']
const SHAPES = ['circle', 'rect', 'diamond']

interface Particle {
  id: number
  x: number
  color: string
  size: number
  delay: number
  duration: number
  drift: number
  rotate: number
  shape: string
}

export const Confetti = () => {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const burst = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 10 + 5,
      delay: Math.random() * 1.2,
      duration: 2.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 80,
      rotate: Math.random() * 720 - 360,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]
    }))
    setParticles(burst)
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 999
    }}>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: -20,
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          animate={{
            x: `calc(${p.x}vw + ${p.drift}px)`,
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: p.rotate,
            scale: [1, 0.8]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '1px',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : 'none',
            boxShadow: `0 0 ${p.size / 2}px ${p.color}80`
          }}
        />
      ))}
    </div>
  )
}
