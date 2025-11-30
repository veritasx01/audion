import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { removePlaylist } from "../store/actions/playlist.action.js";
import playIcon from "../assets/icons/play.svg";
import moreOptionsIcon from "../assets/icons/meatball-menu.svg";

export function PlaylistDetailsHeaderControlls() {
  const [headerMenu, setHeaderMenu] = useState({ visible: false, x: 0, y: 0 });

  return (
    <section className="playlist-controls">
      <div className="controls-primary">
        <button className="playlist-play-pause-btn">
          <img src={playIcon} alt="Play" />
        </button>
        <button
          className="playlist-options-btn"
          title="More options"
          onClick={(e) => {
            // Show a header context menu at the button position
          }}
        >
          <img src={moreOptionsIcon} alt="More" />
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
