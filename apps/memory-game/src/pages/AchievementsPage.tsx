import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAchievements } from '../services/achievementsService'

const containerMotion = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
}

const itemMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const AchievementsPage = () => {
  const navigate = useNavigate()
  const achievements = getAchievements()
  const unlocked = achievements.filter(a => a.unlocked).length

  return (
    <section className="victory-container">
      <motion.div
        className="victory-card postgame-card"
        variants={containerMotion}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="victory-title" variants={itemMotion}>
          🏆 Achievements
        </motion.h1>
        <motion.div
          className="victory-card-divider"
          variants={itemMotion}
          role="separator"
          aria-hidden
        />

        <motion.p className="result-info-text" variants={itemMotion}>
          {unlocked} / {achievements.length} Unlocked
        </motion.p>

        <motion.div className="ach-progress-bar-wrap postgame-ach-progress" variants={itemMotion}>
          <motion.div
            className="ach-progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked / achievements.length) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </motion.div>

        <motion.main className="postgame-ach-list" variants={itemMotion}>
          {achievements.map((ach, i) => (
            <motion.div
              key={ach.id}
              className={`postgame-ach-item ach-card ${ach.unlocked ? 'ach-unlocked' : 'ach-locked'}`}
              variants={itemMotion}
              transition={{ delay: i * 0.04 }}
            >
              <span className="ach-card-icon">{ach.unlocked ? ach.icon : '🔒'}</span>
              <div className="ach-card-body">
                <span className="ach-card-title">{ach.title}</span>
                <span className="ach-card-desc">{ach.unlocked ? ach.description : '???'}</span>
                {ach.unlocked && ach.unlockedAt && (
                  <span className="ach-card-date">
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {ach.unlocked && <span className="ach-check">✓</span>}
            </motion.div>
          ))}
        </motion.main>

        <motion.div className="victory-actions" variants={itemMotion}>
          <button type="button" className="victory-action victory-action--menu" onClick={() => navigate('/')}>
            <span className="victory-menu-icon" aria-hidden>
              ◆
            </span>
            Menu
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default AchievementsPage
