import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";
import { MdMovie } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";

function SearchBar({
  placeholder = "Search for a movie, tv shows...",
  data = [],
  onSearch,
  onSelect,
  onSearchSubmit,
}) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleClick = (movie) => {
    setQuery(movie.title);
    setSearchResults([]);
    if (onSelect) onSelect(movie);
  };

  //Handle form submission
  const handleFormSubmit = (e) => {
    // stop page from reloading
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(query);
    }
    setSearchResults([]); // Hide the dropdown after submitting
  };

  const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
  const WATCH_REGION = "GB";
   const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w92";

  const streamData = async () => {
    if (!query) return;
    const searchUrl = `https://api.themoviedb.org/3/search/multi?query=${query}`;

    try {
      const response = await axios.get(searchUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          accept: "application/json",
        },
        params: {
          watch_region: WATCH_REGION,
        },
      });

      const validResults = response.data.results
        .filter(
          (item) => item.media_type !== "person" && (item.title || item.name)
        )
        .map((item) => ({
          id: item.id,
          title: item.title || item.name,
          mediaType: item.media_type,
          poster_path: item.poster_path
        }));

      setSearchResults(validResults);

      console.log("TMDB Multi-Search API Response:", response.data);
    } catch (error) {
      console.error("API error occured:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      streamData();
    }, 300);
    return () => clearTimeout(timeOut);
  }, [query]);

  return (
    <div className={`searchbar-wrapper ${isFocused ? "focused" : ""}`}>
      <form className="searchInputs" onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button type="submit" className="searchIcon">
          <FaSearch />
        </button>
      </form>
      {searchResults.length !== 0 && query && (
        <div className="dataResults">
          {searchResults.slice(0, 6).map((movie) => (
            <Link
              to={`/results-page/${movie.id}`}
              style={{ textDecoration: "none" }}
              key={movie.id}
            >
              <div className="dataItem" onClick={() => handleClick(movie)}>
                {movie.poster_path ? (
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={movie.title}
                    style={{
                      width: "40px",
                      height: "60px",
                      objectFit: "cover",
                      marginRight: "10px",
                      borderRadius: "4px",
                    }}
                  />
                ) : (
                  <MdMovie
                    className="movieIcon"
                    style={{ marginRight: "10px", fontSize: "30px" }}
                  />
                )}
                <div className="text-info">
                  <span className="title-text">{movie.title}</span>
                  <span className="type-text">
                    {movie.mediaType === "tv" ? "TV Show" : "Movie"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;