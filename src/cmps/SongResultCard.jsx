import { useSelector } from "react-redux";
import { formatTimeFromSecs } from "../services/util.service";
import { meatBallMenuIcon, pauseIcon } from "../services/icon.service";
import { playIcon } from "../services/icon.service";
import { useSongController } from "../customHooks/useSongController";
import {
  addSongToLikedSongs,
  removeSongFromLikedSongs,
} from "../store/actions/userLibrary.action.js";
import { addToCollectionIcon, checkmarkIcon } from "../services/icon.service";

export function SongResultCard({ song }) {
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const isSongInLibrary = likedSongs?.songs?.some((s) => s._id === song._id);
  const userId = likedSongs?.createdBy?._id;
  const { isCurrentSongPlaying, toggleSong } = useSongController(song);

  const onAddOrRemoveLikedSong = (userId, song, isSongInLibrary) => {
    if (!isSongInLibrary) {
      addSongToLikedSongs(userId, song);
    } else {
      removeSongFromLikedSongs(userId, song._id);
    }
  };

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
        <button
          className={`add-button hov-enlarge ${
            isSongInLibrary ? "active" : ""
          }`}
          style={{ marginRight: "16px" }}
          onClick={() => onAddOrRemoveLikedSong(userId, song, isSongInLibrary)}
        >
          <span className="size-16">
            {isSongInLibrary
              ? checkmarkIcon({ height: "16px", width: "16px" })
              : addToCollectionIcon({
                  height: "16px",
                  width: "16px",
                  fill: "#b0b0b0",
                })}
          </span>
        </button>
        <p>{formatTimeFromSecs(song?.duration)}</p>
        <button className={`song-result-meatball-button hov-enlarge`}>
          <span className="size-24">{meatBallMenuIcon({})}</span>
        </button>
      </div>
    </div>
  );
}
