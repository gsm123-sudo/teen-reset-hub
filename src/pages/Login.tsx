import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { signIn, signUp } from '../hooks/useAuth'

type Mode = 'login' | 'signup'

const MotionButton = motion.button

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const nextPath = searchParams.get('next') ?? '/dashboard'

  const [mode, setMode] = useState<Mode>('signup')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password, name.trim())
        // Supabase may require email confirmation — handle gracefully
        navigate(nextPath)
      } else {
        await signIn(email, password)
        navigate(nextPath)
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lavender-50 flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-sm">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <span className="font-bold text-lg text-slate-800">
            Exhale <span className="text-sage-500">Wellness</span>
          </span>
        </Link>
      </header>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="card shadow-lg border-slate-200/80">
            {/* Title */}
            <div className="text-center mb-8">
              <div className="text-4xl mb-3">
                {mode === 'signup' ? '🌱' : '👋'}
              </div>
              <h1 className="text-2xl font-bold text-slate-800">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {mode === 'signup'
                  ? 'Start your wellness journey today.'
                  : 'Good to see you again.'}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              {(['signup', 'login'] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setMode(m)
                    setError('')
                  }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? 'bg-white shadow-sm text-slate-800'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'signup' ? 'Sign Up' : 'Log In'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Your name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First name is fine!"
                    className="input-field"
                    autoFocus
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field"
                  autoFocus={mode === 'login'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    mode === 'signup' ? 'At least 6 characters' : '••••••••'
                  }
                  className="input-field"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <MotionButton
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="btn-primary w-full text-base py-3.5 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {mode === 'signup'
                      ? 'Creating account…'
                      : 'Signing in…'}
                  </span>
                ) : mode === 'signup' ? (
                  'Create Account →'
                ) : (
                  'Sign In →'
                )}
              </MotionButton>
            </form>

            {mode === 'signup' && (
              <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
                By signing up you agree to our privacy-first approach. Your
                wellness data stays private.
              </p>
            )}
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">
            {mode === 'signup'
              ? 'Already have an account? '
              : "Don't have an account? "}
            <button
              onClick={() => {
                setMode(mode === 'signup' ? 'login' : 'signup')
                setError('')
              }}
              className="text-sage-600 font-medium hover:text-sage-700 underline underline-offset-2"
            >
              {mode === 'signup' ? 'Sign in' : 'Sign up free'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
