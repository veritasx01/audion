export function SongCarousel({ songs }) {
  return (
    <div className="song-carousel-container">
      <h1>Recently Played</h1>
      <div className="song-carousel">
        {songs.map((pl, idx) => (
          <div key={idx} className="song-card">
            <div style={{width: "100%"}}>
              <img src={pl.thumbnail} alt={pl.title} />
              <p style={{overflow: "auto"}}>{pl.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
