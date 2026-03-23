import { useMoodStore, type MoodEntry } from '../hooks/useMoodStore'

const moodEmoji: Record<number, string> = { 1: '😞', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' }
const moodColor: Record<number, string> = {
  1: 'text-red-500 bg-red-50',
  2: 'text-orange-500 bg-orange-50',
  3: 'text-yellow-500 bg-yellow-50',
  4: 'text-sage-500 bg-sage-50',
  5: 'text-sky-500 bg-sky-50',
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function getAverage(entries: MoodEntry[]): number | null {
  if (!entries.length) return null
  return entries.reduce((sum, e) => sum + e.mood, 0) / entries.length
}

function getTrend(entries: MoodEntry[]): 'up' | 'down' | 'stable' | null {
  if (entries.length < 2) return null
  const recent = getAverage(entries.slice(0, Math.ceil(entries.length / 2)))!
  const older = getAverage(entries.slice(Math.ceil(entries.length / 2)))!
  if (recent > older + 0.3) return 'up'
  if (recent < older - 0.3) return 'down'
  return 'stable'
}

export default function InsightCards() {
  const { entries, sessions } = useMoodStore()
  const last7 = entries.slice(0, 7)
  const avg = getAverage(last7)
  const trend = getTrend(last7)

  const trendConfig = {
    up: { icon: '↑', label: 'Improving', color: 'text-sage-600' },
    down: { icon: '↓', label: 'Needs care', color: 'text-orange-500' },
    stable: { icon: '→', label: 'Stable', color: 'text-sky-600' },
  }

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-slate-700">{entries.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Check-ins</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-slate-700">{sessions.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Sessions</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-slate-700">{avg ? avg.toFixed(1) : '—'}</p>
          <p className="text-xs text-slate-500 mt-0.5">Avg mood</p>
        </div>
      </div>

      {/* Trend */}
      {trend && (
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl">
            {trend === 'up' ? '🌱' : trend === 'down' ? '🌧️' : '🌤️'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Mood trend:{' '}
              <span className={trendConfig[trend].color}>
                {trendConfig[trend].icon} {trendConfig[trend].label}
              </span>
            </p>
            <p className="text-xs text-slate-500">Based on your last {last7.length} check-ins</p>
          </div>
        </div>
      )}

      {/* Mini mood history */}
      {last7.length > 0 && (
        <div className="card">
          <p className="text-sm font-semibold text-slate-700 mb-3">Recent check-ins</p>
          <div className="space-y-2">
            {last7.slice(0, 4).map((entry) => (
              <div key={entry.id} className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${moodColor[entry.mood]}`}>
                  {moodEmoji[entry.mood]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{entry.label}</p>
                  {entry.note && (
                    <p className="text-xs text-slate-500 truncate">{entry.note}</p>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">{formatRelative(entry.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement */}
      {entries.length === 0 && (
        <div className="card bg-gradient-to-br from-sage-50 to-sky-50 border-sage-100 text-center py-8">
          <p className="text-3xl mb-3">🌱</p>
          <p className="font-semibold text-slate-700">Start your journey</p>
          <p className="text-sm text-slate-500 mt-1">Log your first mood check-in above!</p>
        </div>
      )}
    </div>
  )
}
