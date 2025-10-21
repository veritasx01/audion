import { useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { playlistService } from "../services/playlist.service";
import {
  addSong,
  removeSong,
  updatePlaylistDetails,
} from "../store/actions/playlist.action.js";
import playIcon from "../assets/icons/play.svg";
import checkmarkIcon from "../assets/icons/checkmark.svg";
import moreOptionsIcon from "../assets/icons/meatball-menu.svg";

const ALL_COLUMNS = [
  { key: "album", label: "Album" },
  { key: "dateAdded", label: "Date Added" },
  { key: "duration", label: "Duration" },
];

export function PlaylistDetails({ onAddSong, onRemoveSong }) {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const otherPlaylists = useSelector((store) =>
    store.playlistModule.playlists
      .filter((pl) => pl._id !== playlistId)
      .map((pl) => ({ _id: pl._id, title: pl.title }))
  );

  const [hoveredRow, setHoveredRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    song: null,
  });
  const [playlistDropdown, setPlaylistDropdown] = useState({
    visible: false,
    x: 0,
    y: 0,
    song: null,
  });
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.map((c) => c.key)
  );

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  if (!playlist) return <div>Loading...</div>;

  function loadPlaylist() {
    playlistService
      .getById(playlistId)
      .then(setPlaylist)
      .catch((err) => {
        console.error("Error loading playlist to playlist details:", err);
        navigate("/");
      });
  }

  function toggleColumns(columnKey) {
    setVisibleColumns((columns) =>
      columns.includes(columnKey)
        ? columns.filter((c) => c !== columnKey)
        : [...columns, columnKey]
    );
  }

  function handleOnSongMoreOptionsClick(e, song) {
    e.preventDefault();
    const menuWidth = 180; // should match with CSS min-width
    const menuHeight = 90;
    let x = e.clientX;
    let y = e.clientY;

    // Adjust if menu would overflow right
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    // Adjust if menu would overflow bottom
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }
    setContextMenu({
      visible: true,
      x,
      y,
      song,
    });
  }

  function formatSongDuration(totalSeconds) {
    if (!totalSeconds) return "";
    const minutes = Math.floor(totalSeconds / 60);
    const secondsRemainder = totalSeconds % 60;
    return `${minutes}:${secondsRemainder.toString().padStart(2, "0")}`;
  }

  function formatPlaylistDuration() {
    const totalDurationSeconds = playlist.songs.reduce(
      (acc, song) => acc + song.duration,
      0
    );
    const hours = Math.floor(totalDurationSeconds / 3600);
    const minutes = Math.floor((totalDurationSeconds % 3600) / 60);
    const seconds = totalDurationSeconds % 60;
    const hoursStr = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""} ` : "";
    const minutesStr = minutes > 0 ? `${minutes} min ` : "";
    const secondsStr = seconds > 0 ? `${seconds} sec` : "";
    return `${hoursStr}${minutesStr}${secondsStr}`.trim();
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="playlist-details">
      {/* Background Blur Setup // TODO: replace with Gradient */}
      <div
        className="playlist-bg"
        style={{
          background: `url(${playlist.thumbnail}) center/cover no-repeat`,
        }}
      />

      {/* Playlist Header Section */}
      <div className="playlist-header">
        <img
          className="playlist-cover"
          src={playlist.thumbnail}
          alt={playlist.title}
        />
        <div className="playlist-meta">
          {/* Playlist Title and Description */}
          <button
            className="playlist-title-btn"
            onClick={() => setShowEditModal(true)}
            title="Edit playlist details"
          >
            {playlist.title}
          </button>
          <h3>{playlist.description}</h3>

          {/* creator, # of songs and duration */}
          <p>
            {playlist.createdBy}
            {playlist.songs.length > 0 && (
              <span>
                {" • "}
                {playlist.songs.length}{" "}
                {playlist.songs.length > 1 ? "songs" : "song"},{" "}
                {formatPlaylistDuration()}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <section className="playlist-controls">
        <div className="playlist-controls-buttons">
          <button className="spotify-play-pause-btn">
            <img src={playIcon} alt="Play" />
          </button>
          <button
            className="menu-btn"
            title={`More options for ${playlist.title}`}
          >
            <img src={moreOptionsIcon} alt="More" />
          </button>
        </div>
        <div className="playlist-cols-toggle">
          {ALL_COLUMNS.map((column) => (
            <label key={column.key}>
              <input
                type="checkbox"
                checked={visibleColumns.includes(column.key)}
                onChange={() => toggleColumns(column.key)}
              />
              {column.label}
            </label>
          ))}
        </div>
      </section>

      {/* Song List Table */}
      <div className="playlist-table-wrapper">
        <table className="playlist-table">
          <thead>
            <tr>
              <th className="song-number-col">#</th>
              <th className="playlist-song-title">Title</th>
              {ALL_COLUMNS.map((col) =>
                visibleColumns.includes(col.key) ? (
                  <th key={col.key}>{col.label}</th>
                ) : null
              )}
              <th></th>
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
                {[
                  <td className="song-number-col" key="num">
                    {idx + 1}
                  </td>,
                  <td className="playlist-song-title" key="title">
                    <div className="playlist-title-content">
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="song-thumb"
                      />
                      <div className="song-text">
                        <span className="song-title">{song.title}</span>
                        <span className="song-artist">{song.artist}</span>
                      </div>
                    </div>
                  </td>,
                  visibleColumns.includes("album") ? (
                    <td key="album">
                      <div className="song-album">{song.albumName}</div>
                    </td>
                  ) : null,
                  visibleColumns.includes("dateAdded") ? (
                    <td key="dateAdded">
                      <div className="song-date-added">
                        {song.addedAt ? formatDate(song.addedAt) : ""}
                      </div>
                    </td>
                  ) : null,
                  visibleColumns.includes("duration") ? (
                    <td key="duration">
                      {song.duration ? formatSongDuration(song.duration) : ""}
                    </td>
                  ) : null,
                  <td className="playlist-table-actions" key="actions">
                    <div
                      className="playlist-row-actions"
                      style={{
                        opacity: hoveredRow === idx ? 1 : 0,
                        pointerEvents: hoveredRow === idx ? "auto" : "none",
                        transition: "opacity 0.2s",
                      }}
                    >
                      <button className="add-btn" title="Add to playlist">
                        <img src={checkmarkIcon} alt="Add" />
                      </button>
                      <button
                        className="menu-btn"
                        title={`More options for ${song.title} by ${song.artist}`}
                        onClick={(e) => handleOnSongMoreOptionsClick(e, song)}
                      >
                        <img src={moreOptionsIcon} alt="More" />
                      </button>
                    </div>
                  </td>,
                ]}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Edit Playlist Modal*/}
      {showEditModal && (
        <div className="playlist-edit-modal">
          <div className="modal-content">
            <h2>Edit Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updatePlaylistDetails({ ...playlist });
                setShowEditModal(false);
              }}
              autoComplete="off"
            >
              <div className="modal-field">
                <input
                  id="playlist-title"
                  value={playlist.title}
                  onChange={(e) =>
                    setPlaylist({ ...playlist, title: e.target.value })
                  }
                  placeholder=" "
                  required
                />
                <label htmlFor="playlist-title">Title</label>
              </div>
              <div className="modal-field">
                <textarea
                  id="playlist-description"
                  value={playlist.description}
                  onChange={(e) =>
                    setPlaylist({ ...playlist, description: e.target.value })
                  }
                  placeholder=" "
                  rows={3}
                />
                <label htmlFor="playlist-description">Description</label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Songs Context Menu */}
      {contextMenu.visible && (
        <ul
          className="song-context-menu"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            position: "fixed",
            zIndex: 2000,
          }}
          onMouseLeave={() =>
            setContextMenu({ ...contextMenu, visible: false })
          }
        >
          <li
            onClick={(e) => {
              // Estimate context menu height (e.g., 90px for 2 items, adjust as needed)
              const contextMenuHeight = 90;
              const contextMenuWidth = 180;
              setPlaylistDropdown({
                visible: true,
                x: contextMenu.x - contextMenuWidth,
                y: contextMenu.y - contextMenuHeight,
                song: contextMenu.song,
              });
              setContextMenu({ ...contextMenu, visible: false });
            }}
          >
            Add to Playlist
          </li>
          <li
            onClick={() => {
              /* handle remove */
              removeSong(playlist._id, contextMenu.song._id).then(() =>
                loadPlaylist()
              );
              setContextMenu({
                ...contextMenu,
                visible: false,
              });
            }}
          >
            Remove from Playlist
          </li>
        </ul>
      )}

      {/* Add to Playlist Dropdown */}
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
                addSong(playlist._id, playlistDropdown.song);
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
