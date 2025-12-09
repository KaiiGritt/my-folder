import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiLoader } from 'react-icons/fi';
import { searchApi, getImageUrl } from '../services/tmdb';
import MovieModal from '../components/MovieModal';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filter, setFilter] = useState('all'); // all, movie, tv, person
  const [showFilters, setShowFilters] = useState(false);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Fetch search results
  const fetchResults = useCallback(async (searchQuery, pageNum = 1, append = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = await searchApi.multiSearch(searchQuery, pageNum);
      const filteredResults = filter === 'all'
        ? data.results
        : data.results.filter(item => item.media_type === filter);

      setResults(prev => append ? [...prev, ...filteredResults] : filteredResults);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Initial search from URL
  useEffect(() => {
    if (initialQuery) {
      fetchResults(initialQuery);
    }
  }, [initialQuery, fetchResults]);

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      setPage(1);
      fetchResults(query);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage(prev => prev + 1);
          fetchResults(query, page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [loading, page, totalPages, query, fetchResults]);

  // Filter change
  useEffect(() => {
    if (query) {
      setPage(1);
      fetchResults(query);
    }
  }, [filter]);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
    { value: 'person', label: 'People' },
  ];

  const getItemTitle = (item) => {
    return item.title || item.name;
  };

  const getItemImage = (item) => {
    if (item.media_type === 'person') {
      return item.profile_path
        ? getImageUrl(item.profile_path, 'profile', 'medium')
        : '/placeholder-avatar.jpg';
    }
    return item.poster_path
      ? getImageUrl(item.poster_path, 'poster', 'medium')
      : '/placeholder-poster.jpg';
  };

  const getItemSubtitle = (item) => {
    if (item.media_type === 'person') {
      return item.known_for_department;
    }
    return (
      item.release_date?.split('-')[0] ||
      item.first_air_date?.split('-')[0] ||
      'N/A'
    );
  };

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 max-w-7xl mx-auto" style={{ padding: 'var(--container-padding)' }}>
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 mt-16 md:mt-20">
          Search
        </h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies, TV shows..."
                className="w-full pl-10 md:pl-12 pr-10 py-3 md:py-4 rounded-xl glass-strong text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <FiX className="w-4 md:w-5 h-4 md:h-5" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-glass flex-1 sm:flex-none"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'btn-icon' : 'btn-icon-secondary'}
              >
                <FiFilter className="w-4 md:w-5 h-4 md:h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                    className={filter === option.value ? 'btn-glass' : 'btn-glass-secondary'}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Results Count */}
        {totalResults > 0 && (
          <p className="text-gray-400">
            Found <span className="text-neon-aqua font-semibold">{totalResults}</span> results
            {query && (
              <>
                {' '}for "<span className="text-white">{query}</span>"
              </>
            )}
          </p>
        )}
      </motion.div>

      {/* Results Grid */}
      {results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6"
        >
          {results.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => item.media_type !== 'person' && setSelectedMovie(item)}
              className="group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] mb-3">
                {/* Image */}
                <img
                  src={getItemImage(item)}
                  alt={getItemTitle(item)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Media Type Badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-md backdrop-blur-sm ${
                      item.media_type === 'movie'
                        ? 'bg-neon-aqua/80 text-deep-black'
                        : item.media_type === 'tv'
                        ? 'bg-accent-pink/80 text-white'
                        : 'bg-soft-blue/80 text-white'
                    }`}
                  >
                    {item.media_type === 'tv' ? 'TV' : item.media_type === 'person' ? 'Person' : 'Movie'}
                  </span>
                </div>

                {/* Rating */}
                {item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-deep-black/80 backdrop-blur-sm">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-white text-xs font-semibold">
                      {item.vote_average.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Hover Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {item.overview && (
                    <p className="text-gray-300 text-xs line-clamp-3">
                      {item.overview}
                    </p>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-white font-medium text-sm truncate group-hover:text-neon-aqua transition-colors">
                {getItemTitle(item)}
              </h3>
              <p className="text-gray-400 text-xs mt-1">{getItemSubtitle(item)}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : !loading && query ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-midnight-mid to-midnight-end flex items-center justify-center mb-6">
            <FiSearch className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400 text-center max-w-md">
            We couldn't find anything matching "{query}". Try different keywords or check for typos.
          </p>
        </motion.div>
      ) : !loading && !query ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-aqua/20 to-soft-blue/20 flex items-center justify-center mb-6">
            <FiSearch className="w-10 h-10 text-neon-aqua" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Start searching</h3>
          <p className="text-gray-400 text-center max-w-md">
            Enter a movie title, TV show name, or person to find what you're looking for.
          </p>
        </motion.div>
      ) : null}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-12">
          <FiLoader className="w-8 h-8 text-neon-aqua animate-spin" />
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={loadMoreRef} className="h-10" />

      {/* Movie Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};

export default SearchPage;
