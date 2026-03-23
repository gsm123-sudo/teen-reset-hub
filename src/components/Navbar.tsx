import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../hooks/useMoodStore'

const navLinks = [
  { to: '/dashboard', label: 'Home' },
  { to: '/reset', label: 'Reset Hub' },
  { to: '/history', label: 'History' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { userName, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                <path d="M8 12s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <span className="font-bold text-lg text-slate-800">
              Exhale <span className="text-sage-500">Wellness</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-sage-50 text-sage-700'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials || 'U'}
              </div>
              <span className="text-sm font-medium text-slate-700">{userName.split(' ')[0]}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex md:hidden gap-1 pb-2 overflow-x-auto">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-sage-50 text-sage-700'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
