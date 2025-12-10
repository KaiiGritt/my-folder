import { useState, useEffect } from 'react';
import { movieApi } from '../services/tmdb';
import RowCarousel from '../components/RowCarousel';
import MovieModal from '../components/MovieModal';

const MoviesPage = () => {
  const [data, setData] = useState({
    trending: [],
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingRes,
          nowPlayingRes,
          popularRes,
          topRatedRes,
          upcomingRes,
        ] = await Promise.all([
          movieApi.getTrending('week'),
          movieApi.getNowPlaying(),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getUpcoming(),
        ]);

        setData({
          trending: trendingRes.results,
          nowPlaying: nowPlayingRes.results,
          popular: popularRes.results,
          topRated: topRatedRes.results,
          upcoming: upcomingRes.results,
        });
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/30 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0f] min-h-screen pb-16">
      {/* Page Header */}
      <header className="pt-32 sm:pt-36 md:pt-40 mb-8 sm:mb-10 md:mb-12" style={{ padding: '8rem var(--container-padding) 0' }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
          Movies
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Discover the latest and greatest films
        </p>
      </header>

      {/* Content Rows */}
      <div className="space-y-2 sm:space-y-4">
        <RowCarousel
          title="Trending This Week"
          movies={data.trending}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Now Playing in Theaters"
          movies={data.nowPlaying}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Popular on CineStream"
          movies={data.popular}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Top Rated of All Time"
          movies={data.topRated}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Coming Soon"
          movies={data.upcoming}
          onMovieSelect={setSelectedMovie}
        />
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};

export default MoviesPage;
