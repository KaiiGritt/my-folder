import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlay, FiPlus, FiCheck } from 'react-icons/fi';
import { movieApi, getImageUrl, getTrailerKey } from '../services/tmdb';

const MovieModal = ({ movie, isOpen, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [inList, setInList] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!movie?.id) return;
      setLoading(true);
      setShowTrailer(false);
      try {
        const data = await movieApi.getDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && movie) {
      fetchDetails();
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [movie, isOpen]);

  const trailerKey = details?.videos ? getTrailerKey(details.videos) : null;

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10 px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-[#141419] rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <FiX className="w-5 h-5 text-white" />
          </button>

          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#00D2FF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Backdrop / Trailer */}
              <div className="relative aspect-video bg-black">
                {showTrailer && trailerKey ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      src={getImageUrl(details?.backdrop_path || movie.backdrop_path, 'backdrop', 'large')}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-transparent to-transparent" />

                    {/* Play Button */}
                    {trailerKey && (
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="absolute inset-0 m-auto w-16 h-16 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg group"
                      >
                        <FiPlay className="w-6 h-6 text-black ml-1 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-6">
                  {/* Poster - Mobile hidden */}
                  <div className="hidden sm:block w-28 flex-shrink-0 -mt-20 relative z-10">
                    <img
                      src={getImageUrl(details?.poster_path || movie.poster_path, 'poster', 'medium')}
                      alt=""
                      className="w-full rounded-lg shadow-xl"
                    />
                  </div>

                  <div className="flex-1 sm:-mt-2">
                    {/* Title */}
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {details?.title || movie.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                      {details?.vote_average > 0 && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 rounded">
                          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-semibold text-white">{details.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                      <span className="text-zinc-400">{details?.release_date?.split('-')[0]}</span>
                      {formatRuntime(details?.runtime) && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-zinc-600" />
                          <span className="text-zinc-400">{formatRuntime(details?.runtime)}</span>
                        </>
                      )}
                    </div>

                    {/* Genres */}
                    {details?.genres?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {details.genres.slice(0, 4).map((genre) => (
                          <span
                            key={genre.id}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 text-zinc-300 border border-white/10"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="btn-glass"
                      >
                        <FiPlay className="w-4 h-4" />
                        <span>Watch Trailer</span>
                      </button>
                      <button
                        onClick={() => setInList(!inList)}
                        className={inList ? 'btn-accent' : 'btn-glass-secondary'}
                      >
                        {inList ? <FiCheck className="w-4 h-4" /> : <FiPlus className="w-4 h-4" />}
                        <span>{inList ? 'Added' : 'My List'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                {details?.tagline && (
                  <p className="text-[#FF0099] italic text-sm mb-4">"{details.tagline}"</p>
                )}

                {/* Overview */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Overview</h3>
                  <p className="text-zinc-300 leading-relaxed">{details?.overview || movie.overview}</p>
                </div>

                {/* Cast */}
                {details?.credits?.cast?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Cast</h3>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {details.credits.cast.slice(0, 8).map((actor) => (
                        <div key={actor.id} className="flex-shrink-0 text-center w-16">
                          <div className="w-14 h-14 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-2">
                            {actor.profile_path ? (
                              <img
                                src={getImageUrl(actor.profile_path, 'profile', 'small')}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                                N/A
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-white truncate">{actor.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Movies */}
                {details?.recommendations?.results?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">More Like This</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {details.recommendations.results.slice(0, 6).map((rec) => (
                        <div key={rec.id} className="relative rounded-lg overflow-hidden aspect-[2/3] bg-zinc-800 group cursor-pointer">
                          {rec.poster_path && (
                            <img
                              src={getImageUrl(rec.poster_path, 'poster', 'small')}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MovieModal;
