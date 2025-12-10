import { useState } from 'react';
import { useMyList } from '../context/MyListContext';
import MovieCard from '../components/MovieCard';
import MovieModal from '../components/MovieModal';
import { FiHeart } from 'react-icons/fi';

const MyListPage = () => {
  const { myList } = useMyList();
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <div className="bg-[#0a0a0f] min-h-screen pb-16">
      {/* Page Header */}
      <header className="pt-32 sm:pt-36 md:pt-40 mb-8 sm:mb-10 md:mb-12" style={{ padding: '8rem var(--container-padding) 0' }}>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
          My List
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          {myList.length} {myList.length === 1 ? 'title' : 'titles'} saved
        </p>
      </header>

      {myList.length === 0 ? (
        /* Empty State */
        <div
          className="flex flex-col items-center justify-center py-16 sm:py-24 md:py-32"
          style={{ padding: '0 var(--container-padding)' }}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <FiHeart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-500" />
          </div>
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-semibold mb-2 text-center">
            Your list is empty
          </h2>
          <p className="text-gray-400 text-sm sm:text-base text-center max-w-md">
            Add movies and TV shows to your list to keep track of what you want to watch.
          </p>
        </div>
      ) : (
        /* Grid of saved items */
        <div style={{ padding: '0 var(--container-padding)' }}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {myList.map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}`}
                movie={item}
                onSelect={setSelectedMovie}
              />
            ))}
          </div>
        </div>
      )}

      <MovieModal
        movie={selectedMovie}
        isOpen={!!selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
};

export default MyListPage;
