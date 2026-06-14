import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-aw-purple to-aw-pink flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            C
          </div>
          <h1 className="text-2xl font-bold text-aw-text">Welcome back</h1>
          <p className="text-aw-muted text-sm mt-1">Login to your CineTrack account</p>
        </div>

        <div className="bg-aw-card border border-aw-border rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-aw-muted block mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="w-full bg-aw-bg border border-aw-border rounded-lg px-4 py-2.5 text-sm text-aw-text placeholder-aw-muted focus:outline-none focus:border-aw-violet transition-colors"
                placeholder="your_username"
              />
            </div>
            <div>
              <label className="text-sm text-aw-muted block mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-aw-bg border border-aw-border rounded-lg px-4 py-2.5 text-sm text-aw-text placeholder-aw-muted focus:outline-none focus:border-aw-violet transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-aw-violet hover:bg-aw-purple text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-aw-muted mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-aw-violet hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}