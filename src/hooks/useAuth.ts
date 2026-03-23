import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './useMoodStore'

/** Call once at the app root — sets up Supabase auth state listener. */
export function useAuthListener() {
  const setUser = useAuthStore((s) => s.setUser)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(true)

    // Hydrate from existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Keep in sync with any auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])
}

/** Sign in with email + password. Throws on error. */
export async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

/** Sign up with email + password + display name. Throws on error. */
export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<void> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  })
  if (error) throw error
}

/** Sign out the current user. */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
