import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { playlistService } from "../services/playlist.service";
import checkmarkIcon from "../assets/icons/checkmark.svg";
import moreOptionsIcon from "../assets/icons/meatball-menu.svg";

const ALL_COLUMNS = [
  { key: "album", label: "Album" },
  { key: "dateAdded", label: "Date Added" },
  { key: "duration", label: "Duration" },
];

export function PlaylistDetails() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(
    ALL_COLUMNS.map((c) => c.key)
  );

  useEffect(() => {
    playlistService.getById(playlistId).then(setPlaylist);
  }, [playlistId]);

  if (!playlist) return <div>Loading...</div>;

  function toggleColumns(columnKey) {
    setVisibleColumns((columns) =>
      columns.includes(columnKey)
        ? columns.filter((c) => c !== columnKey)
        : [...columns, columnKey]
    );
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
      {/* Optional blurred thumbnail background */}
      <div
        className="playlist-bg"
        style={{
          background: `url(${playlist.thumbnail}) center/cover no-repeat`,
        }}
      />

      {/* Playlist Header */}
      <div className="playlist-header">
        <img
          className="playlist-cover"
          src={playlist.thumbnail}
          alt={playlist.title}
        />
        <div className="playlist-meta">
          <h2>{playlist.title}</h2>
          <h3>{playlist.description}</h3>
          {/* creator & duration */}
          {playlist.songs.length > 0 ? (
            <p>
              {playlist.createdBy} • {playlist.songs.length}{" "}
              {playlist.songs.length > 1 ? "songs" : "song"},{" "}
              {/* Playlist duration */}
              {formatPlaylistDuration()}
            </p>
          ) : (
            /* If playlist contains no songs, display just the creator */
            <p>{playlist.createdBy}</p>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <section className="playlist-controls">
        <div className="playlist-controls-buttons">
          <button className="playlist-btn" disabled>
            Shuffle
          </button>
          <button className="playlist-btn" disabled>
            Sort
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
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="song-thumb"
                    />
                    <div>
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artist}</div>
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
    </div>
  );
}
