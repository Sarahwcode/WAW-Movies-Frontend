import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Paper, Typography, Box } from "@mui/material";

const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const WATCH_REGION = "GB";

function MovieTrailers() {
  const { movieId } = useParams();
  const [movieTrailers, setMovieTrailers] = useState(null);

  const fetchMovieTrailers = async () => {
    const trailersUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos`;

    try {
      const response = await axios.get(trailersUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });

      setMovieTrailers(response.data.results);

      console.log(response.data);
    } catch (error) {
      console.error("Failed to show movie trailers:", error);
    }
  };

  useEffect(() => {
    fetchMovieTrailers();
  }, [movieId]);

  if (movieTrailers === null) {
    return (
        <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ccc" }}>
            <Typography variant="h5" gutterBottom>
              🎥 Movie Trailer
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Loading trailer information...
            </Typography>
        </Box>
    );
  }

  const primaryTrailer = movieTrailers.find(
    (video) => video.site === "YouTube" && video.type === "Trailer"
  );

  return (
  <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ccc" }}>
      <Typography variant="h5" gutterBottom>
        🎥 Movie Trailer
      </Typography>

      {primaryTrailer ? (
        // Use the YouTube key to create an embeddable URL
        <Box sx={{ maxWidth: "100%", aspectRatio: "16/9", mb: 2 }}>
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${primaryTrailer.key}`}
            title={`${primaryTrailer.name} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "8px" }}
          ></iframe>
          
        </Box>
      ) : (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          No official trailer found (but other videos might be available).
        </Typography>
      )}
    </Box> );
}

export default MovieTrailers;