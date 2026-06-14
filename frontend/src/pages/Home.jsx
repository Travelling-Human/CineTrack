import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURED = [
  { imdbID: 'tt0816692', title: 'Interstellar',   year: '2014', poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMTEtY2Q3OTY3NzU4YTVhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg' },
  { imdbID: 'tt1375666', title: 'Inception',       year: '2010', poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg' },
  { imdbID: 'tt0468569', title: 'The Dark Knight',  year: '2008', poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg' },
  { imdbID: 'tt0110912', title: 'Pulp Fiction',    year: '1994', poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg' },
  { imdbID: 'tt0137523', title: 'Fight Club',      year: '1999', poster: 'https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-aw-purple/30 via-aw-surface to-aw-bg border border-aw-border p-10 mb-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-aw-purple/20 via-transparent to-transparent pointer-events-none" />
        <h1 className="text-4xl sm:text-5xl font-bold text-aw-text mb-4 relative">
          Your Movie Universe,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-aw-violet to-aw-pink">
            Tracked & Organized
          </span>
        </h1>
        <p className="text-aw-muted text-lg mb-8 max-w-xl mx-auto relative">
          Search any movie, save it to your watchlist, and track your progress — all in one place.
        </p>
        <div className="flex gap-4 justify-center relative">
          <Link
            to="/search?q=popular"
            className="bg-aw-violet hover:bg-aw-purple text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Browse Movies
          </Link>
          {!user && (
            <Link
              to="/register"
              className="bg-aw-card border border-aw-border hover:border-aw-violet text-aw-text px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Featured */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-aw-text">Featured Movies</h2>
        <Link to="/search?q=2024" className="text-sm text-aw-violet hover:text-aw-pink transition-colors">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {FEATURED.map((movie) => (
          <Link to={`/movie/${movie.imdbID}`} key={movie.imdbID} className="group block">
            <div className="bg-aw-card border border-aw-border rounded-xl overflow-hidden hover:border-aw-violet transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-aw-purple/20">
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-semibold text-aw-text line-clamp-2 group-hover:text-aw-violet transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-aw-muted mt-1">{movie.year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats strip */}
      {user && (
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'My Watchlist', to: '/watchlist', icon: '🎬' },
            { label: 'Watching',     to: '/watchlist?status=watching',  icon: '▶️' },
            { label: 'Completed',    to: '/watchlist?status=completed', icon: '✅' },
            { label: 'Planning',     to: '/watchlist?status=planning',  icon: '📋' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="bg-aw-card border border-aw-border rounded-xl p-4 text-center hover:border-aw-violet transition-colors group"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-sm text-aw-muted group-hover:text-aw-violet transition-colors">
                {item.label}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}