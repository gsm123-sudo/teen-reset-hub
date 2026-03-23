import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type MoodLevel = 1 | 2 | 3 | 4 | 5

export interface MoodEntry {
  id: string
  mood: MoodLevel
  label: string
  note: string
  timestamp: string
  sessionType?: string
}

export interface ResetSession {
  id: string
  type: string
  duration: number // seconds
  completedAt: string
  moodBefore?: MoodLevel
  moodAfter?: MoodLevel
}

// ---------------------------------------------------------------------------
// Auth store — NOT persisted (Supabase client manages its own session storage)
// ---------------------------------------------------------------------------
interface AuthStore {
  user: User | null
  userName: string
  userEmail: string
  isLoggedIn: boolean
  loading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  userName: '',
  userEmail: '',
  isLoggedIn: false,
  loading: true,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: user !== null,
      userName:
        user?.user_metadata?.full_name ??
        user?.email?.split('@')[0] ??
        '',
      userEmail: user?.email ?? '',
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  logout: async () => {
    // Clear state immediately so UI responds at once
    set({ user: null, isLoggedIn: false, userName: '', userEmail: '', loading: false })
    await supabase.auth.signOut()
  },
}))

// ---------------------------------------------------------------------------
// Mood / session store — persisted locally
// ---------------------------------------------------------------------------
interface MoodStore {
  entries: MoodEntry[]
  sessions: ResetSession[]
  todayMood: MoodEntry | null
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void
  addSession: (session: Omit<ResetSession, 'id' | 'completedAt'>) => void
  setTodayMood: (entry: MoodEntry) => void
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set) => ({
      entries: [],
      sessions: [],
      todayMood: null,
      addMoodEntry: (entry) => {
        const newEntry: MoodEntry = {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          entries: [newEntry, ...state.entries],
          todayMood: newEntry,
        }))
      },
      addSession: (session) => {
        const newSession: ResetSession = {
          ...session,
          id: crypto.randomUUID(),
          completedAt: new Date().toISOString(),
        }
        set((state) => ({ sessions: [newSession, ...state.sessions] }))
      },
      setTodayMood: (entry) => set({ todayMood: entry }),
    }),
    { name: 'exhale-mood' }
  )
)
