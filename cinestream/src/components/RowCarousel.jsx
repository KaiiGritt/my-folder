import { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from './MovieCard';

const RowCarousel = ({ title, movies, onMovieSelect }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      const newScrollLeft = direction === 'left'
        ? rowRef.current.scrollLeft - scrollAmount
        : rowRef.current.scrollLeft + scrollAmount;

      rowRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 20);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  if (!movies?.length) return null;

  return (
    <section className="relative py-6 md:py-8 group">
      {/* Title */}
      <h2 className="text-white text-lg md:text-xl lg:text-2xl font-semibold mb-4 md:mb-5" style={{ padding: '0 var(--container-padding)' }}>
        {title}
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-0 top-0 bottom-0 z-10 w-12 md:w-16 flex items-center justify-center transition-all ${
            showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)' }}
        >
          <FiChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-0 top-0 bottom-0 z-10 w-12 md:w-16 flex items-center justify-center transition-all ${
            showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.8), transparent)' }}
        >
          <FiChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Movies Row */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', paddingTop: '1rem', paddingBottom: '1rem' }}
        >
          {/* Left spacer */}
          <div style={{ paddingLeft: 'var(--container-padding)', flexShrink: 0 }} />

          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onMovieSelect}
            />
          ))}

          {/* Right spacer */}
          <div style={{ paddingRight: 'var(--container-padding)', flexShrink: 0 }} />
        </div>
      </div>
    </section>
  );
};

export default RowCarousel;
