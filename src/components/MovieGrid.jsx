import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MovieGrid.css";
import { IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

export const Pagination = ({ totalPages, paginate, currentPage }) => {
  const pageNumbers = [];
  const MAX_VISIBLE_PAGES = 10;

  let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
  let endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);

  if (endPage - startPage + 1 < MAX_VISIBLE_PAGES) {
    startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) {
    return null;
  }

  return (
    <nav>
      <ul className="pagination">
        {/* Previous Button */}
        {currentPage > 1 && (
          <li key="prev" className="page-item">
            <a
              onClick={() => paginate(currentPage - 1)}
              href="#!"
              className="page-link"
            >
              &laquo;
            </a>
          </li>
        )}

        {/* '1 ...' display logic */}
        {startPage > 1 && (
          <>
            <li key={1} className="page-item">
              <a onClick={() => paginate(1)} href="#!" className="page-link">
                1
              </a>
            </li>
            {startPage > 2 && (
              <li key="dots-start" className="page-item dots">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {/* Dynamic Page Buttons */}
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
          >
            <a onClick={() => paginate(number)} href="#!" className="page-link">
              {number}
            </a>
          </li>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li key="dots-end" className="page-item dots">
                <span className="page-link">...</span>
              </li>
            )}
            <li key={totalPages} className="page-item">
              <a
                onClick={() => paginate(totalPages)}
                href="#!"
                className="page-link"
              >
                {totalPages}
              </a>
            </li>
          </>
        )}

        {currentPage < totalPages && (
          <li key="next" className="page-item">
            <a
              onClick={() => paginate(currentPage + 1)}
              href="#!"
              className="page-link"
            >
              &raquo;
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};
const MovieGrid = ({ watchlist = [], toggleWatchlist }) => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const isInWatchlist = (id) => {
    return watchlist && watchlist.some((movie) => movie.id === id);
  };

  useEffect(() => {
    const fetchMoviesByPage = async (page) => {
      const discoverUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${page}&sort_by=popularity.desc`;
      try {
        const response = await axios.get(discoverUrl, {
          headers: {
            Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
            Accept: "application/json",
          },
        });
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 200));
      } catch (error) {
        console.error("Discover API Error:", error);
      }
    };

    fetchMoviesByPage(currentPage);
  }, [currentPage]);

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="movie-grid-container">
        {movies.map((movie) => (
          <Link
            to={`/results-page/${movie.id}`}
            key={movie.id}
            className="movie-card-link"
          >
            <div className="movie-card">
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchlist(movie);
                }}
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 1)" },
                  padding: "4px",
                }}
              >
                {isInWatchlist(movie.id) ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon sx={{ color: "black" }} />
                )}
              </IconButton>

              {movie.picture || movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${
                    movie.picture || movie.poster_path
                  }`}
                  alt={movie.title}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <div className="movie-card-title">{movie.title}</div>
            </div>
          </Link>
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          paginate={changePage}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

export default MovieGrid;