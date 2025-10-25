import { useState } from "react";

export function SongCarousel({ songs, title = "title" }) {
  const [offset, setOffset] = useState(0);
  const moveLeft = () => setOffset((prev) => Math.max(0, prev - 3));
  const moveRight = () =>
    setOffset((prev) => Math.min(songs.length - 6, prev + 3));
  return (
    <div style={{ paddingLeft: "28px", overflow: "hidden" }}>
      <h1 className="carousel-title">{title}</h1>
      <div
        className="song-carousel-container"
        style={{ transform: `translate(-${offset * 200}px)` }}
      >
        <div className="song-carousel">
          {songs.map((song, idx) => (
            <div key={idx} className="song-card">
              <div style={{ width: "100%" }}>
                <img src={song.thumbnail} alt={song.title} />
                <p className="card-title">{song.title}</p>
                <p className="card-artist">{song.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={moveLeft}>-</button>
      <button onClick={moveRight}>+</button>
    </div>
  );
}
