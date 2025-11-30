import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removePlaylist } from "../store/actions/playlist.action.js";
import { updateSongObject, togglePlaying } from "../store/actions/song.action";
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { ContextMenu, useContextMenu } from "./ContextMenu.jsx";
import {
  playIcon,
  pauseIcon,
  meatBallMenuIcon as moreOptionsIcon,
  copyIcon,
  addToQueueIcon,
  editDetailsIcon,
  deleteIcon,
  enableShuffleIcon,
  disableShuffleIcon,
} from "../services/icon.service.jsx";

export function PlaylistDetailsHeaderControlls({ playlist }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isShuffleEnabled = useSelector(
    (state) => state.playlistModule.isShuffleEnabled
  );
  const currentlyPlayingSong = useSelector((state) => state.songModule.songObj);
  const isNowPlaying = useSelector((state) => state.songModule.isPlaying);
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  function handlePlayPause() {
    if (currentlyPlayingSong._id === playlist.songs?.[0]?._id) {
      dispatch(togglePlaying());
    } else {
      // Set the new song and start playing in one action
      dispatch(updateSongObject(playlist.songs?.[0]));
      dispatch(togglePlaying());
    }
  }

  function onShowOptionsMenu(event) {
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

  async function onSharePlaylistURL() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showSuccessMsg("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      showErrorMsg("Failed to copy link");
    }
  }

  function onDeletePlaylist() {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      removePlaylist(playlist._id).then(() => {
        navigate("/");
      });
    }
  }

  // Define menu items for playlist options
  const playlistMenuItems = [
    {
      id: "add-to-queue",
      label: "Add to queue",
      icon: addToQueueIcon({}),
      onClick: () =>
        showSuccessMsg(
          "Added to queue (Not really, queue is not implemented yet...)"
        ),
    },
    { type: "separator" },
    {
      id: "edit",
      label: "Edit details",
      icon: editDetailsIcon({}),
      onClick: () =>
        showSuccessMsg("TBD - open edit playlist details modal..."),
    },
    {
      id: "delete",
      label: "Delete",
      icon: deleteIcon({}),
      danger: true,
      onClick: onDeletePlaylist,
    },
    { type: "separator" },

    {
      id: "share",
      label: "Copy link to playlist",
      icon: copyIcon({}),
      onClick: onSharePlaylistURL,
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
        {/* Enable/Disable Shuffle Button */}
        <button
          className="playlist-shuffle-btn"
          title={`${
            isShuffleEnabled ? "Disable Shuffle" : "Enable Shuffle"
          } for ${playlist.title}`}
          onClick={() =>
            showSuccessMsg(
              `Shuffle ${isShuffleEnabled ? "disabled" : "enabled"} for ${
                playlist.title
              } (TBD... shuffle functionality not implemented yet...)`
            )
          }
        >
          {isShuffleEnabled ? disableShuffleIcon({}) : enableShuffleIcon({})}
        </button>
        {/* More Options Button */}
        <button
          className="playlist-options-btn"
          title={`More options for ${playlist.title}`}
          onClick={onShowOptionsMenu}
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
