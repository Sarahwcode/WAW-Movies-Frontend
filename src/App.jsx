import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Provider } from "react-redux";
import API from '../api';
// Page/Component Imports - Consolidate all external imports here
import PopularMovies from "./pages/popular.jsx"; // 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Watchlist from "./pages/watchlist.jsx";
import Results from "./pages/results-page";

// Context & Utility Imports
import AuthContext from "./contexts/AuthContext.jsx";
import RequiredAuth from "./contexts/RequireAuth.jsx";

// Component Imports
import SearchBar from "./components/SearchBar.jsx";
import BackgroundTrailer from "./components/BackgroundTrailer.jsx";
import MovieGrid from "./components/MovieGrid.jsx";

// Asset Imports
import "./App.css"; // Note: I corrected the duplicated App.css import
import headerImage from "./assets/images.png";

// Environment Variables & Constants
const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const POPULAR_MOVIES = "popular";

function App() {
  // State from the first merged block (Auth)
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // State from the second merged block (Movies/UI)
  const [movieData, setMovieData] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [movieGenre, setMovieGenre] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- AUTHENTICATION LOGIC (Login/Logout/Token Check) ---

  // Check for stored token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const login = async (credentials) => {
    console.log(credentials);
    try {
      const { data } = await API.post('/api/auth/profile',
        credentials
      );
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setIsLoggedIn(true);
      console.log(data.message, data.token);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const logout = () => {
    console.log("logging out");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
  };

  // --- MOVIE DATA AND GENRE LOGIC ---

  // get genres
  const getGenres = async () => {
    const genreUrl = "https://api.themoviedb.org/3/genre/movie/list";

    try {
      const response = await axios.get(genreUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });

      const map = response.data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});

      setMovieGenre(map);
    } catch (error) {
      console.error("This API Error:", error);
    }
  };

  // fetch movies + random trailer
  const fetchMovieData = async () => {
    const popularUrl = `https://api.themoviedb.org/3/movie/${POPULAR_MOVIES}`;

    try {
      const response = await axios.get(popularUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });

      const moviesData = response.data.results.map((m) => ({
        id: m.id,
        title: m.title,
        releaseDate: m.release_date,
        overView: m.overview,
        score: m.vote_average,
        picture: m.poster_path,
      }));

      setMovieData(moviesData);
      setFilteredMovies(moviesData);

      // random traier background video
      if (moviesData.length > 0) {
        const randomMovie =
          moviesData[Math.floor(Math.random() * moviesData.length)];
        const randomMovieId = randomMovie.id;

        console.log("Random movie selected:", randomMovie.title);

        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${randomMovieId}/videos`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        const videos = videosResponse.data.results || [];

        const trailer = videos.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        if (trailer) {
          setTrailerKey(trailer.key);
        }
      }
    } catch (error) {
      console.error("API Error occurred:", error);
    }
  };

  // --- EFFECT HOOKS ---

  // Fetch initial data (Popular movies and Genres) on component mount
  useEffect(() => {
    console.log("Fetching initial data: Popular movies and Genres");
    fetchMovieData();
    getGenres();
  }, []);

  // --- WATCHLIST & SEARCH LOGIC ---

  const toggleWatchlist = (movie) => {
    const isInWatchlist = watchlist.some((m) => m.id === movie.id);
    // standarization to use new name or fallback to raw data name (example: picture or poster_path)
    const standardMovie = {
      id: movie.id,
      title: movie.title,
      picture: movie.picture || movie.poster_path,
      overView: movie.overView || movie.overview,
      score: movie.score || movie.vote_average,
      releaseDate: movie.releaseDate || movie.release_date,
    };

    if (isInWatchlist) {
      setWatchlist(watchlist.filter((m) => m.id !== movie.id));
    } else {
      setWatchlist([...watchlist, standardMovie]);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredMovies(movieData);
    } else {
      const results = movieData.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMovies(results);
    }
  };

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const resetFilters = () => {
    setFilteredMovies(movieData);
  };

  // --- MAIN COMPONENT RENDER ---

   return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <BrowserRouter>
        <BackgroundTrailer youtubeKey={trailerKey} />

        {/* header */}
        <div className="header">
          <div className="header-left">
            <Link to="/">
              <img src={headerImage} alt="WAW MOVIES logo" className="logo" />
            </Link>
          </div>

          <div className="header-center">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h1 className="waw-title">WAW MOVIES</h1>
            </Link>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            onClick={handleToggle}
            aria-expanded={isMenuOpen ? "true" : "false"}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon">☰</span>{" "}
          </button>
          <div
            className={`header-right navbar-collapse ${
              isMenuOpen ? "show" : ""
            }`}
          >
            <nav className="header-links">
              <Link to="/popular" className="popularMovies-link">
                Popular Movies
              </Link>
              <Link to="/watchlist" className="watchlist-link">
                {" "}
                Watchlist
              </Link>
              <Link to="/register" className="register-link">
                Register
              </Link>
              <Link to="/login" className="login-link">
                Login
              </Link>
            </nav>
          </div>
        </div>

        {/* main content */}
        <div className="app-content">
          <Routes>
            {/* Home Page - Root '/' */}
            <Route
              path="/"
              element={
                <>
                  <SearchBar
                    placeholder="Search for a movie, tv shows..."
                    data={filteredMovies}
                    onSearch={handleSearch}
                    onSelect={(movie) => setFilteredMovies([movie])}
                  />

                  <MovieGrid
                    // MovieGrid needs movie data to render
                    movieData={filteredMovies}
                    watchlist={watchlist}
                    toggleWatchlist={toggleWatchlist}
          
                  />
                </>
              }
            />
            {/* Popular movies (duplicate link for clarity) */}
            <Route
              path="/popular"
              element={
                <PopularMovies
                  onClick={fetchMovieData}
                  movieData={filteredMovies}
                  watchlist={watchlist}
                  toggleWatchlist={toggleWatchlist}
                  resetFilters={resetFilters}
                />
              }
            />

            {/* Watchlist page route */}
            <Route
              path="/watchlist"
              element={
                <Watchlist movies={watchlist} onToggle={toggleWatchlist} />
              }
            />

            <Route
              path="/results-page/:movieId"
              element={<Results genresMap={movieGenre} />}
            />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <RequiredAuth>
                  {" "}
                  <Profile />{" "}
                </RequiredAuth>
              }
            />
          </Routes>
        </div>
        {/* Footer */}
        <div className="footer">
          <p>© {new Date().getFullYear()} WAWMovies. All rights reserved.</p>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
