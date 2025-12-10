import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import MoviesPage from './pages/MoviesPage';
import TVPage from './pages/TVPage';
import MyListPage from './pages/MyListPage';
import { MyListProvider } from './context/MyListContext';

function App() {
  return (
    <MyListProvider>
      <Router>
        <div className="min-h-screen bg-[#0a0a0f]">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/tv" element={<TVPage />} />
              <Route path="/my-list" element={<MyListPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </MyListProvider>
  );
}

export default App;
