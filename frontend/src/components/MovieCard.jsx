import { Link } from 'react-router-dom'

const PLACEHOLDER = 'https://placehold.co/300x450/1e1e28/8888aa?text=No+Poster'

export default function MovieCard({ movie }) {
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER

  return (
    <Link to={`/movie/${movie.imdbID}`} className="group block">
      <div className="bg-aw-card border border-aw-border rounded-xl overflow-hidden hover:border-aw-violet transition-all duration-300 hover:shadow-lg hover:shadow-aw-purple/20 hover:-translate-y-1">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={poster}
            alt={movie.Title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-aw-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-xs bg-aw-violet text-white px-2 py-1 rounded-full">
              View Details
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-aw-text line-clamp-2 group-hover:text-aw-violet transition-colors">
            {movie.Title}
          </h3>
          <p className="text-xs text-aw-muted mt-1">{movie.Year}</p>
        </div>
      </div>
    </Link>
  )
}