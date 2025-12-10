import { useState, useEffect } from 'react';
import { tvApi } from '../services/tmdb';
import RowCarousel from '../components/RowCarousel';
import MovieModal from '../components/MovieModal';

const TVPage = () => {
  const [data, setData] = useState({
    trending: [],
    popular: [],
    topRated: [],
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingRes,
          popularRes,
          topRatedRes,
        ] = await Promise.all([
          tvApi.getTrending('week'),
          tvApi.getPopular(),
          tvApi.getTopRated(),
        ]);

        setData({
          trending: trendingRes.results.map((tv) => ({ ...tv, media_type: 'tv' })),
          popular: popularRes.results.map((tv) => ({ ...tv, media_type: 'tv' })),
          topRated: topRatedRes.results.map((tv) => ({ ...tv, media_type: 'tv' })),
        });
      } catch (error) {
        console.error('Failed to fetch TV shows:', error);
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
          TV Shows
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Binge-worthy series and episodes
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
          title="Popular TV Shows"
          movies={data.popular}
          onMovieSelect={setSelectedMovie}
        />
        <RowCarousel
          title="Top Rated Series"
          movies={data.topRated}
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

export default TVPage;
