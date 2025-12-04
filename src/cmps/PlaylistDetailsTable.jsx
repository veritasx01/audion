import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateSongObject, togglePlaying } from "../store/actions/song.action";
import {
  addSong,
  removeSong,
  loadPlaylists,
} from "../store/actions/playlist.action.js";
import {
  ContextMenu,
  useContextMenu,
  calculateMenuPosition,
} from "./ContextMenu.jsx";
import {
  playIcon,
  pauseIcon,
  durationIcon,
  checkmarkIcon,
  meatBallMenuIcon as moreOptionsIcon,
  addIcon,
  removeIcon,
  addToCollectionIcon,
  nowPlayingBarChartIcon,
} from "../services/icon.service.jsx";
import { showSuccessMsg } from "../services/event-bus.service.js";

const ALL_COLUMNS = [
  { key: "album", label: "Album" },
  { key: "dateAdded", label: "Date Added" },
  { key: "duration", label: "Duration" },
];

export function PlaylistDetailsTable({ playlist, loadPlaylist }) {
  const dispatch = useDispatch();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedRow, setFocusedRow] = useState(null);
  const isPlaying = useSelector((store) => store.songModule.isPlaying);
  const playingSongId = useSelector((store) => store.songModule.songObj._id);
  const playlists = useSelector((store) => store.playlistModule.playlists);
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();

  const otherPlaylists = useMemo(
    () =>
      playlists
        .filter((pl) => pl._id !== playlist._id)
        .map((pl) => ({ _id: pl._id, title: pl.title, songs: pl.songs || [] })),
    [playlists, playlist._id]
  );

  // refresh library playlists when playlist changes (e.g., song added/removed)
  useEffect(() => {
    loadPlaylists();
  }, [playlist._id]);

  // Clear focused row when context menu closes
  useEffect(() => {
    if (!contextMenu.isVisible) {
      setFocusedRow(null);
    }
  }, [contextMenu.isVisible]);

  // Handle clicks outside table to clear focus
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Clear focus if clicking outside the table wrapper
      if (!e.target.closest(".playlist-table-wrapper")) {
        setFocusedRow(null);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  function setCurrentSong(song) {
    dispatch(updateSongObject(song));
  }

  function handleOnSongMoreOptionsClick(e, song) {
    e.preventDefault();
    const buttonRect = e.currentTarget.getBoundingClientRect(); // Get the button's position

    const { menuX, menuY } = calculateMenuPosition(buttonRect);

    const modifiedEvent = {
      ...e,
      clientX: menuX,
      clientY: menuY,
    };

    // Create menu items specific to the selected song
    const songMenuItems = [
      {
        id: "add-to-playlist",
        label: "Add to playlist",
        icon: addIcon({}),
        submenu: otherPlaylists
          .filter((pl) => !pl.songs?.some((s) => s._id === song._id)) // exclude playlists that already contain the song
          .map((otherPlaylist) => {
            return {
              id: `playlist-${otherPlaylist._id}`,
              label: otherPlaylist.title,
              onClick: () => {
                addSong(otherPlaylist._id, song).then(() => loadPlaylist());
                hideContextMenu();
              },
            };
          }),
      },
      { type: "separator" },
      {
        id: "remove-from-playlist",
        label: "Remove from this playlist",
        icon: removeIcon({}),
        onClick: () => {
          removeSong(playlist._id, song._id).then(() => loadPlaylist());
          hideContextMenu();
        },
      },
      {
        id: "add-to-liked-songs",
        label: "Save to Your Liked Songs",
        icon: addToCollectionIcon({}),
        onClick: () => {
          //onAddSong(playlist._id, song._id).then(() => loadPlaylist());
          showSuccessMsg("To be implemented...");
          hideContextMenu();
        },
      },
    ];

    showContextMenu(modifiedEvent, songMenuItems);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatSongDuration(totalSeconds) {
    if (!totalSeconds) return "";
    const minutes = Math.floor(totalSeconds / 60);
    const secondsRemainder = totalSeconds % 60;
    return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}`;
  }

  return (
    <div className="playlist-table-wrapper">
      <table className="playlist-table">
        <thead>
          <tr>
            <th className="song-number-col">#</th>
            <th className="playlist-song-title">Title</th>
            <th className="playlist-song-album">Album</th>
            <th className="playlist-song-date-added">Date Added</th>
            <th className="playlist-song-add-action"></th>
            <th className="playlist-song-duration" title="Duration">
              {durationIcon({})}
            </th>
            <th className="playlist-song-actions"></th>
          </tr>
        </thead>
        <tbody>
          {playlist.songs.map((song, idx) => (
            <tr
              key={song._id}
              className={`${hoveredRow === idx ? "hovered" : ""} ${
                focusedRow === idx ? "focused" : ""
              }`.trim()}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
              onClick={(e) => {
                setFocusedRow(idx);
              }}
            >
              <td className={"song-number-col"} key="num">
                {hoveredRow === idx ? (
                  playingSongId === song._id && isPlaying ? (
                    <button
                      className="song-play-pause-btn"
                      onClick={() => dispatch(togglePlaying())}
                      title="Pause"
                    >
                      {pauseIcon({})}
                    </button>
                  ) : (
                    <button
                      className="song-play-pause-btn"
                      onClick={() => {
                        if (playingSongId === song._id && !isPlaying) {
                          dispatch(togglePlaying());
                        } else {
                          setCurrentSong(song);
                        }
                      }}
                      title="Play"
                    >
                      {playIcon({})}
                    </button>
                  )
                ) : playingSongId === song._id && isPlaying ? (
                  <span className="now-playing-animation" title="Now Playing">
                    {nowPlayingBarChartIcon({})}
                  </span>
                ) : (
                  <span
                    className={`song-number-col ${
                      playingSongId === song._id ? "active" : ""
                    }`}
                  >
                    {idx + 1}
                  </span>
                )}
              </td>
              <td className="playlist-song-title" key="title">
                <div className="playlist-title-content">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="playlist-song-thumb"
                  />
                  <div className="playlist-song-text">
                    <span
                      className={`playlist-song-title ${
                        playingSongId === song._id ? "active" : ""
                      }`}
                    >
                      {song.title}
                    </span>
                    <span className="playlist-song-artist">{song.artist}</span>
                  </div>
                </div>
              </td>
              <td key="album">
                <div className="playlist-song-album">{song.albumName}</div>
              </td>
              <td key="dateAdded">
                <div className="playlist-song-date-added">
                  {song.addedAt ? formatDate(song.addedAt) : ""}
                </div>
              </td>

              <td className="playlist-song-add-action" key="add-action">
                <button
                  className="add-btn"
                  title="Save to your Liked Songs"
                  onClick={(e) => {
                    e.preventDefault();
                    setFocusedRow(idx);
                    showSuccessMsg("To be implemented...");
                  }}
                >
                  {checkmarkIcon({})}
                </button>
              </td>
              <td className="playlist-song-duration" key="duration">
                {song.duration ? formatSongDuration(song.duration) : ""}
              </td>
              <td className="playlist-table-actions" key="actions">
                <div className="playlist-row-actions">
                  <button
                    className="menu-btn"
                    title={`More options for ${song.title} by ${song.artist}`}
                    onClick={(e) => {
                      setFocusedRow(idx);
                      handleOnSongMoreOptionsClick(e, song);
                    }}
                  >
                    {moreOptionsIcon({ height: 28, width: 28 })}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.isVisible}
        position={contextMenu.position}
        onClose={hideContextMenu}
        menuItems={contextMenu.items}
      />
    </div>
  );
}
