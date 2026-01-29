import React from 'react';
import '../App.css';
import { Box, Typography, Paper, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";


export default function Watchlist({ movies, onToggle }) {
    const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
    return (
   <div className="container">
      <h2 className="page-title">My Watchlist ({movies.length})</h2>

      {movies.length === 0 ? (
        <Typography variant="h6" sx={{ marginLeft: "20px", color: "gray" }}>
          No movies added yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 2,
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {movies.map((movie) => (
            <Paper key={movie.id} className="watchlist-card" elevation={3}>
            <Box sx={{ flexShrink: 0, width: "100px", marginRight: 2 }}>
            {movie.picture ? (
                <img
                src={`${TMDB_IMAGE_BASE_URL}${movie.picture}`}
                alt={movie.title}
                style={{
                    width: "100px",
                    height: "150px",
                    objectFit: "cover", // Prevents image distortion
                    borderRadius: "4px",
                }}
                />
              ) : (
                <div className="movie-poster">
                  No Image
                </div>
              )}
              </Box>

              {/* 2. RIGHT SIDE: Content Area */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {/* TOP: Title and Description */}
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
                    {movie.title}
                  </Typography>
                  
                  <Typography variant="body2" color="grey" sx={{ mb: 2 }}>
                    {/* cut off description if it is too long */}
                    {movie.overView
                      ? movie.overView.length > 300
                        ? movie.overView.substring(0, 300) + "..."
                        : movie.overView
                      : "No description available."}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: "auto", // Pushes this section to the bottom of the card
                  }}
                >
                  <Typography variant="subtitle1">
                    Score: {Math.round(movie.score)}/10
                  </Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => onToggle(movie)}
                  >
                    Remove
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </div>
  );
}


