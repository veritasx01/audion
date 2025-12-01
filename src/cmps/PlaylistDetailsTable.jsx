import { useState } from "react";
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
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
        onClick: () => {
          // Position the dropdown near where the context menu was
          setPlaylistDropdown({
            visible: true,
            x: contextMenu.position.x - 150,
            y: contextMenu.position.y,
            song,
          });
          hideContextMenu();
        },
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
          onRemoveSong(playlist._id, song._id).then(() => loadPlaylist());
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
            <th className="playlist-song-duration" title="Duration">
              {durationIcon({})}
            </th>
          </tr>
        </thead>
        <tbody>
          {playlist.songs.map((song, idx) => (
            <tr
              key={song._id}
              className={hoveredRow === idx ? "hovered" : ""}
              onMouseEnter={() => setHoveredRow(idx)}
              onMouseLeave={() => setHoveredRow(null)}
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
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <rect
                        className="bar bar1"
                        x="3"
                        y="6"
                        width="3"
                        height="8"
                        rx="1"
                      />
                      <rect
                        className="bar bar2"
                        x="9"
                        y="3"
                        width="3"
                        height="14"
                        rx="1"
                      />
                      <rect
                        className="bar bar3"
                        x="15"
                        y="8"
                        width="3"
                        height="6"
                        rx="1"
                      />
                    </svg>
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
                  <div className="song-text">
                    <span
                      className={`playlist-song-title ${
                        playingSongId === song._id ? "active" : ""
                      }`}
                    >
                      {song.title}
                    </span>
                    <span className="song-artist">{song.artist}</span>
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

              {visibleColumns.includes("duration") ? (
                <td key="duration">
                  {song.duration ? formatSongDuration(song.duration) : ""}
                </td>
              ) : null}
              <td className="playlist-table-actions" key="add-action">
                <button
                  className="add-btn"
                  title="Add to playlist"
                  onClick={(e) => {
                    e.preventDefault();
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
              <td className="playlist-table-actions" key="actions">
                <div className="playlist-row-actions">
                  <button
                    className="menu-btn"
                    title={`More options for ${song.title} by ${song.artist}`}
                    onClick={(e) => handleOnSongMoreOptionsClick(e, song)}
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

      {/* Playlist Dropdown for adding a song to a playlist*/}
      {playlistDropdown.visible && (
        <ul
          className="playlist-dropdown-menu"
          style={{
            position: "fixed",
            top: playlistDropdown.y,
            left: playlistDropdown.x,
            zIndex: 2100,
            minWidth: "200px",
          }}
          onMouseLeave={() =>
            setPlaylistDropdown({ ...playlistDropdown, visible: false })
          }
        >
          {otherPlaylists.map((playlist) => (
            <li
              key={playlist._id}
              onClick={() => {
                onAddSong(playlist._id, playlistDropdown.song);
                setPlaylistDropdown({ ...playlistDropdown, visible: false });
              }}
            >
              {playlist.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
