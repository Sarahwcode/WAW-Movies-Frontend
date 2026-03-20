import React from "react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Paper, Typography, Box } from "@mui/material";
import MovieTrailers from "../components/movie-trailers";
import "./results-page.css";
import ScoreBadge from "../components/ScoreBadge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const TMDB_READ_ACCESS_TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const WATCH_REGION = "GB";

function Results() {
  // 1. Get the movie ID from the URL path
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  // blur/darken background video when results page renders
  useEffect(() => {
    document.body.classList.add("results-page-bg");

    return () => {
      document.body.classList.remove("results-page-bg");
    };
  }, []);

  const fetchWatchProviders = async () => {
    const providersUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`;

    try {
      const response = await axios.get(providersUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });

      // The data is nested under the 'results' key, then under the region code
      const providersData = response.data.results[WATCH_REGION];
      setWatchProviders(providersData);
      console.log("Watch Providers Response:", providersData);
    } catch (error) {
      console.error("Failed to fetch watch providers:", error);
    }
  };

  // Function to fetch the single movie's details
  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);

    // TMDB GET DETAILS endpoint: /movie/{movie_id}
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}`;

    try {
      const response = await axios.get(detailsUrl, {
        headers: {
          Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      });

      setMovieDetails(response.data);
      setLoading(false);

      console.log("Movie Details Response:", response.data);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
      setError("Could not load movie details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (movieId) {
      setLoading(true);
      setError(null);

      // Fetch details and providers together
      Promise.all([fetchMovieDetails(), fetchWatchProviders()])
        .then(() => setLoading(false))
        .catch(() => setLoading(false)); // Ensure loading stops even on failure
    }
  }, [movieId]);

  if (loading) {
    return (
      <Typography variant="h5" sx={{ mt: 4, textAlign: "center" }}>
        Loading movie details...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography
        variant="h5"
        color="error"
        sx={{ mt: 4, textAlign: "center" }}
      >
        {error}
      </Typography>
    );
  }

  // Check if data is available before trying to access properties
  if (!movieDetails) {
    return (
      <Typography variant="h5" sx={{ mt: 4, textAlign: "center" }}>
        No details found.
      </Typography>
    );
  }

  return (
    <Paper
      className="result-container"
      elevation={6}
      sx={{ p: 4, mt: 4, mx: "auto", maxWidth: 800 }}
    >
      <Box sx={{ position: "relative", mb: 1, mt: 2 }}>
        <Typography
          className="result-title"
          variant="h3"
          sx={{ textAlign: "center" }}
        >
          {movieDetails.title}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
          {movieDetails.tagline}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3,
          alignItems: { xs: "center", md: "stretch" },
        }}
      >
        {/* left column*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: { xs: 2, md: 6 },
            width: { xs: "100%", md: "auto" },
          }}
        >
          <Typography
            className="result-date"
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {movieDetails.release_date.split("-")[0]}
          </Typography>

          {movieDetails.poster_path && (
            <img
              src={`${TMDB_IMAGE_BASE_URL}${movieDetails.poster_path}`}
              alt={movieDetails.title}
              style={{width: "100%",
          maxWidth: "350px", 
          height: "auto",
          borderRadius: "8px",
          boxShadow: 3}}
            />
          )}
        </Box>
        {/* right column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            width: "100%",
          }}
        >
         <Box sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }} />
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <ScoreBadge score={movieDetails.vote_average} />
          </Box>
          <Box className="overview-container" sx={{ p: 2, mt: "auto"}}>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Overview
            </Typography>
            <Typography variant="body1" sx={{ textAlign: "left", pt: 1 }}>
              {movieDetails.overview}
            </Typography>
            <Typography
              className="result-genres"
              variant="body2"
              sx={{ mt: 3, mb: 1 }}
            >
              <strong>Genres:</strong>{" "}
              {movieDetails.genres?.map((genre, index) => (
                <span key={genre.id}>
                  {genre.name}
                  {index < movieDetails.genres.length - 1 ? ", " : ""}
                </span>
              ))}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mt: 2,
                width: "100%",
                textAlign: "center",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              {movieDetails.runtime} minutes
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* --- WATCH PROVIDERS SECTION --- */}
      <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ccc" }}>
        <Typography variant="h5" gutterBottom>
          Where to Watch (Region: {WATCH_REGION})
        </Typography>

        {/* Check if providers data exists for the region */}
        {watchProviders ? (
          <Box>
            {/* Display Streaming Providers */}
            {watchProviders.flatrate && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: "green" }}>
                  Stream:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {watchProviders.flatrate.map((provider) => (
                    <img
                      key={provider.provider_id}
                      src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                      alt={provider.provider_name}
                      title={provider.provider_name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Display Rental Providers */}
            {watchProviders.rent && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: "blue" }}>
                  Rent:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {watchProviders.rent.map((provider) => (
                    <img
                      key={provider.provider_id}
                      src={`${TMDB_IMAGE_BASE_URL}${provider.logo_path}`}
                      alt={provider.provider_name}
                      title={provider.provider_name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* If no streaming/rental/buy options are available */}
            {!watchProviders.flatrate &&
              !watchProviders.rent &&
              !watchProviders.buy && (
                <Typography variant="body1">
                  No streaming, rental, or purchase options available in your
                  region ({WATCH_REGION}).
                </Typography>
              )}
          </Box>
        ) : (
          <Typography variant="body1">
            Watch provider data is not available for the region {WATCH_REGION}.
          </Typography>
        )}
      </Box>
      <MovieTrailers />
    </Paper>
  );
}

export default Results;