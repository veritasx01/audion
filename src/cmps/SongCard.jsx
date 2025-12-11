import { useSongController } from "../customHooks/useSongController";
import { pauseIcon, playIcon } from "../services/icon.service";
import { useNavigate } from "react-router-dom";

export function SongCard({ playlist }) {
  const navigate = useNavigate();
  const song = playlist.songs[0];
  //const goToPlaylist = () => {};

  const { isCurrentSongPlaying, toggleSong } = useSongController(song);

  const handlePlayButtonClick = (e) => {
    e.stopPropagation();
    toggleSong(song);
  };

  function goToPlaylistPage() {
    if (!playlist._id || playlist._id === "") return;
    navigate(`playlist/${playlist._id}`);
  }

  return (
    <div className="song-card" onClick={goToPlaylistPage}>
      <button className="play-button-carousel" onClick={handlePlayButtonClick}>
        <span className="size-48">
          {isCurrentSongPlaying
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
