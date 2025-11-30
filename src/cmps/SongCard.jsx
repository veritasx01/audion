export function SongCard({ song, changeToSong }) {
  return (
    <div className="song-card">
      <div
        style={{ width: "100%" }}
        onClick={() => changeToSong(song)}
      >
        <img src={song.thumbnail} alt={song.title} />
        <p className="card-title">{song.title}</p>
        <p className="card-artist">{song.artist}</p>
      </div>
    </div>
  );
}
