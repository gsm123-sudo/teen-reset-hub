import { Link } from 'react-router-dom'
import { motion, type Variants } from 'framer-motion'
import Navbar from '../components/Navbar'
import MoodTracker from '../components/MoodTracker'
import InsightCards from '../components/InsightCards'
import { useAuthStore, useMoodStore } from '../hooks/useMoodStore'

// ── Animation variants ──────────────────────────────────────────────────────
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
}

const quickActions = [
  { to: '/reset', label: 'Box Breathing', desc: '1 min calm', emoji: '🌬️', color: 'from-sky-400 to-blue-500' },
  { to: '/reset', label: 'Grounding', desc: '5-4-3-2-1', emoji: '🌿', color: 'from-sage-400 to-green-500' },
  { to: '/reset', label: 'Affirmations', desc: 'Build confidence', emoji: '💜', color: 'from-lavender-400 to-purple-500' },
  { to: '/reset', label: 'Body Scan', desc: 'Release tension', emoji: '🧘', color: 'from-amber-400 to-orange-500' },
]

function getGreeting(name: string): string {
  const hour = new Date().getHours()
  const first = name.split(' ')[0]
  if (hour < 12) return `Good morning, ${first}! ☀️`
  if (hour < 17) return `Good afternoon, ${first}! 🌤️`
  return `Good evening, ${first}! 🌙`
}

const moodEmoji: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }

export default function Dashboard() {
  const { userName } = useAuthStore()
  const { todayMood, sessions } = useMoodStore()
  const todaySessionCount = sessions.filter((s) => {
    const d = new Date(s.completedAt)
    return d.toDateString() === new Date().toDateString()
  }).length

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Greeting banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sage-500 to-sky-600 text-white p-6 sm:p-8 mb-8 shadow-lg"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">
              {getGreeting(userName)}
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              {todayMood
                ? `You're feeling ${todayMood.label.toLowerCase()} today ${moodEmoji[todayMood.mood]}`
                : 'Take a moment to check in with yourself.'}
            </p>
            {todaySessionCount > 0 && (
              <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm">
                <span>🔥</span>
                <span>
                  {todaySessionCount} reset session
                  {todaySessionCount > 1 ? 's' : ''} today — amazing!
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column — staggered */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Mood check-in */}
            <motion.div variants={item} className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-title text-xl">Today's Check-in</h2>
                  {todayMood && (
                    <p className="text-sm text-slate-500">
                      Logged{' '}
                      {new Date(todayMood.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </div>
                {todayMood && (
                  <span className="text-3xl">{moodEmoji[todayMood.mood]}</span>
                )}
              </div>
              <MoodTracker />
            </motion.div>

            {/* Quick resets */}
            <motion.div variants={item} className="card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="section-title text-xl">Quick Resets</h2>
                  <p className="section-subtitle text-sm">
                    Feeling off? Try a guided session.
                  </p>
                </div>
                <Link
                  to="/reset"
                  className="text-sm text-sage-600 font-medium hover:text-sage-700 transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.label}
                    whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Link
                      to={action.to}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl shadow-sm`}
                      >
                        {action.emoji}
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-slate-700">
                          {action.label}
                        </p>
                        <p className="text-xs text-slate-500">{action.desc}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Crisis resources */}
            <motion.div
              variants={item}
              className="rounded-2xl border-2 border-lavender-200 bg-lavender-50 p-4 flex items-start gap-3"
            >
              <span className="text-2xl flex-shrink-0">💜</span>
              <div>
                <p className="font-semibold text-lavender-800 text-sm">
                  Need more support?
                </p>
                <p className="text-xs text-lavender-700 mt-0.5 leading-relaxed">
                  If you're struggling, you're not alone. Text or call{' '}
                  <strong>988</strong> (Suicide &amp; Crisis Lifeline) anytime,
                  24/7.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column — staggered */}
          <motion.div
            className="space-y-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title text-xl">Your Insights</h2>
                <Link
                  to="/history"
                  className="text-sm text-sage-600 font-medium hover:text-sage-700 transition-colors"
                >
                  History →
                </Link>
              </div>
              <InsightCards />
            </motion.div>

            {/* Tip of the day */}
            <motion.div
              variants={item}
              whileHover={{ y: -4, boxShadow: '0 8px 24px -4px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.18 }}
              className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">
                    Tip of the day
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Even 5 minutes of deep breathing can lower cortisol levels
                    and reduce feelings of anxiety. Try it right now!
                  </p>
                  <Link
                    to="/reset"
                    className="text-xs font-medium text-amber-600 hover:text-amber-700 mt-2 inline-flex items-center gap-1 transition-colors"
                  >
                    Try a session <span>→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
