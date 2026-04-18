import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0)
  
  const loadingMessages = [
    "Preparing your challenge...",
    "Loading tiles...",
    "Shuffling cards...",
    "Get ready!",
    "Starting soon..."
  ]
  
  const [message] = useState(loadingMessages[Math.floor(Math.random() * loadingMessages.length)])

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 5
      })
    }, 50)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="loading-content">
        <motion.div 
          className="loading-logo"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🎮
        </motion.div>
        <h1 className="loading-text">MEMORY ARENA</h1>
        <div className="loading-bar-container">
          <motion.div 
            className="loading-bar-fill"
            animate={{ width: `${progress}%` }}
          />
        </div>
        <p className="loading-subtitle">{message}</p>
      </div>
    </motion.div>
  )
}
