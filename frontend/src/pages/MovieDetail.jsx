import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'

const PLACEHOLDER = 'https://placehold.co/300x450/1e1e28/8888aa?text=No+Poster'

const STATUS_OPTIONS = [
  { value: 'watching',  label: '▶  Watching' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'planning',  label: '📋 Planning to Watch' },
  { value: 'stopped',   label: '🛑 Stopped' },
]

export default function MovieDetail() {
  const { imdbId } = useParams()
  const { user } = useAuth()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [entry, setEntry] = useState(null)
  const [status, setStatus] = useState('planning')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchMovie()
    if (user) fetchEntry()
  }, [imdbId])

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/movies/${imdbId}/`)
      setMovie(res.data)
    } finally {
      setLoading(false)
    }
  }

  const fetchEntry = async () => {
    try {
      const res = await api.get('/watchlist/')
      const found = res.data.results.find(e => e.imdb_id === imdbId)
      if (found) {
        setEntry(found)
        setStatus(found.status)
        setNotes(found.notes || '')
      }
    } catch {}
  }

  const handleSave = async () => {
    if (!movie) return
    setSaving(true)
    setMessage('')
    try {
      if (entry) {
        await api.patch(`/watchlist/${entry.id}/`, { status, notes })
        setMessage('Watchlist updated!')
      } else {
        const res = await api.post('/watchlist/', {
          imdb_id: imdbId,
          title: movie.Title,
          year: movie.Year,
          poster: movie.Poster !== 'N/A' ? movie.Poster : '',
          status,
          notes,
        })
        setEntry(res.data)
        setMessage('Added to watchlist!')
      }
    } catch (err) {
      setMessage('Error saving. Try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleRemove = async () => {
    if (!entry) return
    try {
      await api.delete(`/watchlist/${entry.id}/`)
      setEntry(null)
      setStatus('planning')
      setNotes('')
      setMessage('Removed from watchlist.')
      setTimeout(() => setMessage(''), 3000)
    } catch {}
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
      <div className="flex gap-8">
        <div className="w-64 aspect-[2/3] bg-aw-card rounded-xl shrink-0" />
        <div className="flex-1 space-y-4 pt-4">
          <div className="h-8 bg-aw-card rounded w-3/4" />
          <div className="h-4 bg-aw-card rounded w-1/2" />
          <div className="h-24 bg-aw-card rounded" />
        </div>
      </div>
    </div>
  )

  if (!movie) return (
    <div className="text-center py-20 text-aw-muted">Movie not found.</div>
  )

  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER
  const ratings = movie.Ratings || []

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Poster */}
        <div className="shrink-0 w-full md:w-64">
          <img
            src={poster}
            alt={movie.Title}
            className="w-full rounded-xl border border-aw-border shadow-xl shadow-black/50"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-aw-text mb-1">{movie.Title}</h1>

          <div className="flex flex-wrap gap-2 mb-4 text-sm text-aw-muted">
            <span>{movie.Year}</span>
            <span>•</span>
            <span>{movie.Runtime}</span>
            <span>•</span>
            <span>{movie.Rated}</span>
            {entry && <><span>•</span><StatusBadge status={entry.status} /></>}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-5">
            {movie.Genre?.split(', ').map(g => (
              <span key={g} className="bg-aw-badge border border-aw-border text-xs text-aw-muted px-3 py-1 rounded-full">
                {g}
              </span>
            ))}
          </div>

          <p className="text-aw-muted text-sm leading-relaxed mb-5 line-clamp-3">
            {movie.Plot}
          </p>

          {/* Ratings */}
          <div className="flex gap-4 mb-6">
            {ratings.map(r => (
              <div key={r.Source} className="bg-aw-card border border-aw-border rounded-xl px-4 py-3 text-center">
                <p className="text-aw-violet font-bold text-lg">{r.Value}</p>
                <p className="text-xs text-aw-muted mt-1">
                  {r.Source === 'Internet Movie Database' ? 'IMDb' :
                   r.Source === 'Rotten Tomatoes' ? 'RT' : 'MC'}
                </p>
              </div>
            ))}
          </div>

          <div className="text-sm text-aw-muted space-y-1 mb-6">
            <p><span className="text-aw-text">Director:</span> {movie.Director}</p>
            <p><span className="text-aw-text">Cast:</span> {movie.Actors}</p>
          </div>

          {/* Watchlist panel */}
          {user ? (
            <div className="bg-aw-card border border-aw-border rounded-xl p-5">
              <h3 className="font-semibold text-aw-text mb-4">
                {entry ? 'Update Watchlist' : 'Add to Watchlist'}
              </h3>

              <div className="flex flex-wrap gap-2 mb-4">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      status === opt.value
                        ? 'bg-aw-violet border-aw-violet text-white'
                        : 'bg-aw-bg border-aw-border text-aw-muted hover:border-aw-violet'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)..."
                rows={2}
                className="w-full bg-aw-bg border border-aw-border rounded-lg px-3 py-2 text-sm text-aw-text placeholder-aw-muted focus:outline-none focus:border-aw-violet transition-colors resize-none mb-4"
              />

              <div className="flex gap-3 items-center">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-aw-violet hover:bg-aw-purple text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : entry ? 'Update' : 'Add to List'}
                </button>
                {entry && (
                  <button
                    onClick={handleRemove}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    Remove
                  </button>
                )}
                {message && (
                  <span className="text-sm text-aw-violet">{message}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-aw-card border border-aw-border rounded-xl p-5 text-center text-aw-muted text-sm">
              <a href="/login" className="text-aw-violet hover:underline">Login</a> to add this to your watchlist.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}