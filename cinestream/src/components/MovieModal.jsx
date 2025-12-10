import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlay, FiPlus, FiCheck, FiStar } from 'react-icons/fi';
import { movieApi, tvApi, getImageUrl, getTrailerKey } from '../services/tmdb';
import { useMyList } from '../context/MyListContext';

const MovieModal = ({ movie, isOpen, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  const mediaType = movie?.media_type || (movie?.first_air_date ? 'tv' : 'movie');
  const inMyList = movie ? isInList(movie.id, mediaType) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!movie?.id) return;
      setLoading(true);
      setShowTrailer(false);
      try {
        const isTv = mediaType === 'tv';
        const data = isTv
          ? await tvApi.getDetails(movie.id)
          : await movieApi.getDetails(movie.id);
        setDetails(data);
      } catch (error) {
        console.error('Error fetching details:', error);
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
  }, [movie, isOpen, mediaType]);

  const handleAddToList = () => {
    if (inMyList) {
      removeFromList(movie.id, mediaType);
    } else {
      addToList({ ...movie, media_type: mediaType });
    }
  };

  const trailerKey = details?.videos ? getTrailerKey(details.videos) : null;

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!isOpen) return null;

  const title = details?.title || details?.name || movie?.title || movie?.name;
  const year = (details?.release_date || details?.first_air_date || movie?.release_date || movie?.first_air_date)?.split('-')[0];
  const rating = details?.vote_average || movie?.vote_average;
  const overview = details?.overview || movie?.overview;
  const backdrop = details?.backdrop_path || movie?.backdrop_path;
  const poster = details?.poster_path || movie?.poster_path;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
        style={{ padding: '40px 16px' }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/80" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-zinc-900 rounded-lg overflow-hidden shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <FiX className="w-5 h-5 text-white" />
          </button>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Hero Section with Backdrop */}
              <div className="relative" style={{ aspectRatio: '16/9' }}>
                {showTrailer && trailerKey ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title="Trailer"
                  />
                ) : (
                  <>
                    {/* Backdrop Image */}
                    <img
                      src={getImageUrl(backdrop, 'backdrop', 'large')}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/80 via-transparent to-transparent" />

                    {/* Play Button */}
                    {trailerKey && (
                      <button
                        onClick={() => setShowTrailer(true)}
                        className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all hover:scale-105"
                      >
                        <FiPlay className="w-7 h-7 sm:w-8 sm:h-8 text-black ml-1" style={{ fill: 'black' }} />
                      </button>
                    )}

                    {/* Bottom Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                      {/* Title */}
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                        {title}
                      </h1>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        {trailerKey && (
                          <button
                            onClick={() => setShowTrailer(true)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              height: '44px',
                              padding: '0 24px',
                              backgroundColor: 'white',
                              color: 'black',
                              fontWeight: '600',
                              fontSize: '15px',
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                            className="hover:bg-gray-200 transition-colors active:scale-95"
                          >
                            <FiPlay style={{ width: '20px', height: '20px', fill: 'black' }} />
                            Play
                          </button>
                        )}

                        <button
                          onClick={handleAddToList}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            height: '44px',
                            padding: '0 24px',
                            backgroundColor: inMyList ? 'rgba(34, 197, 94, 0.2)' : 'rgba(109, 109, 110, 0.7)',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '15px',
                            borderRadius: '4px',
                            border: inMyList ? '1px solid rgba(34, 197, 94, 0.5)' : 'none',
                            cursor: 'pointer',
                          }}
                          className="hover:opacity-80 transition-opacity active:scale-95"
                        >
                          {inMyList
                            ? <FiCheck style={{ width: '20px', height: '20px' }} />
                            : <FiPlus style={{ width: '20px', height: '20px' }} />}
                          {inMyList ? 'Added' : 'My List'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6 md:p-8">
                {/* Meta Info Row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {rating > 0 && (
                    <div className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-400" style={{ fill: '#facc15' }} />
                      <span className="text-white font-semibold">{rating.toFixed(1)}</span>
                    </div>
                  )}
                  {year && (
                    <span className="text-zinc-400">{year}</span>
                  )}
                  {details?.runtime && (
                    <span className="text-zinc-400">{formatRuntime(details.runtime)}</span>
                  )}
                  {details?.number_of_seasons && (
                    <span className="text-zinc-400">
                      {details.number_of_seasons} Season{details.number_of_seasons > 1 ? 's' : ''}
                    </span>
                  )}
                  <span className="px-2 py-0.5 text-xs font-semibold text-white bg-zinc-700 rounded">HD</span>
                </div>

                {/* Genres */}
                {details?.genres?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {details.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 text-sm text-zinc-300 bg-zinc-800 rounded-full"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                {overview && (
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
                    {overview}
                  </p>
                )}

                {/* Cast Section */}
                {details?.credits?.cast?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-white font-semibold mb-3">Cast</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {details.credits.cast.slice(0, 10).map((actor) => (
                        <div key={actor.id} className="flex-shrink-0 text-center" style={{ width: '80px' }}>
                          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-2">
                            {actor.profile_path ? (
                              <img
                                src={getImageUrl(actor.profile_path, 'profile', 'small')}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xl font-semibold">
                                {actor.name?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="text-white text-xs font-medium truncate">{actor.name}</p>
                          <p className="text-zinc-500 text-xs truncate">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {details?.recommendations?.results?.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">More Like This</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                      {details.recommendations.results.slice(0, 6).map((rec) => (
                        <div
                          key={rec.id}
                          className="relative rounded overflow-hidden bg-zinc-800 cursor-pointer hover:ring-2 hover:ring-white/50 transition-all"
                          style={{ aspectRatio: '2/3' }}
                        >
                          {rec.poster_path ? (
                            <img
                              src={getImageUrl(rec.poster_path, 'poster', 'small')}
                              alt={rec.title || rec.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-zinc-600 text-xs text-center px-1">
                                {rec.title || rec.name}
                              </span>
                            </div>
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
