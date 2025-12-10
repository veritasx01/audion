import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addPlaylist,
  removePlaylist,
} from "../store/actions/playlist.action.js";
import { setPlaying, togglePlaying } from "../store/actions/song.action";
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
  addToCollectionIcon,
  checkmarkIcon,
} from "../services/icon.service.jsx";
import {
  addPlaylistToLibrary,
  removePlaylistFromLibrary,
} from "../store/actions/userLibrary.action.js";
import {
  clearSongQueue,
  setPlaylistId,
  setSongQueue,
  toggleShuffle,
} from "../store/actions/songQueue.action.js";
import { arraysEqual } from "../services/util.service.js";

export function PlaylistDetailsHeaderControlls({ playlist, onOpenModal }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isShuffleEnabled = useSelector(
    (state) => state.songQueueModule.isShuffle
  );
  const isNowPlaying = useSelector((state) => state.songModule.isPlaying);
  const queueState = useSelector((state) => state.songQueueModule);
  const likedSongs = useSelector((state) => state.userLibraryModule.likedSongs);
  const libraryPlaylists = useSelector(
    (state) => state.userLibraryModule.playlists
  );
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const userId = likedSongs?.createdBy?._id;
  const playlistId = playlist?._id;
  const isCurrentPlaylist = queueState?.playlistId === playlistId;
  const isCurrentlyPlaying = isNowPlaying && isCurrentPlaylist;
  const isPlaylistOwnedByUser = userId === playlist.createdBy._id;
  const isPlaylistInLibrary = libraryPlaylists?.some(
    (p) => p._id === playlistId
  );

  function handlePlayPause() {
    // If it's already the current playlist (regardless of play state), just toggle
    if (!isCurrentPlaylist) {
      // Load this playlist and start playing
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...playlist.songs]));
      dispatch(setPlaylistId(playlistId));
      dispatch(setPlaying(true));
    } else {
      dispatch(togglePlaying());
    }
  }

  function onAddOrRemoveFromLibrary() {
    if (isPlaylistOwnedByUser) return; // Prevent adding/removing own playlist
    if (!isPlaylistInLibrary) {
      addPlaylistToLibrary(userId, playlistId);
    } else {
      removePlaylistFromLibrary(userId, playlistId);
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

    showContextMenu(modifiedEvent, getPlaylistMenuItems());
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
      removePlaylist(playlistId).then(() => {
        navigate("/");
      });
    }
  }

  const isPlaylistEditable = isPlaylistOwnedByUser && !playlist.isLikedSongs;

  const getPlaylistMenuItems = () => {
    // Define menu items for playlist options
    const menuItems = [];

    // Add playlist to library option if not owned by user and not already in library
    if (!isPlaylistOwnedByUser && !isPlaylistInLibrary) {
      menuItems.push({
        id: "add-to-library",
        label: "Add to Your Library",
        icon: addToCollectionIcon({}),
        onClick: () => addPlaylistToLibrary(userId, playlistId),
      });
    }

    // Remove playlist from library option if not owned by user and is in library
    if (!isPlaylistOwnedByUser && isPlaylistInLibrary) {
      menuItems.push({
        id: "remove-from-library",
        label: "Remove from Your Library",
        icon: checkmarkIcon({ fill: "var(--text-bright-accent)" }),
        onClick: () => removePlaylistFromLibrary(userId, playlistId),
      });
    }

    // Edit and Delete options if playlist is editable
    if (isPlaylistEditable) {
      menuItems.push({
        id: "edit",
        label: "Edit details",
        icon: editDetailsIcon({}),
        onClick: onOpenModal,
      });
      menuItems.push({
        id: "delete",
        label: "Delete",
        icon: deleteIcon({}),
        danger: true,
        onClick: onDeletePlaylist,
      });
    }

    if (menuItems.length > 0) menuItems.push({ type: "separator" });

    menuItems.push({
      id: "share",
      label: "Copy link to playlist",
      icon: copyIcon({}),
      onClick: onSharePlaylistURL,
    });

    return menuItems;
  };

  const isPlaylistEmpty = !playlist.songs || playlist.songs?.length === 0;

  return (
    <section className="playlist-controls">
      <div className="controls-primary">
        {/* Play/Pause Button */}
        {!isPlaylistEmpty && (
          <button
            className={"playlist-play-pause-btn hov-enlarge"}
            title={`${isCurrentlyPlaying ? "Pause" : "Play"} ${playlist.title}`}
            onClick={() => handlePlayPause()}
          >
            {isCurrentlyPlaying ? pauseIcon({}) : playIcon({})}
          </button>
        )}
        {/* Enable/Disable Shuffle Button */}
        {!isPlaylistEmpty && (
          <button
            className={`playlist-shuffle-btn hov-enlarge ${
              isShuffleEnabled ? "green-button" : ""
            }`}
            title={`${
              isShuffleEnabled ? "Disable Shuffle" : "Enable Shuffle"
            } for ${playlist.title}`}
            onClick={() => {
              dispatch(toggleShuffle());
              showSuccessMsg(
                `Shuffle ${isShuffleEnabled ? "disabled" : "enabled"} for ${
                  playlist.title
                }`
              );
            }}
          >
            {enableShuffleIcon({})}
          </button>
        )}
        {/* Add/Remove from Library Button */}
        {!isPlaylistOwnedByUser && (
          <button
            className={"playlist-library-btn hov-enlarge"}
            onClick={() => {
              onAddOrRemoveFromLibrary();
            }}
            title={
              isPlaylistInLibrary
                ? `Remove from Your Library`
                : `Add to Your Library`
            }
          >
            <span className="size-32">
              {isPlaylistInLibrary
                ? checkmarkIcon({ height: 32, width: 32 })
                : addToCollectionIcon({
                    height: 32,
                    width: 32,
                  })}
            </span>
          </button>
        )}
        {/* More Options Button */}
        {!(playlistId === likedSongs?._id) && (
          <button
            className="playlist-options-btn hov-enlarge"
            title={`More options for ${playlist.title}`}
            onClick={(e) => onShowOptionsMenu(e, playlist)}
          >
            {moreOptionsIcon({})}
          </button>
        )}
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
