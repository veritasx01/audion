import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removePlaylist } from "../store/actions/playlist.action.js";
import { updateSongObject, togglePlaying } from "../store/actions/song.action";
import { showSuccessMsg } from "../services/event-bus.service.js";
import { ContextMenu, useContextMenu } from "./ContextMenu.jsx";
import {
  playIcon,
  pauseIcon,
  meatBallMenuIcon as moreOptionsIcon,
} from "../services/icon.service.jsx";

export function PlaylistDetailsHeaderControlls({ playlist }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentlyPlayingSong = useSelector((state) => state.songModule.songObj);
  const isNowPlaying = useSelector((state) => state.songModule.isPlaying);
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  function handlePlayPause() {
    if (currentlyPlayingSong._id === playlist.songs?.[0]?._id) {
      dispatch(togglePlaying());
    } else {
      dispatch(updateSongObject(playlist.songs?.[0]));
    }
  }

  function showOptionsMenu(event) {
    // Get the button's position
    const buttonRect = event.currentTarget.getBoundingClientRect();

    // Create a modified event with button position
    const modifiedEvent = {
      ...event,
      clientX: buttonRect.left + 14,
      clientY: buttonRect.bottom,
    };

    showContextMenu(modifiedEvent, playlistMenuItems);
  }

  async function sharePlaylistURL() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccessMsg("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy URL: ", err);
    }
  }

  // Define menu items for playlist options
  const playlistMenuItems = [
    {
      id: "share",
      label: "Share",
      onClick: sharePlaylistURL,
    },
    {
      id: "copy-link",
      label: "Copy playlist link",
      onClick: () => console.log("Copy link"),
    },
    { type: "separator" },
    {
      id: "edit",
      label: "Edit details",
      onClick: () => console.log("Edit playlist"),
    },
    { type: "separator" },
    {
      id: "delete",
      label: "Delete",
      danger: true,
      onClick: () => {
        if (window.confirm("Are you sure you want to delete this playlist?")) {
          removePlaylist(playlist._id).then(() => {
            navigate("/");
          });
        }
      },
    },
  ];

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
          onClick={showOptionsMenu}
        >
          {moreOptionsIcon({})}
        </button>
      </div>
      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        onClose={hideContextMenu}
        menuItems={contextMenu.items}
      />
    </section>
  );
}
