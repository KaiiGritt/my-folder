import { useState } from 'react';
import { FiPlay, FiPlus, FiCheck } from 'react-icons/fi';
import { getImageUrl } from '../services/tmdb';
import { useMyList } from '../context/MyListContext';

const MovieCard = ({ movie, onSelect }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToList, removeFromList, isInList } = useMyList();

  const title = movie.title || movie.name;
  const year = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0];
  const rating = movie.vote_average ? Math.round(movie.vote_average * 10) : null;
  const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
  const inMyList = isInList(movie.id, mediaType);

  const handleAddToList = (e) => {
    e.stopPropagation();
    if (inMyList) {
      removeFromList(movie.id, mediaType);
    } else {
      addToList({ ...movie, media_type: mediaType });
    }
  };

  return (
    <div
      className="relative flex-shrink-0 group cursor-pointer"
      style={{ width: 'clamp(130px, 15vw, 200px)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(movie)}
    >
      {/* Card Container */}
      <div
        className="relative rounded-md overflow-hidden bg-zinc-900 transition-transform duration-300 ease-out group-hover:scale-105 group-hover:z-10"
        style={{ aspectRatio: '2/3' }}
      >
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
        )}

        {/* Poster Image */}
        {movie.poster_path ? (
          <img
            src={getImageUrl(movie.poster_path, 'poster', 'medium')}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-zinc-800">
            <span className="text-zinc-600 text-xs text-center px-2">{title}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              onClick={handleAddToList}
              className="w-8 h-8 rounded-full bg-zinc-900/80 border border-zinc-600 flex items-center justify-center hover:border-white hover:bg-zinc-800 transition-colors"
              title={inMyList ? 'Remove from list' : 'Add to list'}
            >
              {inMyList ? (
                <FiCheck className="w-4 h-4 text-green-400" />
              ) : (
                <FiPlus className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* Play Button Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
              <FiPlay className="w-5 h-5 text-black ml-0.5" style={{ fill: 'black' }} />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-400 text-xs font-bold">{rating}%</span>
                {year && <span className="text-zinc-400 text-xs">{year}</span>}
              </div>
            )}
            {/* Title */}
            <h3 className="text-white text-sm font-medium line-clamp-1">{title}</h3>
          </div>
        </div>
      </div>

      {/* Title Below Card (Mobile) */}
      <div className="mt-2 md:hidden">
        <h3 className="text-white text-xs font-medium line-clamp-1">{title}</h3>
        {year && <p className="text-zinc-500 text-[10px]">{year}</p>}
      </div>
    </div>
  );
};

export default MovieCard;
