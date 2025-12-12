import { useDispatch, useSelector } from "react-redux";
import { pauseIcon, playIcon } from "../services/icon.service";
import { useNavigate } from "react-router-dom";
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
} from "../store/actions/songQueue.action";
import { setPlaying, togglePlaying } from "../store/actions/song.action";

export function SongCard({ playlist }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const song = playlist.songs[0];
  const playlistId = useSelector((state) => state.songQueueModule.playlistId);
  //const goToPlaylist = () => {};

  const handlePlayPause = (e) => {
    e.stopPropagation();
    // If it's already the current playlist (regardless of play state), just toggle
    if (playlist._id !== playlistId) {
      // Load this playlist and start playing
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...playlist.songs]));
      dispatch(setPlaylistId(playlist._id));
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  };

  function goToPlaylistPage() {
    if (!playlist._id || playlist._id === "") return;
    navigate(`playlist/${playlist._id}`);
  }

  return (
    <div className="song-card" onClick={goToPlaylistPage}>
      <button className="play-button-carousel" onClick={handlePlayPause}>
        <span className="size-48">
          {playlistId === playlist._id
            ? pauseIcon({ height: "24px", width: "24px", fill: "black" })
            : playIcon({ height: "24px", width: "24px", fill: "black" })}
        </span>
      </button>
      <div style={{ width: "100%" }}>
        <img src={song?.thumbnail} alt={song?.title} />
        <p className="card-title">{song?.title}</p>
        <p className="card-artist">{song?.artist}</p>
      </div>
    </div>
  );
}
