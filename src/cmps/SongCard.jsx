export function SongCard({ song, changeToSong }) {
  return (
    <div className="song-card">
      <button className="play-button-carousel" onClick={() => changeToSong(song)}>
        <span className="size-48">{playIcon()}</span>
      </button>
      <div style={{ width: "100%" }} onClick={() => changeToSong(song)}>
        <img src={song.thumbnail} alt={song.title} />
        <p className="card-title">{song.title}</p>
        <p className="card-artist">{song.artist}</p>
      </div>
    </div>
  );
}

function playIcon() {
  return (
    <svg className="size-24" viewBox="0 0 24 24" fill="#000">
      <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606"></path>
    </svg>
  );
}
