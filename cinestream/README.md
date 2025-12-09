# CineStream - Movie Streaming Frontend

A modern, cinematic, and responsive movie-streaming front-end application built with React + Vite. Inspired by Netflix with a dark, immersive, and visually premium design.

## Features

- **Hero Banner** - Large featured movie section with auto-rotating content, gradient overlays, and smooth animations
- **Movie Carousels** - Horizontal scroll sections with Swiper.js for Trending, Top Rated, Upcoming, and Popular content
- **Movie Cards** - Interactive cards with hover animations, scale effects, and gradient overlays
- **Movie Details Modal** - Glassmorphism modal with HD backdrop, trailers, cast, ratings, and more
- **Search Page** - Live search with filters, grid layout, and infinite scroll
- **Responsive Design** - Optimized for Desktop, Tablet, and Mobile

## Tech Stack

- **React 18** + **Vite** - Fast development and build
- **TailwindCSS** - Utility-first styling with custom gradients
- **Framer Motion** - Smooth animations and micro-interactions
- **Swiper.js** - Touch-enabled carousels
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **React Icons** - Beautiful icon library

## Color Palette

| Name | Gradient |
|------|----------|
| Deep Midnight Blue → Purple | `#0F0C29 → #302B63 → #24243E` |
| Neon Aqua → Soft Blue | `#00D2FF → #3A7BD5` |
| Charcoal Gray → Black | `#1A1A1A → #000000` |
| Accent Pink → Purple | `#FF0099 → #493240` |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- TMDB API Key (free)

### Installation

1. **Clone the repository**
   ```bash
   cd cinestream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_TMDB_API_KEY=your_api_key_here
   ```

   Get your free API key from [TMDB](https://www.themoviedb.org/settings/api):
   - Create an account at themoviedb.org
   - Go to Settings → API
   - Request an API key (choose "Developer" option)
   - Copy your API Key (v3 auth)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
cinestream/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation with search
│   │   ├── HeroBanner.jsx      # Featured movie banner
│   │   ├── MovieCard.jsx       # Individual movie card
│   │   ├── RowCarousel.jsx     # Horizontal movie carousel
│   │   ├── MovieModal.jsx      # Movie details modal
│   │   └── Footer.jsx          # Site footer
│   ├── pages/
│   │   ├── HomePage.jsx        # Main landing page
│   │   └── SearchPage.jsx      # Search results page
│   ├── services/
│   │   └── tmdb.js             # TMDB API service
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles & Tailwind
├── .env.example                # Environment template
├── index.html                  # HTML template
├── package.json
├── vite.config.js
└── README.md
```

## API Integration

The app uses [The Movie Database (TMDB) API](https://developers.themoviedb.org/3) for:

- Trending movies/shows
- Popular content
- Top-rated content
- Upcoming releases
- Movie/TV show details
- Cast information
- Trailers and videos
- Search functionality

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## UI/UX Features

- Dark mode first design
- Gradient accents throughout
- Cinematic spacing and typography
- Smooth hover animations
- Glassmorphism effects for modals
- Big bold headlines
- Soft shadows
- High contrast text
- Premium feel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

Built with React + Vite + TailwindCSS
