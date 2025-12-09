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
      <div style={{ width: "56px", height: "56px" }}>
        {song?.thumbnail ? (
          <img
            src={song.thumbnail || fallbackImage}
            alt="song widget photo"
          ></img>
        ) : (
          <img
            style={{ width: "56px", height: "56px" }}
            src="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%20viewBox='0%200%20200%20200'%3e%3crect%20width='200'%20height='200'%20fill='%23282828'/%3e%3cg%20transform='translate(100,%20100)'%3e%3cpath%20d='M-5%20-30v42.2c-2.36-1.36-5.08-2.2-8-2.2-8.84%200-16%207.16-16%2016s7.16%2016%2016%2016%2016-7.16%2016-16V-20h16v-10h-24z'%20fill='%23b3b3b3'/%3e%3c/g%3e%3c/svg%3e"
            alt="My Playlist #4"
          ></img>
        )}
      </div>
      <div className="song-description">
        <p className="widget-song-header">{song.title || ""}</p>
        <p className="widget-song-artist">{song.artist || ""}</p>
      </div>
      <div className="add-button-container">
        <button
          className={`add-button hov-enlarge ${
            isSongInLibrary ? "active" : ""
          }`}
          onClick={() => onAddOrRemoveLikedSong(userId, song, isSongInLibrary)}
          title={
            !isSongInLibrary
              ? "Add to Liked Songs"
              : "Remove from your Liked Songs"
          }
        >
          {song?.thumbnail ? (
            <span className="size-16" aria-hidden="true">
              {isSongInLibrary
                ? checkmarkIcon({ height: "16px", width: "16px" })
                : addToCollectionIcon({
                    height: "16px",
                    width: "16px",
                    fill: "#b0b0b0",
                  })}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
}
