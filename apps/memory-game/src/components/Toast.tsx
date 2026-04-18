import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  title?: string
  type?: 'error' | 'success' | 'info'
  duration?: number
  onClose?: () => void
}

export const Toast = ({ message, title, type = 'info', duration = 2500, onClose }: ToastProps) => {
  const bgColors = {
    error: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
    info: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  }

  const defaultTitles = {
    error: 'Not quite!',
    success: 'Correct!',
    info: 'Info'
  }

  const displayTitle = title || defaultTitles[type]

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose()
      }
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <motion.div
      className="toast-notification"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{
        enter: { type: 'spring', stiffness: 350, damping: 25 },
        exit: { duration: 0.3, ease: 'easeInOut' }
      }}
      style={{
        background: bgColors[type],
        color: '#fff',
        padding: '0.8rem 1.2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2rem',
        width: '100%',
        maxWidth: '320px',
        minWidth: '260px',
        pointerEvents: 'none',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}
    >
      <div style={{ fontWeight: '700', fontSize: '1rem', letterSpacing: '0.02em' }}>
        {displayTitle}
      </div>
      <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.4 }}>
        {message}
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; title?: string; type?: 'error' | 'success' | 'info' }>
  onRemove: (id: string) => void
  duration?: number
}

export const ToastContainer = ({ toasts, onRemove, duration = 2500 }: ToastContainerProps) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            title={toast.title}
            type={toast.type || 'info'}
            duration={duration}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
