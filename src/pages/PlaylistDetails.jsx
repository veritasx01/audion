import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { playlistService } from "../services/playlist.service";
import {
  addSong,
  removeSong,
  updatePlaylistDetails,
  removePlaylist,
} from "../store/actions/playlist.action.js";
import {
  updateCurrentSong,
  updateSongObject,
  togglePlaying,
} from "../store/actions/song.action";
import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import checkmarkIcon from "../assets/icons/checkmark.svg";
import moreOptionsIcon from "../assets/icons/meatball-menu.svg";

const ALL_COLUMNS = [
  { key: "album", label: "Album" },
  { key: "dateAdded", label: "Date Added" },
  { key: "duration", label: "Duration" },
];

export function PlaylistDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const isPlaying = useSelector((store) => store.songModule.isPlaying);
  const playingSongId = useSelector((store) => store.songModule.songObj._id);
  const playlists = useSelector((store) => store.playlistModule.playlists);
  const otherPlaylists = useMemo(
    () =>
      playlists
        .filter((pl) => pl._id !== playlistId)
        .map((pl) => ({ _id: pl._id, title: pl.title })),
    [playlists, playlistId]
  );
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [headerMenu, setHeaderMenu] = useState({ visible: false, x: 0, y: 0 });
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

  function setCurrentSong(song) {
    dispatch(updateCurrentSong(song.url));
    dispatch(updateSongObject(song));
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
          <button className="playlist-play-pause-btn">
            <img src={playIcon} alt="Play" />
          </button>
          <button
            className="menu-btn"
            title="More options"
            onClick={(e) => {
              // Show a header context menu at the button position
              const rect = e.currentTarget.getBoundingClientRect();
              setHeaderMenu({
                visible: true,
                x: rect.left,
                y: rect.bottom,
              });
            }}
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
                  <td className={"song-number-col"} key="num">
                    {hoveredRow === idx ? (
                      playingSongId === song._id && isPlaying ? (
                        <button
                          className="song-play-pause-btn"
                          onClick={() => dispatch(togglePlaying())}
                          title="Pause"
                        >
                          <img src={pauseIcon} alt="Pause" />
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
                          <img src={playIcon} alt="Play" />
                        </button>
                      )
                    ) : playingSongId === song._id && isPlaying ? (
                      <span
                        className="now-playing-animation"
                        title="Now Playing"
                      >
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
                  </td>,
                  <td className="playlist-song-title" key="title">
                    <div className="playlist-title-content">
                      <img
                        src={song.thumbnail}
                        alt={song.title}
                        className="song-thumb"
                      />
                      <div className="song-text">
                        <span
                          className={`song-title ${
                            playingSongId === song._id ? "active" : ""
                          }`}
                        >
                          {song.title}
                        </span>
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
