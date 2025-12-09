import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiMenu, FiChevronDown, FiUser, FiSettings, FiLogOut, FiHeart } from 'react-icons/fi';
import { searchApi, getImageUrl } from '../services/tmdb';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* Detect scroll */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Click outside search and profile */
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
      // Close profile dropdown if clicked outside
      if (!e.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* Search debounce */
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        try {
          const response = await searchApi.multiSearch(searchQuery);
          setSearchResults(response.results.slice(0, 6));
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* Keyboard shortcuts */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!searchOpen) {
          setSearchOpen(true);
        } else {
          // If search is open, focus the input
          const searchInput = document.querySelector('input[placeholder*="Search"]');
          if (searchInput) searchInput.focus();
        }
      }

      // Escape to close search or profile dropdown
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          setSearchResults([]);
        }
        if (profileDropdownOpen) {
          setProfileDropdownOpen(false);
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, profileDropdownOpen, mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'My List', path: '/my-list' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl shadow-lg'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-[1700px] mx-auto" style={{ padding: '0 var(--container-padding)' }}>
        <div className="flex items-center justify-between h-16">

          {/* LOGO */}
          <div className="flex items-center gap-10">
            <Link to="/" className="select-none">
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-600 to-purple-600 font-extrabold text-3xl tracking-tight drop-shadow-lg">
                CINESTREAM
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium tracking-wide transition-all ${
                    location.pathname === link.path
                      ? 'text-white border-b-2 border-red-500 pb-1'
                      : 'text-gray-300 hover:text-white hover:scale-105'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* Search */}
            <div ref={searchRef} className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles..."
                    autoFocus
                    className="w-[240px] sm:w-[280px] bg-black/80 border border-gray-600 rounded-xl px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 focus:border-red-500 outline-none transition-all"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-white hover:text-red-400 transition-all"
                >
                  <FiSearch size={20} />
                </button>
              )}

              {/* Enhanced Search Results Dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-[340px] bg-[#0D0D0D] border border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl ring-1 ring-white/10"
                  >
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-gray-400 text-xs font-medium">Search Results</p>
                    </div>
                    {searchResults.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          to={`/search?q=${result.title || result.name}`}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-purple-500/10 transition-all duration-200 group focus:outline-none focus:bg-white/10"
                          tabIndex={0}
                        >
                          <div className="relative">
                            <img
                              src={result.poster_path
                                ? getImageUrl(result.poster_path, 'poster', 'small')
                                : '/placeholder.jpg'}
                              alt={`Poster for ${result.title || result.name}`}
                              className="w-12 h-16 object-cover rounded-md shadow-md group-hover:shadow-lg transition-shadow"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-white font-medium text-sm truncate group-hover:text-red-400 transition-colors">
                              {result.title || result.name}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-gray-400 text-xs capitalize">
                                {result.media_type === 'tv' ? 'TV Series' : 'Movie'}
                              </span>
                              {result.vote_average > 0 && (
                                <span className="text-yellow-400 text-xs">
                                  ★ {result.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="hidden lg:block relative profile-dropdown">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg p-1"
                aria-label="Open profile menu"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-purple-700 shadow-md ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                <FiChevronDown className={`text-white transition-all duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#0D0D0D] border border-gray-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-purple-700 shadow-md" />
                        <div>
                          <p className="text-white font-semibold text-sm">Guest User</p>
                          <p className="text-gray-400 text-xs">guest@cinestream.com</p>
                        </div>
                      </div>
                    </div>

                    <nav className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                        <FiUser className="w-4 h-4" />
                        <span className="text-sm">Profile</span>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                        <FiHeart className="w-4 h-4" />
                        <span className="text-sm">My List</span>
                      </button>

                      <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                        <FiSettings className="w-4 h-4" />
                        <span className="text-sm">Settings</span>
                      </button>

                      <div className="border-t border-gray-700 my-2" />

                      <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
                        <FiLogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-white"
            >
              {mobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/95 border-t border-gray-800 shadow-inner"
          >
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg font-medium transition-all ${
                    location.pathname === link.path
                      ? 'bg-red-600/20 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
