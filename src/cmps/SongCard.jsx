import { useSongController } from "../customHooks/useSongController";
import { pauseIcon, playIcon } from "../services/icon.service";

export function SongCard({ playlist }) {
  const song = playlist.songs[0];
  //const goToPlaylist = () => {};

  const { isCurrentSongPlaying, toggleSong } = useSongController(song);

  return (
    <div className="song-card">
      <button className="play-button-carousel" onClick={() => toggleSong(song)}>
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
