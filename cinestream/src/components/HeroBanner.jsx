import { useState, useEffect, useCallback } from 'react';
import { FiPlay, FiInfo } from 'react-icons/fi';
import { getImageUrl } from '../services/tmdb';

const HeroBanner = ({ movies, onMovieSelect }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMovie = movies?.[currentIndex];

  useEffect(() => {
    if (!movies?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const goToSlide = useCallback((index) => setCurrentIndex(index), []);

  if (!currentMovie) {
    return (
      <div className="relative w-full h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  const title = currentMovie.title || currentMovie.name;
  const year =
    currentMovie.release_date?.split('-')[0] ||
    currentMovie.first_air_date?.split('-')[0];
  const rating = currentMovie.vote_average?.toFixed(1);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Desktop Backdrop */}
      <div
        className="hidden sm:block absolute inset-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: `url(${getImageUrl(
            currentMovie.backdrop_path,
            'backdrop',
            'original'
          )})`,
        }}
      />
      {/* Mobile Poster */}
      <div
        className="sm:hidden absolute inset-0 w-full h-full bg-cover bg-top z-0"
        style={{
          backgroundImage: `url(${getImageUrl(
            currentMovie.poster_path,
            'poster',
            'large'
          )})`,
        }}
      />

      {/* Gradients */}
      {/* Mobile: Strong bottom gradient */}
      <div
        className="sm:hidden absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0a0a0f 0%, #0a0a0f 10%, rgba(10,10,15,0.9) 25%, rgba(10,10,15,0.4) 50%, transparent 70%)'
        }}
      />
      {/* Desktop: Bottom + Left gradients */}
      <div
        className="hidden sm:block absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0a0a0f 0%, #0a0a0f 5%, transparent 35%)'
        }}
      />
      <div
        className="hidden sm:block absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, #0a0a0f 0%, rgba(10,10,15,0.85) 25%, rgba(10,10,15,0.4) 45%, transparent 65%)'
        }}
      />

      {/* Content */}
      {/* Mobile: Bottom aligned | Desktop: Center-left aligned */}
      <div className="absolute inset-0 z-20 flex items-end sm:items-center">
        <div className="w-full pb-28 sm:pb-0" style={{ paddingLeft: 'var(--container-padding)', paddingRight: 'var(--container-padding)' }}>
          <div className="w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl">

            {/* Label */}
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <span className="text-red-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                Featured
              </span>
              <span className="w-1 h-1 bg-zinc-500 rounded-full" />
              <span className="text-zinc-400 text-[11px] sm:text-xs">
                #{currentIndex + 1} Trending
              </span>
            </div>

            {/* Title */}
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 sm:mb-5">
              {title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              {rating && (
                <span className="inline-flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1.5 rounded">
                  ★ {rating}
                </span>
              )}
              {year && (
                <span className="text-zinc-300 text-xs bg-white/10 px-3 py-1.5 rounded">
                  {year}
                </span>
              )}
              <span className="text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded border border-white/30">
                HD
              </span>
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 line-clamp-2 sm:line-clamp-3 max-w-md sm:max-w-lg">
              {currentMovie.overview}
            </p>

            {/* Buttons - Consistent styling with proper centering */}
            <div className="flex items-center gap-3 sm:gap-4 ml-1">
              <button
                onClick={() => onMovieSelect?.(currentMovie)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  height: '48px',
                  padding: '0 28px',
                  backgroundColor: 'white',
                  color: 'black',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="hover:bg-zinc-200 transition-colors"
              >
                <FiPlay style={{ width: '20px', height: '20px', fill: 'black' }} />
                <span>Play</span>
              </button>
              <button
                onClick={() => onMovieSelect?.(currentMovie)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  height: '48px',
                  padding: '0 28px',
                  backgroundColor: 'rgba(82, 82, 91, 0.7)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                className="hover:bg-zinc-600/80 transition-colors"
              >
                <FiInfo style={{ width: '20px', height: '20px' }} />
                <span>More Info</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 flex items-center gap-2 z-20" style={{ right: 'var(--container-padding)' }}>
        {movies?.slice(0, 5).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Slide ${index + 1}`}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroBanner;
