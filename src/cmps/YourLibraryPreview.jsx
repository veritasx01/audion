import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { playIcon, pauseIcon } from "../services/icon.service.jsx";
import { arraysEqual } from "../services/util.service.js";
import { togglePlaying } from "../store/actions/song.action";
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
  toggleShuffle,
} from "../store/actions/songQueue.action.js";

export function YourLibraryPreview({
  _id,
  title,
  type: itemType, // playlist, artist, album, etc.
  createdBy,
  thumbnail,
  songs,
  isCollapsed,
}) {
  const dispatch = useDispatch();
  const isNowPlaying = useSelector((state) => state.songModule.isPlaying);
  const queueState = useSelector((state) => state.songQueueModule);

  const isCurrentPlaylist = queueState?.playlistId === _id;
  const isCurrentlyPlaying = isNowPlaying && isCurrentPlaylist;

  function handlePlayPause() {
    // If it's already the current playlist (regardless of play state), just toggle
    if (isCurrentPlaylist) {
      dispatch(togglePlaying());
    } else if (songs?.length > 0) {
      // Load this playlist and start playing
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...songs]));
      dispatch(setPlaylistId(_id));
      dispatch(togglePlaying());
    }
  }

  return (
    <div className={`your-library-preview${isCollapsed ? " collapsed" : ""}`}>
      <Link to={`/${itemType}/${_id}`} className="your-library-preview-link">
        <div className="your-library-thumbnail-container">
          <img
            src={thumbnail}
            alt={`${title} thumbnail`}
            className={`your-library-thumbnail${
              isCollapsed ? " collapsed" : ""
            }`}
          />
          {!isCollapsed && itemType === "Playlist" && (
            <button
              className="your-library-play-btn"
              onClick={handlePlayPause}
              title={`${isCurrentlyPlaying ? "Pause" : "Play"} ${title}`}
            >
              {isCurrentlyPlaying ? pauseIcon({}) : playIcon({})}
            </button>
          )}
        </div>
        {!isCollapsed && (
          <div className="your-library-info">
            <h4 className="your-library-title">{title}</h4>
            <p className="your-library-meta">
              {itemType} • {createdBy}
            </p>
          </div>
        )}
      </Link>
    </div>
  );
}
