import React, { useRef } from "react";
import "./popular.css";
import headerImage from "../assets/images.png";
import { Paper, Button, Box, Typography, IconButton } from "@mui/material"; // Import IconButton
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"; // Import Right Arrow Icon
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"; // Import Left Arrow Icon

// Removed unused imports: useState, StreamMovies

function SuggestedMovies({ movieData }) {
  // Ref to reference the scrollable container element
  const scrollContainerRef = useRef(null);

  // Determines the scroll distance (one card's width + margin)
  const SCROLL_DISTANCE_FACTOR = 1;

  // Function to scroll the container right (Next)
  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({
        left: containerWidth * SCROLL_DISTANCE_FACTOR, // Scroll by one viewport
        behavior: "smooth",
      });
    }
  };

  // Function to scroll the container left (Previous)
  const scrollPrevious = () => {
    if (scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;

      scrollContainerRef.current.scrollBy({
        left: -containerWidth * SCROLL_DISTANCE_FACTOR, // Scroll backwards by one viewport
        behavior: "smooth",
      });
    }
  };

  const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  return (
    <div>
      <div className="header">
        <img src={headerImage} alt="" className="logo" />
      </div>

      <div className="container">
        <h1 className="popular-title">Suggested for you</h1>

        {/* 1. WRAPPER FOR ARROW POSITIONING */}
        <Box sx={{ position: "relative" }}>
          {/* LEFT ARROW BUTTON */}
          <IconButton onClick={scrollPrevious} sx={arrowButtonStyles("left")}>
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* RIGHT ARROW BUTTON */}
          <IconButton onClick={scrollNext} sx={arrowButtonStyles("right")}>
            <ArrowForwardIosIcon />
          </IconButton>

          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              overflowX: "scroll",
              py: 2,
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
          >
            {movieData.map((movie) => (
              <Paper
                key={movie.id}
                elevation={3}
                sx={{
                  flexShrink: 0,
                  width: { xs: "90%", sm: "45%", md: "23.5%" },
                  margin: "0 8px",
                  padding: "20px",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "auto",
                }}
              >
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
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  className="detail-button"
                >
                  {" "}
                  View Details{" "}
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default SuggestedMovies;

const arrowButtonStyles = (position) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
  backgroundColor: "rgba(0, 0, 0, 0.5)", 
  color: "white",
  // Apply different styles based on position
  [position]: 0,
  // Hide buttons on smaller screens if they clutter the view
 // display: { xs: "none", md: "inline-flex" },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
});