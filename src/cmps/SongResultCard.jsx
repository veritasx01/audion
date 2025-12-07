
export function SongResultCard({ song }) {
  console.log("song:", song)
  return (
    <div className="result-song-list-item">
      <div className="flex">
        <img className="song-result-card-image" src={song?.thumbnail}></img>
        <div className="song-result-card-text">
          <a className="song-result-card-title">{song?.title}</a>
          <a className="song-result-card-artist">{song?.artist}</a>
        </div>
      </div>
    </div>
  );
}
