import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import Navbar from '../components/Navbar'
import ResetSession from '../components/ResetSession'
import { useMoodStore } from '../hooks/useMoodStore'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.25, 0.1, 0.25, 1] } },
}

const tips = [
  { emoji: '💧', text: 'Drink some water before you start.' },
  { emoji: '📱', text: 'Put your phone on Do Not Disturb.' },
  { emoji: '🪑', text: 'Find a comfortable, quiet place.' },
  { emoji: '👀', text: "It's okay if your mind wanders — just come back." },
]

const sessionLabels: Record<string, string> = {
  breathing: '🌬️ Box Breathing',
  grounding: '🌿 5-4-3-2-1 Grounding',
  affirmations: '💜 Affirmations',
  'body-scan': '🧘 Body Scan',
}

export default function ResetHub() {
  const [started, setStarted] = useState(false)
  const { sessions } = useMoodStore()
  const recentSessions = sessions.slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/dashboard"
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Reset Hub</h1>
          <p className="text-slate-500 mt-1">
            A space to slow down, breathe, and reset.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main session area */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: 0.1 }}
          >
            <div className="card shadow-sm min-h-[400px] flex flex-col">
              {!started ? (
                <div className="flex-1 flex flex-col">
                  {/* Hero area */}
                  <div className="text-center py-8 px-4 bg-gradient-to-br from-sage-50 to-sky-50 rounded-xl mb-6">
                    <div className="text-6xl mb-4 animate-float inline-block">
                      🧘
                    </div>
                    <h2 className="text-xl font-bold text-slate-700">
                      Ready to reset?
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                      Take a few minutes for yourself. These guided sessions are
                      designed to help you feel calmer, clearer, and more
                      grounded.
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStarted(true)}
                      className="btn-primary mt-5"
                    >
                      Start a Session
                    </motion.button>
                  </div>

                  {/* Tips — staggered */}
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-3">
                      Before you begin
                    </p>
                    <motion.div
                      variants={container}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 gap-2"
                    >
                      {tips.map((tip) => (
                        <motion.div
                          key={tip.text}
                          variants={item}
                          whileHover={{ y: -3, boxShadow: '0 6px 18px -4px rgba(0,0,0,0.08)' }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center gap-2 bg-slate-50 rounded-xl p-3"
                        >
                          <span className="text-xl flex-shrink-0">
                            {tip.emoji}
                          </span>
                          <span className="text-xs text-slate-600">
                            {tip.text}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              ) : (
                <div className="flex-1">
                  <ResetSession />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStarted(false)}
                    className="mt-6 text-sm text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    ← Back
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar — staggered */}
          <motion.div
            className="space-y-5"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Stats */}
            <motion.div
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.09)' }}
              transition={{ duration: 0.18 }}
              className="card"
            >
              <h3 className="font-semibold text-slate-700 mb-4">
                Your journey
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Total sessions</span>
                  <span className="font-bold text-slate-800">
                    {sessions.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Time spent</span>
                  <span className="font-bold text-slate-800">
                    {Math.floor(
                      sessions.reduce((acc, s) => acc + s.duration, 0) / 60
                    )}
                    m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Today</span>
                  <span className="font-bold text-slate-800">
                    {
                      sessions.filter(
                        (s) =>
                          new Date(s.completedAt).toDateString() ===
                          new Date().toDateString()
                      ).length
                    }
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent sessions */}
            {recentSessions.length > 0 && (
              <motion.div
                variants={item}
                whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.09)' }}
                transition={{ duration: 0.18 }}
                className="card"
              >
                <h3 className="font-semibold text-slate-700 mb-4">
                  Recent sessions
                </h3>
                <div className="space-y-3">
                  {recentSessions.map((s) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sage-50 flex items-center justify-center text-sm flex-shrink-0">
                        {sessionLabels[s.type]?.split(' ')[0] ?? '✨'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {sessionLabels[s.type]?.slice(2) ?? s.type}
                        </p>
                        <p className="text-xs text-slate-500">
                          {Math.floor(s.duration / 60)}m {s.duration % 60}s
                          {s.moodBefore && s.moodAfter && (
                            <span className="ml-1">
                              · {s.moodBefore} → {s.moodAfter} /5
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quote */}
            <motion.div
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.09)' }}
              transition={{ duration: 0.18 }}
              className="card bg-gradient-to-br from-lavender-50 to-purple-50 border-lavender-100"
            >
              <p className="text-sm italic text-lavender-800 leading-relaxed">
                "You don't have to control your thoughts. You just have to stop
                letting them control you."
              </p>
              <p className="text-xs text-lavender-600 mt-2 font-medium">
                — Dan Millman
              </p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
