import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import MovieCard from '../components/MovieCard'

export default function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) return
    setPage(1)
    fetchResults(1)
  }, [query])

  const fetchResults = async (p) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/movies/search/?q=${encodeURIComponent(query)}&page=${p}`)
      setResults(res.data.results)
      setTotal(parseInt(res.data.total))
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-aw-text">
          Search results for{' '}
          <span className="text-aw-violet">"{query}"</span>
        </h1>
        {total > 0 && (
          <p className="text-sm text-aw-muted mt-1">{total} movies found</p>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-aw-card border border-aw-border rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-[2/3] bg-aw-border" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-aw-border rounded w-3/4" />
                <div className="h-3 bg-aw-border rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🎬</p>
          <p className="text-aw-muted">{error}</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                onClick={() => { setPage(p => p - 1); fetchResults(page - 1) }}
                disabled={page === 1}
                className="px-4 py-2 bg-aw-card border border-aw-border rounded-lg text-sm text-aw-muted hover:border-aw-violet disabled:opacity-30 transition-colors"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm text-aw-muted">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => { setPage(p => p + 1); fetchResults(page + 1) }}
                disabled={page === totalPages}
                className="px-4 py-2 bg-aw-card border border-aw-border rounded-lg text-sm text-aw-muted hover:border-aw-violet disabled:opacity-30 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}