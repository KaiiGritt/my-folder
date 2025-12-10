import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX, FiSearch } from 'react-icons/fi';
import { searchApi } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
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
  const [filter, setFilter] = useState('all');

  const inputRef = useRef(null);
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
      let filteredResults = data.results.filter(item => item.media_type !== 'person');

      if (filter !== 'all') {
        filteredResults = filteredResults.filter(item => item.media_type === filter);
      }

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
        if (entries[0].isIntersecting && !loading && page < totalPages && query) {
          setPage(prev => prev + 1);
          fetchResults(query, page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [loading, page, totalPages, query, fetchResults]);

  // Filter change
  useEffect(() => {
    if (query) {
      setPage(1);
      fetchResults(query);
    }
  }, [filter, query, fetchResults]);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] pb-16">
      <div style={{ padding: '0 var(--container-padding)' }}>
        {/* Header */}
        <div className="mb-8" style={{ paddingTop: '120px' }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Search
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies and TV shows..."
                className="w-full h-12 sm:h-14 px-4 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setTotalResults(0);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white transition-colors"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: filter === option.value ? 'white' : 'rgba(63, 63, 70, 0.5)',
                  color: filter === option.value ? 'black' : 'rgb(161, 161, 170)',
                  fontWeight: '500',
                  fontSize: '14px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                className="hover:opacity-80"
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {totalResults > 0 && (
            <p className="text-zinc-400 text-sm">
              Found <span className="text-white font-medium">{totalResults}</span> results
              {query && <> for "<span className="text-white">{query}</span>"</>}
            </p>
          )}
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5"
          >
            {results.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.02, 0.3) }}
              >
                <MovieCard
                  movie={item}
                  onSelect={setSelectedMovie}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && query ? (
          /* No Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
              <FiSearch className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
            <p className="text-zinc-400 text-center max-w-md">
              We couldn't find anything for "{query}". Try different keywords.
            </p>
          </motion.div>
        ) : !loading && !query ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-6">
              <FiSearch className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Start searching</h3>
            <p className="text-zinc-400 text-center max-w-md">
              Search for your favorite movies and TV shows
            </p>
          </motion.div>
        ) : null}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div ref={loadMoreRef} className="h-10" />
      </div>

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
