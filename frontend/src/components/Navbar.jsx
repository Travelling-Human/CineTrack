import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-aw-surface border-b border-aw-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-aw-purple to-aw-pink flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          <span className="text-aw-text font-bold text-lg hidden sm:block">
            Cine<span className="text-aw-violet">Track</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-aw-card border border-aw-border rounded-lg px-4 py-2 text-sm text-aw-text placeholder-aw-muted focus:outline-none focus:border-aw-violet transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-aw-muted hover:text-aw-violet transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* Nav links */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                to="/watchlist"
                className="text-sm text-aw-muted hover:text-aw-violet transition-colors hidden sm:block"
              >
                My List
              </Link>
              <span className="text-sm text-aw-muted hidden sm:block">
                {user.username}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-aw-card border border-aw-border px-3 py-1.5 rounded-lg text-aw-muted hover:text-aw-violet hover:border-aw-violet transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-aw-muted hover:text-aw-violet transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-aw-violet hover:bg-aw-purple px-3 py-1.5 rounded-lg text-white transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}