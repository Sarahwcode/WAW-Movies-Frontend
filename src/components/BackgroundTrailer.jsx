import "./BackgroundTrailer.css";

function BackgroundTrailer({ youtubeKey }) {
  if (!youtubeKey) return null; // don't render until trailer found

  return (
    <iframe
      className="background-video"
      src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${youtubeKey}&end=30&rel=0&modestbranding=1`}
      title="Movie trailer background"
      frameBorder="0"
      allow="autoplay; fullscreen"
    />
  );
}

export default BackgroundTrailer;