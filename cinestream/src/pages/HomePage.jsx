import { useState, useEffect } from 'react';
import { movieApi, tvApi } from '../services/tmdb';
import HeroBanner from '../components/HeroBanner';
import RowCarousel from '../components/RowCarousel';
import MovieModal from '../components/MovieModal';

const HomePage = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRatedTV, setTopRatedTV] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, popular, topRated, upcoming, tvPopular, tvTopRated] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getUpcoming(),
          tvApi.getPopular(),
          tvApi.getTopRated(),
        ]);

        setTrendingMovies(trending.results || []);
        setPopularMovies(popular.results || []);
        setTopRatedMovies(topRated.results || []);
        setUpcomingMovies(upcoming.results || []);
        setPopularTV(tvPopular.results || []);
        setTopRatedTV(tvTopRated.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero Banner */}
      <HeroBanner movies={trendingMovies} onMovieSelect={handleMovieSelect} />

      {/* Movie Rows */}
      <div className="relative z-10 -mt-20 sm:-mt-32">
        <RowCarousel
          title="Trending Now"
          movies={trendingMovies}
          onMovieSelect={handleMovieSelect}
        />
        <RowCarousel
          title="Popular Movies"
          movies={popularMovies}
          onMovieSelect={handleMovieSelect}
        />
        <RowCarousel
          title="Top Rated Movies"
          movies={topRatedMovies}
          onMovieSelect={handleMovieSelect}
        />
        <RowCarousel
          title="Coming Soon"
          movies={upcomingMovies}
          onMovieSelect={handleMovieSelect}
        />
        <RowCarousel
          title="Popular TV Shows"
          movies={popularTV.map(show => ({ ...show, media_type: 'tv' }))}
          onMovieSelect={handleMovieSelect}
        />
        <RowCarousel
          title="Top Rated TV Shows"
          movies={topRatedTV.map(show => ({ ...show, media_type: 'tv' }))}
          onMovieSelect={handleMovieSelect}
        />
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default HomePage;
