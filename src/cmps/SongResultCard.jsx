import { formatTimeFromSecs } from "../services/util.service";
import { meatBallMenuIcon, pauseIcon } from "../services/icon.service";
import { playIcon } from "../services/icon.service";
import { useSongController } from "../customHooks/useSongController";

export function SongResultCard({ song }) {
  const { isCurrentSongPlaying, toggleSong } = useSongController(song);

  return (
    <div className="result-song-list-item">
      <div className="flex" style={{ width: "100%" }}>
        <div className="search-card-thumbnail-container">
          <img className="song-result-card-image" src={song?.thumbnail}></img>
          <button className="search-card-play-btn" onClick={toggleSong}>
            {isCurrentSongPlaying ? pauseIcon({}) : playIcon({})}
          </button>
        </div>
        <div className="song-result-card-text">
          <a className="song-result-card-title">{song?.title}</a>
          <a className="song-result-card-artist">{song?.artist}</a>
        </div>
      </div>
      <div className="song-result-options">
        <button className={`add-button hov-enlarge`}>
          <span className="size-16">{addToLikedIcon()}</span>
        </button>
        <p>{formatTimeFromSecs(song?.duration)}</p>
        <button className={`song-result-meatball-button hov-enlarge`}>
          <span className="size-24">{meatBallMenuIcon({})}</span>
        </button>
      </div>
    </div>
  );
}

function addToLikedIcon(addedToLiked = false) {
  if (addedToLiked) {
    return (
      <svg viewBox="0 0 16 16" fill="#1ed760">
        <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m11.748-1.97a.75.75 0 0 0-1.06-1.06l-4.47 4.47-1.405-1.406a.75.75 0 1 0-1.061 1.06l2.466 2.467 5.53-5.53z"></path>
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="#b0b0b0">
      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"></path>
      <path d="M11.75 8a.75.75 0 0 1-.75.75H8.75V11a.75.75 0 0 1-1.5 0V8.75H5a.75.75 0 0 1 0-1.5h2.25V5a.75.75 0 0 1 1.5 0v2.25H11a.75.75 0 0 1 .75.75"></path>
    </svg>
  );
}
