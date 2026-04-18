import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './ReviewPage.css'

const containerMotion = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemMotion = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

// Generate interesting facts for review cards
const generateFact = (_q: string, a: string, subject?: string, theme?: string, mode?: string): string => {
  const facts: { [key: string]: string } = {
    // Animals facts
    'Zebra': '🦓 Zebras have unique stripe patterns like fingerprints!',
    'Lion': '🦁 Lions are the only truly social cats, living in family groups.',
    'Elephant': '🐘 Elephants never forget - they have excellent memories!',
    'Giraffe': '🦒 Giraffes have no vocal cords but communicate through sounds.',
    'Penguin': '🐧 Penguins can swim up to 22 mph underwater.',
    'Dolphin': '🐬 Dolphins sleep with only half their brain at a time.',
    'Eagle': '🦅 Eagles can see fish from 30,000 feet in the air.',
    'Butterfly': '🦋 Butterflies taste with their feet to find food.',
    'Octopus': '🐙 Octopuses have three hearts and blue blood.',
    'Shark': '🦈 Some sharks glow in the dark with bioluminescence.',

    // Food facts
    'Apple': '🍎 Apples float because they\'re 25% air inside.',
    'Banana': '🍌 Bananas are berries, but strawberries aren\'t!',
    'Carrot': '🥕 Carrots were originally purple, not orange.',
    'Strawberry': '🍓 Strawberry seeds are on the outside of the fruit.',
    'Chocolate': '🍫 It takes 400 cocoa beans to make 1 pound of chocolate.',
    'Honey': '🍯 Honey never expires - it can last thousands of years.',
    'Egg': '🥚 Chickens can lay eggs without a rooster.',
    'Cheese': '🧀 It takes 10 pounds of milk to make 1 pound of cheese.',
    'Peanut': '🥜 Peanuts are legumes, not true nuts!',
    'Garlic': '🧄 Garlic is technically a bulb, not a vegetable.',

    // Sports facts
    'Soccer': '⚽ Soccer is played by over 250 million people worldwide.',
    'Basketball': '🏀 Basketball hoops are exactly 10 feet high.',
    'Tennis': '🎾 Tennis balls are fuzzy to increase air resistance.',
    'Football': '🏈 A football is made from cowhide and has 120 ridges.',
    'Golf': '⛳ Golf balls have 336 dimples on average.',
    'Cricket': '🏏 Cricket bats are made from willow wood.',
    'Hockey': '🏒 A hockey puck is frozen before games for better control.',
    'Swimming': '🏊 Olympic pools must be exactly 50 meters long.',
    'Volleyball': '🏐 Volleyball was invented as an indoor baseball alternative.',
    'Cycling': '🚴 Tour de France cyclists burn 6,000 calories per day.',

    // Geography facts
    'Paris': '✨ The Eiffel Tower was meant to be temporary!',
    'Tokyo': '🗼 Tokyo is the world\'s largest metropolitan area.',
    'Cairo': '🏜️ Cairo is the hottest capital city in Africa.',
    'London': '🇬🇧 Big Ben is actually the name of the bell, not the tower.',
    'Sydney': '🦘 Sydney Opera House has over 1 million tiles.',
    'Rome': '🏛️ Rome has more fountains than any other city.',
    'Venice': '🚤 Venice has no cars - only boats and feet!',
    'Bangkok': '🏙️ Bangkok\'s official name is the world\'s longest city name.',
    'Barcelona': '🏖️ Barcelona hosted the 1992 Summer Olympics.',
    'Amsterdam': '🚲 Amsterdam has over 500 kilometers of bike lanes.',

    // Math facts
    'Zero': '💡 Zero was invented in India around 500 AD.',
    'Pi': '🔢 Pi has been calculated to over 31 trillion digits!',
    'Fibonacci': '✨ Fibonacci numbers appear throughout nature.',
    'Prime': '💡 There are infinitely many prime numbers.',
    'Infinity': '∞ Infinity is a concept, not actually a number.',
    'Algebra': '📐 Algebra comes from the Arabic word "al-jabr".',
    'Geometry': '🔺 Geometry means "measuring the earth" in Greek.',
    'Calculus': '📈 Calculus was invented by Newton and Leibniz independently.',
    'Fraction': '🔀 Fractions have been used since ancient Egypt.',
    'Percent': '📊 Percent literally means "per one hundred".',

    // Science facts
    'Hydrogen': '💡 Hydrogen is the most abundant element in the universe!',
    'Boron': '🔬 Boron is found in borax and used in cleaning products.',
    'Carbon': '🔬 Carbon can form more compounds than any other element.',
    'Oxygen': '💡 Oxygen doesn\'t burn - it helps things burn!',
    'Nitrogen': '🔬 Nitrogen makes up 78% of Earth\'s atmosphere.',
    'Silicon': '🔬 Silicon is the second most abundant element on Earth.',
    'Helium': '🎈 Helium is lighter than air and makes voices sound funny.',
    'Neon': '✨ Neon glows when electricity passes through it.',
    'Sulfur': '🔬 Sulfur gives rotten eggs their awful smell.',
    'Chlorine': '🧪 Chlorine is used to keep swimming pools clean.'
  }

  // 1. Try to match the answer to our specific facts database
  const answer = a.trim()
  if (facts[answer]) {
    return facts[answer]
  }

  // 2. Subject-based fallbacks
  const subjectFacts: { [key: string]: string } = {
    'math': '🔢 Math is the secret language used to understand the universe!',
    'science': '🔬 Science helps us explore the mysteries of the natural world!',
    'history': '📜 Learning history helps us understand the world we live in today!',
    'geography': '🌍 Geography is about discovering the amazing places on our planet!',
    'animals': '🐾 Animals come in all shapes and sizes with incredible abilities!',
    'food': '🍎 Eating healthy food gives you the energy to play and grow!',
    'nature': '🌲 Spending time in nature can make you feel happier and calmer!',
    'space': '🚀 Space is vast, mysterious, and full of glowing stars and galaxies!',
    'sports': '⚽ Sports are a great way to stay active and learn teamwork!',
    'fun': '✨ Keep exploring and learning new things every single day!'
  }

  const key = (mode === 'learning' ? subject : theme)?.toLowerCase() || 'fun'
  if (subjectFacts[key]) {
    return subjectFacts[key]
  }

  // 3. Generic fallback
  const emojis = ['💡', '✨', '🎯', '🌟', '💫', '🚀', '🧠']
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]
  return `${emoji} Great job! Every match you make helps your brain grow stronger.`
}

const ReviewPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { matchedPairs, subject, theme, mode } = location.state || {
    matchedPairs: [],
    mode: 'fun'
  }

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <section className="review-page">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="toast-notification"
            transition={{ duration: 0.3 }}
          >
            <div className={`toast-content toast-${toast.type}`}>
              <div className="toast-icon">
                {toast.type === 'success' ? '✓' : '✗'}
              </div>
              <div className="toast-text">
                <div className="toast-main">{toast.message}</div>
                {toast.type === 'success' && <div className="toast-sub">e.g., Carbon is correct</div>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="review-container"
        variants={containerMotion}
        initial="hidden"
        animate="visible"
      >
        <motion.header className="review-header" variants={itemMotion}>
          <h1 className="review-title">Review Your Pairs</h1>
        </motion.header>

        <motion.main className="review-main" variants={containerMotion}>
          {matchedPairs.length === 0 ? (
            <div className="empty-review">No pairs to review yet!</div>
          ) : (
            <div className="review-grid">
              {matchedPairs.map((pair: { q: string; a: string; explanation?: string; attempts: number }, index: number) => (
                <motion.article
                  key={index}
                  className={`review-card`}
                  variants={itemMotion}
                >
                  <div className="review-card-top">
                    <span className="review-q">{pair.q || 'Card'}</span>
                    <span className={`review-badge ${pair.attempts === 1 ? 'success' : 'retry'}`}>
                      {pair.attempts === 1 ? 'Got it first try!' : 'Needed retries'}
                    </span>
                  </div>

                  <div className="review-a">{pair.a || 'Match'}</div>

                  <div className="review-explanation">
                    <p>{generateFact(pair.q, pair.a, subject, theme, mode)}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </motion.main>

        <motion.footer className="review-actions" variants={itemMotion}>
          <button type="button" className="btn-retry-pairs" onClick={() => {
            navigate('/')
            showToast('Retrying struggled pairs...', 'success')
          } }>
            Retry Struggled Pairs
          </button>
          <button type="button" className="btn-back-menu" onClick={() => navigate('/') }>
            Back to Menu
          </button>
        </motion.footer>
      </motion.div>
    </section>
  )
}

export default ReviewPage
