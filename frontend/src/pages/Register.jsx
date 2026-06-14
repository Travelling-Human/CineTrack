import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await register(form.username, form.password, form.email)
      navigate('/')
    } catch (err) {
      const msg = err.response
        ? `Status: ${err.response.status} — ${JSON.stringify(err.response.data)}`
        : `Network error: ${err.message} | URL tried: ${err.config?.url}`
      setError(msg)
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
          <h1 className="text-2xl font-bold text-aw-text">Create an account</h1>
          <p className="text-aw-muted text-sm mt-1">Start tracking your movies today</p>
        </div>

        <div className="bg-aw-card border border-aw-border rounded-2xl p-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}
          <div className="space-y-4">
            {[
              { key: 'username', label: 'Username', type: 'text',     placeholder: 'your_username' },
              { key: 'email',    label: 'Email',    type: 'email',    placeholder: 'you@example.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              { key: 'confirm',  label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-sm text-aw-muted block mb-1.5">{field.label}</label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-aw-bg border border-aw-border rounded-lg px-4 py-2.5 text-sm text-aw-text placeholder-aw-muted focus:outline-none focus:border-aw-violet transition-colors"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-aw-violet hover:bg-aw-purple text-white py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-aw-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-aw-violet hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}