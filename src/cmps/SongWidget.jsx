import { useSelector } from "react-redux";
import { addToCollectionIcon, checkmarkIcon } from "../services/icon.service";
import fallbackImage from "../assets/images/black_image.jpg";
import {
  addSongToLikedSongs,
  removeSongFromLikedSongs,
} from "../store/actions/userLibrary.action.js";

const onAddOrRemoveLikedSong = (userId, song, isSongInLibrary) => {
  if (!isSongInLibrary) {
    addSongToLikedSongs(userId, song);
  } else {
    removeSongFromLikedSongs(userId, song._id);
  }
};

export function SongWidget() {
  const song = useSelector((state) => state.songModule.songObj);
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const isSongInLibrary = likedSongs?.songs?.some((s) => s._id === song._id);
  const userId = likedSongs?.createdBy?._id;

  return (
    <div className="song-controls-container">
      <div>
        <img
          src={song.thumbnail || fallbackImage}
          alt="song widget photo"
        ></img>
      </div>
      <div className="song-description">
        <p className="widget-song-header">{song.title || "----------"}</p>
        <p className="widget-song-artist">{song.artist || "-------"}</p>
      </div>
      <div className="add-button-container">
        <button
          className={`add-button hov-enlarge ${
            isSongInLibrary ? "active" : ""
          }`}
          onClick={() => onAddOrRemoveLikedSong(userId, song, isSongInLibrary)}
        >
          <span className="size-16" aria-hidden="true">
            {isSongInLibrary
              ? checkmarkIcon({})
              : addToCollectionIcon({ fill: "#b0b0b0" })}
          </span>
        </button>
      </div>
    </div>
  );
}
