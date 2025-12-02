import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { togglePlaying } from "../store/actions/song.action";
import { ContextMenu, useContextMenu } from "./ContextMenu.jsx";
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

const ALL_COLUMNS = [
  { key: "album", label: "Album" },
  { key: "dateAdded", label: "Date Added" },
  { key: "duration", label: "Duration" },
];

export function PlaylistDetailsTable({
  playlist,
  playingSongId,
  isPlaying,
  setCurrentSong,
  onRemoveSong,
  onAddSong,
  otherPlaylists,
  loadPlaylist,
}) {
  const dispatch = useDispatch();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [focusedRow, setFocusedRow] = useState(null);
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.map((c) => c.key)
  );
  const [playlistDropdown, setPlaylistDropdown] = useState({
    visible: false,
    x: 0,
    y: 0,
    song: null,
  });

  // Clear focused row when context menu or dropdown closes
  useEffect(() => {
    if (!contextMenu.isVisible && !playlistDropdown.visible) {
      setFocusedRow(null);
    }
  }, [contextMenu.isVisible, playlistDropdown.visible]);

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

  function toggleColumns(columnKey) {
    setVisibleColumns((columns) =>
      columns.includes(columnKey)
        ? columns.filter((c) => c !== columnKey)
        : [...columns, columnKey]
    );
  }

  function handleOnSongMoreOptionsClick(e, song) {
    e.preventDefault();
    const buttonRect = e.currentTarget.getBoundingClientRect(); // Get the button's position

    // adjust menu location to the top-left of the button
    const modifiedEvent = {
      ...e,
      clientX: buttonRect.left - 140,
      clientY: buttonRect.top - 140,
    };

    // Create menu items specific to the selected song
    const songMenuItems = [
      {
        id: "add-to-playlist",
        label: "Add to playlist",
        icon: addIcon({}),
        submenu: otherPlaylists.map((otherPlaylist) => {
          const playlistName =
            otherPlaylist.name ||
            otherPlaylist.title ||
            `Playlist ${otherPlaylist._id}`;
          return {
            id: `playlist-${otherPlaylist._id}`,
            label: playlistName,
            onClick: () => {
              onAddSong(otherPlaylist._id, song).then(() => loadPlaylist());
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
          onRemoveSong(playlist._id, song._id).then(() => loadPlaylist());
          hideContextMenu();
        },
      },
      {
        id: "add-to-liked-songs",
        label: "Save to Your Liked Songs",
        icon: addToCollectionIcon({}),
        onClick: () => {
          onAddSong(playlist._id, song._id).then(() => loadPlaylist());
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
              {visibleColumns.includes("album") ? (
                <td key="album">
                  <div className="playlist-song-album">{song.albumName}</div>
                </td>
              ) : null}
              {visibleColumns.includes("dateAdded") ? (
                <td key="dateAdded">
                  <div className="playlist-song-date-added">
                    {song.addedAt ? formatDate(song.addedAt) : ""}
                  </div>
                </td>
              ) : null}

              <td className="playlist-song-add-action" key="add-action">
                <button
                  className="add-btn"
                  title="Add to playlist"
                  onClick={(e) => {
                    e.preventDefault();
                    setFocusedRow(idx);
                    // Position the dropdown near the button
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPlaylistDropdown({
                      visible: true,
                      x: rect.left - 150, // or rect.left, adjust as needed
                      y: rect.bottom, // or rect.bottom
                      song,
                    });
                  }}
                >
                  {checkmarkIcon({})}
                </button>
              </td>
              {visibleColumns.includes("duration") ? (
                <td className="playlist-song-duration" key="duration">
                  {song.duration ? formatSongDuration(song.duration) : ""}
                </td>
              ) : null}
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
