import { Link } from 'react-router-dom'
import { useAuthStore } from '../hooks/useMoodStore'

const features = [
  {
    icon: '😊',
    title: 'Daily Mood Check-ins',
    desc: 'Track how you feel each day with simple emoji check-ins. No pressure, no judgment.',
    color: 'from-sage-400 to-green-500',
  },
  {
    icon: '🌬️',
    title: 'Reset Sessions',
    desc: 'Breathing exercises, grounding techniques, and affirmations to help you reset in minutes.',
    color: 'from-sky-400 to-blue-500',
  },
  {
    icon: '📈',
    title: 'Personal Insights',
    desc: 'See your mood trends over time. Understanding yourself is the first step to growth.',
    color: 'from-lavender-400 to-purple-500',
  },
  {
    icon: '🔒',
    title: 'Private & Safe',
    desc: 'Your data stays on your device. This is your safe space — completely private.',
    color: 'from-amber-400 to-orange-500',
  },
]

const testimonials = [
  { text: 'Exhale helped me get through exam week. The breathing exercises actually work!', name: 'Alex, 16', emoji: '🌟' },
  { text: "I never knew how much my mood fluctuated until I started tracking. It's been eye-opening.", name: 'Jordan, 17', emoji: '💡' },
  { text: 'The grounding exercises help me so much during anxiety spirals. 10/10 recommend.', name: 'Sam, 15', emoji: '💚' },
]

export default function Home() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="font-bold text-lg text-slate-800">
              Exhale <span className="text-sage-500">Wellness</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn-primary py-2 text-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Sign in
                </Link>
                <Link to="/login" className="btn-primary py-2 text-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-white to-sky-50 pt-16 pb-24 px-4">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lavender-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <span>🌱</span>
            <span>Teen mental health, simplified</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-800 leading-tight tracking-tight animate-slide-up">
            Take a breath.{' '}
            <span className="bg-gradient-to-r from-sage-500 to-sky-500 bg-clip-text text-transparent">
              You've got this.
            </span>
          </h1>

          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Exhale Wellness is your personal mental health companion. Track your mood, reset when you're overwhelmed, and build emotional resilience — one breath at a time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/login" className="btn-primary text-base px-8 py-4">
              Start for free →
            </Link>
            <a href="#features" className="btn-secondary text-base px-8 py-4">
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500 animate-fade-in">
            <div className="flex -space-x-2">
              {['🧑', '👩', '🧒', '👦'].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-200 to-sky-200 flex items-center justify-center text-base border-2 border-white">
                  {e}
                </div>
              ))}
            </div>
            <span>Join <strong className="text-slate-700">2,400+ teens</strong> using Exhale</span>
          </div>
        </div>

        {/* Hero card mockup */}
        <div className="max-w-sm mx-auto mt-16 animate-float">
          <div className="card shadow-xl border-slate-200/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center text-white text-sm font-bold">
                JS
              </div>
              <div>
                <p className="font-semibold text-slate-700 text-sm">Good morning, Jamie!</p>
                <p className="text-xs text-slate-500">How are you feeling today?</p>
              </div>
            </div>
            <div className="flex gap-2 mb-4">
              {['😞', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
                <button key={i} className={`flex-1 py-2 rounded-xl text-xl transition-all ${i === 3 ? 'bg-sage-100 ring-2 ring-sage-400 scale-110' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  {emoji}
                </button>
              ))}
            </div>
            <div className="bg-sage-50 rounded-xl p-3 flex items-center gap-3">
              <span className="text-2xl">🌬️</span>
              <div>
                <p className="text-sm font-semibold text-sage-700">Try Box Breathing</p>
                <p className="text-xs text-slate-500">1 min reset session</p>
              </div>
              <span className="ml-auto text-sage-500 text-lg">→</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800">Everything you need to feel better</h2>
            <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">
              Simple tools designed specifically for teens, by mental health experts.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl shadow-sm mb-4 group-hover:shadow-md transition-shadow`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-slate-700 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-sage-50 to-sky-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What teens are saying</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card border-0 shadow-sm">
                <span className="text-3xl block mb-3">{t.emoji}</span>
                <p className="text-slate-600 leading-relaxed text-sm mb-4">"{t.text}"</p>
                <p className="text-sm font-semibold text-slate-700">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-sage-600 to-sky-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to exhale?</h2>
          <p className="text-white/80 text-lg mb-8">Start your wellness journey today. It's free, private, and takes less than a minute to set up.</p>
          <Link to="/login" className="btn-outline text-base px-8 py-4 inline-flex">
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-400">
          © 2026 Exhale Wellness · Made with 💚 for teen mental health
        </p>
        <p className="text-xs text-slate-400 mt-2">
          If you are in crisis, please call or text <strong>988</strong> (Suicide & Crisis Lifeline)
        </p>
      </footer>
    </div>
  )
}
