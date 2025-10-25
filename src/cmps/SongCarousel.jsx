export function SongCarousel({ songs, title="title" }) {
  return (
    <div className="song-carousel-container">
      <h1 className="carousel-title">{title}</h1>
      <div className="song-carousel">
        {songs.map((song, idx) => (
          <div key={idx} className="song-card">
            <div style={{width: "100%"}}>
              <img src={song.thumbnail} alt={song.title} />
              <p className="card-title">{song.title}</p>
              <p className="card-artist">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
