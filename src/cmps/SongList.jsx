import { useDispatch } from "react-redux";
import { updateCurrentSong, updateSongObject } from "../store/actions/song.action";

export function SongList({ songs }) {
  const dispatch = useDispatch();
  const changeToSong = (url, songObj) => {
    dispatch(updateCurrentSong(url));
    dispatch(updateSongObject(songObj));
  };

  return (
    <div className="song-list-container">
      {songs.map((pl, idx) => (
        <div key={idx} className="song-list-item">
          <img
            className="song-list-image"
            src={pl.thumbnail}
            alt={pl.title}
            onClick={() => changeToSong(pl.url, pl)}
          />
          <p className="song-list-title">{pl.title}</p>
        </div>
      ))}
    </div>
  );
}
