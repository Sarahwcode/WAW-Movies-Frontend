import "./popular.css";
import SuggestedMovies from "./suggested.jsx";
import React, { useRef, useEffect } from "react";

import {
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { Link } from "react-router-dom";
import headerImage from "../assets/images.png";

function PopularMovies({ movieData, watchlist = [], toggleWatchlist, resetFilters }) {
  const scrollContainerRef = useRef(null);

  const SCROLL_DISTANCE_FACTOR = 1;

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: containerWidth * SCROLL_DISTANCE_FACTOR,
        behavior: "smooth",
      });
    }
  };

  const scrollPrevious = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: -containerWidth * SCROLL_DISTANCE_FACTOR,
        behavior: "smooth",
      });
    }
  };

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

  const isInWatchlist = (id) => {
    return watchlist.some((movie) => movie.id === id);
  };

  useEffect(() => {
    resetFilters();
  }, []);

  return (
    

      <div>
      <div className="container container-relative">
        <h1 className="popular-title">Popular titles this week</h1>

        <Box sx={{ position: "relative" }}>
          <IconButton onClick={scrollPrevious} sx={arrowButtonStyles("left")}>
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton onClick={scrollNext} sx={arrowButtonStyles("right")}>
            <ArrowForwardIosIcon />
          </IconButton>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              flexWrap: 'nowrap',
              overflowX: "scroll",
              py: 2,
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              height: "150%"
            }}
          >
            {movieData.map((movie) => (
              <Paper
                key={movie.id}
                elevation={3}
                sx={{
                  flexShrink: 0,
                  width: { xs: "90%", sm: "45%", md: "25%" },
                  margin: "10px 8px",
                  padding: "20px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "auto",
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={() => toggleWatchlist(movie)}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 5,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    "&:hover": { backgroundColor: "rgb(223, 158, 36)" },
                  }}
                >
                  {isInWatchlist(movie.id) ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "black" }} />
                  )}
                </IconButton>

                <Box>
                  {movie.picture && (
                    <img
                      src={`${TMDB_IMAGE_BASE_URL}${movie.picture}`}
                      alt={movie.title}
                      className="movie-poster"
                    />
                  )}

                  <Typography variant="h6" className="movieTitle" gutterBottom>
                    {movie.title}
                  </Typography>

                  <Typography variant="subtitle2" className="movieDate">
                    ({movie.releaseDate})
                  </Typography>

                  <Typography variant="body2" sx={{ my: 1 }}>
                    {movie.overView
                      ? movie.overView.substring(0, 150) + "..."
                      : "No overview available"}
                  </Typography>

                  <Typography variant="body1" sx={{ mt: 1 }}>
                    Score: {Math.round(movie.score)}
                  </Typography>
                </Box>

                <Link
                  to={`/results-page/${movie.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    className="detail-button"
                  >
                    View Details
                  </Button>
                </Link>
              </Paper>
            ))}
          </Box>
        </Box>
      </div>

      <SuggestedMovies movieData={movieData} />
    </div>
  );
}

export default PopularMovies;

const arrowButtonStyles = (position) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  [position]: 0,
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});