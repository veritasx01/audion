import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removePlaylist } from "../store/actions/playlist.action.js";
import {
  playIcon,
  pauseIcon,
  meatBallMenuIcon as moreOptionsIcon,
} from "../services/icon.service.jsx";

import { updateSongObject, togglePlaying } from "../store/actions/song.action";

export function PlaylistDetailsHeaderControlls({ playlist }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [headerMenu, setHeaderMenu] = useState({ visible: false, x: 0, y: 0 });
  const currentlyPlayingSong = useSelector((state) => state.songModule.songObj);
  const isNowPlaying = useSelector((state) => state.songModule.isPlaying);

  function handlePlayPause() {
    if (currentlyPlayingSong._id === playlist.songs?.[0]?._id) {
      dispatch(togglePlaying());
    } else {
      dispatch(updateSongObject(playlist.songs?.[0]));
    }
  }

  return (
    <section className="playlist-controls">
      <div className="controls-primary">
        {/* Play/Pause Button */}
        <button
          className="playlist-play-pause-btn"
          title={`${isNowPlaying ? "Pause" : "Play"} ${playlist.title}`}
          onClick={() => handlePlayPause()}
        >
          {isNowPlaying && currentlyPlayingSong._id === playlist.songs?.[0]?._id
            ? pauseIcon({})
            : playIcon({})}
        </button>
        {/* More Options Button */}
        <button
          className="playlist-options-btn"
          title={`More options for ${playlist.title}`}
          onClick={(e) => {
            // Show a header context menu at the button position
          }}
        >
          {moreOptionsIcon({})}
        </button>
      </div>
      {/* Header Context Menu */}
      {headerMenu.visible && (
        <ul
          className="playlist-header-context-menu"
          style={{
            position: "fixed",
            top: headerMenu.y,
            left: headerMenu.x,
            zIndex: 2100,
            minWidth: "160px",
          }}
          onMouseLeave={() => setHeaderMenu({ ...headerMenu, visible: false })}
        >
          <li
            onClick={() => {
              setHeaderMenu({ ...headerMenu, visible: false });
              if (
                window.confirm("Are you sure you want to delete this playlist?")
              ) {
                removePlaylist(playlist._id).then(() => {
                  navigate("/");
                });
              }
            }}
          >
            Delete Playlist
          </li>
        </ul>
      )}
    </section>
  );
}
