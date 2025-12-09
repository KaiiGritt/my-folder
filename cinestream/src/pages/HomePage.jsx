import { useState, useEffect } from 'react';
import { movieApi, tvApi } from '../services/tmdb';
import HeroBanner from '../components/HeroBanner';
import RowCarousel from '../components/RowCarousel';
import MovieModal from '../components/MovieModal';

const HomePage = () => {
  const [data, setData] = useState({
    featured: [],
    trending: [],
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
    popularTv: [],
    topRatedTv: [],
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
          popularTvRes,
          topRatedTvRes,
        ] = await Promise.all([
          movieApi.getTrending('week'),
          movieApi.getNowPlaying(),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getUpcoming(),
          tvApi.getPopular(),
          tvApi.getTopRated(),
        ]);

        // Get details for featured movies
        const featuredMovies = await Promise.all(
          trendingRes.results.slice(0, 5).map((m) => movieApi.getDetails(m.id))
        );

        setData({
          featured: featuredMovies,
          trending: trendingRes.results,
          nowPlaying: nowPlayingRes.results,
          popular: popularRes.results,
          topRated: topRatedRes.results,
          upcoming: upcomingRes.results,
          popularTv: popularTvRes.results.map((tv) => ({ ...tv, media_type: 'tv' })),
          topRatedTv: topRatedTvRes.results.map((tv) => ({ ...tv, media_type: 'tv' })),
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-[#141414] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Hero */}
      <HeroBanner movies={data.featured} onMovieSelect={setSelectedMovie} />

      {/* Content Rows */}
      <div className="relative z-10 mt-4 md:-mt-24 pt-8 md:pt-12 pb-16">
        <RowCarousel
          title="Trending Now"
          movies={data.trending}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Now Playing"
          movies={data.nowPlaying}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Popular on CineStream"
          movies={data.popular}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Top Rated"
          movies={data.topRated}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Coming Soon"
          movies={data.upcoming}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Popular TV Shows"
          movies={data.popularTv}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Top Rated TV Shows"
          movies={data.topRatedTv}
          onMovieSelect={setSelectedMovie}
        />
      </div>

      {/* Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};

export default HomePage;
