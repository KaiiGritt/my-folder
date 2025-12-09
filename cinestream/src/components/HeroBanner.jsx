import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiInfo } from 'react-icons/fi';
import { getImageUrl } from '../services/tmdb';

const HeroBanner = ({ movies, onMovieSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = movies?.[currentIndex];

  // Auto-cycle (only first 5 movies)
  useEffect(() => {
    if (!movies?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 9000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!currentMovie) {
    return (
      <div className="h-[70vh] md:h-[80vh] bg-[#0B0B0B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative h-[70vh] md:h-[85vh] lg:h-[92vh] overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <motion.img
            src={getImageUrl(currentMovie.backdrop_path, 'backdrop', 'original')}
            alt=""
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 4, ease: 'easeOut' }}
            className="w-full h-full object-cover object-center opacity-90"
          />
        </motion.div>
      </AnimatePresence>

      {/* Soft Apple-style gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent md:from-black/80 md:via-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 md:from-black/70 md:to-black/10" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end md:items-center pb-20 md:pb-0">
        <div className="max-w-[1800px] mx-auto w-full" style={{ padding: '0 var(--container-padding)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl md:max-w-2xl"
            >
              {/* Animated Title */}
              <motion.h1
                className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 md:mb-4 leading-tight drop-shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              >
                {currentMovie.title || currentMovie.name}
              </motion.h1>

              {/* Animated Meta */}
              <motion.div
                className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6 text-xs md:text-sm font-medium text-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {currentMovie.release_date && (
                  <span className="bg-white/10 px-2.5 py-1 md:px-3 rounded-full backdrop-blur-sm">
                    {currentMovie.release_date.split('-')[0]}
                  </span>
                )}
                <span className="bg-red-500/20 text-red-300 px-2.5 py-1 md:px-3 rounded-full backdrop-blur-sm border border-red-500/30 font-semibold">
                  HD
                </span>
                {currentMovie.vote_average > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-300 px-2.5 py-1 md:px-3 rounded-full backdrop-blur-sm border border-yellow-500/30 font-semibold">
                    ★ {currentMovie.vote_average.toFixed(1)}
                  </span>
                )}
              </motion.div>

              {/* Animated Description - Hidden on very small screens */}
              <motion.p
                className="hidden sm:block text-gray-100 text-sm md:text-base lg:text-lg max-w-xl md:max-w-2xl mb-6 md:mb-8 opacity-95 leading-relaxed line-clamp-2 md:line-clamp-3 font-light"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {currentMovie.overview}
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex items-center gap-2 md:gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => onMovieSelect?.(currentMovie)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-glass"
                >
                  <FiPlay className="w-4 h-4" />
                  <span>Play</span>
                </motion.button>

                <motion.button
                  onClick={() => onMovieSelect?.(currentMovie)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-glass-secondary"
                >
                  <FiInfo className="w-4 h-4" />
                  <span>Info</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Indicators - Repositioned for mobile */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:bottom-10 md:left-auto md:right-8 md:translate-x-0 flex items-center gap-2">
        {movies?.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1 md:h-[3px] rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-6 md:w-8'
                : 'bg-white/40 w-2 md:w-3'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
