import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import StatusBadge from '../components/StatusBadge'

const TABS = [
  { key: 'all',       label: 'All' },
  { key: 'watching',  label: '▶ Watching' },
  { key: 'completed', label: '✅ Completed' },
  { key: 'planning',  label: '📋 Planning' },
  { key: 'stopped',   label: '🛑 Stopped' },
]

const PLACEHOLDER = 'https://placehold.co/100x150/1e1e28/8888aa?text=?'

export default function Watchlist() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('status') || 'all'
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [data, setData] = useState({ summary: {}, results: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchList() }, [activeTab])

  const fetchList = async () => {
    setLoading(true)
    try {
      const params = activeTab !== 'all' ? `?status=${activeTab}` : ''
      const res = await api.get(`/watchlist/${params}`)
      setData(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fmt) => {
    try {
      const res = await api.get(`/watchlist/download/?format=${fmt}`, {
        responseType: 'blob',
      })
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `watchlist.${fmt}`
      a.click()
      URL.revokeObjectURL(url)
    } catch {}
  }

  const handleRemove = async (id) => {
    await api.delete(`/watchlist/${id}/`)
    fetchList()
  }

  const { summary, results } = data

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-aw-text">My Watchlist</h1>
          <p className="text-sm text-aw-muted mt-1">
            {summary.total || 0} movies total
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleDownload('txt')}
            className="text-sm bg-aw-card border border-aw-border hover:border-aw-violet text-aw-muted px-4 py-2 rounded-lg transition-colors"
          >
            ↓ TXT
          </button>
          <button
            onClick={() => handleDownload('json')}
            className="text-sm bg-aw-card border border-aw-border hover:border-aw-violet text-aw-muted px-4 py-2 rounded-lg transition-colors"
          >
            ↓ JSON
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { key: 'watching',  label: 'Watching',  color: 'text-blue-400' },
          { key: 'completed', label: 'Completed', color: 'text-green-400' },
          { key: 'planning',  label: 'Planning',  color: 'text-yellow-400' },
          { key: 'stopped',   label: 'Stopped',   color: 'text-red-400' },
        ].map(item => (
          <div key={item.key} className="bg-aw-card border border-aw-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${item.color}`}>
              {summary[item.key] || 0}
            </p>
            <p className="text-xs text-aw-muted mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-aw-card border border-aw-border rounded-xl p-1 mb-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-aw-violet text-white font-semibold'
                : 'text-aw-muted hover:text-aw-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-aw-card border border-aw-border rounded-xl p-4 animate-pulse flex gap-4">
              <div className="w-12 h-16 bg-aw-border rounded" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-aw-border rounded w-1/2" />
                <div className="h-3 bg-aw-border rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🎬</p>
          <p className="text-aw-muted">No movies here yet.</p>
          <Link to="/search?q=popular" className="text-aw-violet hover:underline text-sm mt-2 inline-block">
            Search for movies →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(entry => (
            <div key={entry.id} className="bg-aw-card border border-aw-border rounded-xl p-4 flex gap-4 hover:border-aw-violet transition-colors group">
              <Link to={`/movie/${entry.imdb_id}`} className="shrink-0">
                <img
                  src={entry.poster || PLACEHOLDER}
                  alt={entry.title}
                  className="w-12 h-16 object-cover rounded-lg border border-aw-border"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/movie/${entry.imdb_id}`}>
                  <h3 className="font-semibold text-aw-text group-hover:text-aw-violet transition-colors truncate">
                    {entry.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-aw-muted">{entry.year}</p>
                  <StatusBadge status={entry.status} />
                </div>
                {entry.notes && (
                  <p className="text-xs text-aw-muted mt-1 line-clamp-2">{entry.notes}</p>
                )}
              </div>
              <button
                onClick={() => handleRemove(entry.id)}
                className="shrink-0 text-aw-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-lg"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}