import { useState, useEffect, useRef } from 'react'
import { useMoodStore, type MoodLevel } from '../hooks/useMoodStore'

type Phase = 'idle' | 'running' | 'done'

interface SessionConfig {
  id: string
  name: string
  description: string
  duration: number
  icon: string
  color: string
  gradient: string
  steps: string[]
}

const sessions: SessionConfig[] = [
  {
    id: 'breathing',
    name: 'Box Breathing',
    description: '4-4-4-4 technique to calm your nervous system',
    duration: 64,
    icon: '🌬️',
    color: 'text-sky-600',
    gradient: 'from-sky-400 to-blue-500',
    steps: ['Inhale for 4s', 'Hold for 4s', 'Exhale for 4s', 'Hold for 4s'],
  },
  {
    id: 'grounding',
    name: '5-4-3-2-1 Grounding',
    description: 'Ground yourself in the present moment',
    duration: 90,
    icon: '🌿',
    color: 'text-sage-600',
    gradient: 'from-sage-400 to-green-500',
    steps: ['5 things you see', '4 things you touch', '3 things you hear', '2 things you smell', '1 thing you taste'],
  },
  {
    id: 'affirmations',
    name: 'Positive Affirmations',
    description: 'Build self-compassion and confidence',
    duration: 60,
    icon: '💜',
    color: 'text-lavender-600',
    gradient: 'from-lavender-400 to-purple-500',
    steps: ['I am enough', 'I deserve peace', 'I handle challenges', 'I am growing', 'I choose kindness'],
  },
  {
    id: 'body-scan',
    name: 'Quick Body Scan',
    description: 'Release tension and reconnect with your body',
    duration: 120,
    icon: '🧘',
    color: 'text-amber-600',
    gradient: 'from-amber-400 to-orange-500',
    steps: ['Relax your jaw', 'Drop your shoulders', 'Unclench your hands', 'Soften your belly', 'Feel your feet'],
  },
]

interface ResetSessionProps {
  preSelected?: string
}

export default function ResetSession({ preSelected }: ResetSessionProps) {
  const [chosen, setChosen] = useState<SessionConfig | null>(
    preSelected ? sessions.find((s) => s.id === preSelected) ?? null : null
  )
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [moodBefore, setMoodBefore] = useState<MoodLevel | null>(null)
  const [moodAfter, setMoodAfter] = useState<MoodLevel | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const addSession = useMoodStore((s) => s.addSession)

  const stepDuration = chosen ? Math.floor(chosen.duration / chosen.steps.length) : 10

  useEffect(() => {
    if (phase !== 'running' || !chosen) return

    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1
        if (next >= chosen.duration) {
          clearInterval(intervalRef.current!)
          setPhase('done')
          if (moodBefore) {
            addSession({ type: chosen.id, duration: chosen.duration, moodBefore })
          }
          return chosen.duration
        }
        setStepIndex(Math.floor(next / stepDuration) % chosen.steps.length)
        return next
      })
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [phase, chosen, stepDuration, moodBefore, addSession])

  const start = (mood: MoodLevel) => {
    setMoodBefore(mood)
    setPhase('running')
    setElapsed(0)
    setStepIndex(0)
  }

  const stop = () => {
    clearInterval(intervalRef.current!)
    setPhase('idle')
    setElapsed(0)
    setChosen(null)
  }

  const progress = chosen ? (elapsed / chosen.duration) * 100 : 0
  const remaining = chosen ? chosen.duration - elapsed : 0
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  // Mood selector component (inline)
  const MoodSelector = ({ onSelect }: { onSelect: (m: MoodLevel) => void }) => (
    <div className="flex gap-3 justify-center mt-4">
      {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => {
        const emojis = ['😞', '😕', '😐', '🙂', '😄']
        return (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white border-2 border-slate-100 hover:border-sage-300 hover:bg-sage-50 transition-all active:scale-95"
          >
            <span className="text-2xl">{emojis[level - 1]}</span>
            <span className="text-xs text-slate-500">{level}</span>
          </button>
        )
      })}
    </div>
  )

  // Session selection
  if (!chosen) {
    return (
      <div className="animate-fade-in">
        <h3 className="font-semibold text-slate-700 text-lg mb-1">Choose a Reset</h3>
        <p className="text-sm text-slate-500 mb-5">Pick what feels right for this moment.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setChosen(session)}
              className="card-hover text-left group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${session.gradient} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
                  {session.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-700 group-hover:text-slate-900">{session.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{session.description}</p>
                  <p className="text-xs text-slate-400 mt-1">⏱ {Math.floor(session.duration / 60)}:{String(session.duration % 60).padStart(2, '0')}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Mood before
  if (phase === 'idle' && !moodBefore) {
    return (
      <div className="text-center animate-fade-in">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${chosen.gradient} flex items-center justify-center text-3xl shadow-md mx-auto mb-4`}>
          {chosen.icon}
        </div>
        <h3 className="font-bold text-slate-700 text-xl">{chosen.name}</h3>
        <p className="text-slate-500 text-sm mt-1 mb-6">{chosen.description}</p>
        <p className="text-sm font-medium text-slate-600 mb-2">How are you feeling before we start?</p>
        <MoodSelector onSelect={(m) => start(m)} />
        <button onClick={() => setChosen(null)} className="mt-4 text-sm text-slate-400 hover:text-slate-600 transition-colors">
          ← Back
        </button>
      </div>
    )
  }

  // Running
  if (phase === 'running' && chosen) {
    return (
      <div className="text-center animate-fade-in">
        <p className="text-xs uppercase tracking-widest text-slate-400 mb-6">{chosen.name}</p>

        {/* Breathe circle */}
        <div className="relative mx-auto mb-6" style={{ width: 160, height: 160 }}>
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="70" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="80" cy="80" r="70"
              fill="none"
              stroke="url(#grad)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#68a06b" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl">{chosen.icon}</span>
            <span className="text-2xl font-bold text-slate-700 mt-1">
              {mins}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Current step */}
        <div className="animate-breathe inline-block">
          <span className={`text-xl font-bold ${chosen.color}`}>
            {chosen.steps[stepIndex]}
          </span>
        </div>

        {/* Step dots */}
        <div className="flex gap-2 justify-center mt-4">
          {chosen.steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === stepIndex ? `bg-sage-500 w-4` : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <button
          onClick={stop}
          className="mt-8 text-sm text-slate-400 hover:text-slate-600 transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
        >
          End session
        </button>
      </div>
    )
  }

  // Done
  if (phase === 'done' && chosen) {
    return (
      <div className="text-center animate-fade-in">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-bold text-slate-700 text-xl">Session Complete!</h3>
        <p className="text-slate-500 text-sm mt-1 mb-6">
          You finished <span className="font-medium text-slate-700">{chosen.name}</span>. How do you feel now?
        </p>
        <MoodSelector
          onSelect={(m) => {
            setMoodAfter(m)
            addSession({ type: chosen.id, duration: chosen.duration, moodBefore: moodBefore!, moodAfter: m })
            setTimeout(stop, 1500)
          }}
        />
        {moodAfter && (
          <p className="mt-4 text-sm text-sage-600 font-medium animate-fade-in">
            ✓ Logged! Well done for taking care of yourself. 💚
          </p>
        )}
      </div>
    )
  }

  return null
}
