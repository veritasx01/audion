import { useState } from "react";
import { useSelector } from "react-redux";
import { addToCollectionIcon, checkmarkIcon } from "../services/icon.service";
import {
  addSongToLikedSongs,
  removeSongFromLikedSongs,
} from "../store/actions/userLibrary.action.js";
import fallbackImage from "../assets/images/black_image.jpg";

const onAddOrRemoveLikedSong = (userId, song, isSongInLibrary) => {
  if (!isSongInLibrary) {
    addSongToLikedSongs(userId, song);
  } else {
    removeSongFromLikedSongs(userId, song._id);
  }
};

export function NowPlayingDetails({ songObj: song }) {
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const isSongInLibrary = likedSongs?.songs?.some((s) => s._id === song._id);
  const userId = likedSongs?.createdBy?._id;
  return (
    <div className="now-playing-details-container">
      <img
        className="now-playing-image"
        src={song?.thumbnail || fallbackImage}
      ></img>
      <div style={{ position: "relative" }}>
        <p className="now-playing-title">{song?.title}</p>
        <p className="now-playing-artist">{song?.artist}</p>
        <button
          className={`now-playing-add-button hov-enlarge ${
            isSongInLibrary ? "active" : ""
          }`}
          onClick={() => onAddOrRemoveLikedSong(userId, song, isSongInLibrary)}
          title={
            !isSongInLibrary
              ? "Add to Liked Songs"
              : "Remove from your Liked Songs"
          }
        >
          <span className="size-24">
            {isSongInLibrary
              ? checkmarkIcon({})
              : addToCollectionIcon({ fill: "#b2b2b2" })}
          </span>
        </button>
      </div>
    </div>
  );
}
