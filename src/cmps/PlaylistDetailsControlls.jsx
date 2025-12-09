import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removePlaylist } from "../store/actions/playlist.action.js";
import { togglePlaying } from "../store/actions/song.action";
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
  const isCurrentPlaylist = queueState?.playlistId === playlist._id;
  const isCurrentlyPlaying = isNowPlaying && isCurrentPlaylist;
  const isPlaylistInLibrary = libraryPlaylists?.some(
    (p) => p._id === playlist._id
  );
  const userId = likedSongs?.createdBy?._id;
  const isPlaylistOwnedByUser = userId === playlist.createdBy._id;

  function handlePlayPause() {
    // If it's already the current playlist (regardless of play state), just toggle
    if (isCurrentPlaylist) {
      dispatch(togglePlaying());
    } else {
      // Load this playlist and start playing
      dispatch(clearSongQueue());
      dispatch(setSongQueue([...playlist.songs]));
      dispatch(setPlaylistId(playlist._id));
      dispatch(togglePlaying());
    }
  }

  function onAddOrRemoveFromLibrary(
    userId,
    playlistId,
    isPlaylistOwnedByUser,
    isPlaylistInLibrary
  ) {
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

  const isPlaylistEditable =
    !playlist.isLikedSongs &&
    playlist.createdBy._id === likedSongs?.createdBy?._id;

  // Define menu items for playlist options
  const playlistMenuItems = [
    /*{
      id: "add-to-queue",
      label: "Add to queue",
      icon: addToQueueIcon({}),
      onClick: () =>
        showSuccessMsg(
          "Added to queue (Not really, queue is not implemented yet...)"
        ),
    },
    { type: "separator" },*/
    {
      id: "edit",
      label: "Edit details",
      icon: editDetailsIcon({}),
      onClick: onOpenModal,
      disabled: !isPlaylistEditable,
    },
    {
      id: "delete",
      label: "Delete",
      icon: deleteIcon({}),
      disabled: !isPlaylistEditable,
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
              onAddOrRemoveFromLibrary(
                userId,
                playlist._id,
                isPlaylistOwnedByUser,
                isPlaylistInLibrary
              );
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
        <button
          className="playlist-options-btn hov-enlarge"
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
