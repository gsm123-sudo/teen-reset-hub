import { useState } from 'react'
import { useMoodStore, type MoodLevel } from '../hooks/useMoodStore'

const moods: { level: MoodLevel; emoji: string; label: string; color: string; bg: string }[] = [
  { level: 1, emoji: '😞', label: 'Struggling', color: 'text-red-500', bg: 'bg-red-50 border-red-200 hover:bg-red-100' },
  { level: 2, emoji: '😕', label: 'Low', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
  { level: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' },
  { level: 4, emoji: '🙂', label: 'Good', color: 'text-sage-500', bg: 'bg-sage-50 border-sage-200 hover:bg-sage-100' },
  { level: 5, emoji: '😄', label: 'Great', color: 'text-sky-500', bg: 'bg-sky-50 border-sky-200 hover:bg-sky-100' },
]

interface MoodTrackerProps {
  onComplete?: () => void
  compact?: boolean
}

export default function MoodTracker({ onComplete, compact = false }: MoodTrackerProps) {
  const [selected, setSelected] = useState<MoodLevel | null>(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const addMoodEntry = useMoodStore((s) => s.addMoodEntry)

  const handleSave = () => {
    if (!selected) return
    const mood = moods.find((m) => m.level === selected)!
    addMoodEntry({ mood: selected, label: mood.label, note })
    setSaved(true)
    onComplete?.()
  }

  if (saved) {
    return (
      <div className="text-center py-6 animate-fade-in">
        <div className="text-4xl mb-3">✨</div>
        <p className="font-semibold text-slate-700">Mood logged!</p>
        <p className="text-sm text-slate-500 mt-1">Keep checking in — you're doing great.</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {!compact && (
        <div className="mb-5">
          <h3 className="font-semibold text-slate-700 text-lg">How are you feeling right now?</h3>
          <p className="text-sm text-slate-500 mt-0.5">No judgment — just honest.</p>
        </div>
      )}

      <div className={`grid grid-cols-5 gap-2 ${compact ? '' : 'mb-5'}`}>
        {moods.map((mood) => (
          <button
            key={mood.level}
            onClick={() => setSelected(mood.level)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-150 ${
              selected === mood.level
                ? `${mood.bg} border-current ${mood.color} scale-105 shadow-md`
                : `border-transparent bg-slate-50 hover:bg-slate-100`
            }`}
          >
            <span className="text-2xl leading-none">{mood.emoji}</span>
            {!compact && (
              <span className={`text-xs font-medium ${selected === mood.level ? mood.color : 'text-slate-500'}`}>
                {mood.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {!compact && selected && (
        <div className="mt-4 animate-slide-up">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            rows={2}
            className="input-field resize-none text-sm"
          />
          <button
            onClick={handleSave}
            className="btn-primary w-full mt-3"
          >
            Log My Mood
          </button>
        </div>
      )}

      {compact && selected && (
        <div className="mt-3 flex gap-2">
          <button onClick={handleSave} className="btn-primary flex-1 text-sm py-2">
            Save
          </button>
        </div>
      )}
    </div>
  )
}
