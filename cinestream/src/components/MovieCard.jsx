import { useState } from 'react';
import { FiPlay, FiPlus, FiChevronDown } from 'react-icons/fi';
import { getImageUrl } from '../services/tmdb';

const MovieCard = ({ movie, onSelect }) => {
  const [isActive, setIsActive] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const title = movie.title || movie.name;
  const year = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0];

  // Handle both touch and mouse interactions
  const handleInteraction = () => {
    setIsActive(true);
  };

  const handleLeave = () => {
    setIsActive(false);
  };

  const handleClick = () => {
    // On mobile, first tap shows overlay, second tap opens modal
    if (window.innerWidth < 768 && !isActive) {
      setIsActive(true);
      return;
    }
    onSelect?.(movie);
  };

  return (
    <div
      className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]"
      onMouseEnter={handleInteraction}
      onMouseLeave={handleLeave}
      onTouchStart={handleInteraction}
    >
      <div
        className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
          isActive ? 'md:scale-105 z-20 shadow-2xl ring-2 ring-white/20' : 'scale-100 z-0'
        }`}
        onClick={handleClick}
      >
        {/* Poster */}
        <div className="aspect-[2/3] bg-[#1a1a1a]">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse" />
          )}
          {movie.poster_path && (
            <img
              src={getImageUrl(movie.poster_path, 'poster', 'medium')}
              alt={title}
              className={`w-full h-full object-cover transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          )}
        </div>

        {/* Always visible on mobile - Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent md:hidden">
          <h3 className="text-white text-xs font-medium line-clamp-1">
            {title}
          </h3>
          {year && <span className="text-gray-400 text-[10px]">{year}</span>}
        </div>

        {/* Hover/Active Overlay - Desktop */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent transition-opacity duration-300 hidden md:block ${isActive ? 'opacity-100' : 'opacity-0'}`}>
          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#141414]">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-2">
              <button className="btn-icon !w-8 !h-8">
                <FiPlay className="w-3.5 h-3.5 text-white" />
              </button>
              <button className="btn-icon-secondary !w-8 !h-8">
                <FiPlus className="w-3.5 h-3.5 text-white" />
              </button>
              <button
                className="btn-icon-secondary !w-8 !h-8 ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(movie);
                }}
              >
                <FiChevronDown className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-400 font-semibold">
                {Math.round(movie.vote_average * 10)}%
              </span>
              {year && <span className="text-gray-400">{year}</span>}
              <span className="bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-300 rounded">HD</span>
            </div>

            {/* Title */}
            <h3 className="text-white text-sm font-medium mt-1 line-clamp-1">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
