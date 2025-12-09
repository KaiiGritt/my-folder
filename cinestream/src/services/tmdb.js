import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image size configurations
export const IMAGE_SIZES = {
  poster: {
    small: `${IMAGE_BASE_URL}/w185`,
    medium: `${IMAGE_BASE_URL}/w342`,
    large: `${IMAGE_BASE_URL}/w500`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  backdrop: {
    small: `${IMAGE_BASE_URL}/w300`,
    medium: `${IMAGE_BASE_URL}/w780`,
    large: `${IMAGE_BASE_URL}/w1280`,
    original: `${IMAGE_BASE_URL}/original`,
  },
  profile: {
    small: `${IMAGE_BASE_URL}/w45`,
    medium: `${IMAGE_BASE_URL}/w185`,
    large: `${IMAGE_BASE_URL}/h632`,
    original: `${IMAGE_BASE_URL}/original`,
  },
};

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Helper function to get full image URL
export const getImageUrl = (path, type = 'poster', size = 'medium') => {
  if (!path) return null;
  return `${IMAGE_SIZES[type][size]}${path}`;
};

// Movies API
export const movieApi = {
  // Get trending movies
  getTrending: async (timeWindow = 'week', page = 1) => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  },

  // Get popular movies
  getPopular: async (page = 1) => {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated movies
  getTopRated: async (page = 1) => {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get upcoming movies
  getUpcoming: async (page = 1) => {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page },
    });
    return response.data;
  },

  // Get now playing movies
  getNowPlaying: async (page = 1) => {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { page },
    });
    return response.data;
  },

  // Get movie details
  getDetails: async (movieId) => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,recommendations,similar',
      },
    });
    return response.data;
  },

  // Get movie credits (cast and crew)
  getCredits: async (movieId) => {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data;
  },

  // Get movie videos (trailers, teasers, etc.)
  getVideos: async (movieId) => {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Get movies by genre
  getByGenre: async (genreId, page = 1) => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc',
      },
    });
    return response.data;
  },
};

// TV Shows API
export const tvApi = {
  // Get trending TV shows
  getTrending: async (timeWindow = 'week', page = 1) => {
    const response = await tmdbApi.get(`/trending/tv/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  },

  // Get popular TV shows
  getPopular: async (page = 1) => {
    const response = await tmdbApi.get('/tv/popular', {
      params: { page },
    });
    return response.data;
  },

  // Get top rated TV shows
  getTopRated: async (page = 1) => {
    const response = await tmdbApi.get('/tv/top_rated', {
      params: { page },
    });
    return response.data;
  },

  // Get TV show details
  getDetails: async (tvId) => {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'videos,credits,recommendations,similar',
      },
    });
    return response.data;
  },
};

// Search API
export const searchApi = {
  // Multi search (movies, TV shows, people)
  multiSearch: async (query, page = 1) => {
    const response = await tmdbApi.get('/search/multi', {
      params: { query, page },
    });
    return response.data;
  },

  // Search movies only
  searchMovies: async (query, page = 1) => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Search TV shows only
  searchTv: async (query, page = 1) => {
    const response = await tmdbApi.get('/search/tv', {
      params: { query, page },
    });
    return response.data;
  },
};

// Genres API
export const genreApi = {
  // Get movie genres
  getMovieGenres: async () => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  },

  // Get TV genres
  getTvGenres: async () => {
    const response = await tmdbApi.get('/genre/tv/list');
    return response.data.genres;
  },
};

// Helper to get YouTube trailer URL
export const getTrailerUrl = (videos) => {
  if (!videos || !videos.results) return null;

  const trailer = videos.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos.results.find(
    (video) => video.site === 'YouTube'
  );

  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
};

// Helper to get YouTube trailer key
export const getTrailerKey = (videos) => {
  if (!videos || !videos.results) return null;

  const trailer = videos.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos.results.find(
    (video) => video.site === 'YouTube'
  );

  return trailer ? trailer.key : null;
};

export default {
  movieApi,
  tvApi,
  searchApi,
  genreApi,
  getImageUrl,
  getTrailerUrl,
  getTrailerKey,
  IMAGE_SIZES,
};
