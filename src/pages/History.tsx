import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useMoodStore } from '../hooks/useMoodStore'

const moodEmoji: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }
const moodLabel: Record<number, string> = { 1: 'Struggling', 2: 'Low', 3: 'Okay', 4: 'Good', 5: 'Great' }
const moodBg: Record<number, string> = {
  1: 'bg-red-50 border-red-100',
  2: 'bg-orange-50 border-orange-100',
  3: 'bg-yellow-50 border-yellow-100',
  4: 'bg-sage-50 border-sage-100',
  5: 'bg-sky-50 border-sky-100',
}
const moodDot: Record<number, string> = {
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-sage-400',
  5: 'bg-sky-400',
}

const sessionLabels: Record<string, { emoji: string; name: string }> = {
  breathing: { emoji: '🌬️', name: 'Box Breathing' },
  grounding: { emoji: '🌿', name: '5-4-3-2-1 Grounding' },
  affirmations: { emoji: '💜', name: 'Affirmations' },
  'body-scan': { emoji: '🧘', name: 'Body Scan' },
}

function groupByDate<T extends { timestamp?: string; completedAt?: string }>(items: T[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {}
  for (const item of items) {
    const dateStr = new Date(item.timestamp ?? item.completedAt ?? '').toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(item)
  }
  return groups
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

type Tab = 'moods' | 'sessions'

export default function History() {
  const { entries, sessions } = useMoodStore()

  const moodGroups = groupByDate(entries)
  const sessionGroups = groupByDate(sessions)

  // Simple tab state using URL hash approach
  const hash = window.location.hash
  const activeTab: Tab = hash === '#sessions' ? 'sessions' : 'moods'

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Link to="/dashboard" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
              ← Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Your History</h1>
          <p className="text-slate-500 mt-1">Every step of your wellness journey.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-700">{entries.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Mood logs</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-700">{sessions.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Sessions</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-700">
              {entries.length
                ? (entries.reduce((s, e) => s + e.mood, 0) / entries.length).toFixed(1)
                : '—'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Avg mood</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-slate-700">
              {Math.floor(sessions.reduce((s, r) => s + r.duration, 0) / 60)}m
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Reset time</p>
          </div>
        </div>

        {/* Mini mood chart */}
        {entries.length >= 3 && (
          <div className="card mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">Mood over time (last 14)</p>
            <div className="flex items-end gap-1.5 h-16">
              {entries
                .slice(0, 14)
                .reverse()
                .map((e) => (
                  <div
                    key={e.id}
                    className="flex-1 rounded-t-sm transition-all"
                    style={{ height: `${(e.mood / 5) * 100}%` }}
                    title={`${moodLabel[e.mood]} — ${new Date(e.timestamp).toLocaleDateString()}`}
                  >
                    <div className={`h-full rounded-t-sm ${moodDot[e.mood]} opacity-80`} />
                  </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Older</span>
              <span>Recent</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-white rounded-xl border border-slate-100 p-1 mb-6 shadow-sm">
          <a
            href="#moods"
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-center transition-all ${
              activeTab === 'moods' ? 'bg-sage-50 text-sage-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Mood Logs ({entries.length})
          </a>
          <a
            href="#sessions"
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-center transition-all ${
              activeTab === 'sessions' ? 'bg-sage-50 text-sage-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sessions ({sessions.length})
          </a>
        </div>

        {/* Mood log tab */}
        {activeTab === 'moods' && (
          <div className="space-y-6 animate-fade-in">
            {entries.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">📓</p>
                <p className="font-semibold text-slate-700">No mood logs yet</p>
                <p className="text-sm text-slate-500 mt-1">Go to your dashboard and log your first check-in!</p>
                <Link to="/dashboard" className="btn-primary mt-4 text-sm py-2.5">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              Object.entries(moodGroups).map(([date, dayEntries]) => (
                <div key={date}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{date}</p>
                  <div className="space-y-2">
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className={`rounded-xl border p-4 flex items-start gap-3 ${moodBg[entry.mood]}`}>
                        <span className="text-2xl flex-shrink-0">{moodEmoji[entry.mood]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-700">{entry.label}</p>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${moodDot[entry.mood]}`} />
                          </div>
                          {entry.note && (
                            <p className="text-sm text-slate-600 mt-0.5">{entry.note}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(entry.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Sessions tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6 animate-fade-in">
            {sessions.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">🧘</p>
                <p className="font-semibold text-slate-700">No sessions yet</p>
                <p className="text-sm text-slate-500 mt-1">Complete your first reset session to see it here!</p>
                <Link to="/reset" className="btn-primary mt-4 text-sm py-2.5">
                  Go to Reset Hub
                </Link>
              </div>
            ) : (
              Object.entries(sessionGroups).map(([date, daySessions]) => (
                <div key={date}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{date}</p>
                  <div className="space-y-2">
                    {daySessions.map((session) => {
                      const info = sessionLabels[session.type] ?? { emoji: '✨', name: session.type }
                      const mins = Math.floor(session.duration / 60)
                      const secs = session.duration % 60
                      return (
                        <div key={session.id} className="card flex items-center gap-3 py-3.5">
                          <div className="w-10 h-10 rounded-xl bg-sage-50 flex items-center justify-center text-xl flex-shrink-0">
                            {info.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-700 text-sm">{info.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-xs text-slate-500">
                                {mins}m {secs}s
                              </p>
                              {session.moodBefore && session.moodAfter && (
                                <p className="text-xs text-slate-500">
                                  · mood {moodEmoji[session.moodBefore]} → {moodEmoji[session.moodAfter]}
                                  {session.moodAfter > session.moodBefore && (
                                    <span className="text-sage-500 font-medium ml-1">+{session.moodAfter - session.moodBefore}</span>
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 flex-shrink-0">{formatTime(session.completedAt)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  )
}
