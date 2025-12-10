import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMenu, FiPlay, FiHome, FiFilm, FiTv, FiHeart } from 'react-icons/fi';
import { searchApi, getImageUrl } from '../services/tmdb';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        closeSearch();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const response = await searchApi.multiSearch(searchQuery);
        setSearchResults(response.results.filter(r => r.media_type !== 'person').slice(0, 6));
        setSelectedIndex(-1);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
        setMobileMenuOpen(false);
      }
      if (searchOpen && searchResults.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
        }
        if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          handleResultClick(searchResults[selectedIndex]);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, searchResults, selectedIndex]);

  const openSearch = () => {
    setSearchOpen(true);
    setMobileMenuOpen(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      closeSearch();
    }
  };

  const handleResultClick = (result) => {
    navigate(`/search?q=${encodeURIComponent(result.title || result.name)}`);
    closeSearch();
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Movies', path: '/movies', icon: FiFilm },
    { name: 'TV Shows', path: '/tv', icon: FiTv },
    { name: 'My List', path: '/my-list', icon: FiHeart },
  ];

  return (
    <>
      {/* Main Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isScrolled || mobileMenuOpen ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
          backdropFilter: isScrolled || mobileMenuOpen ? 'blur(12px)' : 'none',
        }}
      >
        {/* Use same padding as HeroBanner and RowCarousel */}
        <div className="w-full" style={{ padding: '0 var(--container-padding)' }}>
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 font-extrabold text-3xl tracking-tight drop-shadow-lg">
                CINESTREAM
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    location.pathname === link.path ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <button
                onClick={openSearch}
                className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <FiSearch size={20} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-white transition-colors ${
                  mobileMenuOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 sm:top-20 left-0 right-0 bottom-0 z-40 bg-black/98 backdrop-blur-xl"
          >
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-5 py-6"
            >
              {/* Navigation Links */}
              <div style={{ marginBottom: '32px' }}>
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '16px',
                          marginBottom: '8px',
                          borderRadius: '12px',
                          backgroundColor: isActive ? 'rgba(229, 9, 20, 0.1)' : 'transparent',
                          border: isActive ? '1px solid rgba(229, 9, 20, 0.3)' : '1px solid transparent',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: isActive ? '#e50914' : 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={22} color={isActive ? 'white' : '#a1a1aa'} />
                        </div>
                        <div>
                          <span
                            style={{
                              fontSize: '17px',
                              fontWeight: 600,
                              color: isActive ? '#ffffff' : '#e4e4e7',
                              display: 'block',
                            }}
                          >
                            {link.name}
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              color: '#71717a',
                            }}
                          >
                            {link.name === 'Home' && 'Browse featured content'}
                            {link.name === 'Movies' && 'Explore all movies'}
                            {link.name === 'TV Shows' && 'Discover TV series'}
                            {link.name === 'My List' && 'Your saved items'}
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Search Bar in Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <button
                  onClick={openSearch}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#71717a',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <FiSearch size={20} />
                  <span>Search movies and TV shows...</span>
                </button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeSearch}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '16px',
              paddingTop: '80px',
            }}
          >
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '600px',
              }}
            >
              {/* Search Input Container */}
              <div
                style={{
                  backgroundColor: '#18181b',
                  borderRadius: '16px',
                  border: '1px solid #3f3f46',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Input */}
                <form onSubmit={handleSearchSubmit}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <FiSearch
                      style={{
                        position: 'absolute',
                        left: '16px',
                        width: '20px',
                        height: '20px',
                        color: '#71717a',
                      }}
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      autoComplete="off"
                      style={{
                        width: '100%',
                        height: '56px',
                        paddingLeft: '48px',
                        paddingRight: '48px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        color: 'white',
                      }}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults([]);
                          inputRef.current?.focus();
                        }}
                        style={{
                          position: 'absolute',
                          right: '16px',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#3f3f46',
                          border: 'none',
                          borderRadius: '50%',
                          color: '#a1a1aa',
                          cursor: 'pointer',
                        }}
                      >
                        <FiX size={14} />
                      </button>
                    )}
                    {isSearching && (
                      <div
                        style={{
                          position: 'absolute',
                          right: searchQuery ? '56px' : '16px',
                          width: '20px',
                          height: '20px',
                          border: '2px solid #3f3f46',
                          borderTopColor: '#e50914',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                    )}
                  </div>
                </form>

                {/* Results */}
                {searchResults.length > 0 && (
                  <div style={{ borderTop: '1px solid #27272a', maxHeight: '60vh', overflowY: 'auto' }}>
                    {searchResults.map((result, index) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          backgroundColor: selectedIndex === index ? '#27272a' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {/* Poster */}
                        <div
                          style={{
                            width: '40px',
                            height: '60px',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            backgroundColor: '#27272a',
                            flexShrink: 0,
                          }}
                        >
                          {result.poster_path ? (
                            <img
                              src={getImageUrl(result.poster_path, 'poster', 'small')}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#52525b',
                              fontSize: '10px',
                            }}>
                              N/A
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}>
                            {result.title || result.name}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 500,
                              color: result.media_type === 'movie' ? '#22c55e' : '#3b82f6',
                              backgroundColor: result.media_type === 'movie' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}>
                              {result.media_type === 'tv' ? 'TV' : 'Movie'}
                            </span>
                            {(result.release_date || result.first_air_date) && (
                              <span style={{ color: '#71717a', fontSize: '12px' }}>
                                {(result.release_date || result.first_air_date)?.split('-')[0]}
                              </span>
                            )}
                            {result.vote_average > 0 && (
                              <span style={{ color: '#facc15', fontSize: '12px' }}>
                                ★ {result.vote_average.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Play Icon */}
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: selectedIndex === index ? 1 : 0,
                            transition: 'opacity 0.15s',
                            flexShrink: 0,
                          }}
                        >
                          <FiPlay size={12} style={{ color: 'white', marginLeft: '2px' }} />
                        </div>
                      </button>
                    ))}

                    {/* View All */}
                    <button
                      onClick={handleSearchSubmit}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderTop: '1px solid #27272a',
                        color: '#e50914',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background-color 0.15s',
                      }}
                    >
                      View all results
                    </button>
                  </div>
                )}

                {/* No Results */}
                {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                  <div style={{ padding: '24px 16px', textAlign: 'center', borderTop: '1px solid #27272a' }}>
                    <p style={{ color: '#71717a', fontSize: '14px' }}>
                      No results found
                    </p>
                  </div>
                )}
              </div>

              {/* Close hint */}
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ color: '#52525b', fontSize: '12px' }}>
                  Press <kbd style={{ backgroundColor: '#27272a', padding: '2px 8px', borderRadius: '4px', margin: '0 4px' }}>ESC</kbd> to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          nav.hidden.md\\:flex {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
